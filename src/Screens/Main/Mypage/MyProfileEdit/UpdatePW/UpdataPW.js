import React, {useState} from 'react';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import autoLogin_checkedOn from '~/Assets/Images/autoLogin_checkedOn.svg';
import autoLogin_checkedOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import {SvgXml} from 'react-native-svg';
import {passwordReg} from '~/Tools/Reg';
import {Alert} from 'react-native';
import {useEffect} from 'react';
import {APIUpdateMyProfile} from '~/API/MyPageAPI/MyPageAPI';
import {useSelector} from 'react-redux';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const Content = styled.View`
	padding: 40px 20px;
`;

const MainTitle = styled.Text`
	font-size: 18px;
	font-family: ${FONTNanumGothicBold};
	margin-bottom: 10px;
`;
const SubTitle = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicRegular};
	margin-bottom: 40px;
	line-height: 20px;
`;

const SubjectTitle = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicBold};
	margin: 10px 0;
`;
const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-width: 1px;
	border-color: ${props => props.color};
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
	align-items: center;
	margin-bottom: 10px;
`;
const TextInput = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #000000;
`;

const Button = styled.TouchableOpacity`
	height: 50px;
	background-color: ${ColorRed};
	justify-content: center;
	align-items: center;
	padding: 0 25px;
	border-radius: 5px;
`;

const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
`;

const Box = styled.View`
	flex: 1;
	justify-content: flex-end;
	padding: 20px;
`;

const UpdatePW = ({navigation, route}) => {
	const user = useSelector(state => state.loginReducer.user);
	const [onFocus, setOnFocus] = useState();
	const [currentPassword, setCurrentPassword] = useState('');
	const [password, setPassword] = useState('');
	const [rePassword, setRePassword] = useState('');
	const [isPassword, setIsPassword] = useState(false);
	const [isRePassword, setIsRePassword] = useState(false);

	const checkPassword = () => {
		const reg = passwordReg.exec(password);
		if (reg === null) {
			setIsPassword(false);
			Alert.alert(
				'알림',
				'비밀번호는 8~20자, 최소 1개의 숫자와 특수문자를 포함해야합니다.',
				[{text: '확인'}],
			);
		} else {
			setIsPassword(true);
		}
	};

	const checkRePassword = () => {
		if (rePassword === '' || password === '') {
			return setIsRePassword(false);
		}
		if (!isPassword || password !== rePassword) {
			setIsRePassword(false);
		} else {
			setIsRePassword(true);
		}
	};

	const changePassword = async () => {
		try {
			if (currentPassword === '' || password === '' || rePassword === '') {
				return Alert.alert('알림', '비밀번호를 입력해주세요.', [
					{text: '확인'},
				]);
			}
			const reg = passwordReg.exec(password);
			console.log(reg);
			if (reg === null) {
				return Alert.alert(
					'알림',
					'비밀번호는 8~20자, 최소 1개의 숫자와 특수문자를 포함해야합니다.',
					[{text: '확인'}],
				);
			}
			if (password === rePassword) {
				const res = await APIUpdateMyProfile(
					user.mt_info.mt_idx,
					'password',
					'',
					password,
					rePassword,
					currentPassword,
				);
				if (res.result === 'true') {
					Alert.alert('알림', '비밀번호 변경 완료!', [
						{text: '확인', onPress: () => navigation.goBack()},
					]);
				} else {
					Alert.alert('알림', res.message, [{text: '확인'}]);
				}
			} else {
				Alert.alert('알림', '새 비밀번호가 일치하지 않습니다.', [
					{text: '확인'},
				]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		checkRePassword();
	});

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="비밀번호 변경"
				border={true}
			/>
			<Content>
				<MainTitle>비밀번호 수정</MainTitle>
				<SubTitle>
					{'비밀번호를 수정합니다.\n현재비밀번호와 새 비밀번호를 입력해주세요.'}
				</SubTitle>
				<Wrap>
					<InputBox color={onFocus === 0 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="현재 비밀번호"
							placeholderColor={ColorLineGrey}
							value={currentPassword}
							onFocus={() => setOnFocus(0)}
							onChangeText={text => setCurrentPassword(text)}
							secureTextEntry={true}
							maxLength={20}
						/>
					</InputBox>
				</Wrap>
				<SubjectTitle>새 비밀번호</SubjectTitle>
				<Wrap>
					<InputBox color={onFocus === 1 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="비밀번호"
							placeholderColor={ColorLineGrey}
							onFocus={() => setOnFocus(1)}
							value={password}
							onChangeText={text => setPassword(text)}
							onBlur={checkPassword}
							secureTextEntry={true}
							maxLength={20}
						/>
						<SvgXml
							xml={isPassword ? autoLogin_checkedOn : autoLogin_checkedOff}
						/>
					</InputBox>
				</Wrap>
				<Wrap>
					<InputBox color={onFocus === 2 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="비밀번호 확인"
							placeholderColor={ColorLineGrey}
							onFocus={() => setOnFocus(2)}
							value={rePassword}
							onChangeText={text => {
								setRePassword(text);
							}}
							onBlur={checkRePassword}
							secureTextEntry={true}
							maxLength={20}
						/>
						<SvgXml
							xml={isRePassword ? autoLogin_checkedOn : autoLogin_checkedOff}
						/>
					</InputBox>
				</Wrap>
			</Content>
			<Box>
				<Button onPress={changePassword}>
					<ButtonLabel>변경하기</ButtonLabel>
				</Button>
			</Box>
		</Container>
	);
};

export default UpdatePW;
