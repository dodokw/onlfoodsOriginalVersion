import React from 'react';
import {SvgXml} from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import user_profile from '~/Assets/Images/user_profile.svg';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';

const Container = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	background-color: #ffffff;
	padding: 20px;
	border-bottom-width: 1px;
	border-color: #dfdfdf;
`;
const Wrap = styled.View`
	margin-left: 10px;
`;

const CustomerName = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 18px;
	margin-bottom: 10px;
`;

const CustomerGrade = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #333333;
`;

const CancelButton = styled.TouchableOpacity`
	position: absolute;
	top: 20px;
	right: 20px;
`;

const ImageWrap = styled.View`
	width: 62px;
	height: 62px;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	border-width: 0.5px;
	border-color: #e6ebee;
	border-radius: 50px;
`;

const Image = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
`;

const RegularCustomerCard = ({item, onPress}) => {
	return (
		<Container onPress={onPress}>
			<ImageWrap>
				<Image source={{uri: item.mt_image}} />
			</ImageWrap>
			<Wrap>
				<CustomerName>{item.mt_name}</CustomerName>
			</Wrap>
		</Container>
	);
};

export default RegularCustomerCard;
