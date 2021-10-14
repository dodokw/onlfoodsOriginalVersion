import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, Text, Platform, Alert} from 'react-native';
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
import {
	ColorBlue,
	ColorGreen,
	ColorLineGrey,
	ColorRed,
} from '~/Assets/Style/Colors';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import dayjs from 'dayjs';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {
	APICallTodayInForm,
	APIEnrollEvent,
	APIEnrollTodayIn,
	APIModifyTodayIn,
} from '~/API/MyPageAPI/MyPageAPI';
import LoadingModal from '~/Components/LoadingModal/index';
import jwtDecode from 'jwt-decode';
import {set} from 'react-native-reanimated';
import {Checkbox} from 'react-native-paper';
import CodeSearchModal from '~/Components/Modal/CodeSearchModal/CodeSearchModal';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
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
`;
const StockCodeButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;

const StockCodeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
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
	padding: 10px 20px;
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
	border-color: ${ColorRed};
	border-width: 1px;
	justify-content: center;
	align-items: center;
	height: 50px;
	padding: 10px 25px;
	border-radius: 5px;
	background-color: ${ColorRed};
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

const CategoryData = [
	{key: '1', label: '공산', value: '1'},
	{key: '2', label: '농산', value: '2'},
	{key: '3', label: '수산', value: '3'},
	{key: '4', label: '축산', value: '4'},
	{key: '5', label: '기타', value: '5'},
];

const SelectContainer = styled.View`
	height: 50px;
	padding: 0 10px;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-color: ${ColorLineGrey};
