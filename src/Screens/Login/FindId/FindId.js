import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {
	APICheckPhoneAuth,
	APIFindID,
	APICallPhoneAuth,
} from '~/API/SignAPI/SignAPI';
import {ColorGreen, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import {phoneReg} from '~/Tools/Reg';

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
	border-width: 1px;
	border-color: ${props => props.color};
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
	align-items: center;
	margin-bottom: 10px;
	flex-direction: row;
`;
const TextInput = styled.TextInput`
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

const Button = styled.TouchableOpacity`
	width: 100px;
	height: 50px;
	background-color: ${props =>
		props.backgroundColor ? props.backgroundColor : ColorLineGrey};
	justify-content: center;
	align-items: center;
	padding: 0 25px;
	border-radius: 5px;
	margin-left: ${props => (props.marginLeft ? props.marginLeft + 'px' : '0px')};
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

const defaultData = {
	name: '',
	phoneNum: '',
	phoneAuth: '',
};

function FindId({navigation}) {
	const [data, setData] = useState(defaultData);
	const [onFocus, setOnFocus] = useState();
	const [minute, setMinute] = useState(0);
	const [second, setSecond] = useState(0);
	const [pass, setPass] = useState(false);

	const callAuth = async () => {
		if (data.name === '') {
			return Alert.alert('알림', '이름을 입력해주세요.', [{text: '확인'}]);
		}
		const check = phoneReg.exec(data.phoneNum);
		if (check === null) {
			return Alert.alert('알림', '전화번호를 올바르게 입력해주세요.', [
				{text: '확인'},
			]);
		}
		try {
			const res = await APICallPhoneAuth('find', data.phoneNum);
			if (res.result === 'true') {
				setSecond(0);
				setMinute(3);
				Alert.alert('알림', '인증번호가 발송 되었습니다.', [{text: '확인'}]);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
	};

	const checkAuth = async () => {
		try {
			const res = await APICheckPhoneAuth(data.phoneNum, data.phoneAuth);
			if (res.result === 'true') {
				setPass(true);
				setMinute(0);
				setSecond(0);
				Alert.alert('알림', '인증번호가 확인되었습니다.', [{text: '확인'}]);
			} else {
				Alert.alert('알림', '인증번호가 맞지 않습니다.', [{text: '확인'}]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
	};

	const checkFindID = async () => {
		try {
			const res = await APIFindID(data.name, data.phoneNum);
			const jwtData = jwtDecode(res.jwt);
			console.log('아이디찾기', jwtData);
			Alert.alert('아이디 확인', jwtData.data.mt_id, [
				{
					text: '확인',
					onPress: () => navigation.push('FindPw', {idx: jwtData.data.idx}),
				},
			]);
		} catch (err) {
			setPass(false);
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => setPass(false)},
			]);
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
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="계정찾기"
				border={true}
			/>
			<Content>
				<MainTitle>등록된 전화번호로 계정 찾기</MainTitle>
				<SubTitle>
					{
						'가입 당시 입력한 전화번호를 통해 인증 후\n새 비밀번호를 등록해주세요.'
					}
				</SubTitle>
				<SubjectTitle>이름</SubjectTitle>
				<Wrap>
					<InputBox color={onFocus === 0 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="이름"
							placeholderColor={ColorLineGrey}
							value={data.name}
							onChangeText={text => setData({...data, name: text})}
							onFocus={() => setOnFocus(0)}
						/>
					</InputBox>
				</Wrap>
				<SubjectTitle>전화번호</SubjectTitle>
				<Wrap>
					<InputBox color={onFocus === 1 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="전화번호"
							placeholderColor={ColorLineGrey}
							value={data.phoneNum}
							onChangeText={text => setData({...data, phoneNum: text})}
							onFocus={() => setOnFocus(1)}
							maxLength={11}
							editable={minute === 0 && second === 0 && !pass}
							keyboardType="number-pad"
						/>
					</InputBox>
					<Button
						marginLeft={5}
						backgroundColor={pass ? ColorLineGrey : ColorRed}
						onPress={callAuth}
						disabled={pass}>
						<ButtonLabel>
							{minute === 0 && second === 0 ? '인증' : '재발송'}
						</ButtonLabel>
					</Button>
				</Wrap>
				<Wrap>
					<InputBox color={onFocus === 2 ? ColorRed : '#cecece'}>
						<TextInput
							placeholder="인증번호"
							placeholderColor={ColorLineGrey}
							value={data.phoneAuth}
							onChangeText={text => setData({...data, phoneAuth: text})}
							onFocus={() => setOnFocus(2)}
							maxLength={6}
							editable={!pass}
						/>
						<InputLabel color="red">
							{minute > 0 || second > 0
								? second >= 10
									? String(minute) + ' : ' + String(second)
									: String(minute) + ' : ' + '0' + String(second)
								: ''}
						</InputLabel>
					</InputBox>
					<Button
						marginLeft={5}
						backgroundColor={
							minute === 0 && second === 0 ? ColorLineGrey : ColorRed
						}
						disabled={minute === 0 && second === 0}
						onPress={checkAuth}>
						<ButtonLabel>확인</ButtonLabel>
					</Button>
				</Wrap>
			</Content>
			<Box>
				<Button
					onPress={checkFindID}
					style={{width: '100%'}}
					backgroundColor={pass ? ColorRed : ColorLineGrey}
					disabled={!pass}>
					<ButtonLabel>다음</ButtonLabel>
				</Button>
			</Box>
		</Container>
	);
}

export default FindId;
