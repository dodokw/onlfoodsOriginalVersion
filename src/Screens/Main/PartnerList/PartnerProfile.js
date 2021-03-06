import React, {useEffect, useState} from 'react';
import {Text, View, Button, Alert, Modal, Image} from 'react-native'
import { APICallOrderStart, APICallOrderStart2 } from '~/API/MainAPI/MainAPI';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';
import styled from 'styled-components/native';
import {FONTNanumGothicRegular,FONTNanumGothicBold } from '~/Assets/Style/Fonts';
import PartnerList from './PartnerList';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { testURL } from '~/API/default';

const Container = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.7);
	justify-content: center;    
`;
const InfoTitle=styled.Text`
    padding:5px;
`;
const TopWrap = styled.View`
    flex-direction:row;
    justify-content:space-between;
`;
const CloseButton = styled.TouchableOpacity``;
const CloseLabel = styled.Text`
    font-size:18px;
    padding:5px;
    font-family:${FONTNanumGothicBold};
`;
const ProfileBox = styled.View `
    width:100%;
    background-color:#ffffff;
    border-top-left-radius: 40px;
    padding: 15px 15px 10px;
    position:absolute;
    bottom:0
`;

const ProfileInfo = styled.View`
    flex-direction:row;
    align-items:center;
    margin-bottom:5px;
`;
const ImgBox=styled.View`
    width: 80px;
    height: 80px;

    justify-content: center;
    align-items: center;
    margin:10px;
`;
const ProfileImg=styled.Image`

`;
const InfoWrap=styled.View`
    padding: 0 10px;
`;
const CompanyName=styled.Text`
    font-size : 16px;
    margin-bottom:7px;
    font-family: ${FONTNanumGothicRegular};
`;
const CompanyNum=styled.Text`
font-family: ${FONTNanumGothicRegular};
    color:#333333;
`;


const ButtonWrap = styled.View`
    flex-direction:row;
    justify-content:space-around;
    padding-bottom:12px;
`;
const ButtonBox= styled.TouchableOpacity`
    width:45%;
    padding: 10px 20px;
    background-color : #ec636b;
`;
const ButtonBox2= styled.TouchableOpacity`
    width:45%;
    padding: 10px 20px;
    background-color : #adb5bd;
`;
const ButtonLabel=styled.Text`
    color:#ffffff;
    text-align:center;
    font-family: ${FONTNanumGothicRegular};
