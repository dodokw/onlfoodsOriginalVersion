import React, {useEffect} from 'react';
import {Dimensions, ScrollView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import SwitchingButton from '~/Components/SwitchingButton';
import ic_add from '~/Assets/Images/ic_add.svg';
import {SvgXml} from 'react-native-svg';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import Icon from 'react-native-vector-icons/Feather';
import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import dayjs from 'dayjs';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {
	APICallTodayEventForm,
	APIEnrollEvent,
	APIModifyEvent,
} from '~/API/MyPageAPI/MyPageAPI';
import {Alert} from 'react-native';
import LoadingModal from '~/Components/LoadingModal/index';
import jwtDecode from 'jwt-decode';
import {APICallGeo} from '~/API/MainAPI/MainAPI';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const TitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin: 10px 0;
`;

const Section = styled.View`
	background-color: #ffffff;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
`;
const AddBannerButton = styled.TouchableOpacity``;

const AddBannerButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: #ec636b;
`;

const BannerBox = styled.View`
	width: ${Dimensions.get('screen').width - 20}px;
	justify-content: center;
	align-items: center;
	height: 100px;
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
	overflow: hidden;
`;
const BannerImage = styled.Image`
	width: 100%;
	height: 100%;
`;

const ImageWrap = styled.View`
	flex-direction: row;
	margin: 10px 0;
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
`;

const ImageDelButton = styled.TouchableOpacity`
	position: absolute;
	top: 10px;
	right: 5px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 50px;
	padding: 5px;
`;

const SubText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #7b7b7b;
`;

const Dive = styled.View`
	height: 1px;
	background-color: #dfdfdf;
	margin: 10px 0;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;
const TextInput = styled.TextInput`
	flex: 1;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	padding: 0;
	color: #000000;
`;

const MultiTextInput = styled.TextInput`
	flex: 1;
	height: 300px;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	color: #000000;
`;

const DateBox = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;

const DateLabel = styled.Text`
	flex: 1;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	padding: 0;
	color: #000000;
`;

const ButtonWrap = styled.View`
	background-color: #ffffff;
	flex-direction: row;
`;

const SelectedButton = styled.TouchableOpacity`
	height: 50px;
	border-color: ${props => (props.selected ? ColorBlue : ColorLineGrey)};
	border-width: 1px;
	align-items: center;
	justify-content: center;
	padding: 10px;
	flex: 1;
	border-radius: 5px;
	margin: 5px 0;
`;
const SelectedButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	color: ${props => (props.selected ? ColorBlue : ColorLineGrey)};
	text-align: center;
`;

const RowWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const EditButton = styled.TouchableOpacity`
	border-color: ${ColorBlue};
	border-width: 1px;
	justify-content: center;
	align-items: center;
	height: 50px;
	padding: 10px 25px;
	border-radius: 5px;
	margin-left: 5px;
	background-color: ${ColorBlue};
`;
const EditButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const PeriodWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const EnrollButton = styled.TouchableOpacity`
	height: 50px;
	width: 100%;
	border-radius: 5px;
	background-color: ${ColorBlue};
	justify-content: center;
	align-items: center;
	margin-top: 10px;
`;
const EnrollLabel = styled.Text`
	font-size: 15px;
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
`;

const EnrollEvent = ({navigation, route}) => {
	const item_id = route.params.itemID;
	const {state, user} = useSelector(state => state.loginReducer);
	const [mainImg, setMainImg] = useState();
	const [subImg, setSubImg] = useState([]);
	const [title, setTitle] = useState('');
	const [type, setType] = useState('');
	const [startDate, setStartDate] = useState('시작일');
	const [endDate, setEndDate] = useState('종료일');
	const [address, setAddress] = useState({
		address: '',
		sangse: '',
		lng: '',
		lat: '',
	});
	const [info, setInfo] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState('');
	const [showPostCode, setShowPostCode] = useState(false);

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
					if (imgData.uri !== undefined) {
						if (type === 'main') {
							setMainImg(imgData);
						} else {
							if (num === undefined) {
								setSubImg([...subImg, imgData]);
							} else {
								const newSub = subImg.map((item, index) =>
									num === index ? imgData : item,
								);
								setSubImg([...newSub]);
							}
						}
					}
				} catch (err) {
					console.log(err);
				}
			},
		);
	};

	const removeImg = num => {
		const newSub = subImg.filter((item, index) => num !== index);
		setSubImg([...newSub]);
	};

	const handleConfirm = date => {
		console.log(showDatePicker, date);
		if (showDatePicker === 'start') {
			setStartDate(dayjs(date).format('YYYY-MM-DD'));
		} else {
			setEndDate(dayjs(date).format('YYYY-MM-DD'));
		}
		setShowDatePicker('');
	};

	const handleCancel = () => {
		setShowDatePicker('');
	};

	const getPost = async newAddress => {
		try {
			const res = await APICallGeo(newAddress.address);
			const getAddress = res.address;
			setAddress({
				...address,
				address: getAddress.address_name,
				lng: getAddress.x,
				lat: getAddress.y,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const getForm = async () => {
		setLoading(true);
		try {
			const res = await APICallTodayEventForm(user.mt_info.mt_idx, item_id);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				if(decode.data.et_image !== null){
					setMainImg({uri: decode.data.et_thumbnail});
				const imgArr = decode.data.et_image.map(item => ({uri: item}));
				setSubImg(imgArr);
				}else{
					setMainImg('');
				}
				setTitle(decode.data.et_name);
				setType(decode.data.et_type);
				setStartDate(decode.data.et_sdate);
				setEndDate(decode.data.et_edate);
				setAddress({
					address: decode.data.et_addr1,
					sangse: decode.data.et_addr2,
					lat: decode.data.et_lat,
					lng: decode.data.et_lng,
				});
				setInfo(decode.data.et_content);
			} else {
				Alert.alert('알림', res.message, [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			}
		} catch (err) {
			Alert.alert('알림', '예기치 못한 문제가 발생하였습니다.', [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
		setLoading(false);
	};

	const goEnroll = async () => {
		console.log('타이틀', title.replace(/ /g, '').trim());
		// if (mainImg === undefined) {
		// 	return Alert.alert('알림', '대표이미지를 등록해주세요.', [
		// 		{text: '확인'},
		// 	]);
		// }
		// if (subImg.length === 0) {
		// 	return Alert.alert('알림', '추가이미지는 최소 1장이 있어야합니다.', [
		// 		{text: '확인'},
		// 	]);
		// }
		if (
			title.replace(/ /g, '').trim() === '' ||
			type === '' ||
			// address.address === '' ||
			info.replace(/ /g, '').trim() === ''
		) {
			return Alert.alert(
				'알림',
				'양식에 빈 곳이 없어야 합니다. 다시 확인해주세요.',
				[{text: '확인'}],
			);
		}
		if (startDate === '시작일' || endDate === '종료일') {
			return Alert.alert('알림', '행사 날짜를 입력해주세요.', [{text: '확인'}]);
		}
		if (dayjs(startDate) > dayjs(endDate)) {
			return Alert.alert('알림', '시작일이 종료일보다 미래입니다.', [
				{text: '확인'},
			]);
		}
		setLoading(true);
		try {
			const res = await APIEnrollEvent(
				user.mt_info.mt_idx,
				title,
				type,
				startDate,
				endDate,
				address,
				info,
				mainImg,
				subImg,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '오늘의 행사가 등록되었습니다.', [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (error) {
			console.error(error);
			Alert.alert('오류', '예기치 않은 문제가 발생했습니다.', [{text: '확인'}]);
		}
		setLoading(false);
	};

	const goModify = async () => {
		// if (mainImg === undefined) {
		// 	return Alert.alert('알림', '대표이미지를 등록해주세요.', [
		// 		{text: '확인'},
		// 	]);
		// }
		// if (subImg.length === 0) {
		// 	return Alert.alert('알림', '추가이미지는 최소 1장이 있어야합니다.', [
		// 		{text: '확인'},
		// 	]);
		// }
		if (
			title.replace(/ /g, '').trim() === '' ||
			type === '' ||
			// address.address === '' ||
			info.replace(/ /g, '').trim() === ''
		) {
			return Alert.alert(
				'알림',
				'양식에 빈 곳이 없어야 합니다. 다시 확인해주세요.',
				[{text: '확인'}],
			);
		}
		if (dayjs(startDate) > dayjs(endDate)) {
			return Alert.alert('알림', '시작일이 종료일보다 미래입니다.', [
				{text: '확인'},
			]);
		}
		setLoading(true);
		try {
			const res = await APIModifyEvent(
				user.mt_info.mt_idx,
				item_id,
				title,
				type,
				startDate,
				endDate,
				address,
				info,
				mainImg,
				subImg,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '오늘의 행사 상품이 수정되었습니다.', [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (error) {
			console.error(error);
			Alert.alert('오류', '예기치 않은 문제가 발생했습니다.', [{text: '확인'}]);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (item_id) {
			getForm();
		}
	}, []);

	return (
		<Container>
			<Header
				title={item_id ? '공지수정' : '공지등록'}
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			<ScrollView contentContainerStyle={{paddingBottom: 50}}>
			<Section style={{padding: 20}}>
					<TitleLabel>대표이미지</TitleLabel>
					<ImageAddButton onPress={() => pickImg('main')}>
						{mainImg === undefined ? (
							<SvgXml xml={ic_add} />
						) : (
							<ImageBox source={{uri: mainImg.uri}} />
						)}
					</ImageAddButton>
				</Section>
				<Section style={{paddingLeft: 20}}>
					<TitleLabel>추가이미지</TitleLabel>
					<ImageWrap>
						<ScrollView
							horizontal={true}
							bounces={false}
							showsHorizontalScrollIndicator={false}>
							{subImg.length < 5 && (
								<ImageAddButton onPress={() => pickImg('sub')}>
									<SvgXml xml={ic_add} />
								</ImageAddButton>
							)}
							{subImg.map((item, index) => (
								<ImageAddButton
									key={index}
									onPress={() => pickImg('sub', index)}>
									<ImageBox source={{uri: item.uri}} />
									<ImageDelButton onPress={() => removeImg(index)}>
										<Icon name="x" size={15} color="#ffffff" />
									</ImageDelButton>
								</ImageAddButton>
							))}
						</ScrollView>
					</ImageWrap>
					<SubText>
						{`*사진은 가로로 찍은 사진을 권장합니다. 
  (가로 사이즈 최소 800px) 
*사진용량은 사진 한 장당 2MB 까지 등록이 가능합니다.
*최소 1장 이상 등록해야하며, 최대 5장 까지 업로드 가능합니다.`}
					</SubText>
					<Dive />
				</Section>
				{/* <Section style={{paddingTop: 20}}>
					<TitleWrap>
						<TitleLabel>배너</TitleLabel>
						<AddBannerButton>
							<AddBannerButtonLabel>+ 배너등록</AddBannerButtonLabel>
						</AddBannerButton>
					</TitleWrap>
					<BannerBox>
						<BannerImage
							source={require('~/Assets/Images/company_banner.png')}
							resizeMode="cover"
						/>
					</BannerBox>
				</Section> */}
				
				<Section style={{paddingHorizontal: 20}}>
					<TitleLabel>제목</TitleLabel>
					<InputBox>
						<TextInput
							name="title"
							placeholder="공지 제목"
							placeholderColor={ColorLineGrey}
							value={title}
							onChangeText={text => setTitle(text)}
						/>
					</InputBox>
					<TitleLabel>공지유형</TitleLabel>
					<ButtonWrap>
						<SelectedButton
							selected={type === '1'}
							onPress={() => setType('1')}
							style={{marginRight: 5}}>
							<SelectedButtonLabel
								selected={type === '1'}
								style={{fontSize: 13}}>
								일반
							</SelectedButtonLabel>
						</SelectedButton>
						<SelectedButton
							selected={type === '2'}
							onPress={() => setType('2')}
							style={{marginRight: 5}}>
							<SelectedButtonLabel
								selected={type === '2'}
								style={{fontSize: 13}}>
								행사
							</SelectedButtonLabel>
						</SelectedButton>
						<SelectedButton
							selected={type === '3'}
							onPress={() => setType('3')}
							style={{marginRight: 5}}>
							<SelectedButtonLabel
								selected={type === '3'}
								style={{fontSize: 13}}>
								시세변동
							</SelectedButtonLabel>
						</SelectedButton>
					</ButtonWrap>
					<TitleLabel>공지기간</TitleLabel>
					<PeriodWrap>
						<DateBox onPress={() => setShowDatePicker('start')}>
							<DateLabel>{startDate}</DateLabel>
							<Icon name="calendar" size={20} />
						</DateBox>
						<Text
							style={{
								fontFamily: FONTNanumGothicRegular,
								fontSize: 16,
								marginHorizontal: 10,
							}}>
							~
						</Text>
						<DateBox onPress={() => setShowDatePicker('end')}>
							<DateLabel>{endDate}</DateLabel>
							<Icon name="calendar" size={20} />
						</DateBox>
					</PeriodWrap>
					{/* <TitleLabel>공지위치</TitleLabel>

					<RowWrap>
						<InputBox>
							<TextInput
								placeholder="주소"
								editable={false}
								placeholderColor={ColorLineGrey}
								value={address.address}
							/>
						</InputBox>
						<EditButton onPress={() => setShowPostCode(true)}>
							<EditButtonLabel>검색</EditButtonLabel>
						</EditButton>
					</RowWrap>
					<InputBox>
						<TextInput
							placeholder="상세주소"
							value={address.sangse}
							onChangeText={text => setAddress({...address, sangse: text})}
						/>
					</InputBox> */}
					<TitleLabel>공지내용</TitleLabel>
					<MultiTextInput
						placeholder="공지내용을 입력해주세요."
						placeholderColor={ColorLineGrey}
						multiline={true}
						value={info}
						onChangeText={text => setInfo(text)}
						style={{textAlignVertical: 'top'}}
					/>
				</Section>
				<EnrollButton onPress={item_id ? goModify : goEnroll}>
						<EnrollLabel>{item_id ? '수정하기' : '등록하기'}</EnrollLabel>
					</EnrollButton>
			</ScrollView>
			<DateTimePickerModal
				isVisible={showDatePicker !== ''}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				headerTextIOS="날짜를 선택해주세요."
				locale="ko_KR"
				cancelTextIOS="취소"
				confirmTextIOS="확인"
			/>
			<PostcodeModal
				isShow={showPostCode}
				setIsShow={setShowPostCode}
				getPost={getPost}
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
};

export default EnrollEvent;
