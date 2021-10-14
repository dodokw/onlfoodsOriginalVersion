import React from 'react';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import ic_refresh from '~/Assets/Images/ic_refresh.svg';

const Container = styled.TouchableOpacity`
	flex-direction: row;
	border-radius: 25px;
	background-color: ${props => (props.onToggle ? '#d0eefe' : '#fed4d6')};
	align-items: center;
	height: 30px;
`;
const Title = styled.Text`
	margin: 5px;
	font-family: ${FONTNanumGothicBold};
	font-size: 13px;
	color: ${props => (props.onToggle ? '#185eba' : '#ec636b')};
	text-align: center;
`;

const Circle = styled.View`
	background-color: #ffffff;
	border-radius: 50px;
	padding: 5px;
	margin: 1px;
	margin-left: ${props => (props.onToggle ? '5px' : '0px')};
	margin-right: ${props => (props.onToggle ? '0px' : '5px')};
`;

const SwitchingButton = ({onToggle, onPress, disabled}) => {
	return (
		<Container onToggle={onToggle} onPress={onPress} disabled={disabled}>
			{onToggle === false && (
				<Title onToggle={onToggle} style={{margin: disabled && 0}}>
					구매
				</Title>
			)}
			{!disabled && (
				<Circle onToggle={onToggle}>
					<SvgXml xml={ic_refresh} width={15} height={15} />
				</Circle>
			)}
			{onToggle === true && <Title onToggle={onToggle}>판매</Title>}
		</Container>
	);
};

export default SwitchingButton;
