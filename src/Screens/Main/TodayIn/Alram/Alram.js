import {useIsFocused} from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Alert} from 'react-native';
import {FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {
	APICallAlramCheck,
	APICallAlramCheckOne,
	APICallAlramList,
} from '~/API/MainAPI/MainAPI';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import BackButton from '~/Components/BackButton/index';
import Header from '~/Components/Header/index';
import {floatingHide, saleroff, saleron} from '~/Modules/Action';

const Container = styled.View`
	flex: 1;
`;
const Content = styled.View`
	flex: 1;
`;

const Button = styled.TouchableOpacity``;
const CheckReadLabel = styled.Text`
	color: ${ColorRed};
`;

const Bar = styled.View`
	flex-direction: row;
	padding: 10px;
	background-color: ${props => (props.color ? '#ffffff' : 'rgba(0,0,0,0)')};
	justify-content: space-between;
	align-items: center;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;
const Wrap = styled.View`
	flex: 1;
`;
const Title = styled.Text``;
const DataLabel = styled.Text`
	color: #707070;
	font-size: 12px;
`;

const EmptyLabel = styled.Text`
	text-align: center;
	margin-top: 60px;
`;

const NoticeBar = ({item, navigation, user, location}) => {
	const dispatch = useDispatch();

	const goNav = async () => {
		const res = await APICallAlramCheckOne(item.plt_idx);
		if (item.plt_intent === 'ChattingDetail') {
			navigation.navigate('ChattingPage', {
				chatID: item.plt_data1,
			});
		} else if (item.plt_intent === 'TodayEventDetail') {
			navigation.navigate('TodayEventDetail', {
				et_idx: item.plt_data1,
				seller_idx: item.plt_data2,
				mt_idx: user.mt_info.mt_idx,
				lat: location.y,
				lng: location.x,
			});
		} else if (item.plt_intent === 'TodayInDetail') {
			navigation.navigate('TodayInDetail', {
				pt_idx: item.plt_data1,
				slt_idx: item.plt_data2,
				mt_idx: user.mt_info.mt_idx,
				lat: location.y,
				lng: location.x,
			});
		} else if (item.plt_intent === 'DeliverPickupDetail') {
			navigation.navigate('DeliverPickupDetail', {
				slt_idx: item.plt_data1,
				before: 'TodayIn',
			});
		} else if (item.plt_intent === 'CustomService') {
			if (item.plt_data2 === '1') {
				dispatch(saleroff());
			} else {
				dispatch(saleron());
			}
			navigation.navigate('CustomService', {
				qt_idx: item.plt_data1,
			});
		} else if (item.plt_intent === 'InventoryManagement') {
			dispatch(saleron());
			navigation.navigate('InventoryManagement');
		}
	};

	return (
		<TouchableOpacity
			onPress={() => goNav()}
			disabled={item.plt_intent === null}>
			<Bar color={item.plt_check === '안읽음'}>
				<Wrap>
					<Title>{item.plt_title}</Title>
					<DataLabel>{item.plt_wdate}</DataLabel>
				</Wrap>
			</Bar>
		</TouchableOpacity>
	);
};

function Alram({navigation}) {
	const dispatch = useDispatch();
	const {user} = useSelector(state => state.loginReducer);
	const {location} = useSelector(state => state.dataReducer);
	const [data, setData] = useState([]);
	const isFoucs = useIsFocused();

	const getList = async () => {
		try {
			const res = await APICallAlramList(user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData(decode.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const checkAll = async () => {
		try {
			const res = await APICallAlramCheck(user.mt_info.mt_idx);
			if (res.result === 'true') {
				Alert.alert('알림', '모든 알람을 읽음 처리했습니다.', [
					{text: '확인', onPress: () => getList()},
				]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (isFoucs) {
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: false});
			getList();
			dispatch(floatingHide());
		}
	}, [isFoucs]);
	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="알람"
				headerRight={
					<Button onPress={checkAll}>
						<CheckReadLabel>모두읽음</CheckReadLabel>
					</Button>
				}
			/>
			<Content>
				<FlatList
					data={data}
					keyExtractor={(item, index) => `Alram-${index}`}
					renderItem={({item}) => (
						<NoticeBar
							item={item}
							navigation={navigation}
							user={user}
							location={location}
						/>
					)}
					contentContainerStyle={{paddingBottom: 100}}
					ListEmptyComponent={<EmptyLabel>알림 내역이 없습니다.</EmptyLabel>}
				/>
			</Content>
		</Container>
	);
}

export default Alram;
