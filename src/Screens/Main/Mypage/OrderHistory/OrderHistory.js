import jwtDecode from 'jwt-decode';
import React, {useRef, useState} from 'react';
import {useEffect} from 'react';
import {Alert, FlatList, Modal, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {
	APICallSellerSupplyOrderDeatil,
	APICallSellerSupplyOrderList,
	APICallSellerTodayInOrderList,
	APICallSupplyOrderDeatil,
	APICallSupplyOrderList,
	APICallTodayInOrderList,
	APICallZzimSupplyOrderDeatil,
	APICallZzimSupplyOrderList,
	APICallZzimTodayInOrderList,
} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import LoadingSpinner from '~/Components/LoadingSpinner';
import OrderCard from '~/Components/OrderCard/OrderCard';
import OrderItemCard from '~/Components/OrderItemCard';
import SupplyCard from '~/Components/SupplyCard';
import SwitchingButton from '~/Components/SwitchingButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableWithoutFeedback} from 'react-native';
import {Dimensions} from 'react-native';
import {Platform} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
	APISendReOrder,
	APISendStockReOrder,
	APISendTodayReOrder,
} from '~/API/ChattingAPI/ChattingAPI';

const Container = styled.View`
	flex: 1;
`;
const TabContainer = styled.View`
	background-color: #ffffff;
`;
const TabWrap = styled.View`
	flex-direction: row;
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	padding-top: 10px;
`;
const TabBox = styled.TouchableOpacity`
	flex: 1;
	border-color: ${props => (props.state ? ColorBlue : ColorRed)};
	border-bottom-width: ${props => (props.selected ? '3px' : '0')};
	padding: 10px 0;
	justify-content: center;
	align-content: center;
`;
const TabLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${props =>
		props.selected ? (props.state ? ColorBlue : ColorRed) : '#7b7b7b'};
	text-align: center;
`;

const DateBox = styled.View`
	padding: 10px;
	background-color: #ffffff;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;
const DateButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
`;
const DateLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	margin-right: 5px;
`;

const ModalBackground = styled.View`
	flex: 1;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.7);
`;

const ModalBackBox = styled.View`
	position: absolute;
	top: ${Platform.OS === 'ios' ? '60px' : '10px'};
	right: 10px;
	padding: 5px;
`;

const ListWarningBox = styled.View`
	flex: 1;
	justify-content: center;
`;

const ListWarningLabel = styled.Text`
	text-align: center;
	margin: 60px 0;
	font-family: ${FONTNanumGothicRegular};
`;

