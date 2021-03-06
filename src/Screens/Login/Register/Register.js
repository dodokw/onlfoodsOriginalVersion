import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {
	ColorBlue,
	ColorGreen,
	ColorLineGrey,
	ColorRed,
} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import checkOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import checkOn from '~/Assets/Images/autoLogin_checkedOn.svg';
import {SvgXml} from 'react-native-svg';
import {useRef} from 'react';
import {
	APICheckId,
	APICheckPhoneAuth,
	APICallPhoneAuth,
	APIMemberSignUp,
} from '~/API/SignAPI/SignAPI';
import {idReg, passwordReg, phoneReg} from '~/Tools/Reg';
import {useIsFocused} from '@react-navigation/native';

const Container = styled.View`
	flex: 1;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin-top: 20px;
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

const PhoneButton = styled.TouchableOpacity`
	width: 100px;
	padding: 15px 20px;
	background-color: ${props => (props.pass ? ColorLineGrey : ColorRed)};
	border-radius: 5px;
	margin-left: 5px;
	align-items: center;
	justify-content: center;
`;

const PhoneButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const PasswordBox = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	border-color: #cecece;
	border-width: 0.5px;
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
`;

const PasswordInput = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #000000;
`;

const Dive = styled.View`
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	margin: 10px 0;
`;

const SubText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 13px;
	color: #989898;
	letter-spacing: -0.5px;
	margin-bottom: 10px;
`;

const ContranctCheckButton = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

const ContractWrap = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;

const ContractTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-left: 10px;
`;

const ContractSubTitle = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	margin-left: 5px;
`;

const MoreDetailButton = styled.TouchableOpacity``;

const MoreDetailLabel = styled.Text`
	color: #cecece;
	font-size: 14px;
`;

const RedLabel = styled.Text`
	color: ${ColorRed};
`;

