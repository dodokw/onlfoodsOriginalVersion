import React from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';
import Icon from 'react-native-vector-icons/Feather';

const Container = styled.TouchableOpacity`
	flex-direction: row;
	padding: 10px 0px;
`;
const Title = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	color: #333333;
`;

const Menubar = ({label, onPress}) => {
	return (
		<Container onPress={onPress}>
			<Title>{label}</Title>
			<Icon name="chevron-right" size={20} />
		</Container>
	);
};

export default Menubar;
