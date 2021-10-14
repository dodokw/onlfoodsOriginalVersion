import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallQuestionList} from '~/API/MyPageAPI/MyPageAPI';
import {
	ColorBlue,
	ColorLineGrey,
	ColorLowBlue,
	ColorLowRed,
	ColorRed,
} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import jwtDecode from 'jwt-decode';
import {useIsFocused} from '@react-navigation/native';
import SwitchingButton from '~/Components/SwitchingButton';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const Box = styled.View`
	background-color: #ffffff;
	padding: 10px;
`;
const EnrollButton = styled.TouchableOpacity`
	height: 78px;
	border-color: ${props => (props.state ? ColorBlue : ColorRed)};
	border-width: 1px;
	background-color: #ffffff;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
`;
const EnrollLabel = styled.Text`
	color: ${props => (props.state ? ColorBlue : ColorRed)};
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const Dive = styled.View`
	height: 1px;
	background-color: ${ColorLineGrey};
`;

const EmptyLabel = styled.Text`
	margin-top: 60px;
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
`;

const Bar = styled.TouchableOpacity`
	flex-direction: row;
	padding: 15px 10px;
	background-color: #ffffff;
	justify-content: space-between;
	align-items: center;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;

const StatusLabel = styled.Text`
	width: 90px;
	font-size: 16px;
	color: ${props => props.color};
	font-family: ${FONTNanumGothicRegular};
`;
const Wrap = styled.View`
	flex: 1;
`;
const Title = styled.Text`
	font-size: 18px;
	font-family: ${FONTNanumGothicBold};
	margin-bottom: 3px;
`;
const DataLabel = styled.Text`
	color: ${ColorLineGrey};
`;

const NoticeBar = ({item, navigation, state, idx}) => {
	return (
		<Bar
			style={{
				backgroundColor:
					item.qt_idx === idx
						? state
							? ColorLowBlue
							: ColorLowRed
						: undefined,
			}}
			onPress={() =>
				navigation.navigate('QuestionDetail', {item: item, state})
			}>
			<StatusLabel color={state ? ColorBlue : ColorRed}>
				[{item.qt_status}]
			</StatusLabel>
			<Wrap>
				<Title>{item.qt_title}</Title>
				<DataLabel>{item.qt_wdate}</DataLabel>
			</Wrap>
		</Bar>
	);
};

function CustomService({navigation, route}) {
	const {user, state} = useSelector(state => state.loginReducer);
	const idx = route.params.qt_idx;
	const [data, setData] = useState([]);
	const isFocused = useIsFocused();
	const pageRef = useRef(1);

	const getQuestionList = async () => {
		pageRef.current = 1;
		console.log('요청 값', user.mt_info.mt_idx, state, pageRef.current);
		try {
			const res = await APICallQuestionList(
				user.mt_info.mt_idx,
				state,
				pageRef.current,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode);
				setData([...decode.data]);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const addQuestionList = async () => {
		pageRef.current += 1;
		console.log('요청 값', user.mt_info.mt_idx, state, pageRef.current);
		try {
			const res = await APICallQuestionList(
				user.mt_info.mt_idx,
				state,
				pageRef.current,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode);
				setData([...data, ...decode.data]);
			} else {
				console.log(res);
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

	useEffect(() => {
		if (isFocused) {
			getQuestionList();
		}
	}, [isFocused]);

	return (
		<Container>
			<Header
				title={`${state ? '판매자' : '구매자'} 문의함`}
				border
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={<SwitchingButton onToggle={state} disabled={true} />}
			/>
			<Box style={{marginBottom: 5}}>
				<EnrollButton
					onPress={() => navigation.navigate('EnrollQuestion')}
					state={state}>
					<EnrollLabel state={state}>+ 문의 등록</EnrollLabel>
				</EnrollButton>
			</Box>
			<Dive />
			<FlatList
				style={{flex: 1}}
				bounces={false}
				data={data}
				keyExtractor={(item, index) => `Q-${item.qt_idx}`}
				renderItem={({item}) => (
					<NoticeBar
						item={item}
						state={state}
						navigation={navigation}
						idx={idx}
					/>
				)}
				onEndReached={addQuestionList}
				ListEmptyComponent={<EmptyLabel>문의가 없습니다.</EmptyLabel>}
			/>
		</Container>
	);
}

export default CustomService;
