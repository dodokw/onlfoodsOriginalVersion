import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {SvgXml} from 'react-native-svg';
import user_profile from '~/Assets/Images/user_profile.svg';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {ColorLineGrey, ColorBlue} from '~/Assets/Style/Colors';
import autoLogin_checkedOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import BigButton from '~/Components/BigButton';
import {useDispatch, useSelector} from 'react-redux';
import SwitchingButton from '~/Components/SwitchingButton';
import BackButton from '~/Components/BackButton';
import {launchImageLibrary} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';
import {View} from 'react-native';
import {APICallGeo, APICallLocalList} from '../../../../API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import {
	APICallSellerInfo,
	APIUpdataSellerProfile,
	APIUpdateMyProfile,
} from '../../../../API/MyPageAPI/MyPageAPI';
import {changeImg} from '../../../../Modules/Action';
import {Alert} from 'react-native';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {LocationBox} from '../SellerRegister/SellerRegister';
import LoadingModal from '~/Components/LoadingModal';
import {Platform} from 'react-native';
import LongButton from '~/Components/LongButton/LongButton';
import {Checkbox} from 'react-native-paper';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
	background-color: #ffffff;
`;
const ProfileImageContainer = styled.View`
	align-items: center;
	padding: 20px;
	margin-bottom: 5px;
	background-color: #ffffff;
`;

const MyProfileImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
	background-color: #ffffff;
`;

const MyProfileImageWrap = styled.View`
	width: 90px;
	height: 90px;
	background-color: #f8f8f8;
	border-width: 1px;
	border-color: #e6ebee;
	border-radius: 50px;
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
`;

const ProfileImageLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #989898;
`;

const ProfileInfoContainer = styled.View`
	background-color: #ffffff;
	padding: 20px;
`;

const ProfileInfoWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const ProfileInfoLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin-bottom: 5px;
`;
const ProfileInfoText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const PressableText = styled.TouchableOpacity``;

const RedText = styled.Text`
	color: ${ColorBlue};
`;

const Dive = styled.View`
	background-color: #dfdfdf;
	height: 0.5px;
	margin: 10px 0;
`;

const RowWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: #cecece;
	border-width: 1px;
	align-items: center;

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

const InputLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
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

const ButtonWrap = styled.View`
	padding: 20px;
	background-color: #ffffff;
	height: 90px;
`;

const SelectButton = styled.TouchableOpacity`
	flex: 1;
	height: 50px;
	border-width: 1px;
	border-radius: 5px;
	border-color: ${props => (props.color ? ColorBlue : ColorLineGrey)};
	justify-content: center;
	align-items: center;
`;
const SelectButtonLabel = styled.Text`
	color: ${props => (props.color ? ColorBlue : ColorLineGrey)};
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const SelectedButton = styled.TouchableOpacity`
	height: 50px;
	border-color: #cecece;
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
	color: #cecece;
	text-align: center;
