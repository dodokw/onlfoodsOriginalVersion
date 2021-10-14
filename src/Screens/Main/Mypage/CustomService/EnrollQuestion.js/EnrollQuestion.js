import React, {useState} from 'react';
import {Platform} from 'react-native';
import {Keyboard} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APIEnrollQuestion} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import LongButton from '~/Components/LongButton/LongButton';

const Container = styled.KeyboardAvoidingView`
	background-color: #ffffff;
	flex: 1;
`;

const Section = styled.View`
	padding: 0 20px;
	margin-bottom: 10px;
`;

const Box = styled.View`
	padding: 20px;
`;

const Label = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 5px;
`;
const TitleInput = styled.TextInput`
	border-width: 1px;
	border-color: ${ColorLineGrey};
	border-radius: 5px;
	padding: 10px;
	color: #000000;
`;

const ContentInput = styled.TextInput`
	border-width: 1px;
	border-color: ${ColorLineGrey};
	border-radius: 5px;
	padding: 10px;
	flex: 1;
	color: #000000;
`;

const SubLabel = styled.Text`
	font-size: 12px;
	color: #000000;
	margin: 5px 0;
`;

const ImageBox = styled.Image`
	width: 120px;
	height: 120px;
	border-width: 1px;
	border-color: #dfdfdf;
	background-color: #dfdfdf;
	justify-content: center;
	align-items: center;
`;

const ImageAddButton = styled.TouchableOpacity`
	width: 120px;
	height: 120px;
	border-width: 1px;
	border-color: #dfdfdf;
	background-color: #dfdfdf;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
	border-radius: 10px;
	overflow: hidden;
`;

const EnrollQuestion = ({navigation}) => {
	const {user, state} = useSelector(state => state.loginReducer);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [img, setImg] = useState();

	const pickImg = (type, num) => {
		launchImageLibrary(
			{mediaType: 'photo', quality: 0.5, maxHeight: 1000, maxWidth: 1000},
			response => {
				if (response.didCancel) {
					return console.log('취소함');
				} else if (response.error) {
					return console.log(response.error);
				}
				try {
					console.log('Response = ', response.assets);
					const imgs = response.assets[0];
					const imgData = {
						name: imgs.fileName,
						type: imgs.type,
						uri: imgs.uri,
					};
					// You can also display the image using data:
					// const source = { uri: 'data:image/jpeg;base64,' + response.data };
					console.log(imgData);
					setImg(imgData);
				} catch (err) {
					console.log(err);
				}
			},
		);
	};

	const goEnroll = async () => {
		try {
			if (
				title.replace(/ /g, '').trim() === '' ||
				content.replace(/ /g, '').trim() === ''
			) {
				return Alert.alert('알림', '제목과 내용을 채워주세요.', [
					{text: '확인'},
				]);
			}
			const res = await APIEnrollQuestion(
				user.mt_info.mt_idx,
				state,
				title,
				content,
				img,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '문의 등록 완료!', [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			} else {
				console.log(res);
				Alert.alert('알림', '문의 등록 실패.', [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Container>
				<Header
					headerLeft={<BackButton onPress={() => navigation.goBack()} />}
					title={`${state ? '판매자' : '구매자'} 문의등록`}
					border
				/>
				<Section style={{flex: 1}}>
					<Label>제목</Label>
					<TitleInput
						placeholder="제목을 입력해주세요."
						placeholderTextColor="#7e7e7e"
						value={title}
						onChangeText={text => setTitle(text)}
					/>
					<Label>문의내용</Label>
					<ContentInput
						placeholder="문의내용을 입력해주세요."
						placeholderTextColor="#7e7e7e"
						multiline={true}
						value={content}
						onChangeText={text => setContent(text)}
						style={{textAlignVertical: 'top'}}
					/>
				</Section>
				<Section>
					<SubLabel>*필요시 이미지를 한 장 첨부할 수 있습니다.</SubLabel>
					<ImageAddButton onPress={() => pickImg('main')}>
						{img === undefined ? (
							<Icon name="plus" size={20} />
						) : (
							<ImageBox source={{uri: img.uri}} />
						)}
					</ImageAddButton>
				</Section>
				<Box>
					<LongButton
						text="등록하기"
						onPress={goEnroll}
						color={state ? ColorBlue : ColorRed}
					/>
				</Box>
			</Container>
		</TouchableWithoutFeedback>
	);
};

export default EnrollQuestion;
