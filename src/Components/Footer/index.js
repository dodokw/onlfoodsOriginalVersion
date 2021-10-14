import React from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';

const Container = styled.View`
	flex: 1;
	background-color: #ebebeb;
	padding: 20px;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: #8f8f8f;
	margin-bottom: 10px;
`;

const Content = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #8f8f8f;
	line-height: 18px;
`;

const Footer = ({item}) => {
	const text = `상호명  ${item.st_company_name2}
대표자 ${item.st_company_boss}
개인정보보호책임자 ${item.st_privacy_admin}
사업자등록번호 ${item.st_company_num1}
통신판매업 신고번호 ${item.st_company_num2}
${item.st_company_add}
고객센터 ${item.st_customer_tel}  |  Fax ${item.st_customer_fax}

COPYRIGHT © 2021 FOODINUS LTD ALL RIGHTS RESERVED.
`;
	return (
		<Container>
			<Title>{item.st_company_name}</Title>
			<Content>{text}</Content>
		</Container>
	);
};

export default Footer;
