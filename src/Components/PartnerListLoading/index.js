import React from 'react';
import {Text, View, Modal} from 'react-native';
import LoadingSpinner from '../LoadingSpinner/index'

const PartnerListLoading = (visible, setVisible) => {
    return(
        <Modal visible={visible} setVisible={setVisible} transparent={true} animationType='fade'>
        <View>
            <Text>[비즈맴버]</Text>
            <Text>내 친구들을 불러오는 중입니다. 잠시만 기다려주세요.</Text>
            <LoadingSpinner/>
        </View>
        </Modal>
    )
}

export default PartnerListLoading;