const GreyLabel = styled.Text`
	color: #989898;
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

const defaultData = {
	id: '',
	name: '',
	phoneNum: '',
	phoneAuth: '',
	password: '',
	rePassword: '',
	checkService: false,
	checkPrivacy: false,
	checkMarketing: false,
};

const defaultFocus = {
	id: false,
	name: false,
	phoneNum: false,
	phoneAuth: false,
	password: false,
	rePassword: false,
};

const Register = ({navigation}) => {
	const [data, setData] = useState(defaultData);
	const [focusedInput, setFocusedInput] = useState(defaultFocus);
	const [isId, setIsId] = useState(false);
	const [isPassword, setIsPassword] = useState(false);
	const [isRePassword, setIsRePassword] = useState(false);
	const [minute, setMinute] = useState(0);
	const [second, setSecond] = useState(0);
	const [authPass, setAuthPass] = useState(false); 
	const idRef = useRef();
	const passwordRef = useRef();
	const isFocus = useIsFocused();

	const checkId = async () => {
		try {
			if (!isFocus) {
				return;
			}
			const reg = idReg.exec(data.id);
			if (reg === null) {
				setIsId(false);
				idRef.current.focus();
				Alert.alert('??????', '???????????? 5~15?????? ??????,????????? ???????????????.', [
					{text: '??????'},
				]);
			} else {
				const res = await APICheckId(data.id);
				if (res.result === 'true') {
					setIsId(true);
				} else {
					setIsId(false);
					idRef.current.focus();
					Alert.alert('??????', '???????????? ?????????????????????.', [{text: '??????'}]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const callAuth = async () => {
		try {
			console.log(data.phoneNum);
			const reg = phoneReg.exec(data.phoneNum);
			if (reg === null) {
				Alert.alert('??????', '??????????????? ??????????????????.', [{text: '??????'}]);
			} else {
				const res = await APICallPhoneAuth('reg', data.phoneNum);
				if (res.result === 'true') {
					setSecond(0);
					setMinute(3);
					Alert.alert('??????', '??????????????? ?????? ???????????????.', [{text: '??????'}]);
				} else {
					Alert.alert('??????', res.message, [{text: '??????'}]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const checkAuth = async () => {
		try {
			const res = await APICheckPhoneAuth(data.phoneNum, data.phoneAuth);
			console.log('???????????? ??????', res);
			if (res.result === 'true') {
				setAuthPass(true);
				setMinute(0);
				setSecond(0);
				Alert.alert('??????', '??????????????? ?????????????????????.', [{text: '??????'}]);
			} else {
				Alert.alert('??????', '??????????????? ?????? ????????????.', [{text: '??????'}]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const checkPassword = async () => {
		const reg = passwordReg.exec(data.password);
		if (!isFocus) {
			return;
		}
		if (reg === null) {
			setIsPassword(false);
			passwordRef.current.focus();
			Alert.alert(
				'??????',
				'??????????????? 8~20???, ?????? 1?????? ????????? ??????????????? ?????????????????????.',
				[{text: '??????'}],
			);
		} else {
			setIsPassword(true);
		}
	};

	const checkRePassword = async () => {
		if (data.rePassword === '' || data.password === '') {
			return setIsRePassword(false);
		}
		if (data.password !== data.rePassword) {
			setIsRePassword(false);
			Alert.alert('??????', '??????????????? ???????????? ????????????. ??????????????????.', [
				{text: '??????'},
			]);
		} else {
			setIsRePassword(true);
		}
	};

	const goTerms = async type => {
		return navigation.navigate('Terms', {type});
	};

	const goRegister = async () => {
		if (data.id === '' || !isId) {
			Alert.alert('??????', '???????????? ?????????????????? ??????????????????.', [
				{text: '??????'},
			]);
		} else if (data.name === '') {
			Alert.alert('??????', '????????? ??????????????????.', [{text: '??????'}]);
		} else if (!authPass) {
			Alert.alert('??????', '???????????? ????????? ?????? ???????????????.', [{text: '??????'}]);
		} else if (!isPassword || !isRePassword) {
			Alert.alert('??????', '??????????????? ??????????????????.', [{text: '??????'}]);
		} else if (!data.checkPrivacy || !data.checkService) {
			Alert.alert('??????', '?????? ????????? ??????????????????.', [{text: '??????'}]);
		} else {
			console.log(data);
			navigation.navigate('Register2', {data});
		}
	};

	useEffect(() => {
		const countdown = setInterval(() => {
			if (second > 0) {
				setSecond(second - 1);
			}
			if (second === 0) {
				if (minute === 0) {
					clearInterval(countdown);
				} else {
					setMinute(minute - 1);
					setSecond(59);
				}
			}
		}, 1000);
		return () => clearInterval(countdown);
	}, [minute, second]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{flex: 1}}>
			<Container>
				<Header
					headerLeft={<BackButton onPress={() => navigation.goBack()} />}
					title="????????????"
				/>
				<ScrollView
					style={{padding: 10, backgroundColor: '#ffffff'}}
					contentContainerStyle={{paddingBottom: 20}}
					bounces={false}>
					<Title>?????????</Title>
					<InputBox focus={focusedInput.id}>
						<Input
							ref={idRef}
							value={data.id}
							onChangeText={text => setData({...data, id: text})}
							placeholder="?????????"
							onFocus={() => setFocusedInput({...defaultFocus, id: true})}
							onBlur={() => checkId()}
							maxLength={15}
						/>
						<SvgXml xml={isId ? checkOn : checkOff} />
						<InputLabel color={isId ? 'red' : 'grey'}>????????????</InputLabel>
					</InputBox>
					<Title>??????</Title>
					<TextInput
						style={{borderColor: focusedInput.name ? ColorRed : ColorLineGrey}}
						value={data.name}
						onChangeText={text => setData({...data, name: text})}
						onFocus={() => setFocusedInput({...defaultFocus, name: true})}
						placeholder="??????"
						maxLength={5}
					/>
					<Title>????????????</Title>
					<Wrap>
						<InputBox
							style={{
								flex: 1,
								borderColor: focusedInput.phoneNum ? ColorRed : ColorLineGrey,
							}}>
							<Input
								value={data.phoneNum}
								onChangeText={text => setData({...data, phoneNum: text})}
								onFocus={() =>
									setFocusedInput({...defaultFocus, phoneNum: true})
								}
								placeholder="????????????"
								maxLength={11}
								editable={minute === 0 && second === 0 && !authPass}
								keyboardType="number-pad"
							/>
							<InputLabel color="red">
								{minute > 0 || second > 0
									? second >= 10
										? String(minute) + ' : ' + String(second)
										: String(minute) + ' : ' + '0' + String(second)
									: ''}
							</InputLabel>
						</InputBox>
						<PhoneButton
							pass={authPass}
							disabled={false}//authPass
							onPress={() => callAuth()}>
							<PhoneButtonLabel>
								{minute > 0 || second > 0 ? '?????????' : '??????'}
							</PhoneButtonLabel>
						</PhoneButton>
					</Wrap>
					<Wrap>
						<TextInput
							value={data.phoneAuth}
							onChangeText={text => setData({...data, phoneAuth: text})}
							onFocus={() =>
								setFocusedInput({...defaultFocus, phoneAuth: true})
							}
							placeholder="????????????"
							style={{
								flex: 1,
								borderColor: focusedInput.phoneAuth ? ColorRed : ColorLineGrey,
							}}
							maxLength={6}
							editable={!authPass}
							keyboardType="number-pad"
						/>
						<PhoneButton //authpass => true
							//disabled={minute === 0 && second === 0}
							onPress={() => checkAuth()}
							pass={authPass}>
							<PhoneButtonLabel>??????</PhoneButtonLabel>
						</PhoneButton>
					</Wrap>
					<Title>????????????</Title>
					<Wrap>
						<PasswordBox
							style={{
								borderColor: focusedInput.password ? ColorRed : ColorLineGrey,
							}}>
							<PasswordInput
								ref={passwordRef}
								value={data.password}
								placeholder="????????????"
								secureTextEntry={true}
								onChangeText={text => setData({...data, password: text})}
								onFocus={() =>
									setFocusedInput({...defaultFocus, password: true})
								}
								onBlur={() => checkPassword()}
								maxLength={20}
							/>
							<SvgXml xml={isPassword ? checkOn : checkOff} />
						</PasswordBox>
					</Wrap>
					<Wrap>
						<PasswordBox
							style={{
								borderColor: focusedInput.rePassword ? ColorRed : ColorLineGrey,
							}}>
							<PasswordInput
								value={data.rePassword}
								placeholder="???????????? ??????"
								secureTextEntry={true}
								onChangeText={text => setData({...data, rePassword: text})}
								onFocus={() =>
									setFocusedInput({...defaultFocus, rePassword: true})
								}
								onBlur={() => checkRePassword()}
								maxLength={20}
							/>
							<SvgXml xml={isRePassword ? checkOn : checkOff} />
						</PasswordBox>
					</Wrap>
					<Dive />
					<SubText>
						*????????? ????????? ????????? ?????? ?????? ???????????? ????????? ????????? ?????????.
					</SubText>

					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								data.checkService && data.checkPrivacy && data.checkMarketing
									? setData({
											...data,
											checkService: false,
											checkPrivacy: false,
											checkMarketing: false,
									  })
									: setData({
											...data,
											checkService: true,
											checkPrivacy: true,
											checkMarketing: true,
									  })
							}>
							<SvgXml
								xml={
									data.checkService && data.checkPrivacy && data.checkMarketing
										? checkOn
										: checkOff
								}
							/>
							<ContractTitle>?????? ?????? ??????</ContractTitle>
						</ContranctCheckButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkService: !data.checkService})
							}>
							<SvgXml xml={data.checkService ? checkOn : checkOff} />
							<ContractSubTitle>
								<RedLabel>(??????)</RedLabel>????????? ????????????
							</ContractSubTitle>
						</ContranctCheckButton>
						<MoreDetailButton onPress={() => goTerms(1)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkPrivacy: !data.checkPrivacy})
							}>
							<SvgXml xml={data.checkPrivacy ? checkOn : checkOff} />
							<ContractSubTitle>
								<RedLabel>(??????)</RedLabel>???????????? ????????????
							</ContractSubTitle>
						</ContranctCheckButton>
						<MoreDetailButton onPress={() => goTerms(2)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkMarketing: !data.checkMarketing})
							}>
							<SvgXml xml={data.checkMarketing ? checkOn : checkOff} />
							<ContractSubTitle>
								<RedLabel>(??????)</RedLabel>?????????????????????
							</ContractSubTitle>
						</ContranctCheckButton>

						<MoreDetailButton onPress={() => goTerms(3)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkMarketing: !data.checkMarketing})
							}>
							<SvgXml xml={data.checkMarketing ? checkOn : checkOff} />
							<ContractSubTitle>
								<GreyLabel>(??????)</GreyLabel>????????? ?????? ??????
							</ContractSubTitle>
						</ContranctCheckButton>

						<MoreDetailButton onPress={() => goTerms(4)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
							
					<RegiButton onPress={goRegister}>
						<RegiLabel>??????</RegiLabel>
					</RegiButton>
				</ScrollView>
			</Container>
		</KeyboardAvoidingView>
	);
};

export default Register;
