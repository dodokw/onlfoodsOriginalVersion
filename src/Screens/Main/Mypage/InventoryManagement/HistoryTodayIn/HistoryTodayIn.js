import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import styled from 'styled-components/native';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {useIsFocused} from '@react-navigation/core';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import ic_arrowleft from '~/Assets/Images/ic_arrowleft.svg';
import ic_arrowright from '~/Assets/Images/ic_arrowright.svg';
import {SvgXml} from 'react-native-svg';
import ChatItemCard from '~/Components/ChatItemCard';
import {
	APICallTodayInHistoryList,
	APITodayInExpired,
	APITodayInRefresh,
} from '~/API/MyPageAPI/MyPageAPI';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import {Alert} from 'react-native';
import LoadingSpinner from '~/Components/LoadingSpinner/index';
import {SectionList} from 'react-native';
import {idReg} from '~/Tools/Reg';

const Container = styled.View`
	flex: 1;
`;
const Dive = styled.View`
	height: 1px;
	background-color: #dfdfdf;
	margin: 10px 0;
`;
const Box = styled.View`
	background-color: #ffffff;
`;
const EnrollButton = styled.TouchableOpacity`
	height: 78px;
	border-color: ${ColorBlue};
	border-width: 1px;
	background-color: #ffffff;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
`;
const EnrollLabel = styled.Text`
	color: ${ColorBlue};
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;
const TitleBox = styled.View`
	background-color: ${ColorBlue};
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
`;
const TitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	font-size: 16px;
	margin: 10px 0;
	color: #ffffff;
`;

const HistoryTodayIn = ({navigation, date}) => {
	const {user} = useSelector(state => state.loginReducer);
	const {location} = useSelector(state => state.dataReducer);
	const isFocused = useIsFocused();
	const [data, setData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const pageRef = useRef(1);

	const getData = async () => {
		setLoading(true);
		try {
			pageRef.current = 1;
			const res = await APICallTodayInHistoryList(
				user.mt_info.mt_idx,
				pageRef.current,
				date,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('오늘의 입고 Data', decode.data);
				let today_end;
				if (decode.data.today_end !== null) {
					today_end = decode.data.today_end.map(item => ({...item, end: true}));
				}
				const format = [
					{
						title: '등록중',
						data: decode.data.today === null ? [] : decode.data.today,
					},
					{
						title: '등록만료',
						data: decode.data.today_end === null ? [] : today_end,
					},
				];
				setData(format);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const addData = async () => {
		try {
			pageRef.current += 1;
			console.log(pageRef.current);
			const res = await APICallTodayInHistoryList(
				user.mt_info.mt_idx,
				pageRef.current,
				date,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('오늘의 입고 Data', decode.data);
				let today_end = [];
				if (decode.data.today_end !== null) {
					today_end = decode.data.today_end.map(item => ({...item, end: true}));
				}
				const format = [
					{
						title: '등록중',
						data: [...data[0].data],
					},
					{
						title: '등록만료',
						data: [...data[1].data, ...today_end],
					},
				];
				setData(format);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const refreshItem = async pt_idx => {
		try {
			const res = await APITodayInRefresh(user.mt_info.mt_idx, pt_idx);
			if (res.result === 'true') {
				console.log(res);
				getData();
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const expiredItem = async pt_idx => {
		try {
			const res = await APITodayInExpired(user.mt_info.mt_idx, pt_idx);
			if (res.result === 'true') {
				console.log(res);
				getData();
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (isFocused) getData();
	}, [isFocused, date]);

	return (
		<Container>
			<Box style={{marginBottom: 5, padding: 10}}>
				<EnrollButton
					onPress={() => navigation.navigate('EnrollTodayIn', {itemID: null})}>
					<EnrollLabel>+ 등록</EnrollLabel>
				</EnrollButton>
			</Box>
			<Box style={{flex: 1}}>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<SectionList
						style={{flex: 1}}
						contentContainerStyle={{paddingBottom: 50}}
						showsVerticalScrollIndicator={false}
						sections={data}
						keyExtractor={(item, index) => item + index}
						renderItem={({item}) => (
							<Box style={{paddingHorizontal: 10}}>
								<ChatItemCard
									item={item}
									getData={getData}
									onPress={() => {
										navigation.reset({index: 1, routes: [{name: 'Mypage'}]});
										navigation.navigate('TodayInDetail', {
											pt_idx: item.pt_idx,
											mt_idx: user.mt_info.mt_idx,
											lat: location.x,
											lng: location.y,
											slt_idx: user.mt_info.mt_idx,
										});
									}}
									end={item.end}
									navigation={navigation}
									refreshItem={refreshItem}
									expiredItem={expiredItem}
								/>
							</Box>
						)}
						renderSectionHeader={({section: {title}}) => (
							<TitleBox>
								<TitleLabel>{title}</TitleLabel>
							</TitleBox>
						)}
						onEndReached={addData}
					/>
				)}
			</Box>
		</Container>
	);
};

export default HistoryTodayIn;
