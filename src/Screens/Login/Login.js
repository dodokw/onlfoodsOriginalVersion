import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Svg, G, Path, Circle, SvgXml} from 'react-native-svg';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {useDispatch, useSelector} from 'react-redux';
import {chatCount, login, saleroff} from '~/Modules/Action';
import {APILogin, APISNSLogin} from '~/API/SignAPI/SignAPI';
import {Alert, Platform} from 'react-native';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import {
	login as kakaoLogin,
	getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import jwtDecode from 'jwt-decode';
import Logo from '~/Assets/Images/Login_logo01.svg';
import LoadingModal from '~/Components/LoadingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';
import {ScrollView} from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
	padding: 0 40px;
`;
const Wrap = styled.View`
	flex:1;
`;

const LoginContainer = styled.View`
`;

const LogoWrap = styled.View`
	align-items: center;
	margin-top:100px;
	padding:20px;
`;

const LoginWrap = styled.KeyboardAvoidingView`
	justify-content: center;
	padding: 5px 0;
`;

const LoginInput = styled.TextInput`
	border-bottom-width: 1.5px;
	border-bottom-color: ${props => props.borderColor};
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	padding: 5px 0;
	margin: 7px 0;
	color: #000000;
`;

const AutoLoginWrap = styled.View`
	margin-top: 10px;
	flex-direction: row;
	align-items: center;
`;

const AutoLoginButton = styled.TouchableOpacity`
	align-items: center;
`;

const AutoLoginLabel = styled.Text`
	margin-left: 10px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
`;

const ButtonContainer = styled.View`
	margin: 20px 0;
`;
const ButtonWrap = styled.View``;

const LoginButton = styled.TouchableOpacity`
	border-radius: 25px;
	background-color: ${ColorRed};
	padding: 15px 0;
	margin: 5px 0;
`;

const LoginButtonLabel = styled.Text`
	font-size: 16px;
	color: #ffffff;
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const SeeButton = styled.TouchableOpacity`
	border-radius: 25px;
	border-color: ${ColorRed};
	border-width: 1px;
	padding: 15px 0;
	margin: 5px 0;
`;
const SeeButtonLabel = styled.Text`
	font-size: 16px;
	color: ${ColorRed};
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const OptionsContainer = styled.View`
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	margin: 5px 0;
`;
const OptionsWrap = styled.View``;
const OptionsButton = styled.TouchableOpacity``;
const OptionsLabel = styled.Text`
	color: #989898;
	font-size: 14px;
`;
const OptionBar = styled.View`
	border-color: #989898;
	border-right-width: 0.5px;
	height: 14px;
`;

const EasyLoginContainer = styled.View`
	margin: 30px 0;
	justify-content: center;
`;
const EasyLoginWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	margin: 5px 0;
`;

const SNSImage = styled.Image`
	width: 48px;
	height: 48px;
`;

const DiveBar = styled.View`
	border-bottom-width: 0.5px;
	border-color: #989898;
	flex: 1;
`;

const EasyLoginButton = styled.TouchableOpacity``;

const EasyLoginLabel = styled.Text`
	color: #989898;
	margin: 0 5px;
	font-size: 14px;
`;

const iosKeys = {
	kConsumerKey: 'IvSzPuShQ2BLCwNvvsHh',
	kConsumerSecret: 'jW_s7vmbsJ',
	kServiceAppName: '????????? ?????????',
	kServiceAppUrlScheme: 'foodinus', // only for iOS
};

const androidKeys = {
	kConsumerKey: 'IvSzPuShQ2BLCwNvvsHh',
	kConsumerSecret: 'jW_s7vmbsJ',
	kServiceAppName: '????????? ?????????',
};

const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

const Login = ({navigation}) => {
	const dispatch = useDispatch();
	const firebaseToken = useSelector(state => state.dataReducer.token);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [focusedInput, setFocusedInput] = useState({
		email: false,
		password: false,
	});
	const [autoState, setAutoState] = useState(false);
	const [loading, setLoading] = useState(false);

	const goSignIn = async () => {
		setLoading(true);
		try {
			if (email === '' || password === '') {
				throw Error('????????? ?????? ??????????????? ??????????????????.');
			}
			const res = await APILogin(firebaseToken, email, password);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('?????????', decode.data);
				if (autoState) {
					await AsyncStorage.setItem('login', res.jwt);
				}
				setLoading(false);
				dispatch(saleroff());
				dispatch(chatCount(parseInt(decode.data.chat_cnt)));
				return dispatch(login(decode.data));
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (err) {
			Alert.alert('??????', err.message, [{text: '??????'}]);
		}
		setLoading(false);
	};

	const goNonMemberSign = async () => {
		const noUser = {
			mt_info: {
				mt_hp: '',
				mt_id: 'no',
				mt_idx: '0',
				mt_image1: null,
				mt_level: 0,
				mt_name: '?????????',
			},
		};
		dispatch(login(noUser));
	};

	const naverLogin = props => {
		return new Promise((resolve, reject) => {
			NaverLogin.login(props, (err, token) => {
				console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
				if (err) {
					reject(err);
					return;
				}
				resolve(token);
			});
		});
	};

	const getUserProfile = async naverToken => {
		const profileResult = await getProfile(naverToken.accessToken);
		if (profileResult.resultcode === '024') {
			Alert.alert('????????? ??????', profileResult.message);
			return;
		}
		console.log('profileResult', profileResult);
		return profileResult;
	};

	const snsLoginWithNaver = async props => {
		try {
			const naverToken = await naverLogin(props);
			const naverProfile = await getUserProfile(naverToken);
			console.log(naverProfile?.response);
			const email = naverProfile.response.email;
			const res = await APISNSLogin(2, firebaseToken, email);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('??????????????????', decode);
				dispatch(saleroff());
				dispatch(
					chatCount(
						parseInt(decode.data.chat_cnt === null ? 0 : decode.data.chat_cnt),
					),
				);
				return dispatch(login(decode.data));
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const snsLoginWithKakao = async () => {
		setLoading(true);
		try {
			const kakaoToken = await kakaoLogin();
			console.log(kakaoToken);
			if (kakaoToken.accessToken) {
				const profile = await getKakaoProfile();
				console.log(profile.email);
				const email = profile.email;
				const res = await APISNSLogin(3, firebaseToken, email);
				if (res.result === 'true') {
					const decode = jwtDecode(res.jwt);
					console.log('??????????????????', decode);
					setLoading(false);
					dispatch(saleroff());
					dispatch(
						chatCount(
							parseInt(
								decode.data.chat_cnt === null ? 0 : decode.data.chat_cnt,
							),
						),
					);
					return dispatch(login(decode.data));
				} else {
					Alert.alert('??????', res.message, [{text: '??????'}]);
				}
			}
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const snsLoginWithApple = async () => {
		// performs login request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
		});

		// get current authentication state for user
		// /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
		const credentialState = await appleAuth.getCredentialStateForUser(
			appleAuthRequestResponse.user,
		);

		// use credentialState response to ensure the user is authenticated
		if (credentialState === appleAuth.State.AUTHORIZED) {
			console.log(appleAuthRequestResponse.identityToken);
			const appleSub = jwtDecode(appleAuthRequestResponse.identityToken).sub;
			const appleEmail = jwtDecode(
				appleAuthRequestResponse.identityToken,
			).email;
			const res = await APISNSLogin(
				4,
				firebaseToken,
				appleSub,
				`${appleEmail.split('@')[0]}@apple.com`,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('???????????????', decode);
				dispatch(saleroff());
				dispatch(
					chatCount(
						parseInt(decode.data.chat_cnt === null ? 0 : decode.data.chat_cnt),
					),
				);
				return dispatch(login(decode.data));
			} else {
				console.log(res);
			}
		}
	};

	useEffect(() => {
		return () => setLoading(false);
	}, []);

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Container>
				<ScrollView bounces={false} showsVerticalScrollIndicator={false}>
				<Wrap>
					<LogoWrap>
						<SvgXml xml={Logo} />
					</LogoWrap>
					<LoginContainer>
						<LoginWrap behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
							<LoginInput
								placeholder="ID"
								borderColor={
									focusedInput.email === true ? ColorRed : ColorLineGrey
								}
								onFocus={() => setFocusedInput({email: true, password: false})}
								value={email}
								onChangeText={text => setEmail(text)}
							/>
							<LoginInput
								placeholder="PASSWORD"
								borderColor={
									focusedInput.password === true ? ColorRed : ColorLineGrey
								}
								secureTextEntry={true}
								onFocus={() => setFocusedInput({email: false, password: true})}
								value={password}
								onChangeText={text => setPassword(text)}
							/>
							<AutoLoginWrap>
								<AutoLoginButton
									onPress={() => setAutoState(!autoState)}
									style={{flexDirection: 'row'}}>
									<Svg
										id="AutoCheck"
										xmlns="http://www.w3.org/2000/svg"
										width="19"
										height="19"
										viewBox="0 0 19 19">
										<G id="??????_76" data-name="?????? 76">
											<Path
												id="??????_87"
												data-name="?????? 87"
												d="M9.5,0A9.5,9.5,0,1,0,19,9.5,9.511,9.511,0,0,0,9.5,0Zm5.31,7L8.738,13.024a.934.934,0,0,1-1.31.024L4.214,10.119a.966.966,0,0,1-.071-1.333.942.942,0,0,1,1.333-.048l2.548,2.333,5.429-5.429A.96.96,0,0,1,14.81,7Z"
												fill={autoState ? ColorRed : ColorLineGrey}
											/>
										</G>
									</Svg>
									<AutoLoginLabel>????????? ?????? ??????</AutoLoginLabel>
								</AutoLoginButton>
							</AutoLoginWrap>
						</LoginWrap>
						<ButtonContainer>
							<ButtonWrap>
								<LoginButton
									onPress={() => {
										goSignIn();
									}}>
									<LoginButtonLabel>?????????</LoginButtonLabel>
								</LoginButton>
							</ButtonWrap>
						</ButtonContainer>
						<OptionsContainer>
							<OptionsWrap>
								<OptionsButton onPress={() => navigation.navigate('FindId')}>
									<OptionsLabel>????????????</OptionsLabel>
								</OptionsButton>
							</OptionsWrap>
							<OptionBar />
							<OptionsWrap>
								<OptionsButton onPress={() => navigation.navigate('Register')}>
									<OptionsLabel>????????????</OptionsLabel>
								</OptionsButton>
							</OptionsWrap>
						</OptionsContainer>
						{/* <EasyLoginContainer>
							<EasyLoginWrap>
								<DiveBar />
								<EasyLoginLabel>?????? ?????????</EasyLoginLabel>
								<DiveBar />
							</EasyLoginWrap>
							<EasyLoginWrap>
								<EasyLoginButton onPress={() => snsLoginWithNaver(initials)}>
									<SNSImage source={require('~/Assets/Images/naver.png')} />
								</EasyLoginButton>
								<EasyLoginButton onPress={snsLoginWithKakao}>
									<SNSImage source={require('~/Assets/Images/kakao.png')} />
								</EasyLoginButton>
								{Platform.OS === 'ios' && (
									<EasyLoginButton onPress={snsLoginWithApple}>
										<SNSImage source={require('~/Assets/Images/apple.png')} />
									</EasyLoginButton>
								)}
							</EasyLoginWrap>
						</EasyLoginContainer> */}
					</LoginContainer>
					<LoadingModal visible={loading} />
					</Wrap>
				</ScrollView>
			</Container>
		</TouchableWithoutFeedback>
	);
};

export default Login;
