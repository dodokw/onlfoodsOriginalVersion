import React, {useRef, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {ic_share} from '~/Assets/Images/ic_share.svg';
import {ic_search} from '~/Assets/Images/ic_search.svg';
import RNPickerSelect from 'react-native-picker-select';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import Icon from 'react-native-vector-icons/Feather';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {
	APICallAddr,
	APICallAlramCount,
	APICallGeo,
} from '~/API/MainAPI/MainAPI';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {alramCount, settingLocation} from '~/Modules/Action';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import jwtDecode from 'jwt-decode';
import {useIsFocused} from '@react-navigation/native';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {Alert} from 'react-native';
import Sharing from '~/Tools/Share';
import {Linking} from 'react-native';
import {NativeModules} from 'react-native';
import {set} from 'react-native-reanimated';
import {TouchableWithoutFeedback} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {Modal} from 'react-native';
import {View} from 'react-native';

const HeaderContainer = styled.View`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	flex-direction: row;
	height: 50px;
	align-items: center;
	justify-content: space-between;
	background-color: #ffffff;
	border-bottom-width: ${props => (props.border ? '1px' : '0px')};
	border-color: #dfdfdf;
	padding: 0px 10px;
`;

const HeaderWrap = styled.View`
	flex-direction: row;
`;

const Button = styled.TouchableOpacity`
	margin: 0 10px;
`;

const Image = styled.Image`
	height: 25px;
	width: 25px;
`;
const LocationContainer = styled.View`
	flex: 1;
	flex-direction: row;
	height: 35px;
	border-radius: 5px;
	align-items: center;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	padding-left: 5px;
`;

const Dot = styled.View`
	position: absolute;
	right: 0px;
	background-color: ${ColorRed};
	height: 16px;
	width: 16px;
	border-radius: 50px;
	justify-content: center;
	align-items: center;
`;

const Count = styled.Text`
	color: #ffffff;
	font-size: 10px;
	text-align: center;
`;

const ModalBackground = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.7);
	justify-content: center;
	align-items: center;
`;

const ModalMenuBox = styled.View`
	width: 70%;
	background-color: #ffffff;
`;

const ItemButton = styled.TouchableOpacity``;

const ItemBox = styled.View`
	padding: 20px 10px;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;

const ItemLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
`;

const MainHeader = ({navigation, setLat, setLng, distance}) => {
	const dispatch = useDispatch();
	const {user} = useSelector(state => state.loginReducer);
	const count = useSelector(state => state.dataReducer.alram);
	const location = useSelector(state => state.dataReducer.location);
	const [showPost, setShowPost] = useState(false);
	const [check, setCheck] = useState(false);
	const [pass, setPass] = useState(true);
	const isFocus = useIsFocused();

	const getCount = async () => {
		try {
			const res = await APICallAlramCount(user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				dispatch(alramCount(parseInt(decode.data)));
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (isFocus) {
			getCount();
		}
	}, [isFocus]);

	return (
		<HeaderContainer>
			<HeaderWrap>
				<Button onPress={() => navigation.push('Alram')}>
					<Image
						source={require('~/Assets/Images/bell.png')}
						resizeMode="contain"
					/>
					{count > 0 && (
						<Dot>
							<Count>{count > 99 ? '99' : count}</Count>
						</Dot>
					)}
				</Button>
				{/* <Button onPress={() => Sharing()} disabled={true}>
					<Icon name="share-2" size={20} color="#ffffff" />
				</Button> */}
			</HeaderWrap>
			<TouchableOpacity
				style={{flex: 1, marginVertical: 5}}
				onPress={() => navigation.navigate('LocationSetting')}>
				<LocationContainer>
					<Image
						source={require('~/Assets/Images/pin.png')}
						resizeMode="contain"
						style={{marginRight: 5}}
					/>
					{location && (
						<Text
							ellipsizeMode="tail"
							numberOfLines={1}
							style={{paddingVertical: 10, flex: 1}}>
							{location.address_name} {location.sangse}
						</Text>
					)}
				</LocationContainer>
			</TouchableOpacity>

			<HeaderWrap>
				{/* <Button onPress={() => Sharing()} disabled={true}>
					<Icon name="share-2" size={20} color="#ffffff" />
				</Button> */}
				<Button onPress={() => navigation.push('Search', {distance})}>
					<SvgXml xml={ic_search} />
				</Button>
			</HeaderWrap>
		</HeaderContainer>
	);
};

export default MainHeader;
