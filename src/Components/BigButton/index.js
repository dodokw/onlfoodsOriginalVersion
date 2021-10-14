import React from 'react';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';

const BigButtonBox = styled.TouchableOpacity`
	flex: 1;
	border-radius: ${props => (props.radius ? '5px ' : '0px')};
	background-color: ${ColorRed};
	align-items: center;
	justify-content: center;
`;

const BigButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const BigButton = ({label, onPress}) => {
	return (
		<BigButtonBox onPress={onPress}>
			<BigButtonLabel>{label}</BigButtonLabel>
		</BigButtonBox>
	);
};

export default BigButton;
