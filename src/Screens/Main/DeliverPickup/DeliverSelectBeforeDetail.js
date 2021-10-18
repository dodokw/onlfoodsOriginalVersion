import React, { useEffect, useState } from 'react';
import {Text, View, FlatList, Alert, LogBox} from 'react-native';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import axios from 'axios';
import LoadingSpinner from '~/Components/LoadingSpinner';
import { useIsFocused } from '@react-navigation/core';
import PartnerCard from '~/Components/PartnerCard/PartnerCard';

const DeliverSelectBeforeDetail = ({route, navigation}) => {

    // const {slt_idx} = route.params;
    // const [data, setData] = useState([]);
    const {data} = route.params;
    const [dataMap, setDataMap] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countManager, setCountManager] = useState();
    const isFocused = useIsFocused();

    // const getManagerList = async () => {
    //     setLoading(true);
    //     try{
    //     const form = new FormData();
    //     form.append('slt_idx', slt_idx);
    //     const res = await axios.post('https://onlfoods.com/api/getManager_list.php', form);
    //     // console.log(res.data); //데이터 체크
    //     // console.log(res.data.length);
    //     setCountManager(res.data.length);
    //     setData(res.data);
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    const datacheck = () => {
        try{
            setDataMap(
                data.map(({mt_idx, mt_name, slt_company_boss}) => ({
                   idx: mt_idx,
                   name: mt_name,
                   company_position: slt_company_boss
                  }))
             );
        }catch(err){
            console.log(err);
        }
         console.log("실행확인");
    }

    useEffect(() => {
    LogBox.ignoreLogs(['Each child in a list should have a unique']);
    })

    // useEffect(() => {
    //     getManagerList();
    //     setLoading(false);
    // }, [isFocused])

    useEffect(() => {
        datacheck();
    }, [data])

    return(
        <View>
            <Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title={'매니저 선택창'}
				border
			/>
            <Text>매니저의 숫자: {data.length}</Text>
            {loading ? (<LoadingSpinner/>) :(
            <FlatList
            style={{paddingHorizontal: 20}}
            contentContainerStyle= {{paddingBottom: 50}}
            data={dataMap}
            keyExtractor={item => {item.mt_idx}}
            renderItem={({item}) => (
                <PartnerCard
                    data={item}
                    onPress={()=>  navigation.navigate('DeliverPickupDetail', {
                         	slt_idx: item.idx,
                         	before: 'DeliverPickup',
                         })}
                />
            )}
            bounces={false}
        />
            )} 
            

        </View>
    )
}

export default DeliverSelectBeforeDetail;


// import React, {useEffect, useState} from 'react';
// import {Text, View, FlatList, Alert, LogBox, Image} from 'react-native';
// import styled from 'styled-components/native';
// import Header from '~/Components/Header';
// import BackButton from '~/Components/BackButton';
// import axios from 'axios';
// import LoadingSpinner from '~/Components/LoadingSpinner';
// import {useIsFocused} from '@react-navigation/core';
// import PartnerCard from '~/Components/PartnerCard/PartnerCard';

// const Container = styled.View`
// 	flex: 1;
// 	background-color: #fff;
// `;
// const ContentWrap = styled.View`
        
// `;
// const ManagerListWrap = styled.View`
    
// `;
// const ManagerListTop=styled.View`
//     padding:5px 10px;
// `;
// const ManagerCount = styled.Text`
//     text-align:right;
// `;

// const ManagerList = styled.TouchableOpacity`
//     flex-direction:row;
//     padding:10px 0;
//     align-items:center;
	
// `;
// const ManagerImage= styled.View`
//     position: relative;
//     width: 40px;
//     height: 40px;
//     align-items: center;
//     justify-content: center;
//     border-radius: 30px;
//     border-width: 1px;
//     border-color: #dfdfdf;
// `;

// const ManagerName = styled.Text`
//     padding : 0 10px;
// `;
// const ManagerPosition=styled.Text``;


// const DeliverSelectBeforeDetail = ({route, navigation}) => {
// 	// const {slt_idx} = route.params;
// 	// const [data, setData] = useState([]);
// 	const {data} = route.params;
// 	const [dataMap, setDataMap] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [countManager, setCountManager] = useState();
// 	const isFocused = useIsFocused();

// 	// const getManagerList = async () => {
// 	//     setLoading(true);
// 	//     try{
// 	//     const form = new FormData();
// 	//     form.append('slt_idx', slt_idx);
// 	//     const res = await axios.post('https://onlfoods.com/api/getManager_list.php', form);
// 	//     // console.log(res.data); //데이터 체크
// 	//     // console.log(res.data.length);
// 	//     setCountManager(res.data.length);
// 	//     setData(res.data);
// 	//     }catch(err){
// 	//         console.log(err);
// 	//     }
// 	// }

// 	const datacheck = () => {
// 		try {
// 			setDataMap(
// 				data.map(({mt_idx, mt_image1, mt_name, slt_company_boss}) => ({
// 					idx: mt_idx,
//                     company_image: mt_image1,
// 					name: mt_name,
// 					company_position: slt_company_boss,
// 				})),
// 			);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 		console.log('실행확인');
// 	};

// 	useEffect(() => {
// 		LogBox.ignoreLogs(['Each child in a list should have a unique']);
// 		console.log(data);
// 	});

// 	// useEffect(() => {
// 	//     getManagerList();
// 	//     setLoading(false);
// 	// }, [isFocused])

// 	useEffect(() => {
// 		if(isFocused){
// 			datacheck();
// 		}
// 	}, [isFocused]);

// 	return (
// 		<Container>
// 			<Header
// 				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
// 				title={data[0].slt_company_name + ' 담당자'}
// 				border
// 			/>
// 			<ContentWrap>
// 				<ManagerListWrap>
//                     <ManagerListTop>
// 					<ManagerCount>담당자 인원: {data.length}</ManagerCount>
// 					</ManagerListTop>
// 						{loading ? (
// 							<LoadingSpinner />
// 						) : (
// 							<FlatList
// 								style={{paddingHorizontal: 20}}
// 								contentContainerStyle={{paddingBottom: 50}}
// 								data={dataMap}
// 								keyExtractor={item => {
// 									item.mt_idx;
// 								}}
// 								renderItem={({item}) => (
//                                     <ManagerList onPress={() =>
//                                         navigation.navigate('DeliverPickupDetail', {
//                                             slt_idx: item.idx,
//                                             before: 'DeliverPickup',
//                                         })
//                                     }>
// 									<ManagerImage>
// 										<Image
// 											// require('~/Assets/Images/foodinus.png')
// 											source={{
// 												uri: 'https://onlfoods.com/images/uploads/' + item.company_image,
// 											}}
// 											style={{
// 												resizeMode: 'cover',
// 												width: 40,
// 												height: 40,
// 												alignItems: 'center',
// 												justifyContent: 'center',
// 												borderRadius: 30,
// 												borderWidth: 1,
// 												borderColor: '#dfdfdf',
// 											}}
// 											resizeMode="cover"
// 										/>
// 									</ManagerImage>
                                    
//                                     <ManagerName><Text>이름 : </Text>{item.name}</ManagerName>
//                                     <ManagerPosition>({item.company_position})</ManagerPosition>
                                    
//                                     </ManagerList>
                                    
// 						)}
// 					/>)}
// 				</ManagerListWrap>
// 			</ContentWrap>
// 		</Container>
// 	);
// };

// export default DeliverSelectBeforeDetail;
