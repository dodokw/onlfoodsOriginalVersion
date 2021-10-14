import React from 'react';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import ic_plus from '~/Assets/Images/ic_plus.svg';
import {SvgXml} from 'react-native-svg';

const Container = styled.View`
	position: absolute;
	bottom: ${props => (props.bottom ? props.bottom + 'px' : '10px')};
	right: 20px;
	border-radius: 25px;
	flex-direction: row;
	background-color: #ffffff;
	padding: 5px 10px;
	align-items: center;
`;
const Count = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${ColorRed};
	font-size: 12px;
`;
const All = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #aaaaaa;
	font-size: 12px;
`;

const PlusButton = styled.TouchableOpacity`
	margin-left: 5px;
`;

const BannerIndicator = ({count, all, bottom, onPress}) => {
	return (
		<Container
			bottom={bottom}
			style={{
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				elevation: 6,
			}}>
			<Count>{count === undefined ? 1 : count + 1} </Count>
			<All>/ {all}</All>
			<PlusButton onPress={onPress}>
				<SvgXml xml={ic_plus} />
			</PlusButton>
		</Container>
	);
};

export default BannerIndicator;
