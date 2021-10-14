import React from "react";
import styled from "styled-components/native";
import {Image} from 'react-native';
import {SvgXml} from 'react-native-svg';
import user_profile from '~/Assets/Images/user_profile.svg';
import { FONTNanumGothicRegular } from "~/Assets/Style/Fonts";

const Container = styled.TouchableOpacity`
    flex-direction : row;
    margin : 10px 0;
	align-items: center;
`;
const ImageBox = styled.View`
	position: relative;
	width: 40px;
	height: 40px;
	align-items: center;
	justify-content: center;
	border-radius: 30px;
	border-width: 1px;
	border-color: #dfdfdf;
`;

const InfoWrap=styled.View`
    flex:1;
    flex-direction: row;
    align-items: center;
    margin: 0 10px;
`;
const CompanyWrap=styled.View`
    flex:1;
    justify-content:center;
`;
const CompanyName=styled.Text`
`;
const CompanyNum=styled.Text`
    font-size: 12px;
    color:#777777;
`;
const UserId=styled.Text`
    
`;


const PartnerCard = ({data, onPress})=>{
    return(
        <Container onPress={onPress}>
            <ImageBox>
            {/* <Image source={{uri: data.img}} resizeMode="cover" /> */}
            <Image
					// require('~/Assets/Images/foodinus.png')
					source={{uri: 'https://onlfoods.com/images/uploads/'+data.img}}
					style={{

						resizeMode: 'cover',
						width: 40,
						height: 40,
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 30,
						borderWidth: 1,
						borderColor: '#dfdfdf'
					  }}
					resizeMode="cover"
				/>
            </ImageBox>
            <InfoWrap>
                <CompanyWrap>
                    <CompanyName>{data.name}{data.company_position === undefined ? '' : '('+data.company_position+')'}</CompanyName>
                    <CompanyNum>{data.p_name === undefined ? '' : data.p_name+': '}{data.hp}</CompanyNum>
                </CompanyWrap>
                {/* <UserId>{data.id}</UserId> */}
            </InfoWrap>
        </Container>
    )
}

export default PartnerCard;