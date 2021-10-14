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
import {APIChangePW} from '~/API/SignAPI/SignAPI';
import {useEffect} from 'react';

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

const FindPw = ({navigation, route}) => {
	const idx = route.params.idx;
	const [onFocus, setOnFocus] = useState();
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
		if (isPassword && isRePassword) {
			try {
				const res = await APIChangePW(idx, password, rePassword);
				Alert.alert('알림', '비밀번호가 변경되었습니다.', [
					{
						text: '확인',
						onPress: () =>
							navigation.reset({index: 1, routes: [{name: 'Login'}]}),
					},
				]);
			} catch (err) {
				Alert.alert('알림', err.message, [{text: '확인'}]);
			}
		} else {
			Alert.alert('알림', '비밀번호를 알맞게 입력해주세요.', [{text: '확인'}]);
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
				<MainTitle>새 비밀번호 등록</MainTitle>
				<SubTitle>{'새로운 비밀번호를 등록해주세요.'}</SubTitle>
				<SubjectTitle>비밀번호</SubjectTitle>
				<Wrap>
					<InputBox color={onFocus === 0 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="비밀번호"
							placeholderColor={ColorLineGrey}
							onFocus={() => setOnFocus(0)}
							value={password}
							onChangeText={text => setPassword(text)}
							onBlur={checkPassword}
							secureTextEntry={true}
						/>
						<SvgXml
							xml={isPassword ? autoLogin_checkedOn : autoLogin_checkedOff}
						/>
					</InputBox>
				</Wrap>
				<Wrap>
					<InputBox color={onFocus === 1 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="비밀번호 확인"
							placeholderColor={ColorLineGrey}
							onFocus={() => setOnFocus(1)}
							value={rePassword}
							onChangeText={text => {
								setRePassword(text);
							}}
							onBlur={checkRePassword}
							secureTextEntry={true}
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

export default FindPw;
