// import React, { useEffect, useState } from 'react';
// import {Text} from 'react-native';
// import { Modal } from 'react-native-paper';
// import LoadingSpinner from '~/Components/LoadingSpinner';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { useIsFocused } from '@react-navigation/core';

// const DeliverPickupCheck = ({data, visible, setVisible}) => {
    
//     const navigation = useNavigation();
//     const [countManager, setCountManager] = useState();
//     const [slt_idx, setSlt_idx] = useState();
//     const isFocused = useIsFocused();

//     useEffect(() => {
//         setSlt_idx(data.mt_idx);
//     }, [data.mt_idx]);


    

//     const getManagerList = async () => {
//         try{
//         const form = new FormData();
//         form.append('slt_idx', slt_idx);
//         const res = await axios.post('https://onlfoods.com/api/getManager_list.php', form);
//         setCountManager(res.data.length);
//         console.log(res.data);
//         if(res.data.length === 1){
//              navigation.navigate('DeliverPickupDetail', {
// 		     slt_idx: slt_idx,
// 			 before: 'DeliverPickup',
// 	     })
//          setVisible(false);
//          setSlt_idx('');
//         }else{
//             navigation.push('DeliverSelectBeforeDetail', {data: res.data});
//             setVisible(false);
//             setSlt_idx('');
//         }
//         }catch(err){
//             console.log(err+'에러발생구역-------------------------------------------------------');
//         }
//     }

//     return(
//             <LoadingSpinner/>
//     )
// }

// export default DeliverPickupCheck;