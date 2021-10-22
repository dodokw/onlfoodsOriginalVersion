import React from "react";
import styled from "styled-components/native";
import {Image} from 'react-native';

const Container=styled.TouchableOpacity`
    flex:1;
    padding:8px 0;
    border-bottom-width:0.5px;
    border-color:#eee;
`;
const ManagerWrap=styled.View`
    flex-direction:row;
    align-items:center;
`;
const ManagerImage=styled.View`
    position: relative;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    border-width: 1px;
    border-color: #dfdfdf;
`;
const ManagerName=styled.Text`
    padding:0 15px;
`;
const ManagerGrade=styled.Text``;

const ManagerCard =({data, onPress})=>{
return(
    <Container onPress={onPress}>
        <ManagerWrap>
            <ManagerImage>
                <Image
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
            </ManagerImage>
            <ManagerName>{data.name}</ManagerName>
            <ManagerGrade>({data.company_position})</ManagerGrade>
        </ManagerWrap>
    </Container>
)}

export default ManagerCard;