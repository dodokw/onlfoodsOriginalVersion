import React from 'react';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';

const Button = styled.TouchableOpacity`
	width: 100%;
	height: 50px;
	background-color: ${props => (props.color ? props.color : ColorRed)};
	border-radius: ${props => (props.radius ? props.radius + 'px' : '0px')};
	justify-content: center;
	align-items: center;
`;
const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
	color: #ffffff;
`;

const LongButton = ({text, onPress, color, disabled, radius}) => {
	return (
		<Button color={color} onPress={onPress} disabled={disabled} radius={radius}>
			<ButtonLabel>{text}</ButtonLabel>
		</Button>
	);
};

export default LongButton;
