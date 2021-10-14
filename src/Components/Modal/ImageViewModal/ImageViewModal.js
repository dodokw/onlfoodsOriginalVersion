import React from 'react';
import styled from 'styled-components/native';
import Postcode from '@actbase/react-daum-postcode';
import Icon from 'react-native-vector-icons/Feather';
import {View, Modal} from 'react-native';
import {Platform} from 'react-native';

const ImageBox = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;
const BigImage = styled.Image`
	width: 100%;
	height: 80%;
`;

const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: ${Platform.OS === 'ios' ? '60px' : '10px'};
	right: 10px;
`;

const ImageViewModal = ({isShow, setShow}) => {
	return (
		<Modal
			visible={isShow !== ''}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setShow('')}>
			<ImageBox>
				<BigImage
					source={{
						uri: isShow,
					}}
					resizeMode="contain"
				/>
			</ImageBox>
			<CloseButton onPress={() => setShow('')}>
				<Icon name="x" size={24} color="#ffffff" />
			</CloseButton>
		</Modal>
	);
};

export default ImageViewModal;
