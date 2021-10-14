import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallExitMember} from '~/API/MyPageAPI/MyPageAPI';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton/index';
import Header from '~/Components/Header/index';
import LongButton from '~/Components/LongButton/LongButton';
import {logout, reset} from '~/Modules/Action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
	background-color: #ffffff;
`;
const Content = styled.View`
	flex: 1;
	padding: 20px;
`;

const Wrap = styled.View`
	margin: 30px 0;
	flex-direction: ${props => (props.row ? 'row' : 'column')};
`;

const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 25px;
	color: ${ColorRed};
`;

const SubTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 20px;
	color: ${ColorRed};
`;

const PasswordLabel = styled.Text`
	margin-left: 5px;
	margin-bottom: 10px;
`;
const PasswordInput = styled.TextInput`
	border-width: 1px;
	border-color: ${ColorLineGrey};
	border-radius: 5px;
	padding: 10px;
	color: #000000;
`;

const ButtonWrap = styled.View`
	padding: 20px;
`;

function ExitService({navigation}) {
	const dispatch = useDispatch();
	const {user} = useSelector(state => state.loginReducer);
	const [password, setPassword] = useState();

	const goExit = async () => {
		try {
			const res = await APICallExitMember(user.mt_info.mt_idx, password);
			if (res.result === 'true') {
				Alert.alert('알림', '오늘의 식자재를 이용해주셔서 감사합니다.', [
					{text: '확인'},
				]);
				await AsyncStorage.removeItem('login');
				dispatch(logout());
				dispatch(reset());
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});

		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	return (
		<Container
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={44}>
			<Header
				title="회원탈퇴"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
			/>
			<Content>
				<Title>오늘의 식자재를</Title>
				<Title style={{color: '#000000'}}>그만 이용하시겠어요?</Title>
				<Wrap>
					<PasswordLabel>
						본인 확인을 위해 비밀번호를 입력해주세요.
					</PasswordLabel>
					<PasswordInput
						placeholder="비밀번호 입력"
						placeholderTextColor="#7e7e7e"
						secureTextEntry={true}
						value={password}
						onChangeText={text => setPassword(text)}
					/>
				</Wrap>
			</Content>
			<ButtonWrap>
				<LongButton text="탈퇴하기" onPress={goExit} />
			</ButtonWrap>
		</Container>
	);
}

export default ExitService;
