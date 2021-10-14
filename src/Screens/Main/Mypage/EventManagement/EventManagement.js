import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import SwitchingButton from '~/Components/SwitchingButton';
import {APICallEventManagementList} from '~/API/MyPageAPI/MyPageAPI';
import {Alert} from 'react-native';
import jwtDecode from 'jwt-decode';
import EventCard from '~/Components/EventCard';
import {useRef} from 'react';
import {floatingHide} from '~/Modules/Action';
import {useIsFocused} from '@react-navigation/native';
import LoadingSpinner from '~/Components/LoadingSpinner';
import {SectionList} from 'react-native';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
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
	font-size: 16px;
	margin: 10px 0;
	color: #ffffff;
`;

const PagerWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const PagerButton = styled.TouchableOpacity`
	border-radius: 5px;
	width: 35px;
	height: 35px;
	border-color: #dfdfdf;
	border-width: 1px;
	align-items: center;
	justify-content: center;
`;

const PagerText = styled.Text`
	border-color: #989898;
	font-size: 12px;
	font-family: ${FONTNanumGothicBold};
	margin: 0 20px;
`;

function EventManagement({navigation}) {
	const parent = navigation.dangerouslyGetParent();
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const {user, state} = useSelector(state => state.loginReducer);
	const {location} = useSelector(state => state.dataReducer);
	const [data, setData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const pageRef = useRef(1);

	const getEventList = async () => {
		setLoading(true);
		try {
			pageRef.current = 1;
			const res = await APICallEventManagementList(
				user.mt_info.mt_idx,
				pageRef.current,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('오늘의 이벤트 Data', decode.data);
				const format = [
					{
						title: '등록중',
						data: decode.data.event === null ? [] : decode.data.event,
					},
					{
						title: '등록만료',
						data: decode.data.event_end === null ? [] : decode.data.event_end,
					},
				];
				setData(format);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
		setLoading(false);
	};

	const addEventList = async () => {
		try {
			pageRef.current += 1;
			const res = await APICallEventManagementList(
				user.mt_info.mt_idx,
				pageRef.current,
			);
			if (res.result === 'true') {
				if (isFocused) {
					const decode = jwtDecode(res.jwt);
					console.log('오늘의 이벤트 Data', decode.data);
					const event = decode.data.event === null ? [] : decode.data.event;
					const event_end =
						decode.data.event_end === null ? [] : decode.data.event_end;
					const format = [
						{
							title: '등록중',
							data: [...data[0].data, ...event],
						},
						{
							title: '등록만료',
							data: [...data[1].data, ...event_end],
						},
					];
					console.log(format);
				}
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
	};

	useEffect(() => {
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	useEffect(() => {
		if (isFocused) getEventList();
	}, [isFocused]);

	return (
		<Container>
			<Header
				title="행사 관리"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			<Box style={{marginBottom: 5, padding: 10}}>
				<EnrollButton
					onPress={() => navigation.navigate('EnrollEvent', {eventId: null})}>
					<EnrollLabel>+ 등록</EnrollLabel>
				</EnrollButton>
			</Box>
			<Box style={{flex: 1}}>
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<SectionList
						style={{flex: 1}}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{paddingBottom: 50}}
						sections={data}
						keyExtractor={(item, index) => item + index}
						renderItem={({item}) => (
							<Box style={{paddingHorizontal: 10}}>
								<EventCard
									item={item}
									onPress={() => {
										navigation.reset({index: 1, routes: [{name: 'Mypage'}]});
										navigation.navigate('TodayEventDetail', {
											et_idx: item.et_idx,
											mt_idx: user.mt_info.mt_idx,
											lng: location.x,
											lat: location.y,
											seller_idx: user.mt_info.mt_idx,
										});
									}}
									navigation={navigation}
									user={user}
									getData={getEventList}
									manage
								/>
							</Box>
						)}
						renderSectionHeader={({section: {title}}) => (
							<TitleBox>
								<TitleLabel>{title}</TitleLabel>
							</TitleBox>
						)}
						onEndReached={addEventList}
					/>
				)}
			</Box>
			{/* <PagerWrap>
				<PagerButton>
					<SvgXml xml={ic_arrowleft} />
				</PagerButton>
				<PagerText>
					{pageRef.current} <Text style={{color: '#989898'}}>/ {'10'}</Text>
				</PagerText>
				<PagerButton>
					<SvgXml xml={ic_arrowright} />
				</PagerButton>
			</PagerWrap> */}
		</Container>
	);
}

export default EventManagement;
