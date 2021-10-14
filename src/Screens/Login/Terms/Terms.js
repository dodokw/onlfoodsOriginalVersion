import jwtDecode from 'jwt-decode';
import WebView from 'react-native-webview';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {APICallTerms} from '~/API/SignAPI/SignAPI';
import BackButton from '~/Components/BackButton/index';
import Header from '~/Components/Header/index';
import {floatingHide} from '~/Modules/Action';
import {useDispatch} from 'react-redux';
import LoadingSpinner from '~/Components/LoadingSpinner';

const Container = styled.View`
	flex: 1;
`;

const Terms = ({navigation, route}) => {
	const {type} = route.params;
	const [data, setData] = useState('');
	const dispatch = useDispatch();

	const getTerms = async () => {
		try {
			const res = await APICallTerms(type);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData(decode.data);
			} else {
				Alert.alert('알림', res.message, [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		//getTerms();
	}, []);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title={
					type === 1
						? '이용약관'
						: type === 2
						? '개인정보처리방침'
						: type === 3
						? '위치기반서비스 이용약관'
						: type ===4
						? '마케팅정보제공'
						: type ===5
						? '입점고객 이용약관'
						: '없음'
					
				}
			/>
			<WebView
				source={{
					uri: `https://onlfoods.com/view/policy_content.php?agree_type=${type}`,
				}}
			/>
		</Container>
	);
};

export default Terms;
