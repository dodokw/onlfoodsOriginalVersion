import React from 'react';
import styled from 'styled-components/native';
import {ColorLineGrey} from '~/Assets/Style/Colors';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';

const Container = styled.View`
	flex-direction: row;
	margin: 5px;
	align-items: center;
`;
const Title = styled.Text`
	color: ${ColorLineGrey};
	font-family: ${FONTNanumGothicRegular};
	margin-left: 5px;
	margin-right: 5px;
`;
const Line = styled.View`
	background-color: ${ColorLineGrey};
	height: 0.5px;
	flex: 1;
`;

const TimeLine = ({date}) => {
	return (
		<Container>
			<Line />
			<Title>{date.split(' ')[0]}</Title>
			<Line />
		</Container>
	);
};

export default TimeLine;
