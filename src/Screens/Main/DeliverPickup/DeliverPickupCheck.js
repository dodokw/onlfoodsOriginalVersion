import React, { useEffect, useState } from 'react';
import {Text} from 'react-native';
import { Modal } from 'react-native-paper';
import LoadingSpinner from '~/Components/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const DeliverPickupCheck = ({data, visible, setVisible}) => {
    
    const navigation = useNavigation();
    const [countManager, setCountManager] = useState();
    const [slt_idx, setSlt_idx] = useState();

    useEffect(() => {
        setSlt_idx(data.mt_idx);
    }, [data.mt_idx]);

    

    const getManagerList = async () => {
        try{
        const form = new FormData();
        form.append('slt_idx', slt_idx);
        const res = await axios.post('https://onlfoods.com/api/getManager_list.php', form);
        setCountManager(res.data.length);
        if(res.data.length === 1){
             navigation.navigate('DeliverPickupDetail', {
		     slt_idx: slt_idx,
			 before: 'DeliverPickup',
	     })
         setVisible(false);
         setSlt_idx('');
        }else{
            navigation.navigate('DeliverSelectBeforeDetail', {data: res.data});
            setVisible(false);
            setSlt_idx('');
        }
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        getManagerList();
    }, [slt_idx]);

    return(
        <Modal visible={visible} setVisible={setVisible} transparent={true} animationType='fade'>
            <LoadingSpinner/>
        </Modal>
        
    )
}

export default DeliverPickupCheck;