`;

    // console.log(data.item);

    const PartnerProfile = ({data,type,visible, setVisible}) => {
    // const PartnerProfile = ({navigation, route,visible, setVisible}) => {
    
    const [loadingData, setLoadingData] = useState(false);
    // console.log(route.params);
    const user = useSelector(state => state.loginReducer.user.mt_info);
    // console.log(user);
    const slt_idx = data.idx;
    // console.log(slt_idx);
    // // const address_name = route.params.items.addr;
    // // const sangse =  route.params.items.addr2;
    // // const zip = 0;
    const location = {
        address_name:data.addr,
        sangse:data.addr2,
        zip: 0,
    }
    console.log(location);
    const [chatIdx, setChatIdx] = useState();

    //?????????????????? ????????? ?????? ???????????? ????????? ??????
    const getChattingIdx = async () => {
        try{
            const form = new FormData();
            console.log('user.mt_idx = '+ user.mt_idx);
            console.log('slt_idx = '+ slt_idx);
            form.append('userIdx', user.mt_idx);
            form.append('slt_idx', slt_idx);
            const res = await axios.post(testURL+'newChatting.php', form);
            if(res.data[0].idx !== null && res.data[0].idx !== undefined){
                console.log(res.data[0].idx+"<- ?????????????????? ????????????????????????.");
                setChatIdx(res.data[0].idx);
            }
        }catch(err){
            console.log(err);
        }
        
    }

     useEffect(async() => {
         getChattingIdx();
     }, [data])

    // // console.log(location);
    // // console.log(location.address_name); 
    // // console.log(location.sangse);
    // // console.log(location.zip);

    // //?????? ???????????? ???????????????. ????????? ?????????????????????.
    // console.log(route.params.item.company_num);
    // console.log(route.params.item.img);
    // console.log(route.params.item.name);
    const stopOrderlist = true;

    // const company_num = route.params.item.company_num;
    // const name = route.params.item.name;
    // const img = route.params.item.img;

    // const [company_num, setCompany_num]=useState();
    // const [name, setName]=useState();
    // const [img, setImg]=useState();


    // setCompany_num(data.item.company_num);
    // setName(data.item.name);
    // setImg(data.item.img);
    
    const company_num=data.company_num;
    const name=data.name;
    const p_name=data.p_name;
    const img=data.img;    
    const company_position = data.company_position;
    const hp = data.hp;

    const navigation = useNavigation();
    // const company_num=data.item.company_num;
    // const name=data.item.name;
    // const img=data.item.img;    

   



    // 	const goChatting = async () => {
	// 	setLoadingData(true);
	// 	try {
	// 		const res = await APICallOrderStart(
	// 			user.mt_idx,
	// 			slt_idx,
	// 			'',
	// 			[{pt_idx: '1', pt_qty: '1'}],
	// 			location,
	// 		);
	// 		if (res.result === 'true') {
	// 			const decode = jwtDecode(res.jwt);
    //             // navigation.goBack();
	// 			navigation.navigate('ChattingNav', {
	// 				screen: 'ChattingPage',
	// 				params: {chatID: decode.data.chat_idx},
	// 				initial: false,
	// 			});
	// 		}
	// 	} catch (err) {
	// 		Alert.alert('??????', err.message, [
	// 			{text: '??????', onPress: () => navigation.goBack()},
	// 		]);
	// 	}
	// 	setLoadingData(false);
	// };

    const twoFunc = () => {
        setVisible(false);
        //chatting ??????????????? ???????????? ??????.
        navigation.push('ChattingPage', {
            chatID: chatIdx,
            otherImg: img,
            otherName: name,
            seller_idx: slt_idx,
            user_idx: user.mt_idx,
        });
    }


    const goChatting = async () => {
        setVisible(false);
		try {
			navigation.navigate('DeliverPickupDetail', {
				slt_idx: slt_idx,
				before: 'PartnerProfile',
			});
		} catch (err) {
			Alert.alert('??????', err.message, [
				{text: '??????', onPress: () => navigation.goBack()},
			]);
		}
	};

    const twoFunc2 = () => {
        goChatting();
        setVisible(false);
    }

    return(
        <Modal visible={visible} setVisible={setVisible} transparent={true} animationType='fade'>
        <Container>
            <ProfileBox>

            <TopWrap>
                <InfoTitle>???????????????</InfoTitle>
                <CloseButton onPress={()=>setVisible(false)}><CloseLabel >X</CloseLabel></CloseButton>
            </TopWrap>


                <ProfileInfo>
                    <ImgBox>
                        {/* <ProfileImg source={{uri: 'https://onlfoods.com/images/uploads/member61413bc178c6d.jpg'}}/> */}
                        <Image
					// require('~/Assets/Images/foodinus.png')
					source={{uri: 'https://onlfoods.com/images/uploads/'+img}}
					style={{

						resizeMode: 'cover',
						width: 80,
						height: 80,
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 30,
						borderWidth: 1,
						borderColor: '#dfdfdf'
					  }}
					resizeMode="cover"
				/>
                    </ImgBox>

                    {type===0 &&
                    <InfoWrap>
                    <CompanyName>?????? : {name}</CompanyName>
                    {/* <CompanyNum>????????? : {company_position}</CompanyNum> */}
                    <CompanyNum>??????????????? : {company_num}</CompanyNum>
                    </InfoWrap>
                    }
                    {type===1 &&
                    <InfoWrap>
                    <CompanyName>?????? : {name}</CompanyName>
                    <CompanyNum>?????? : {company_position}</CompanyNum>
                    <CompanyNum>????????? : {hp}</CompanyNum>
                    </InfoWrap>
                    }
                    {type===2 &&
                    <InfoWrap>
                    <CompanyName>????????? : {name}</CompanyName>
                    <CompanyNum>?????? : {company_position}</CompanyNum>
                    <CompanyNum>??????????????? : {company_num}</CompanyNum>
                    <CompanyNum>????????? : {hp}</CompanyNum>
                    </InfoWrap>
                    }
                    
                </ProfileInfo>
            {type===0 &&
            <ButtonWrap>
            {user.mt_level == 5 ?
            <ButtonBox onPress={() =>goChatting()}>
                <ButtonLabel>???????????????</ButtonLabel>
            </ButtonBox>
            :<ButtonBox onPress={() =>Alert.alert('???????????? ??????','???????????? ???????????????. ????????? ??????????????????.',[
                {
                  text: "??????"
                },
              ])}>
            <ButtonLabel>???????????????</ButtonLabel>
        </ButtonBox>}
            <ButtonBox onPress={() => twoFunc()}>
                <ButtonLabel>???????????????</ButtonLabel>
            </ButtonBox>
        </ButtonWrap>
            }
            {type===1 &&
            <ButtonWrap>
            {data.company_type==2 && data.company_status==1 ?
                <ButtonBox onPress={() =>goChatting()}>
                    <ButtonLabel>????????????</ButtonLabel>
                </ButtonBox>
                :<ButtonBox2 disabled={true}>
                <ButtonLabel>????????????</ButtonLabel>
            </ButtonBox2>}
    
                <ButtonBox onPress={() => twoFunc()}>
                    <ButtonLabel>????????????</ButtonLabel>
                </ButtonBox>
            </ButtonWrap>
        }
        {type===2 &&
             <ButtonWrap>
             {data.company_type==2 && data.company_status==1 ?
                 <ButtonBox onPress={() =>goChatting()}>
                     <ButtonLabel>????????????</ButtonLabel>
                 </ButtonBox>
                 :<ButtonBox2 disabled={true}>
                 <ButtonLabel>????????????</ButtonLabel>
             </ButtonBox2>}
                <ButtonBox onPress={() => twoFunc()}>
                    <ButtonLabel>????????????</ButtonLabel>
                </ButtonBox>
            </ButtonWrap>
        }
            </ProfileBox>


        </Container>
        </Modal>
    )
}
export default PartnerProfile;

