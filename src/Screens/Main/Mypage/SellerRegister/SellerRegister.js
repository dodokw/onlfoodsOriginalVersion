import React, {useState, useRef, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {
	ColorGreen,
	ColorLineGrey,
	ColorRed,
	ColorBlue,
} from '~/Assets/Style/Colors';
import RNPickerSelect from 'react-native-picker-select';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {APICallGeo, APICallLocalList} from '../../../../API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import PostcodeModal from '../../../../Components/Modal/PostcodeModal';
import {APISellerSignUp} from '../../../../API/SignAPI/SignAPI';
import {useDispatch, useSelector} from 'react-redux';
import {Alert} from 'react-native';
import LoadingModal from '~/Components/LoadingModal';
import {floatingHide} from '~/Modules/Action';
import {Checkbox} from 'react-native-paper';
import {color} from 'react-native-reanimated';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin-top: 20px;
	margin-bottom: 10px;
`;

const RedLabel = styled.Text`
	color: ${ColorRed};
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-color: ${props => (props.focus ? ColorRed : ColorLineGrey)};
	border-width: 0.5px;
	border-radius: 5px;
	height: 50px;
	align-items: center;
`;
const Input = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	color: #000000;
	font-size: 16px;
`;
const InputLabel = styled.Text`
	margin-left: 5px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 15px;
	color: ${props =>
		props.color === 'red'
			? ColorRed
			: props.color === 'green'
			? ColorGreen
			: ColorLineGrey};
`;
const TextInput = styled.TextInput`
	border-color: #cecece;
	border-width: 0.5px;
	border-radius: 5px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	height: 50px;
	padding: 0 10px;
	color: #000000;
`;
const Wrap = styled.View`
	flex-direction: row;
`;
const ButtonBox = styled.TouchableOpacity`
	width: 100px;
	padding: 15px 20px;
	background-color: ${props => (props.pass ? ColorLineGrey : ColorRed)};
	border-radius: 5px;
	margin-left: 5px;
	align-items: center;
	justify-content: center;
`;
const ButtonBoxLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;
const Dive = styled.View`
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	margin: 20px 0;
`;

const SelectButton = styled.TouchableOpacity`
	flex: 1;
	height: 50px;
	border-width: 1px;
	border-radius: 5px;
	border-color: ${props => (props.color ? ColorRed : ColorLineGrey)};
	justify-content: center;
	align-items: center;
`;
const SelectButtonLabel = styled.Text`
	color: ${props => (props.color ? ColorRed : ColorLineGrey)};
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const RegiButton = styled.TouchableOpacity`
	border-radius: 8px;
	background-color: ${ColorRed};
	margin: 10px 0;
`;
const RegiLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	font-size: 16px;
	text-align: center;
	padding: 20px 0;
`;

const SubTextLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 13px;
	text-align: center;
	color: #989898;
`;

const BoldLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;

const LocationWrap = styled.View`
	border-radius: 25px;
	background-color: ${props => (props.color ? props.color : ColorRed)};
	padding: 5px 10px;
	margin: 3px;
	flex-direction: row;
	align-items: center;
`;

const LocationLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 13px;
	color: #ffffff;
`;

const LocationX = styled.TouchableOpacity`
	margin-left: 5px;
`;

const defaultFocus = {
	info: false,
	time: false,
	phone: false,
	ceoname: false,
	phoneNum: false,
	password: false,
	rePassword: false,
	reqData: false,
};

const JobList = [
	{key: 1, label: '마트', value: '1'},
	{key: 2, label: '식자재', value: '2'},
	{key: 3, label: '도매', value: '3'},
	{key: 4, label: '소매', value: '4'},
	{key: 5, label: '제조', value: '5'},
	{key: 6, label: '생산', value: '6'},
];

export const LocationBox = ({
	item,
	index,
	shipLocation,
	setShipLocation,
	color,
}) => {
	const label = item.split(' ');
	const onDelete = () => {
		const newShip = shipLocation.filter(
			(deepitem, deepindex) => index !== deepindex,
		);
		setShipLocation(newShip);
	};

	return (
		<LocationWrap color={color}>
			<LocationLabel>
				{label[label.length - 1] === '전체'
					? `${label[label.length - 2]} ${label[label.length - 1]} `
					: label[label.length - 1]}
			</LocationLabel>
			<LocationX onPress={onDelete}>
				<Icon name="x" color="#ffffff" size={15} />
			</LocationX>
		</LocationWrap>
	);
};

function SellerRegister({navigation, route}) {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const nowAddress = route.params.address;
	const dispatch = useDispatch();
	const [focusedInput, setFocusedInput] = useState(defaultFocus);
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
	const [detailAddress, setDetailAddress] = useState('');
	const [isShip, setShip] = useState(false);
	const [isAll, setAll] = useState(false);
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
	const [showPost, setShowPost] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const dayRef = useRef();

	const onSign = async () => {
		try {
			if (
				jobOption === '' ||
				businessTime === '' ||
				businessPhone === '' ||
				mainItem === '' ||
				channel === '' ||
				payment === ''
			) {
				return Alert.alert('알림', '추가정보에 비어진 곳이 있습니다.', [
					{text: '확인'},
				]);
			}
			if (!selectAddress && address.address === '') {
				return Alert.alert('알림', '주소를 입력해주세요.', [{text: '확인'}]);
			}
			if (isShip && !isAll && shipLocation.length === 0) {
				return Alert.alert('알림', '배송권역을 설정해주세요.', [
					{text: '확인'},
				]);
			}
			if (isShip && receive === '') {
				return Alert.alert('알림', '배송소요일을 설정해주세요.', [
					{text: '확인'},
				]);
			}
			if (isShip && minPrice === '') {
				return Alert.alert('알림', '최소 배송금액을 설정해주세요.', [
					{text: '확인'},
				]);
			}
			const shipList = shipLocation.length > 0 ? shipLocation.join(',') : '';

			const sendData = {
				mt_idx: user.mt_idx,
				category: jobOption,
				desc: mainItem,
				time: businessTime,
				phone: businessPhone,
				selectAddress: selectAddress ? 1 : 2,
				nowAddress: nowAddress,
				address: address,
				sangse: detailAddress,
				isDeliver: isShip ? 1 : 2,
				deliverArea: shipList,
				deliverTime: receive,
				deliverPrice: minPrice,
				channel: channel,
				payment: payment,
			};
			console.log(sendData);
			return navigation.navigate('SellerService', {
				data: sendData,
			});
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const getPost = async address => {
		try {
			const res = await APICallGeo(address.address);
			const getAddress = res.address;
			setAddress({
				zip: res.road_address.zone_no,
				address: getAddress.address_name,
				lng: getAddress.x,
				lat: getAddress.y,
				dong: getAddress.region_3depth_name,
			});
		} catch (err) {
			console.log(err);
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
			getLocalList(3, value[1]);
		} else {
			setEbmyundong(value);
		}
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		getLocalList(1, '');
	}, []);

	useEffect(() => {
		if (isAll) {
			setShipLocation([]);
		}
	}, [isAll]);

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

	return (
		<Container
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={44}>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="추가정보입력"
			/>
			<ScrollView
				style={{padding: 10, backgroundColor: '#ffffff'}}
				contentContainerStyle={{paddingBottom: 40}}
				bounces={false}>
				<Title>업체정보</Title>
				<Wrap>
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
						style={{flex: 1, paddingHorizontal: 10}}
						focus={focusedInput.info}>
						<Input
							value={mainItem}
							onChangeText={text => setMainItem(text)}
							placeholder="주 취급품목 (자유기재)"
							onFocus={() => setFocusedInput({...defaultFocus, info: true})}
						/>
					</InputBox>
				</Wrap>
				<Title>영업시간</Title>
				<TextInput
					style={{
						borderColor: focusedInput.time ? ColorRed : ColorLineGrey,
					}}
					value={businessTime}
					onChangeText={text => setBusinessTime(text)}
					onFocus={() => setFocusedInput({...defaultFocus, time: true})}
					placeholder="09:00 - 18:00"
					maxLength={30}
				/>
				<Title>사업장 전화번호</Title>
				<TextInput
					style={{
						borderColor: focusedInput.phone ? ColorRed : ColorLineGrey,
					}}
					value={businessPhone}
					onChangeText={text => setBusinessPhone(text)}
					onFocus={() => setFocusedInput({...defaultFocus, phone: true})}
					placeholder="01012341234"
					maxLength={12}
					keyboardType="number-pad"
				/>
				<Title>재고위치</Title>
				<Wrap style={{marginBottom: 10}}>
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
				</Wrap>
				<Wrap style={{marginBottom: 10}}>
					<InputBox
						style={{
							flex: 1,
							borderColor: focusedInput.doro ? ColorRed : ColorLineGrey,
							paddingHorizontal: 10,
						}}>
						<Input
							value={selectAddress ? nowAddress.address : address.address}
							onFocus={() => setFocusedInput({...defaultFocus, doro: true})}
							placeholder="주소"
							editable={false}
						/>
						<InputLabel color="red"></InputLabel>
					</InputBox>
					<ButtonBox onPress={() => setShowPost(true)} disabled={selectAddress}>
						<ButtonBoxLabel>검색</ButtonBoxLabel>
					</ButtonBox>
				</Wrap>
				<TextInput
					style={{
						borderColor: focusedInput.sangse ? ColorRed : ColorLineGrey,
					}}
					value={selectAddress ? nowAddress.sangse : detailAddress}
					onChangeText={text => setDetailAddress(text)}
					onFocus={() => setFocusedInput({...defaultFocus, sangse: true})}
					editable={!selectAddress}
					placeholder="상세주소"
					maxLength={20}
				/>

				<Dive />

				<Title style={{fontSize: 16, marginTop: 0}}>배송정보</Title>
				<Title>배송여부</Title>
				<Wrap>
					<SelectButton
						style={{marginRight: 5}}
						color={isShip}
						onPress={() => setShip(true)}>
						<SelectButtonLabel color={isShip}>가능</SelectButtonLabel>
					</SelectButton>
					<SelectButton color={!isShip} onPress={() => setShip(false)}>
						<SelectButtonLabel color={!isShip}>불가능</SelectButtonLabel>
					</SelectButton>
				</Wrap>

				<Wrap style={{alignItems: 'center', justifyContent: 'space-between'}}>
					<Title>
						배송권역 <RedLabel>(시/도부터 차례로 선택)</RedLabel>
					</Title>
					<Wrap
						style={{
							alignItems: 'center',
							marginTop: 20,
							marginBottom: 10,
							marginRight: 10,
						}}>
						<Checkbox.Android
							status={isAll ? 'checked' : 'unchecked'}
							color={ColorRed}
							onPress={() => setAll(!isAll)}
						/>
						<RedLabel style={{fontFamily: FONTNanumGothicBold}}>전국</RedLabel>
					</Wrap>
				</Wrap>
				{!isAll && (
					<>
						<Wrap style={{marginVertical: 5}}>
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
									placeholder={{key: '0', label: '시/군/구', value: ['0', '0']}}
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
									placeholder={{key: '0', label: '읍/면/동', value: ['0', '0']}}
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
						</Wrap>
						<Wrap style={{flexWrap: 'wrap'}}>
							{shipLocation.map((item, index) => (
								<LocationBox
									key={index}
									item={item}
									index={index}
									shipLocation={shipLocation}
									setShipLocation={setShipLocation}
								/>
							))}
						</Wrap>
					</>
				)}

				<Title>배송소요일</Title>
				<Wrap style={{marginBottom: 10}}>
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
				</Wrap>
				<Wrap style={{marginBottom: 10}}>
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
						<Input
							ref={dayRef}
							style={{textAlign: 'center'}}
							placeholder="기간 입력"
							onChangeText={text => setReceive(text.replace(/[^0-9]/g, ''))}
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
				</Wrap>
				<Wrap style={{alignItems: 'center'}}>
					<BoldLabel style={{fontSize: 16, paddingHorizontal: 10}}>
						최소 배송 금액
					</BoldLabel>
					<InputBox style={{padding: 0}}>
						<Input
							style={{textAlign: 'center'}}
							keyboardType="number-pad"
							value={minPrice}
							onChangeText={text => setMinPrice(text.replace(/[^0-9]/g, ''))}
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
				</Wrap>

				<Dive />

				<Title>거래채널</Title>
				<Wrap>
					<SelectButton
						style={{marginRight: 5, height: 80}}
						color={channel === '1'}
						onPress={() => setChannel('1')}>
						<SelectButtonLabel color={channel === '1'}>전체</SelectButtonLabel>
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
				</Wrap>

				<Title>결제방법</Title>
				<Wrap style={{marginBottom: 10}}>
					<SelectButton
						style={{marginRight: 5}}
						color={payment === '1'}
						onPress={() => setPayMent('1')}>
						<SelectButtonLabel color={payment === '1'}>현금</SelectButtonLabel>
					</SelectButton>
					<SelectButton color={payment === '2'} onPress={() => setPayMent('2')}>
						<SelectButtonLabel color={payment === '2'}>카드</SelectButtonLabel>
					</SelectButton>
				</Wrap>
				<Wrap>
					<SelectButton
						style={{marginRight: 5}}
						color={payment === '3'}
						onPress={() => setPayMent('3')}>
						<SelectButtonLabel color={payment === '3'}>
							온누리상품권
						</SelectButtonLabel>
					</SelectButton>
					<SelectButton color={payment === '4'} onPress={() => setPayMent('4')}>
						<SelectButtonLabel color={payment === '4'}>기타</SelectButtonLabel>
					</SelectButton>
				</Wrap>

				<RegiButton onPress={onSign}>
					<RegiLabel>작성완료</RegiLabel>
				</RegiButton>
				{/* <SubTextLabel>
					*판매자 가입은 관리자 승인 후 완료되며{' '}
					<BoldLabel>1 영업일 내 처리</BoldLabel>됩니다.
				</SubTextLabel> */}
			</ScrollView>
			<PostcodeModal
				isShow={showPost}
				setIsShow={setShowPost}
				getPost={getPost}
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
}

export default SellerRegister;