const OrderHistory = ({navigation, route}) => {
	const {state} = useSelector(state => state.loginReducer);
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const before = route.params.before;
	const [tabState, setTabState] = useState(0);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [todayInData, setTodayInData] = useState();
	const [supplyData, setSupplyData] = useState();
	const [showDetailId, setShowDetailId] = useState('');
	const [detailData, setDetailData] = useState();
	const isFocused = useIsFocused();

	const getData = async () => {
		try {
			if (tabState === 0) {
				const res = route.params.od_mt_idx
					? await APICallZzimTodayInOrderList(
							user.mt_idx,
							route.params.od_mt_idx,
							date,
					  )
					: state
					? await APICallSellerTodayInOrderList(user.mt_idx, date)
					: await APICallTodayInOrderList(user.mt_idx);
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setTodayInData(decode.data);
			} else {
				const res = route.params.od_mt_idx
					? await APICallZzimSupplyOrderList(
							user.mt_idx,
							route.params.od_mt_idx,
							date,
					  )
					: state
					? await APICallSellerSupplyOrderList(user.mt_idx, date)
					: await APICallSupplyOrderList(user.mt_idx);
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setSupplyData(decode.data);
			}
		} catch (err) {
			if (tabState === 0) setTodayInData([]);
			else setSupplyData([]);
		}
	};

	const getDetailData = async () => {
		try {
			const res = route.params.od_mt_idx
				? await APICallZzimSupplyOrderDeatil(user.mt_idx, showDetailId)
				: state
				? await APICallSellerSupplyOrderDeatil(user.mt_idx, showDetailId)
				: await APICallSupplyOrderDeatil(user.mt_idx, showDetailId);
			const decode = jwtDecode(res.jwt);
			console.log(decode.data);
			setDetailData(decode.data);
		} catch (err) {
			console.log(err.message);
		}
	};

	const reOrder = async (type, od_idx) => {
		try {
			const res =
				type === 1
					? await APISendTodayReOrder(od_idx)
					: await APISendStockReOrder(od_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				setShowDetailId('');
				setDetailData(undefined);
				if (before !== 'TodayIn') {
					navigation.reset({index: 1, routes: [{name: before}]});
				} else {
					navigation.navigate('TodayIn');
				}
				navigation.navigate('ChattingNav', {
					screen: 'ChattingPage',
					params: {chatID: decode.data},
					initial: false,
				});
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		getData();
	}, [tabState, date]);

	useEffect(() => {
		if (showDetailId !== '') {
			getDetailData();
		}
	}, [showDetailId]);

	useEffect(() => {
		if (isFocused) {
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: false});
		}
	}, [isFocused]);

	return (
		<Container>
			<Header
				title={state ? '배송관리' : '주문내역'}
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			{state && (
				<DateBox>
					<DateButton>
						<DateLabel onPress={() => setShowDatePicker(true)}>
							{date}
						</DateLabel>
						<Icon name="calendar" size={15} />
					</DateButton>
				</DateBox>
			)}
			<TabContainer>
				<TabWrap>
					<TabBox
						state={state}
						selected={tabState === 0}
						onPress={() => setTabState(0)}>
						<TabLabel state={state} selected={tabState === 0}>
							오늘만
						</TabLabel>
					</TabBox>
					<TabBox
						state={state}
						selected={tabState === 1}
						onPress={() => {
							setTabState(1), setDetailData(undefined), setShowDetailId('');
						}}>
						<TabLabel state={state} selected={tabState === 1}>
							추천업체
						</TabLabel>
					</TabBox>
				</TabWrap>
			</TabContainer>
			{tabState === 0 &&
				(todayInData === undefined ? (
					<LoadingSpinner />
				) : (
					<FlatList
						data={todayInData}
						keyExtractor={(item, index) =>
							`TodayOrder-${item.od_idx ? item.od_idx : item.ot_code}`
						}
						renderItem={({item}) => (
							<OrderItemCard
								item={item}
								zzim={route.params.od_mt_idx}
								getData={getData}
								user={user}
								state={state}
								reOrder={reOrder}
							/>
						)}
						bounces={false}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flex: todayInData.length === 0 ? 1 : undefined,
							paddingHorizontal: 10,
							paddingTop: 10,
							paddingBottom: 50,
						}}
						ListEmptyComponent={
							<ListWarningBox>
								<ListWarningLabel>
									오늘만 주문내역이 없습니다.
								</ListWarningLabel>
							</ListWarningBox>
						}
					/>
				))}
			{tabState === 1 &&
				(supplyData === undefined ? (
					<LoadingSpinner />
				) : (
					<FlatList
						data={supplyData}
						keyExtractor={(item, index) => `SupplyOrder-${item.od_idx}`}
						renderItem={({item, index}) => (
							<SupplyCard
								key={`order-${index}`}
								item={item}
								setShowDetailId={setShowDetailId}
								state={state}
								user={user}
								getData={getData}
								zzim={route.params.od_mt_idx}
							/>
						)}
						bounces={false}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flex: supplyData.length === 0 ? 1 : undefined,
							paddingHorizontal: 10,
							paddingTop: 10,
							paddingBottom: 50,
						}}
						ListEmptyComponent={
							<ListWarningBox>
								<ListWarningLabel>
									추천업체 주문내역이 없습니다.
								</ListWarningLabel>
							</ListWarningBox>
						}
					/>
				))}
			<Modal
				visible={tabState === 1 && detailData !== undefined}
				transparent={true}
				animationType="fade">
				<ModalBackground>
					<OrderCard
						data={detailData}
						zzim={route.params.od_mt_idx}
						od_idx={showDetailId}
						getData={getData}
						getDetailData={getDetailData}
						state={state}
						reOrder={reOrder}
					/>
					<TouchableWithoutFeedback
						onPress={() => {
							setShowDetailId('');
							setDetailData(undefined);
						}}>
						<ModalBackBox>
							<Icon name="x" size={24} color="#ffffff" />
						</ModalBackBox>
					</TouchableWithoutFeedback>
				</ModalBackground>
			</Modal>
			<DateTimePickerModal
				isVisible={showDatePicker}
				mode="date"
				onConfirm={date => {
					setShowDatePicker(false);
					setDate(dayjs(date).format('YYYY-MM-DD'));
				}}
				onCancel={() => setShowDatePicker(false)}
				headerTextIOS="날짜를 선택해주세요."
				locale="ko_KR"
				cancelTextIOS="취소"
				confirmTextIOS="확인"
			/>
		</Container>
	);
};

export default OrderHistory;