`;

const EnrollTodayIn = ({navigation, route}) => {
	const item_id = route.params.itemID;
	const {state, user} = useSelector(state => state.loginReducer);
	const [mainImg, setMainImg] = useState();
	const [subImg, setSubImg] = useState([]);
	const [isNew, setNew] = useState(false);
	const [code, setCode] = useState('');
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [cost, setCost] = useState('');
	const [count, setCount] = useState('');
	const [price, setPrice] = useState('');
	const [tex, setTex] = useState(true);
	const [show, setShow] = useState(true);
	const [nonePrice, setNonePrice] = useState(false);
	const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [info, setInfo] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showSearch, setShowSearch] = useState(false);

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
		if (dayjs(date) < dayjs()) {
			setShowDatePicker(false);
			return Alert.alert('알림', '오늘보다 미래로 선택해주세요.', [
				{text: '확인'},
			]);
		}
		console.log(showDatePicker, date);
		setDate(dayjs(date).format('YYYY-MM-DD'));
		setShowDatePicker(false);
	};

	const handleCancel = () => {
		setShowDatePicker('');
	};

	const getForm = async () => {
		setLoading(true);
		try {
			const res = await APICallTodayInForm(item_id);
			if (res.result) {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setMainImg({uri: decode.data.pt_thumbnail});
				if (decode.data.pt_image === null) {
					setSubImg([]);
				} else {
					const imgArr = decode.data.pt_image.map(item => ({uri: item}));
					console.log(imgArr);
					setSubImg(imgArr);
				}
				setTitle(decode.data.pt_title);
				setCategory(decode.data.ct_id);
				setCount(decode.data.pt_qty);
				setCost(decode.data.pt_in_price);
				setPrice(decode.data.pt_price === '0' ? '' : decode.data.pt_price);
				setNonePrice(decode.data.pt_chatting_chk === 'Y' ? true : false);
				setDate(decode.data.pt_expired_date);
				setInfo(decode.data.pt_content);
				setTex(decode.data.pt_vat === '1' ? true : false);
				setShow(decode.data.pt_show === 'Y' ? true : false);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			}
		} catch (error) {
			console.log(error);
			Alert.alert('알림', '예기치 못한 문제가 발생하였습니다.', [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
		setLoading(false);
	};

	const goEnroll = async () => {
		if (!isNew && code === '') {
			return Alert.alert('알림', '상품코드를 선택해주세요.', [{text: '확인'}]);
		}
		if (mainImg === undefined) {
			return Alert.alert('알림', '대표 이미지를 등록해주세요.', [
				{text: '확인'},
			]);
		}
		if (subImg.length === 0) {
			return Alert.alert('알림', '추가이미지는 최소 1장이 있어야합니다.', [
				{text: '확인'},
			]);
		}
		if (!nonePrice && price === '') {
			return Alert.alert('알림', '판매가격이 비어있습니다.', [{text: '확인'}]);
		}
		if (
			title.replace(/ /g, '').trim() === '' ||
			count === '' ||
			cost === '' ||
			date === '' ||
			info.replace(/ /g, '').trim() === ''
		) {
			return Alert.alert(
				'알림',
				'양식에 빈 곳이 없어야 합니다. 다시 확인해주세요.',
				[{text: '확인'}],
			);
		}
		if (
			category !== '1' &&
			category !== '2' &&
			category !== '3' &&
			category !== '4' &&
			category !== '5'
		) {
			return Alert.alert('알림', '카테고리를 선택해주세요.', [{text: '확인'}]);
		}
		setLoading(true);
		try {
			const res = await APIEnrollTodayIn(
				user.mt_info.mt_idx,
				isNew,
				code,
				category,
				title,
				count,
				tex,
				show,
				cost,
				nonePrice ? 0 : price,
				date,
				info,
				nonePrice,
				mainImg,
				subImg,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '오늘만 상품이 등록되었습니다.', [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch {
			Alert.alert('오류', '예기치 않은 문제가 발생했습니다.', [{text: '확인'}]);
		}
		setLoading(false);
	};

	const goModify = async () => {
		if (mainImg === undefined) {
			return Alert.alert('알림', '대표 이미지를 등록해주세요.', [
				{text: '확인'},
			]);
		}
		if (subImg.length === 0) {
			return Alert.alert('알림', '추가이미지는 최소 1장이 있어야합니다.', [
				{text: '확인'},
			]);
		}
		if (!nonePrice && price === '') {
			return Alert.alert('알림', '판매가격이 비어있습니다.', [{text: '확인'}]);
		}
		if (
			title.replace(/ /g, '').trim() === '' ||
			count === '' ||
			cost === '' ||
			date === '' ||
			info.replace(/ /g, '').trim() === ''
		) {
			return Alert.alert(
				'알림',
				'양식에 빈 곳이 없어야 합니다. 다시 확인해주세요.',
				[{text: '확인'}],
			);
		}
		if (
			category !== '1' &&
			category !== '2' &&
			category !== '3' &&
			category !== '4' &&
			category !== '5'
		) {
			return Alert.alert('알림', '카테고리를 선택해주세요.', [{text: '확인'}]);
		}

		setLoading(true);
		try {
			const res = await APIModifyTodayIn(
				item_id,
				user.mt_info.mt_idx,
				category,
				title,
				count,
				tex,
				show,
				cost,
				nonePrice ? 0 : price,
				date,
				info,
				nonePrice,
				mainImg,
				subImg,
			);
			if (res.result === 'true') {
				console.log(res);
				Alert.alert('알림', '오늘만 상품이 수정되었습니다.', [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch {
			Alert.alert('오류', '예기치 않은 문제가 발생했습니다.', [{text: '확인'}]);
		}
		setLoading(false);
	};

	const onCode = item => {
		setCode(item.pt_code);
		setTitle(item.pt_title);
		setCategory(item.ct_id);
		setCount(item.pt_qty);
	};

	useEffect(() => {
		if (item_id) {
			getForm();
		}
	}, []);

	return (
		<Container>
			<Header
				title={item_id ? '재고수정' : '재고등록'}
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			<ScrollView contentContainerStyle={{paddingBottom: 30}}>
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
						{
							'*사진은 가로로 찍은 사진을 권장합니다.\n(가로 사이즈 최소 800px)\n*사진용량은 사진 한 장당 2MB 까지 등록이 가능합니다.\n*최소 1장 이상 등록해야하며, 최대 5장 까지 업로드 가능합니다.'
						}
					</SubText>
					<Dive />
				</Section>
				<Section style={{paddingHorizontal: 20}}>
					{item_id === null && (
						<>
							<RowWrap style={{justifyContent: 'space-between'}}>
								<TitleLabel>상품코드</TitleLabel>
								<RowWrap>
									<Checkbox.Android
										color={ColorBlue}
										onPress={() => setNew(!isNew)}
										status={isNew ? 'checked' : 'unchecked'}
									/>
									<TitleLabel style={{color: ColorBlue}}>신규상품</TitleLabel>
								</RowWrap>
							</RowWrap>
						</>
					)}
					{!isNew && item_id === null && (
						<StockCodeButton onPress={() => setShowSearch(true)}>
							<StockCodeLabel>
								{code === '' ? '상품코드를 선택하세요.' : code}
							</StockCodeLabel>
						</StockCodeButton>
					)}

					<TitleLabel>상품명</TitleLabel>
					<InputBox>
						<TextInput
							name="title"
							placeholder="상품명"
							placeholderColor={ColorLineGrey}
							value={title}
							onChangeText={text => setTitle(text)}
						/>
					</InputBox>
					<SelectContainer>
						<RNPickerSelect
							items={CategoryData}
							disabled={!isNew || item_id ? true : false}
							onValueChange={value => {
								setCategory(value);
							}}
							fixAndroidTouchableBug={true}
							value={category}
							doneText="확인"
							placeholder={{
								key: '0',
								label: '카테고리',
								value: '0',
							}}
							style={{
								inputIOSContainer: {
									flexDirection: 'row',
									position: 'relative',
									height: '100%',
								},
								inputIOS: {
									position: 'relative',
									width: '100%',
									fontSize: 15,
									fontFamily: FONTNanumGothicRegular,
									paddingRight: 30,
									color: item_id ? ColorLineGrey : '#000000',
								},
								inputAndroidContainer: {
									flexDirection: 'row',
									position: 'relative',
									height: '100%',
									justifyContent: 'center',
									alignItems: 'center',
								},
								inputAndroid: {
									position: 'relative',
									width: '100%',
									fontSize: 15,
									height: 35,
									fontFamily: FONTNanumGothicRegular,
									color: item_id ? ColorLineGrey : '#000000',
									padding: 0,
									paddingRight: 20,
								},
								iconContainer: {top: Platform.os === 'ios' ? 0 : 15},
							}}
							Icon={() => (
								<Icon
									name="chevron-down"
									size={20}
									color={item_id ? ColorLineGrey : '#000000'}
								/>
							)}
							useNativeAndroidPickerStyle={false}
						/>
					</SelectContainer>
					<TitleLabel>품목수량</TitleLabel>
					<InputBox>
						<TextInput
							name="count"
							placeholder="품목수량"
							placeholderColor={ColorLineGrey}
							value={count}
							onChangeText={text => setCount(text.replace(/[^0-9]/g, ''))}
							keyboardType="number-pad"
							maxLength={10}
							editable={isNew}
						/>
					</InputBox>
					<TitleLabel>과세여부</TitleLabel>
					<TitleWrap>
						<SelectedButton
							style={{flex: 1, marginRight: 5}}
							selected={tex}
							onPress={() => setTex(!tex)}>
							<SelectedButtonLabel selected={tex}>과세</SelectedButtonLabel>
						</SelectedButton>
						<SelectedButton
							style={{flex: 1, marginLeft: 5}}
							selected={!tex}
							onPress={() => setTex(!tex)}>
							<SelectedButtonLabel selected={!tex}>면세</SelectedButtonLabel>
						</SelectedButton>
					</TitleWrap>
					<TitleLabel>노출여부</TitleLabel>
					<TitleWrap>
						<SelectedButton
							style={{flex: 1, marginRight: 5}}
							selected={show}
							onPress={() => setShow(!show)}>
							<SelectedButtonLabel selected={show}>노출</SelectedButtonLabel>
						</SelectedButton>
						<SelectedButton
							style={{flex: 1, marginLeft: 5}}
							selected={!show}
							onPress={() => setShow(!show)}>
							<SelectedButtonLabel selected={!show}>미노출</SelectedButtonLabel>
						</SelectedButton>
					</TitleWrap>
					<TitleLabel>입고단가</TitleLabel>
					<InputBox>
						<TextInput
							name="cost"
							placeholder="입고단가"
							placeholderColor={ColorLineGrey}
							value={cost}
							onChangeText={text => setCost(text.replace(/[^0-9]/g, ''))}
							keyboardType="number-pad"
							maxLength={10}
						/>
					</InputBox>
					<TitleLabel>판매가격</TitleLabel>
					<Wrap>
						<InputBox
							style={{backgroundColor: nonePrice ? ColorLineGrey : '#ffffff'}}>
							<TextInput
								name="price"
								placeholder="판매가격"
								placeholderColor={ColorLineGrey}
								value={price}
								onChangeText={text => setPrice(text.replace(/[^0-9]/g, ''))}
								keyboardType="number-pad"
								maxLength={10}
							/>
						</InputBox>
						<SelectedButton
							style={{marginLeft: 5}}
							selected={nonePrice}
							onPress={() => setNonePrice(!nonePrice)}>
							<SelectedButtonLabel selected={nonePrice}>
								채팅문의
							</SelectedButtonLabel>
						</SelectedButton>
					</Wrap>

					<TitleLabel>유통기한</TitleLabel>
					<DateBox onPress={() => setShowDatePicker(true)}>
						<DateLabel>{date}</DateLabel>
						<Icon name="calendar" size={20} />
					</DateBox>

					<TitleLabel>상품내용</TitleLabel>
					<MultiTextInput
						placeholder="상품설명을 입력해주세요."
						placeholderColor={ColorLineGrey}
						multiline={true}
						value={info}
						onChangeText={text => setInfo(text)}
						style={{textAlignVertical: 'top'}}
					/>
					<EnrollButton onPress={item_id ? goModify : goEnroll}>
						<EnrollLabel>{item_id ? '수정하기' : '등록하기'}</EnrollLabel>
					</EnrollButton>
				</Section>
			</ScrollView>
			<DateTimePickerModal
				isVisible={showDatePicker}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				headerTextIOS="날짜를 선택해주세요."
				locale="ko_KR"
				cancelTextIOS="취소"
				confirmTextIOS="확인"
			/>
			<CodeSearchModal
				visible={showSearch}
				setVisible={setShowSearch}
				confirm={onCode}
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
};

export default EnrollTodayIn;
