import React, {useState} from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/core';

const Container = styled.View`
	flex: 1;
	background-color: #ebebeb;
	padding: 20px 10px;
	overflow:hidden;
`;
const FooterWrap = styled.View`
	flex-direction:row;
`;

const TermWrap = styled.View`
	flex-direction:row;
	justify-content:center;
	margin-bottom:10px;
`;
const TermNav=styled.TouchableOpacity``;
const TermLabel=styled.Text`
	font-size:12px;
	padding:0 5px;
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
const Copy = styled.Text`
	font-size : 10px;
	color:#888;
`;

const Footer = ({item}) => {
	const navigation = useNavigation();
	const goTerms = async type => {
		console.log(type);
		return navigation.navigate('Terms', {type});
	};
	
	const [footerOpen, setFooterOpen]=useState(false);
	const text = `상호명  ${item.st_company_name2}
대표자 ${item.st_company_boss}
개인정보보호책임자 ${item.st_privacy_admin}
사업자등록번호 ${item.st_company_num1}
통신판매업 신고번호 ${item.st_company_num2}
${item.st_company_add}
고객센터 ${item.st_customer_tel}  |  Fax ${item.st_customer_fax}
`;
	return (
		<Container>
			<TermWrap>
				<TermNav onPress={() => goTerms(1)}><TermLabel>이용약관</TermLabel></TermNav>
				<TermNav onPress={() => goTerms(2)}><TermLabel>개인정보처리방침</TermLabel></TermNav>
				<TermNav onPress={() => goTerms(3)}><TermLabel>위치기반서비스이용약관</TermLabel></TermNav>
				<TermNav onPress={() => goTerms(4)}><TermLabel>마케팅활용동의</TermLabel></TermNav>
			</TermWrap>
			<FooterWrap>
			<Title>{item.st_company_name}</Title>
			<Icon
							name={footerOpen ? 'chevron-up' : 'chevron-down'}
							size={15}
							onPress={() => setFooterOpen(!footerOpen)}
						/>
			</FooterWrap>
			{footerOpen && (
			<Content>{text}</Content>
			)}
			<Copy>COPYRIGHT © 2021 FOODINUS LTD ALL RIGHTS RESERVED.</Copy>
		</Container>
	);
};

export default Footer;
