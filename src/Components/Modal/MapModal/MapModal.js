import React from 'react';
import styled from 'styled-components/native';
import Postcode from '@actbase/react-daum-postcode';
import Icon from 'react-native-vector-icons/Feather';
import {View, Modal} from 'react-native';
import {Platform} from 'react-native';
import WebView from 'react-native-webview';
import {ActivityIndicator} from 'react-native';
import {ColorRed} from '~/Assets/Style/Colors';

const Box = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;

const WebViewBox = styled.View`
	width: 100%;
	height: 360px;
`;

const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: ${Platform.OS === 'ios' ? '60px' : '10px'};
	right: 10px;
`;

const LoadingBox = styled.View`
	flex: 1;
`;

const MapModal = ({isShow, setShow, idx}) => {
	return (
		<Modal
			visible={isShow}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setShow(false)}>
			<Box>
				<WebViewBox>
					<WebView
						style={{flex: 1}}
						source={{uri: `https://onlfoods.com/view/map.php?slt_idx=${idx}`}}
					/>
				</WebViewBox>
			</Box>
			<CloseButton onPress={() => setShow(false)}>
				<Icon name="x" size={24} color="#ffffff" />
			</CloseButton>
		</Modal>
	);
};

export default MapModal;
