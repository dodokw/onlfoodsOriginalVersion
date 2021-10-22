import React, { useEffect, useState } from 'react';
import {Text, View, FlatList, Alert} from 'react-native';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import axios from 'axios';
import LoadingSpinner from '~/Components/LoadingSpinner';
import { useIsFocused } from '@react-navigation/core';
import PartnerCard from '~/Components/PartnerCard/PartnerCard';

const DeliverSelectBeforeDetail = ({route, navigation}) => {

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
    //     if(res.data.length === 1){
    //          navigation.navigate('DeliverPickupDetail', {
	// 	     slt_idx: slt_idx,
	// 		 before: 'DeliverPickup',
	//      })
    //     }
    //     setData(res.data);
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    const datacheck = () => {
        try{
            setDataMap(
                data.map(({mt_idx, mt_name, slt_company_boss, mt_image1}) => ({
                   idx: mt_idx,
                   name: mt_name,
                   company_position: slt_company_boss,
                   img: mt_image1
                  }))
             );
        }catch(err){
            console.log(err);
        }
         console.log("실행확인");
    }

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