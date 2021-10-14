import React from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';

const Container = styled.View`
	flex-direction: row;
	height: 50px;
	align-items: center;
	justify-content: space-between;
	background-color: #ffffff;
	border-bottom-width: ${props => (props.border ? '1px' : '0px')};
	border-color: #dfdfdf;
	padding: 0px 10px;
	position: ${props => (props.absolute ? 'absolute' : 'relative')};
	top: 0;
	left: 0;
	right: 0;
`;
const HeaderLeftWrap = styled.View`
	flex: 1;
	justify-content: center;
	align-items: flex-start;
`;
const HeaderRightWrap = styled.View`
	flex: 1;
	justify-content: center;
	align-items: flex-end;
`;

const HeaderWrap = styled.View`
	flex: 1;
	justify-content: center;
`;
const HeaderTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	text-align: center;
`;

const Header = ({title, headerLeft, headerRight, border, absolute}) => {
	return (
		<Container border={border} absolute={absolute}>
			<HeaderLeftWrap>{headerLeft}</HeaderLeftWrap>
			<HeaderWrap>
				<HeaderTitle>{title}</HeaderTitle>
			</HeaderWrap>
			<HeaderRightWrap>{headerRight}</HeaderRightWrap>
		</Container>
	);
};

export default Header;
