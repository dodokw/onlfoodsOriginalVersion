import React, {useState} from 'react';
import {Platform} from 'react-native';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APIEnrollQuestion} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import LongButton from '~/Components/LongButton/LongButton';

const Container = styled.View`
	background-color: #ffffff;
	flex: 1;
`;

const Section = styled.View`
	padding: 0 20px;
	flex: 1;
`;

const Box = styled.View`
	padding: 20px;
`;

const Label = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-top: 10px;
	margin-bottom: 10px;
	color: ${props => (props.color ? ColorBlue : ColorRed)};
`;
const Title = styled.Text`
	font-size: 16px;
	margin-bottom: 10px;
	font-family: ${FONTNanumGothicBold};
`;

const QImg = styled.Image`
	height: 300px;
	margin-bottom: 10px;
`;

const Content = styled.Text`
	font-size: 16px;
	margin-bottom: 10px;
	font-family: ${FONTNanumGothicRegular};
`;

const Dive = styled.View`
	height: 1px;
	background-color: ${ColorLineGrey};
	margin: 10px 10px;
`;

const QuestionDetail = ({navigation, route}) => {
	const {item, state} = route.params;

	return (
		<Container>
			<ScrollView>
				<Header
					headerLeft={<BackButton onPress={() => navigation.goBack()} />}
					title="문의 상세"
					border
				/>
				<Section>
					<Label color={state}>제목</Label>
					<Title>{item.qt_title}</Title>
					<Label color={state}>문의 내용</Label>
					{item.qt_image && (
						<QImg source={{uri: item.qt_image}} resizeMode="contain" />
					)}
					<Content>{item.qt_content}</Content>
				</Section>
				<Dive />
				<Section>
					<Label color={state}>문의 답변</Label>
					<Content>{item.qt_answer}</Content>
				</Section>
			</ScrollView>
		</Container>
	);
};

export default QuestionDetail;
