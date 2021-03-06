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
					return console.log('?????????');
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
				return Alert.alert('??????', '????????? ????????? ???????????????.', [
					{text: '??????'},
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
				Alert.alert('??????', '?????? ?????? ??????!', [
					{text: '??????', onPress: () => navigation.goBack()},
				]);
			} else {
				console.log(res);
				Alert.alert('??????', '?????? ?????? ??????.', [{text: '??????'}]);
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
					title={`${state ? '?????????' : '?????????'} ????????????`}
					border
				/>
				<Section style={{flex: 1}}>
					<Label>??????</Label>
					<TitleInput
						placeholder="????????? ??????????????????."
						placeholderTextColor="#7e7e7e"
						value={title}
						onChangeText={text => setTitle(text)}
					/>
					<Label>????????????</Label>
					<ContentInput
						placeholder="??????????????? ??????????????????."
						placeholderTextColor="#7e7e7e"
						multiline={true}
						value={content}
						onChangeText={text => setContent(text)}
						style={{textAlignVertical: 'top'}}
					/>
				</Section>
				<Section>
					<SubLabel>*????????? ???????????? ??? ??? ????????? ??? ????????????.</SubLabel>
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
						text="????????????"
						onPress={goEnroll}
						color={state ? ColorBlue : ColorRed}
					/>
				</Box>
			</Container>
		</TouchableWithoutFeedback>
	);
};

export default EnrollQuestion;
