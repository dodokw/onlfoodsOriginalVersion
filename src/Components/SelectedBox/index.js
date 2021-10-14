import React from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';
import ic_arrowdown from '~/Assets/Images/ic_arrowdown.svg';
import {SvgXml} from 'react-native-svg';

const Container = styled.TouchableOpacity`
	border-width: 1px;
	border-color: #cecece;
	flex-direction: row;
	height: 50px;
	align-items: center;
	border-radius: 5px;
	padding: 10px;
	justify-content: space-between;
`;
const Title = styled.Text`
	min-width: 50px;
	font-family: ${FONTNanumGothicRegular};
	color: #cecece;
	font-size: 16px;
`;

const SelectedBox = ({style, label}) => {
	return (
		<Container style={style}>
			<Title numberOfLines={1}>{label}</Title>
			<SvgXml xml={ic_arrowdown} />
		</Container>
	);
};

export default SelectedBox;
