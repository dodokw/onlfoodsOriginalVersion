import jwtDecode from 'jwt-decode';
import React, {useRef, useState, useEffect} from 'react';
import {Alert, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {APICallFAQList} from '~/API/MyPageAPI/MyPageAPI';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import Icon from 'react-native-vector-icons/Feather';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const Door = styled.View``;

const TouchBar = styled.TouchableOpacity`
	padding: 10px 20px;
	background-color: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;

const QuestionWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const QuestionLabel = styled.Text`
	font-size: 15px;
	font-family: ${FONTNanumGothicBold};
	color: #000000;
`;

const QuestionDate = styled.Text`
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	color: #000000;
	margin-right: 5px;
`;

const AnswerWrap = styled.View`
	background-color: ${props => props.color};
	padding: 10px 20px;
`;
const AnswerLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
`;

const AccordionBar = ({item}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Door>
			<TouchBar onPress={() => setIsOpen(!isOpen)}>
				<QuestionWrap>
					<QuestionDate>[{item.ft_ca}]</QuestionDate>
					<QuestionLabel>{item.ft_title}</QuestionLabel>
				</QuestionWrap>
				<Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} />
			</TouchBar>
			{isOpen && (
				<>
					<AnswerWrap color={ColorRed}>
						<AnswerLabel>{item.ft_content}</AnswerLabel>
					</AnswerWrap>
				</>
			)}
		</Door>
	);
};

function FAQ({navigation}) {
	const [data, setData] = useState([]);
	const pageRef = useRef(1);

	const getData = async () => {
		try {
			const res = await APICallFAQList(1);
			if (res.result === 'true') {
				const newData = jwtDecode(res.jwt);
				console.log(newData.data);
				setData(newData.data);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			Alert.alert('알림', err.message, [{text: '확인'}]);
		}
	};

	const getAddData = async () => {
		try {
			pageRef.current += 1;
			const res = await APICallFAQList(pageRef.current);
			if (res.result === 'true') {
				const newData = jwtDecode(res.jwt);
				console.log(newData.data);
				setData([...data, newData.data]);
			} else {
				console.log(res.message);
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
				title="자주묻는질문"
			/>
			<FlatList
				style={{flex: 1}}
				contentContainerStyle={{paddingBottom: 50}}
				bounces={false}
				data={data}
				renderItem={({item}) => <AccordionBar item={item} />}
				keyExtractor={item => `FAQ-${item.ft_idx}`}
				onEndReached={getAddData}
				onEndReachedThreshold={0.5}
			/>
		</Container>
	);
}

export default FAQ;
