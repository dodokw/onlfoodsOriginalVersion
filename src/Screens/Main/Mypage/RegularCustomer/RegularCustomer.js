import jwtDecode from 'jwt-decode';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallZzimList} from '~/API/MyPageAPI/MyPageAPI';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import RegularCustomerCard from '~/Components/RegularCustomerCard';
import SwitchingButton from '~/Components/SwitchingButton';
import LoadingSpinner from '~/Components/LoadingSpinner';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const EmptyLabel = styled.Text`
	flex: 1;
	text-align: center;
	margin-top: 60px;
`;

const RegularCustomer = ({navigation}) => {
	const {state, user} = useSelector(state => state.loginReducer);
	const [data, setData] = useState([]);
	const [dataLoading, setDataLoading] = useState(false);
	const PageRef = useRef(1);

	const getList = async () => {
		setDataLoading(true);
		try {
			PageRef.current = 1;
			const res = await APICallZzimList(state, user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData(decode.data);
			} else {
				console.log(res);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
			console.log(err);
		}
		setDataLoading(false);
	};

	const addList = async () => {
		setDataLoading(true);
		try {
			PageRef.current += 1;
			const res = await APICallZzimList(state, user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				setData(decode.data);
			} else {
				console.log(res);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
			console.log(err);
		}
		setDataLoading(false);
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		getList();
	}, []);

	return (
		<Container>
			<Header
				title="관심업체관리"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			{dataLoading ? (
				<LoadingSpinner />
			) : (
				<FlatList
					style={{flex: 1}}
					keyExtractor={item => `Customer-${item.od_mt_idx}`}
					data={data}
					renderItem={({item}) => (
						<RegularCustomerCard
							item={item}
							onPress={() =>
								navigation.navigate('OrderHistory', {od_mt_idx: item.od_mt_idx})
							}
						/>
					)}
					bounces={false}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{paddingBottom: 100}}
					ListEmptyComponent={<EmptyLabel>관심 고객이 없습니다.</EmptyLabel>}
				/>
			)}
		</Container>
	);
};

export default RegularCustomer;
