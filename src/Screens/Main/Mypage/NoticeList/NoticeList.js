import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import Icon from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import {APICallNoticeList} from '~/API/MyPageAPI/MyPageAPI';
import jwtDecode from 'jwt-decode';
import {Alert, FlatList} from 'react-native';
import {ColorLineGrey} from '~/Assets/Style/Colors';

const Container = styled.View`
	flex: 1;
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
const Wrap = styled.View`
	flex: 1;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	margin-bottom: 5px;
`;
const DataLabel = styled.Text`
	color: ${ColorLineGrey};
`;

const NoticeBar = ({item, navigation}) => {
	return (
		<Bar onPress={() => navigation.navigate('NoticeDetail', {id: item.nt_idx})}>
			<Wrap>
				<Title>{item.nt_title}</Title>
				<DataLabel>{item.nt_wdate.split(' ')[0]}</DataLabel>
			</Wrap>
		</Bar>
	);
};

const NoticeList = ({navigation}) => {
	const [data, setData] = useState([]);
	const pageRef = useRef(1);

	const getData = async () => {
		try {
			pageRef.current = 1;
			const res = await APICallNoticeList(pageRef.current);
			if (res.result === 'true') {
				const newData = jwtDecode(res.jwt);
				console.log(newData);
				setData(newData.data);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getAddData = async () => {
		try {
			pageRef.current += 1;
			console.log(pageRef.current);
			const res = await APICallNoticeList(pageRef.current);
			if (res.result === 'true') {
				const newData = jwtDecode(res.jwt);
				console.log(newData);
				setData([...data, ...newData.data]);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		getData();

		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="공지사항"
			/>
			{data.length > 0 ? (
				<FlatList
					style={{flex: 1}}
					contentContainerStyle={{paddingBottom: 100}}
					showsVerticalScrollIndicator={false}
					bounces={false}
					data={data}
					renderItem={({item}) => (
						<NoticeBar key={item.nt_idx} item={item} navigation={navigation} />
					)}
					keyExtractor={item => `Notice-${item.nt_idx}`}
					onEndReached={getAddData}
					onEndReachedThreshold={1}
				/>
			) : undefined}
		</Container>
	);
};

export default NoticeList;
