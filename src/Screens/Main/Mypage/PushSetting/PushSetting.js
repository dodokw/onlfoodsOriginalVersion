import React from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import {Switch} from 'react-native';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import {useState} from 'react';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingModal from '~/Components/LoadingModal';
import {
	APICallAlramSetting,
	APIEnrollPushAlram,
} from '~/API/MyPageAPI/MyPageAPI';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import SwitchingButton from '~/Components/SwitchingButton';
import {useIsFocused} from '@react-navigation/native';
import jwtDecode from 'jwt-decode';

const Container = styled.View``;

const Bar = styled.View`
	flex-direction: row;
	padding: 10px;
	background-color: #ffffff;
	justify-content: space-between;
	align-items: center;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;

const SettingBar = ({item, setStatus, status, seller}) => {
	return (
		<Bar>
			<Title>{item.title}</Title>
			<Switch
				thumbColor={status ? '#ffffff' : '#ffffff'}
				trackColor={{false: '#767577', true: seller ? ColorBlue : ColorRed}}
				value={item.push === 'Y' ? true : false}
				onChange={() =>
					setStatus(
						status.map(element =>
							element.id === item.id
								? {...element, push: item.push === 'Y' ? 'N' : 'Y'}
								: {...element},
						),
					)
				}
			/>
		</Bar>
	);
};

const defaultStatus = {
	customer: [
		{id: 1, title: '관심 판매자 상품 등록 알람', push: 'Y'},
		{id: 2, title: '관심 판매자 상품 수정 알람', push: 'Y'},
		{id: 3, title: '관심 판매자 공지 등록 알람', push: 'Y'},
		{id: 4, title: '주문 완료 알람', push: 'Y'},
		{id: 5, title: '판매자 채팅 알람', push: 'Y'},
	],
	seller: [
		{id: 1, title: '주문 완료 알람', push: 'Y'},
		{id: 2, title: '채팅 문의 알람', push: 'Y'},
		{id: 3, title: '관심 신규 등록 알람', push: 'Y'},
		{id: 4, title: '재고 소진 알람', push: 'Y'},
	],
};

const PushSetting = ({navigation, route}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const state = useSelector(state => state.loginReducer.state);
	const [loading, setLoading] = useState(false);
	const [all, setAll] = useState(true);
	const [status, setStatus] = useState();
	const isFocus = useIsFocused();

	const getPushStatus = async () => {
		setLoading(true);
		try {
			const res = await APICallAlramSetting(user.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				const customer = defaultStatus.customer.map((item, index) => ({
					...item,
					push: decode.data[`mt_pushing${index + 1}`],
				}));
				const seller = defaultStatus.seller.map((item, index) => ({
					...item,
					push: decode.data[`mt_pushing${index + 6}`],
				}));
				setStatus(state ? seller : customer);
			}
		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

	const setPushStatus = async () => {
		try {
			const res = await APIEnrollPushAlram(user.mt_idx, state, status, all);
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
	};

	useEffect(() => {
		if (status !== undefined) {
			const check = status.find(element => element.push === 'N');
			if (check === undefined) {
				setAll(true);
			} else {
				setAll(false);
			}
			console.log(status);
			setPushStatus();
		}
	}, [status]);

	useEffect(() => {
		if (isFocus) {
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: false});
			getPushStatus();
		}
	}, [isFocus]);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="푸시알림 설정"
				headerRight={
					<SwitchingButton onToggle={state ? true : false} disabled={true} />
				}
			/>
			<Bar>
				<Title>전체</Title>
				<Switch
					thumbColor={all ? '#ffffff' : '#ffffff'}
					trackColor={{
						false: '#767577',
						true: state ? ColorBlue : ColorRed,
					}}
					value={all}
					onChange={() => {
						setAll(!all);
						setStatus(
							status.map(element => ({
								...element,
								push: all ? 'N' : 'Y',
							})),
						);
					}}
				/>
			</Bar>
			{status !== undefined &&
				status.map((element, index) => (
					<SettingBar
						key={index}
						item={element}
						status={status}
						setStatus={setStatus}
						seller={state}
					/>
				))}
			{/* <LoadingModal visible={loading} /> */}
		</Container>
	);
};

export default PushSetting;