`;

const JobList = [
	{key: '1', label: '마트', value: '1'},
	{key: '2', label: '식자재', value: '2'},
	{key: '3', label: '도매', value: '3'},
	{key: '4', label: '소매', value: '4'},
	{key: '5', label: '제조', value: '5'},
	{key: '6', label: '생산', value: '6'},
];

const SellerProfileEdit = ({navigation, route}) => {
	const dispatch = useDispatch();
	const {state, user} = useSelector(state => state.loginReducer);
	const [userType, setUesrType] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [ceoName, setCeoName] = useState('');
	const [jobOption, setJobOption] = useState('');
	const [mainItem, setMainItem] = useState('');
	const [businessTime, setBusinessTime] = useState('');
	const [businessPhone, setBusinessPhone] = useState('');
	const [selectAddress, setSelectAddress] = useState(true);
	const [address, setAddress] = useState({
		zip: '',
		address: '',
		lat: '',
		lng: '',
		dong: '',
	});
	const [etcAddress, setEtcAddress] = useState({
		zip: '',
		address: '',
		lat: '',
		lng: '',
		dong: '',
	});
	const [detailAddress, setDetailAddress] = useState('');
	const [etcDetailAddress, setEtcDetailAddress] = useState('');
	const [isShip, setShip] = useState(1);
	const [sidoList, setSidoList] = useState([]);
	const [sido, setSido] = useState(['0', '0']);
	const [sigunguList, setSigunguList] = useState([]);
	const [sigungu, setSigungu] = useState(['0', '0']);
	const [ebmyundongList, setEbmyundongList] = useState([]);
	const [ebmyundong, setEbmyundong] = useState(['0', '0']);
	const [shipLocation, setShipLocation] = useState([]);
	const [receive, setReceive] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [channel, setChannel] = useState('');
	const [payment, setPayMent] = useState('');
	const [showPost, setShowPost] = useState();
	const [isLoading, setLoading] = useState(false);
	const [isAll, setAll] = useState(false);

	const dayRef = useRef();

	const getData = async () => {
		setLoading(true);
		try {
			const res = await APICallSellerInfo(user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setUesrType(decode.data.slt_company_type);
				setCompanyName(decode.data.slt_company_name);
				setCeoName(decode.data.slt_company_boss);
				setSelectAddress(decode.data.addr_chk === '1' ? false : true);
				setAddress({
					...address,
					zip: decode.data.slt_zip,
					address: decode.data.slt_addr,
					lat: decode.data.slt_lat,
					lng: decode.data.slt_lng,
					dong: decode.data.slt_dong,
				});
				setDetailAddress(decode.data.slt_addr2);
				setEtcAddress({
					...address,
					zip: decode.data.slt_etc_zip === null ? '' : decode.data.slt_etc_zip,
					address:
						decode.data.slt_etc_addr === null ? '' : decode.data.slt_etc_addr,
					lat: decode.data.slt_etc_lat,
					lng: decode.data.slt_etc_lng,
					dong:
						decode.data.slt_etc_dong === null ? '' : decode.data.slt_etc_dong,
				});
				setEtcDetailAddress(decode.data.slt_etc_addr2);
				setJobOption(decode.data.slt_company_cate);
				setMainItem(decode.data.slt_company_item);
				setBusinessTime(decode.data.slt_business_hours);
				setBusinessPhone(decode.data.slt_company_hp);
				setShip(decode.data.slt_deliver);
				setMinPrice(decode.data.slt_deliver_pay);
				setChannel(decode.data.slt_channel);
				setPayMent(decode.data.slt_payment);
				if (decode.data.slt_deliver_time)
					setReceive(
						decode.data.slt_deliver_time === 'D-0'
							? 'D-0'
							: decode.data.slt_deliver_time === 'D-1'
							? 'D-1'
							: decode.data.slt_deliver_time[2],
					);
				if (decode.data.slt_deliver_area !== null) {
					if (decode.data.slt_deliver_area === '') setAll(true);
					else setShipLocation([...decode.data.slt_deliver_area.split(',')]);
				}
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const setProfileImg = async Img => {
		try {
			const res = await APIUpdateMyProfile(user.mt_info.mt_idx, 'profile', Img);
			if (res.result === 'true') {
				const uri = res.data;
				dispatch(changeImg(uri));
				Alert.alert('알림', '프로필 사진이 변경되었습니다.', [{text: '확인'}]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const changeProfileImg = () => {
		launchImageLibrary(
			{
				maxHeight: 500,
				maxWidth: 500,
				quality: 0.5,
				mediaType: 'photo',
			},
			response => {
				console.log(response);
				if (response.didCancel) {
					return console.log('취소함');
				} else if (response.error) {
					return console.log(response.error);
				}
				const imgData = {
					name: response.assets[0].fileName,
					type: response.assets[0].type,
					uri: response.assets[0].uri,
				};
				console.log(imgData);
				setProfileImg(imgData);
			},
		);
	};

	const updateProfile = async () => {
		console.log(isShip, isAll, shipLocation.length);
		if (isShip === 1)
			if (shipLocation.length === 0) {
				return Alert.alert('알림', '배송권역을 설정해주세요.', [
					{text: '확인'},
				]);
			}
		if (isShip === 1 && receive === '') {
			return Alert.alert('알림', '배송소요일을 설정해주세요.', [
				{text: '확인'},
			]);
		}
		if (isShip === 1 && minPrice === '') {
			return Alert.alert('알림', '최소 배송금액을 설정해주세요.', [
				{text: '확인'},
			]);
		}
		setLoading(true);
		try {
			const shipList = shipLocation.join(',');
			const res = await APIUpdataSellerProfile(
				user.mt_info.mt_idx,
				selectAddress ? 1 : 2,
				address,
				detailAddress,
				jobOption,
				businessTime,
				businessPhone,
				mainItem,
				etcAddress,
				etcDetailAddress,
				isShip,
				isAll ? '' : shipList,
				receive,
				minPrice,
				channel,
				payment,
			);
			if (res.result === 'true') {
				navigation.goBack();
				Alert.alert('알림', '판매자 정보가 수정되었습니다.', [{text: '확인'}]);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		getData();
		getLocalList(1, '');
		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	const getPost = async address => {
		try {
			const res = await APICallGeo(address.address);
			const getAddress = res.address;
			if (showPost === 'now') {
				setAddress({
					zip: res.road_address.zone_no,
					address: getAddress.address_name,
					lng: getAddress.x,
					lat: getAddress.y,
					dong: getAddress.region_3depth_name,
				});
			} else if (showPost === 'etc') {
				setEtcAddress({
					zip: res.road_address.zone_no,
					address: getAddress.address_name,
					lng: getAddress.x,
					lat: getAddress.y,
					dong: getAddress.region_3depth_name,
				});
			} else {
				console.log('주소 검색 예외?');
			}
		} catch (err) {
			console.log(err);
			Alert.alert('알림', '주소지를 다른 곳으로 해주세요.', [{text: '확인'}]);
		}
	};

	const getLocalList = async (type, code) => {
		try {
			const res = await APICallLocalList(type, code);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				const list = decode.data.map(item => ({
					key: item.code,
					label: item.name,
					value: [item.name, item.code],
				}));
				if (type === 1) {
					setSidoList(list);
				} else if (type === 2) {
					setSigunguList([
						{
							key: 1,
							label: '전체',
							value: ['전체', 1],
						},
						...list,
					]);
				} else {
					setEbmyundongList([
						{
							key: 1,
							label: '전체',
							value: ['전체', 1],
						},
						...list,
					]);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const setShipSection = (type, value) => {
		if (type === 'sido') {
			setSido(value);
			getLocalList(2, value[1]);
			setSigungu(['0', '0']);
			setEbmyundong(['0', '0']);
		} else if (type === 'sigungu') {
			setSigungu(value);
			console.log(value);
			getLocalList(3, value[1]);
			setEbmyundong(['0', '0']);
		} else {
			setEbmyundong(value);
		}
	};

	useEffect(() => {
		if (ebmyundong[0] !== '0') {
			if (
				shipLocation.some(
					element => element === `${sido[0]} ${sigungu[0]} ${ebmyundong[0]}`,
				)
			) {
				return;
			}
			setShipLocation([
				...shipLocation,
				`${sido[0]} ${sigungu[0]} ${ebmyundong[0]}`,
			]);
		}
	}, [ebmyundong]);

	useEffect(() => {
		if (sigungu[0] === '전체') {
			setShipLocation([...shipLocation, `${sido[0]} ${sigungu[0]}`]);
			setSigungu(['0', '0']);
			setEbmyundong(['0', '0']);
		}
	}, [sigungu]);

	useEffect(() => {
		if (isAll) {
			setShipLocation([]);
		}
	}, [isAll]);

	return (
		<Container
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={44}>
			<Header
				title="프로필 수정"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={<SwitchingButton onToggle={state} disabled={true} />}
				border={true}
			/>
			<ScrollView bounces={false}>
				<ProfileImageContainer>
					<MyProfileImageWrap>
						<MyProfileImage source={{uri: user.mt_info.mt_image1}} />
					</MyProfileImageWrap>
					<PressableText onPress={changeProfileImg}>
						<ProfileImageLabel>프로필 사진변경</ProfileImageLabel>
					</PressableText>
				</ProfileImageContainer>
				<ProfileInfoContainer>
					<ProfileInfoWrap>
						<ProfileInfoLabel>상호명</ProfileInfoLabel>
						<ProfileInfoText>{companyName}</ProfileInfoText>
					</ProfileInfoWrap>
					<ProfileInfoWrap>
						<ProfileInfoLabel>대표자명</ProfileInfoLabel>
						<ProfileInfoText>{ceoName}</ProfileInfoText>
					</ProfileInfoWrap>
					<ProfileInfoWrap>
						<ProfileInfoLabel>회원유형</ProfileInfoLabel>
						<ProfileInfoText>{userType}</ProfileInfoText>
					</ProfileInfoWrap>
					<Dive />
					<ProfileInfoLabel style={{marginTop: 10}}>주소</ProfileInfoLabel>
					<RowWrap>
						<InputBox
							style={{
								paddingHorizontal: 10,
							}}>
							<TextInput
								placeholder="주소"
								placeholderColor={ColorLineGrey}
								editable={false}
								value={address.address}
							/>
						</InputBox>
						<EditButton onPress={() => setShowPost('now')}>
							<EditButtonLabel>검색</EditButtonLabel>
						</EditButton>
					</RowWrap>
					<InputBox
						style={{
							paddingHorizontal: 10,
						}}>
						<TextInput
							placeholder="상세주소"
							value={detailAddress}
							onChangeText={text => setDetailAddress(text)}
						/>
					</InputBox>
					<ProfileInfoLabel style={{marginTop: 10}}>업체정보</ProfileInfoLabel>
					<RowWrap>
						<View
							style={{
								borderWidth: 1,
								borderColor: ColorLineGrey,
								paddingHorizontal: 20,
								borderRadius: 5,
								marginRight: 5,
								justifyContent: 'center',
								alignItems: 'center',
								height: 50,
							}}>
							<RNPickerSelect
								items={JobList}
								onValueChange={value => setJobOption(value)}
								value={jobOption}
								placeholder={{key: 0, label: '업종 선택', value: '없음'}}
								doneText="확인"
								fixAndroidTouchableBug={true}
								style={{
									inputIOSContainer: {
										flexDirection: 'row',
										position: 'relative',
										height: '100%',
									},
									inputIOS: {
										position: 'relative',
										height: '100%',
										fontSize: 15,
										fontFamily: FONTNanumGothicRegular,
										paddingRight: 30,
									},
									inputAndroidContainer: {
										flexDirection: 'row',
										position: 'relative',
										height: '100%',
									},
									inputAndroid: {
										position: 'relative',
										fontSize: 15,
										height: '100%',
										fontFamily: FONTNanumGothicRegular,
										color: '#000000',
										padding: 0,
										paddingRight: 20,
									},
									iconContainer: {top: 15},
								}}
								Icon={() => <Icon name="chevron-down" size={20} />}
								useNativeAndroidPickerStyle={false}
							/>
						</View>
						<InputBox
							style={{
								paddingHorizontal: 10,
							}}>
							<TextInput
								value={mainItem}
								onChangeText={text => setMainItem(text)}
								placeholder="주 취급품목 (자유기재)"
							/>
						</InputBox>
					</RowWrap>
					<ProfileInfoLabel style={{marginTop: 10}}>영업시간</ProfileInfoLabel>
					<RowWrap>
						<InputBox
							style={{
								paddingHorizontal: 10,
							}}>
							<TextInput
								placeholder="09:00~18:00"
								value={businessTime}
								onChangeText={text => setBusinessTime(text)}
							/>
						</InputBox>
					</RowWrap>
					<ProfileInfoLabel style={{marginTop: 10}}>
						사업장 전화번호
					</ProfileInfoLabel>
					<RowWrap>
						<InputBox
							style={{
								paddingHorizontal: 10,
							}}>
							<TextInput
								placeholder="01012341234"
								value={businessPhone}
								onChangeText={text => setBusinessPhone(text)}
								maxLength={12}
								keyboardType="number-pad"
							/>
						</InputBox>
					</RowWrap>
					<ProfileInfoLabel style={{marginTop: 10}}>재고위치</ProfileInfoLabel>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5}}
							color={selectAddress}
							onPress={() => setSelectAddress(true)}>
							<SelectButtonLabel color={selectAddress}>
								등록주소지
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							color={!selectAddress}
							onPress={() => setSelectAddress(false)}>
							<SelectButtonLabel color={!selectAddress}>
								기타주소지
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap>
					<RowWrap>
						<InputBox
							style={{
								flex: 1,
								paddingHorizontal: 10,
							}}>
							<TextInput
								placeholder="주소"
								value={selectAddress ? address.address : etcAddress.address}
								editable={false}
							/>
						</InputBox>
						{!selectAddress && (
							<EditButton onPress={() => setShowPost('etc')}>
								<EditButtonLabel>검색</EditButtonLabel>
							</EditButton>
						)}
					</RowWrap>
					<InputBox
						style={{
							flex: 1,
							paddingHorizontal: 10,
						}}>
						<TextInput
							placeholder="상세주소"
							editable={!selectAddress}
							value={selectAddress ? detailAddress : etcDetailAddress}
							onChangeText={text => setEtcDetailAddress(text)}
						/>
					</InputBox>
					<Dive style={{height: 1}} />
					<ProfileInfoLabel
						style={{marginTop: 10, fontSize: 16, marginBottom: 10}}>
						배송정보<RedText>(유료회원 필수정보)</RedText>
					</ProfileInfoLabel>
					<ProfileInfoLabel style={{marginTop: 10}}>배송여부</ProfileInfoLabel>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5}}
							color={isShip === '1'}
							onPress={() => setShip('1')}>
							<SelectButtonLabel color={isShip === '1'}>가능</SelectButtonLabel>
						</SelectButton>
						<SelectButton color={isShip === '2'} onPress={() => setShip('2')}>
							<SelectButtonLabel color={isShip === '2'}>
								불가능
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap>
					<RowWrap style={{justifyContent: 'space-between', marginTop: 10}}>
						<ProfileInfoLabel style={{marginTop: 10}}>
							배송권역 <RedText>(시/도부터 차례로 선택)</RedText>
						</ProfileInfoLabel>
						<RowWrap
							style={{
								alignItems: 'center',
								marginRight: 10,
							}}>
							<Checkbox.Android
								status={isAll ? 'checked' : 'unchecked'}
								color={ColorBlue}
								onPress={() => setAll(!isAll)}
							/>
							<RedText style={{fontFamily: FONTNanumGothicBold}}>전국</RedText>
						</RowWrap>
					</RowWrap>
					{!isAll && (
						<>
							<RowWrap>
								<View
									style={{
										flex: 1,
										borderWidth: 1,
										borderColor: ColorLineGrey,
										paddingHorizontal: 10,
										borderRadius: 5,
										marginRight: 5,
										justifyContent: 'center',
										alignItems: 'center',
										height: 50,
									}}>
									<RNPickerSelect
										items={sidoList}
										onValueChange={value => setShipSection('sido', value)}
										placeholder={{key: '0', label: '시/도', value: ['0', '0']}}
										doneText="확인"
										fixAndroidTouchableBug={true}
										style={{
											inputIOSContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
											},
											inputIOS: {
												position: 'relative',
												height: '100%',
												fontSize: 12,
												fontFamily: FONTNanumGothicRegular,
												paddingRight: 30,
											},
											inputAndroidContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
											},
											inputAndroid: {
												position: 'relative',
												fontSize: 12,
												height: '100%',
												width: '100%',
												fontFamily: FONTNanumGothicRegular,
												color: '#000000',
												padding: 0,
												paddingRight: 20,
											},
											iconContainer: {top: 15},
										}}
										Icon={() => <Icon name="chevron-down" size={20} />}
										useNativeAndroidPickerStyle={false}
									/>
								</View>
								<View
									style={{
										flex: 1,
										borderWidth: 1,
										borderColor: ColorLineGrey,
										paddingHorizontal: 10,
										borderRadius: 5,
										marginRight: 5,
										justifyContent: 'center',
										alignItems: 'center',
										height: 50,
									}}>
									<RNPickerSelect
										items={sigunguList}
										onValueChange={value => setShipSection('sigungu', value)}
										placeholder={{
											key: '0',
											label: '시/군/구',
											value: ['0', '0'],
										}}
										doneText="확인"
										disabled={sido[1] === '0'}
										fixAndroidTouchableBug={true}
										style={{
											inputIOSContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
											},
											inputIOS: {
												position: 'relative',
												height: '100%',
												fontSize: 12,
												fontFamily: FONTNanumGothicRegular,
												paddingRight: 30,
											},
											inputAndroidContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
											},
											inputAndroid: {
												position: 'relative',
												fontSize: 12,
												height: '100%',
												width: '100%',
												fontFamily: FONTNanumGothicRegular,
												color: '#000000',
												padding: 0,
												paddingRight: 20,
											},
											iconContainer: {top: 15},
										}}
										Icon={() => <Icon name="chevron-down" size={20} />}
										useNativeAndroidPickerStyle={false}
									/>
								</View>
								<View
									style={{
										flex: 1,
										borderWidth: 1,
										borderColor: ColorLineGrey,
										paddingHorizontal: 10,
										borderRadius: 5,
										marginRight: 5,
										justifyContent: 'center',
										alignItems: 'center',
										height: 50,
									}}>
									<RNPickerSelect
										items={ebmyundongList}
										onValueChange={value => setShipSection('ebmyundong', value)}
										placeholder={{
											key: '0',
											label: '읍/면/동',
											value: ['0', '0'],
										}}
										doneText="확인"
										disabled={sigungu[1] === '0' || sigungu[1] === '1'}
										fixAndroidTouchableBug={true}
										style={{
											inputIOSContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
											},
											inputIOS: {
												position: 'relative',
												height: '100%',
												fontSize: 12,
												fontFamily: FONTNanumGothicRegular,
												paddingRight: 30,
											},
											inputAndroidContainer: {
												flexDirection: 'row',
												position: 'relative',
												height: '100%',
												padding: 0,
											},
											inputAndroid: {
												position: 'relative',
												fontSize: 12,
												height: '100%',
												width: '100%',
												fontFamily: FONTNanumGothicRegular,
												color: '#000000',
												padding: 0,
												paddingRight: 20,
											},
											iconContainer: {top: 15},
										}}
										Icon={() => <Icon name="chevron-down" size={20} />}
										useNativeAndroidPickerStyle={false}
									/>
								</View>
							</RowWrap>
							<RowWrap style={{marginTop: 10, flexWrap: 'wrap'}}>
								{shipLocation.map((item, index) => (
									<LocationBox
										key={index}
										item={item}
										index={index}
										shipLocation={shipLocation}
										setShipLocation={setShipLocation}
										color={ColorBlue}
									/>
								))}
							</RowWrap>
						</>
					)}
					<ProfileInfoLabel style={{marginTop: 10}}>
						배송소요일
					</ProfileInfoLabel>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5}}
							color={receive === 'D-0'}
							onPress={() => {
								dayRef.current.blur();
								setReceive('D-0');
							}}>
							<SelectButtonLabel color={receive === 'D-0'}>
								당일
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							color={receive === 'D-1'}
							onPress={() => {
								dayRef.current.blur();
								setReceive('D-1');
							}}>
							<SelectButtonLabel color={receive === 'D-1'}>
								익일
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5}}
							color={receive !== 'D-0' && receive !== 'D-1'}
							onPress={() => {
								setReceive('');
								dayRef.current.focus();
							}}>
							<SelectButtonLabel color={receive !== 'D-0' && receive !== 'D-1'}>
								직접입력
							</SelectButtonLabel>
						</SelectButton>
						<InputBox style={{padding: 0}}>
							<TextInput
								style={{textAlign: 'center'}}
								ref={dayRef}
								placeholder="기간 입력"
								onChangeText={text => setReceive(text)}
								value={receive === 'D-0' || receive === 'D-1' ? '' : receive}
							/>
							<InputLabel
								style={{
									color: '#000000',
									fontFamily: FONTNanumGothicBold,
									marginHorizontal: 10,
								}}>
								일
							</InputLabel>
						</InputBox>
					</RowWrap>
					<RowWrap>
						<ProfileInfoLabel style={{fontSize: 16, paddingHorizontal: 10}}>
							최소 배송 금액
						</ProfileInfoLabel>
						<InputBox style={{padding: 0}}>
							<TextInput
								style={{textAlign: 'center'}}
								keyboardType="number-pad"
								value={minPrice}
								onChangeText={text => setMinPrice(text)}
								placeholder="금액 입력"
							/>
							<InputLabel
								style={{
									color: '#000000',
									fontFamily: FONTNanumGothicBold,
									marginHorizontal: 10,
								}}>
								원
							</InputLabel>
						</InputBox>
					</RowWrap>
					<Dive style={{height: 1}} />
					{/* <ProfileInfoLabel style={{marginTop: 10}}>거래채널</ProfileInfoLabel>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5, height: 80}}
							color={channel === '1'}
							onPress={() => setChannel('1')}>
							<SelectButtonLabel color={channel === '1'}>
								전체
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							style={{marginRight: 5, height: 80}}
							color={channel === '2'}
							onPress={() => setChannel('2')}>
							<SelectButtonLabel color={channel === '2'}>
								B2B{'\n'}사업자전용
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							style={{height: 80}}
							color={channel === '3'}
							onPress={() => setChannel('3')}>
							<SelectButtonLabel color={channel === '3'}>
								B2C{'\n'}일반고객
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap> */}
					<ProfileInfoLabel style={{marginTop: 10}}>결제방법</ProfileInfoLabel>
					<RowWrap style={{marginBottom: 10}}>
						<SelectButton
							style={{marginRight: 5}}
							color={payment === '1'}
							onPress={() => setPayMent('1')}>
							<SelectButtonLabel color={payment === '1'}>
								당일결제
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							color={payment === '2'}
							onPress={() => setPayMent('2')}>
							<SelectButtonLabel color={payment === '2'}>
								말일결제
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap>
					<RowWrap>
						<SelectButton
							style={{marginRight: 5}}
							color={payment === '3'}
							onPress={() => setPayMent('3')}>
							<SelectButtonLabel color={payment === '3'}>
								익월 10일
							</SelectButtonLabel>
						</SelectButton>
						<SelectButton
							color={payment === '4'}
							onPress={() => setPayMent('4')}>
							<SelectButtonLabel color={payment === '4'}>
								협의
							</SelectButtonLabel>
						</SelectButton>
					</RowWrap>
				</ProfileInfoContainer>
				<ButtonWrap>
					<LongButton
						text="판매자 정보 수정"
						onPress={updateProfile}
						color={ColorBlue}
					/>
				</ButtonWrap>
			</ScrollView>
			<PostcodeModal
				isShow={showPost === 'now' || showPost === 'etc'}
				setIsShow={setShowPost}
				getPost={getPost}
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
};

export default SellerProfileEdit;
