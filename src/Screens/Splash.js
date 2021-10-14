import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import React, {useEffect} from 'react';
import {Modal} from 'react-native';
import {Svg, Ellipse, G, Path, Text, TSpan} from 'react-native-svg';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {APICallBanner} from '~/API/MainAPI/MainAPI';
import {chatCount, login, setToken} from '~/Modules/Action';
import messaging from '@react-native-firebase/messaging';
import {APIAutoLogin} from '../API/SignAPI/SignAPI';
import {Platform} from 'react-native';
import {Alert} from 'react-native';
import {PermissionsAndroid} from 'react-native';

const Container = styled.View`
	flex: 1;
	background-color: #ec636b;
`;

const LogoWrap = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const CompanyLabel = styled.Text`
	text-align: center;
	color: #fff;
	margin-top: 20px;
	margin-bottom: 20px;
`;

const Splash = ({isLoading, setLoading}) => {
	const dispatch = useDispatch();

	async function requestLocationPermission() {
		try {
			// 퍼미션 요청 다이얼로그 보이기
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			);
			setFireBaseToken();
			if (granted == PermissionsAndroid.RESULTS.GRANTED) {
				console.log('위치 권한 허용');
			} else {
				console.log('위치 권한 거절');
				// setLat(37.5642135);
				// setLng(127.0016985);
				// getMyLocation(127.0016985, 37.5642135);
			}
		} catch (err) {
			Alert.alert('퍼미션 작업 에러');
		}
	}

	const setFireBaseToken = async () => {
		try {
			const authStatus = await messaging().requestPermission();
			const token = await messaging().getToken();
			if (token) {
				console.log('파이어베이스토큰🔥', token);
				dispatch(setToken(token));
				autoLogin(token);
			} else {
				setFireBaseToken();
			}
		} catch {
			setFireBaseToken();
		}
	};

	async function autoLogin(firebaseToken) {
		try {
			const jwt = await AsyncStorage.getItem('login');
			if (jwt === null) {
				return setLoading(true);
			}
			const old = jwtDecode(jwt);
			console.log('자동로그인 토큰', firebaseToken, old.data.mt_info.mt_idx);
			const res = await APIAutoLogin(firebaseToken, old.data.mt_info.mt_idx);
			console.log(res.jwt);
			if (res.result === 'true') {
				await AsyncStorage.setItem('login', res.jwt);
				const newData = jwtDecode(res.jwt);
				console.log(newData);
				dispatch(chatCount(parseInt(newData.data.chat_cnt)));
				dispatch(login(newData.data));
				setLoading(true);
			} else {
				await AsyncStorage.removeItem('login');
				setLoading(true);
			}
		} catch (err) {
			console.error(err);
			Alert.alert('알림', `token: ${firebaseToken}`, [{text: '확인'}]);
		}
	}

	const getBanner = async () => {
		try {
			const res = await APICallBanner();
			const bannerData = jwtDecode(res.jwt).data;
			console.log(bannerData);
			await AsyncStorage.setItem('Banner', JSON.stringify(bannerData));
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		if (Platform.OS === 'android') requestLocationPermission();
		else setFireBaseToken();
		getBanner();
	}, []);

	return (
		<Modal visible={!isLoading} animationType="fade">
			<Container>
				<LogoWrap>
					<Svg
						xmlns="http://www.w3.org/2000/svg"
						width="173"
						height="150.203"
						viewBox="0 0 173 150.203">
						<G id="스플레시로고" transform="translate(-121 -273.399)">
							<Text
								id="식자재_재고정보공유_플랫폼"
								data-name="식자재 재고정보공유 플랫폼"
								transform="translate(121 418.601)"
								fill="#fff"
								fontSize="15">
								<TSpan x="0" y="0">
									식자재 재고정보공유 플랫폼
								</TSpan>
							</Text>
							<G id="로고" transform="translate(17.068 -66.892)">
								<Ellipse
									id="타원_53"
									data-name="타원 53"
									cx="21.155"
									cy="2.096"
									rx="21.155"
									ry="2.096"
									transform="translate(115.602 391.323)"
									fill="#fff"
								/>
								<Ellipse
									id="타원_54"
									data-name="타원 54"
									cx="11.133"
									cy="11.133"
									rx="11.133"
									ry="11.133"
									transform="translate(133.482 350.475)"
									fill="#fff"
								/>
								<Path
									id="패스_84"
									data-name="패스 84"
									d="M792.644,104.537a21.317,21.317,0,1,0-27.612,20.369,2.582,2.582,0,0,1,1.086.907l3.6,6.638a1.828,1.828,0,0,0,3.216,0l3.23-5.951.165-.3h0a3.528,3.528,0,0,1,.742-.921l.673-.4c.014,0,.014-.014.028-.014A21.327,21.327,0,0,0,792.644,104.537Z"
									transform="translate(-634.408 257.071)"
									fill="#fff"
								/>
								<Ellipse
									id="타원_55"
									data-name="타원 55"
									cx="11.133"
									cy="11.133"
									rx="11.133"
									ry="11.133"
									transform="translate(125.482 350.159)"
									fill="#ec636b"
								/>
								<G
									id="그룹_74"
									data-name="그룹 74"
									transform="translate(112.932 342.49)">
									<Path
										id="패스_42"
										data-name="패스 42"
										d="M786.17,104.86a1.4,1.4,0,0,1,.316-1.072,1.7,1.7,0,0,1,1.072-.275h45.2a1.619,1.619,0,0,1,1.072.275,1.35,1.35,0,0,1,.316,1.072v4.714a1.4,1.4,0,0,1-.316,1.072,1.682,1.682,0,0,1-1.072.261h-45.2a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072Zm45.191,28.973c.069.426-.014.7-.261.8a4.407,4.407,0,0,1-1.127.261c-2.46.247-4.852.454-7.174.591s-4.7.261-7.119.344-4.989.151-7.683.192-5.663.055-8.92.055a18.854,18.854,0,0,1-4.288-.426,7.476,7.476,0,0,1-3-1.388,5.814,5.814,0,0,1-1.745-2.515,11.489,11.489,0,0,1-.563-3.848v-5.456a1.322,1.322,0,0,1,.316-1.017,1.708,1.708,0,0,1,1.072-.261h30.581v-1.553H790.884c-.935,0-1.388-.522-1.388-1.553v-3.271a1.4,1.4,0,0,1,.316-1.072,1.7,1.7,0,0,1,1.072-.275H829.34a1.618,1.618,0,0,1,1.072.275,1.35,1.35,0,0,1,.316,1.072v11.188a1.4,1.4,0,0,1-.316,1.072,1.681,1.681,0,0,1-1.072.261H798.76v.852c0,.577.22.921.646,1.045a7.635,7.635,0,0,0,1.979.192q4.494,0,8.274-.055c2.515-.041,4.907-.082,7.147-.165s4.4-.165,6.46-.261,4.137-.247,6.24-.426a1.366,1.366,0,0,1,1.017.192,1.445,1.445,0,0,1,.371.825Zm-.481-35.35c.069.536-.014.88-.261,1.017a3.293,3.293,0,0,1-1.127.316q-3.69.371-7.793.646c-2.735.179-5.456.33-8.192.454s-5.415.22-8.054.275-5.113.082-7.394.082a15.381,15.381,0,0,1-4.206-.481,5.247,5.247,0,0,1-2.6-1.608,6.36,6.36,0,0,1-1.333-2.914,22.22,22.22,0,0,1-.371-4.412V86.553a1.4,1.4,0,0,1,.316-1.072,1.681,1.681,0,0,1,1.072-.261h7.5a1.708,1.708,0,0,1,1.072.261,1.349,1.349,0,0,1,.316,1.072v2.941a4.172,4.172,0,0,0,.8,2.831,3.669,3.669,0,0,0,2.941.852c3.89-.069,8.054-.22,12.48-.426s8.741-.55,12.961-1.017c.495-.069.839,0,1.017.22a2.284,2.284,0,0,1,.371,1.127Z"
										transform="translate(-733.198 -84.67)"
										fill="#fff"
									/>
									<Path
										id="패스_43"
										data-name="패스 43"
										d="M823.19,127.028a1.4,1.4,0,0,1,.316-1.072,1.707,1.707,0,0,1,1.072-.261h31.378a1.707,1.707,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072V133.3a1.4,1.4,0,0,1-.316,1.072,1.7,1.7,0,0,1-1.072.275H824.578a1.7,1.7,0,0,1-1.072-.275,1.35,1.35,0,0,1-.316-1.072ZM839.573,84.82a16.463,16.463,0,0,1,7.312,1.471,13.209,13.209,0,0,1,4.8,3.9,15.78,15.78,0,0,1,2.625,5.594,26.378,26.378,0,0,1,.8,6.528,28.058,28.058,0,0,1-.77,6.556,15.42,15.42,0,0,1-2.6,5.621,13.1,13.1,0,0,1-4.8,3.9,19.187,19.187,0,0,1-14.734,0,13.211,13.211,0,0,1-4.8-3.9,15.418,15.418,0,0,1-2.6-5.621,27.342,27.342,0,0,1-.77-6.556,25.76,25.76,0,0,1,.825-6.528,15.648,15.648,0,0,1,2.68-5.594,13.444,13.444,0,0,1,4.8-3.9A16.132,16.132,0,0,1,839.573,84.82Zm0,26.348a6.228,6.228,0,0,0,1.814-.289,3.917,3.917,0,0,0,1.8-1.264,7.542,7.542,0,0,0,1.361-2.708,20.28,20.28,0,0,0,0-9.264,7.393,7.393,0,0,0-1.361-2.68,4.1,4.1,0,0,0-1.8-1.237,5.922,5.922,0,0,0-1.814-.289,6.389,6.389,0,0,0-1.828.289,3.949,3.949,0,0,0-1.8,1.237,7.28,7.28,0,0,0-1.361,2.68,20.28,20.28,0,0,0,0,9.264,7.66,7.66,0,0,0,1.361,2.708,3.951,3.951,0,0,0,1.8,1.264A6.389,6.389,0,0,0,839.573,111.168Zm21.317,24a1.707,1.707,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.689a1.4,1.4,0,0,1,.316-1.072,1.707,1.707,0,0,1,1.072-.261h7.5a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v47.129a1.4,1.4,0,0,1-.316,1.072,1.708,1.708,0,0,1-1.072.261h-7.5Z"
										transform="translate(-715.337 -84.82)"
										fill="#fff"
									/>
									<Path
										id="패스_44"
										data-name="패스 44"
										d="M881.383,85.21a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v7.546a12.308,12.308,0,0,0,.371,3.024,7.173,7.173,0,0,0,1.388,2.735,9.68,9.68,0,0,0,2.735,2.254,14.517,14.517,0,0,0,4.4,1.526c.137.041.316.069.509.11a1.536,1.536,0,0,1,.563.234,1.472,1.472,0,0,1,.454.536,2.141,2.141,0,0,1,.192.99v5.951c0,.646-.165,1.031-.508,1.154a1.971,1.971,0,0,1-.88.137,32.283,32.283,0,0,1-3.835-.564,25,25,0,0,1-3.835-1.127,19.234,19.234,0,0,1-3.587-1.842,14.934,14.934,0,0,1-3.051-2.68,16.711,16.711,0,0,1-3.079,2.68,18.6,18.6,0,0,1-3.56,1.842,25,25,0,0,1-3.835,1.127,32.283,32.283,0,0,1-3.835.564,1.773,1.773,0,0,1-.88-.137c-.344-.124-.509-.509-.509-1.154V105.5a2.14,2.14,0,0,1,.192-.99,1.473,1.473,0,0,1,.454-.536,1.335,1.335,0,0,1,.563-.234c.193-.041.371-.069.509-.11a14.655,14.655,0,0,0,4.4-1.526,9.876,9.876,0,0,0,2.735-2.254,7.078,7.078,0,0,0,1.388-2.735,12.311,12.311,0,0,0,.371-3.024V86.543a1.4,1.4,0,0,1,.316-1.072,1.707,1.707,0,0,1,1.072-.261Zm-14.83,31.337a1.4,1.4,0,0,1,.316-1.072,1.7,1.7,0,0,1,1.072-.275h39.473a1.7,1.7,0,0,1,1.072.275,1.35,1.35,0,0,1,.316,1.072v18.211a1.4,1.4,0,0,1-.316,1.072,1.708,1.708,0,0,1-1.072.261h-7.5a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V124.106H867.941a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072Zm33.357-3.807a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.543a1.4,1.4,0,0,1,.316-1.072,1.708,1.708,0,0,1,1.072-.261h7.5a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v24.849a1.4,1.4,0,0,1-.316,1.072,1.708,1.708,0,0,1-1.072.261h-7.5Z"
										transform="translate(-861.99 -22.825)"
										fill="#fff"
									/>
									<Path
										id="패스_45"
										data-name="패스 45"
										d="M900.845,86.543a1.4,1.4,0,0,1,.316-1.072,1.708,1.708,0,0,1,1.072-.261h28.011a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v6.267a1.4,1.4,0,0,1-.316,1.072,1.682,1.682,0,0,1-1.072.261h-8.892v19.448a12.311,12.311,0,0,0,.371,3.024,7.175,7.175,0,0,0,1.388,2.735,9.678,9.678,0,0,0,2.735,2.254,14.521,14.521,0,0,0,4.4,1.526c.137.041.316.069.509.11a1.364,1.364,0,0,1,.563.247,1.473,1.473,0,0,1,.454.536,2.141,2.141,0,0,1,.192.99v5.951c0,.646-.165,1.031-.508,1.155a1.971,1.971,0,0,1-.88.137,32.286,32.286,0,0,1-3.835-.564,23.553,23.553,0,0,1-3.835-1.127,19.233,19.233,0,0,1-3.587-1.842,14.932,14.932,0,0,1-3.051-2.68,16.7,16.7,0,0,1-3.079,2.68,18.59,18.59,0,0,1-3.56,1.842,25.007,25.007,0,0,1-3.835,1.127,32.289,32.289,0,0,1-3.835.564,1.773,1.773,0,0,1-.88-.137c-.344-.124-.509-.509-.509-1.155v-5.951a2.14,2.14,0,0,1,.192-.99,1.472,1.472,0,0,1,.454-.536,1.574,1.574,0,0,1,.563-.247c.192-.041.371-.069.508-.11a14.654,14.654,0,0,0,4.4-1.526,9.876,9.876,0,0,0,2.735-2.254,7.075,7.075,0,0,0,1.388-2.735,12.308,12.308,0,0,0,.371-3.024V94.157h-8.947a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.543ZM953,110.967a1.4,1.4,0,0,1-.316,1.072,1.7,1.7,0,0,1-1.072.275H946.7v21.372a1.4,1.4,0,0,1-.316,1.072,1.682,1.682,0,0,1-1.072.261h-7.5a1.707,1.707,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.543a1.4,1.4,0,0,1,.316-1.072,1.681,1.681,0,0,1,1.072-.261h7.5a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v16.864h4.92a1.7,1.7,0,0,1,1.072.275,1.35,1.35,0,0,1,.316,1.072Z"
										transform="translate(-847.545 -22.825)"
										fill="#fff"
									/>
									<Path
										id="패스_46"
										data-name="패스 46"
										d="M939.812,86.543a1.4,1.4,0,0,1,.316-1.072,1.708,1.708,0,0,1,1.072-.261h21.633a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v6.267a1.4,1.4,0,0,1-.316,1.072,1.681,1.681,0,0,1-1.072.261H957.1v19.448a16.831,16.831,0,0,0,.261,3.024,10,10,0,0,0,.907,2.735,7.609,7.609,0,0,0,1.745,2.254,7.435,7.435,0,0,0,2.763,1.526c.137.041.316.082.508.137a2.268,2.268,0,0,1,.563.247,1.273,1.273,0,0,1,.454.509,2.138,2.138,0,0,1,.193.99v5.951c0,.646-.165,1.031-.509,1.155a1.97,1.97,0,0,1-.88.137,24.653,24.653,0,0,1-2.708-.536,15.843,15.843,0,0,1-2.941-1.072,17.17,17.17,0,0,1-2.886-1.745,13.751,13.751,0,0,1-2.6-2.543,13.345,13.345,0,0,1-2.6,2.543,17.736,17.736,0,0,1-2.886,1.745,15.964,15.964,0,0,1-2.914,1.072,23.068,23.068,0,0,1-2.68.536,1.773,1.773,0,0,1-.88-.137c-.344-.124-.508-.509-.508-1.155v-5.951a1.978,1.978,0,0,1,.192-.99,1.273,1.273,0,0,1,.454-.509,2.267,2.267,0,0,1,.563-.247c.192-.055.371-.1.509-.137a7.546,7.546,0,0,0,2.762-1.526,8.083,8.083,0,0,0,1.746-2.254,9.842,9.842,0,0,0,.907-2.735,16.836,16.836,0,0,0,.261-3.024V94.157h-5.676a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.543Zm28.121,48.476a1.708,1.708,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V86.543a1.4,1.4,0,0,1,.316-1.072,1.708,1.708,0,0,1,1.072-.261h6.693a1.708,1.708,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v16.864h2.35V86.543a1.4,1.4,0,0,1,.316-1.072,1.681,1.681,0,0,1,1.072-.261h6.693a1.707,1.707,0,0,1,1.072.261,1.35,1.35,0,0,1,.316,1.072v47.129a1.4,1.4,0,0,1-.316,1.072,1.681,1.681,0,0,1-1.072.261h-6.693a1.707,1.707,0,0,1-1.072-.261,1.35,1.35,0,0,1-.316-1.072V112.3h-2.35v21.372a1.4,1.4,0,0,1-.316,1.072,1.682,1.682,0,0,1-1.072.261h-6.693Z"
										transform="translate(-832.966 -22.825)"
										fill="#fff"
									/>
								</G>
							</G>
						</G>
					</Svg>
				</LogoWrap>
				<CompanyLabel>©FOODINUS</CompanyLabel>
			</Container>
		</Modal>
	);
};

export default Splash;
