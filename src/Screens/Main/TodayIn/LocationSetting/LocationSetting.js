import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import {APICallAddr, APICallGeo} from '~/API/MainAPI/MainAPI';
import {
	ColorGreen,
	ColorLineGrey,
	ColorLowRed,
	ColorRed,
} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import Geolocation from 'react-native-geolocation-service';
import {Alert, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {floatingHide, settingLocation} from '~/Modules/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import LongButton from '~/Components/LongButton/LongButton';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import {BackHandler} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const MainBox = styled.View`
	padding: 20px;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;

const TitleBox = styled.View`
	margin: 20px;
	margin-bottom: 40px;
`;

const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 20px;
	text-align: center;
`;

const BoxButton = styled.TouchableOpacity`
	height: 50px;
	margin-bottom: 10px;
`;
const InputBox = styled.View`
	flex-direction: row;
	border-color: ${props => (props.focus ? ColorRed : ColorLineGrey)};
	border-width: 0.5px;
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
	align-items: center;
`;
const Input = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #000000;
`;
const AddrText = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #000000;
`;
const InputLabel = styled.Text`
	margin-left: 5px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
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
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	height: 50px;
	padding: 0 10px;
	color: #000000;
`;
const Wrap = styled.View`
	flex-direction: row;
	margin-bottom: 10px;
`;
const SearchBox = styled.View`
	padding: 7px;
	background-color: ${ColorRed};
	border-radius: 50px;
`;

const Dive = styled.View`
	height: 1px;
	background-color: ${ColorLineGrey};
	margin: 10px 0;
`;

const Bar = styled.TouchableOpacity`
	flex-direction: row;
	border-color: ${ColorLineGrey};
	border-bottom-width: 1px;
	padding: 10px 20px;
	background-color: ${props =>
		props.backgroundColor ? ColorLowRed : '#ffffff'};
`;

const BarLabel = styled.Text`
	flex: 1;
	color: ${props => (props.color ? ColorRed : '#000000')};
	font-family: ${props =>
		props.font ? FONTNanumGothicBold : FONTNanumGothicRegular};
`;

const CancelButton = styled.TouchableOpacity``;

const Button = styled.TouchableOpacity`
	width: 100%;
	height: 50px;
	background-color: #ffffff;
	border-radius: 5px;
	border-width: 1px;
	border-color: ${ColorRed};
	justify-content: center;
	align-items: center;
`;
const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
	color: ${ColorRed};
`;

const AddrBar = ({address, onPress, delAction, index}) => {
	return (
		<Bar onPress={onPress} disabled={index === 0} backgroundColor={index === 0}>
			<BarLabel color={index === 0} font={index === 0}>
				{address.address_name} {address.sangse}
			</BarLabel>
			{index !== 0 && (
				<CancelButton onPress={delAction}>
					<Icon name="x" size={20} />
				</CancelButton>
			)}
		</Bar>
	);
};

function LocationSetting({navigation}) {
	const dispatch = useDispatch();
	const location = useSelector(state => state.dataReducer.location);
	const [list, setList] = useState([]);
	const [address, setAddress] = useState({
		zip: '',
		address_name: '',
		sangse: '',
		region_3depth_name: '',
		x: '',
		y: '',
	});
	const [showPost, setShowPost] = useState(false);
	const sangseInput = useRef();

	const getPost = async address => {
		try {
			const res = await APICallGeo(address.address);
			if (res.address !== undefined) {
				const getAddress = res.address;
				setAddress({
					//zip: res.road_address.zone_no,
					zip: '',
					address_name: getAddress.address_name,
					region_3depth_name: getAddress.region_3depth_name,
					x: getAddress.x,
					y: getAddress.y,
					sangse: '',
				});
			} else {
				Alert.alert(
					'알림',
					'설정한 위치정보를 받아오지 못했습니다. 다른위치로 설정해주세요.',
					[{text: '확인'}],
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	async function requestPermission() {
		try {
			if (Platform.OS === 'ios') {
				return await Geolocation.requestAuthorization('always');
			} // 안드로이드 위치 정보 수집 권한 요청
			if (Platform.OS === 'android') {
				return await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				);
			}
		} catch (e) {
			console.log(e);
		}
	}
	const getMyLocation = async (longitude, latitude) => {
		try {
			console.log(longitude, latitude);
			const res = await APICallAddr(longitude, latitude);
			if (res.address) {
				const getAddress = res.address;
				console.log(res);
				const newAddress = {
					zip: '',
					address_name: getAddress.address_name,
					region_3depth_name: getAddress.region_3depth_name,
					x: String(longitude),
					y: String(latitude),
					sangse: '',
				};
				console.log(newAddress);
				setAddress(newAddress);
			} else {
				Alert.alert(
					'알림',
					'위치를 받아올 수 없습니다. 직접 위치를 설정해주세요.',
					[{text: '확인'}],
				);
			}
		} catch (err) {
			console.error(err);
			Alert.alert(
				'알림',
				'위치를 받아올 수 없습니다. 직접 위치를 설정해주세요.',
				[{text: '확인'}],
			);
		}
	};

	const getPosition = () => {
		requestPermission().then(() =>
			Geolocation.getCurrentPosition(
				position => {
					const {latitude, longitude} = position.coords;
					getMyLocation(longitude, latitude);
				},
				error => {
					Alert.alert(
						'알림',
						'위치를 받아올 수 없습니다. 위치 권한이 거부되어있는지 확인해주세요.',
						[{text: '확인'}],
					);
				},
				{enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
			),
		);
	};

	const setLocation = async () => {
		if (address.addr1 === '' || address.sangse === '') {
			return Alert.alert('알림', '주소 및 상세주소를 입력 해주세요.', [
				{text: '확인'},
			]);
		} else {
			dispatch(settingLocation(address));
			setList([address, ...list.slice(0, 4)]);
			await AsyncStorage.setItem(
				'LocationList',
				JSON.stringify([address, ...list.slice(0, 4)]),
			);
			Alert.alert('알림', '배송지를 설정하였습니다.', [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
	};

	const getLocationList = async () => {
		const list = await AsyncStorage.getItem('LocationList');
		if (list !== null) setList(JSON.parse(list));
	};

	const callHistory = async (address, delIndex) => {
		const newList = list.filter((element, index) => index !== delIndex);
		setList([address, ...newList]);
		dispatch(settingLocation(address));
		await AsyncStorage.setItem(
			'LocationList',
			JSON.stringify([address, ...newList]),
		);
		Alert.alert('알림', '배송지를 설정하였습니다.', [
			{text: '확인', onPress: () => navigation.goBack()},
		]);
	};

	const delList = async delIndex => {
		const newList = list.filter((element, index) => index !== delIndex);
		setList([...newList]);
		await AsyncStorage.setItem('LocationList', JSON.stringify([...newList]));
	};

	const handleBackPress = () => {
		if (location) {
			return false;
		} else {
			return true;
		}
	};

	useEffect(() => {
		if (address.address_name !== '') sangseInput.current.focus();
	}, [address]);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		getLocationList();
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			handleBackPress,
		);
		return () => backHandler.remove();
	}, []);

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Container>
				<Header
					headerLeft={
						location && <BackButton onPress={() => navigation.goBack()} />
					}
					title="배송지 입력"
					border
				/>
				<MainBox>
					<TitleBox>
						<Title>배송 받으실</Title>
						<Title>주소를 설정해주세요.</Title>
					</TitleBox>
					<BoxButton onPress={() => setShowPost(true)}>
						<InputBox
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<AddrText
								style={{
									color:
										address.address_name === '' ? ColorLineGrey : '#000000',
								}}>
								{address.address_name == ''
									? '주소를 검색해주세요.'
									: address.address_name}
							</AddrText>
							<SearchBox>
								<Icon name="search" size={20} color="#ffffff" />
							</SearchBox>
						</InputBox>
					</BoxButton>
					{address.address_name !== '' && (
						<TextInput
							value={address.sangse}
							onChangeText={text => setAddress({...address, sangse: text})}
							placeholder="상세주소"
							style={{marginBottom: 10}}
							ref={sangseInput}
						/>
					)}

					<LongButton text="배송지 설정" radius={5} onPress={setLocation} />
					<Dive />
					<Button onPress={getPosition} style={{flexDirection: 'row'}}>
						<Icon
							name="crosshair"
							color={ColorRed}
							size={20}
							style={{marginRight: 5}}
						/>
						<ButtonLabel>현재위치로 설정</ButtonLabel>
					</Button>
				</MainBox>
				<Title style={{fontSize: 16, textAlign: 'left', margin: 10}}>
					최근 설정한 주소
				</Title>
				<FlatList
					bounces={false}
					data={list}
					keyExtractor={(item, index) => `list-${index}`}
					renderItem={({item, index}) => (
						<AddrBar
							address={item}
							onPress={() => callHistory(item, index)}
							delAction={() => delList(index)}
							index={index}
						/>
					)}
				/>
				<PostcodeModal
					isShow={showPost}
					setIsShow={setShowPost}
					getPost={getPost}
				/>
			</Container>
		</TouchableWithoutFeedback>
	);
}

export default LocationSetting;
