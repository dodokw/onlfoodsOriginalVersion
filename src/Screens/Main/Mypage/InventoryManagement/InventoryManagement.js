import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import SwitchingButton from '~/Components/SwitchingButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getFormatDate} from '~/Tools/FormatDate';
import HistoryTodayIn from './HistoryTodayIn/HistoryTodayIn';
import Shipping from './Shipping/Shipping';
import InventoryState from './InventoryState/InventoryState';
import Icon from 'react-native-vector-icons/Feather';
import {floatingHide} from '~/Modules/Action';
import dayjs from 'dayjs';

const Container = styled.View`
	flex: 1;
`;
const TabContainer = styled.View`
	padding: 0px 10px;
	background-color: #ffffff;
`;

const DateContainer = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	margin-bottom: 5px;
	padding: 10px;
	align-items: center;
`;
const DateButton = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const DateText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-right: 5px;
`;

const TabWrap = styled.View`
	flex-direction: row;
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	padding-top: 10px;
`;
const TabBox = styled.TouchableOpacity`
	flex: 1;
	border-color: ${ColorBlue};
	border-bottom-width: ${props => (props.selected ? '3px' : '0')};
	padding: 10px 0;
	justify-content: center;
	align-content: center;
`;
const TabLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${props => (props.selected ? ColorBlue : '#7b7b7b')};
	text-align: center;
`;

const InventoryManagement = ({navigation}) => {
	const dispatch = useDispatch();
	const {state} = useSelector(state => state.loginReducer);
	const [date, setDate] = useState('');
	const [tabState, setTabState] = useState(0);
	const [showDateTimePicker, setShowDateTimePicker] = useState(false);

	const onConfirm = date => {
		const selectDate = dayjs(date).format('YYYY-MM-DD');
		setDate(selectDate);
		setShowDateTimePicker(false);
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());

		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	return (
		<Container>
			<Header
				title="재고관리"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			{tabState < 2 && (
				<DateContainer>
					<DateButton disabled={true}>
						<Icon name="calendar" size={20} color="#ffffff" />
					</DateButton>
					<DateButton onPress={() => setShowDateTimePicker(true)}>
						<DateText>{date === '' ? '전체' : date}</DateText>
						<Icon name="calendar" size={20} />
					</DateButton>
					<DateButton
						style={{justifyContent: 'flex-end'}}
						onPress={() => setDate('')}>
						<Icon name="refresh-cw" size={20} />
					</DateButton>
				</DateContainer>
			)}
			<TabContainer>
				<TabWrap>
					<TabBox selected={tabState === 0} onPress={() => setTabState(0)}>
						<TabLabel selected={tabState === 0}>오늘입고</TabLabel>
					</TabBox>
					<TabBox selected={tabState === 1} onPress={() => setTabState(1)}>
						<TabLabel selected={tabState === 1}>재고현황</TabLabel>
					</TabBox>
					<TabBox selected={tabState === 2} onPress={() => setTabState(2)}>
						<TabLabel selected={tabState === 2}>출고</TabLabel>
					</TabBox>
				</TabWrap>
			</TabContainer>
			{tabState === 0 && <HistoryTodayIn navigation={navigation} date={date} />}
			{tabState === 1 && <InventoryState navigation={navigation} date={date} />}
			{tabState === 2 && <Shipping />}
			<DateTimePickerModal
				isVisible={showDateTimePicker}
				onConfirm={date => onConfirm(date)}
				onCancel={() => setShowDateTimePicker(false)}
				headerTextIOS="날짜를 선택해주세요."
				locale="ko_KR"
				cancelTextIOS="취소"
				confirmTextIOS="확인"
			/>
		</Container>
	);
};

export default InventoryManagement;
