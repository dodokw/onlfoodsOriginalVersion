import React from 'react';
import {ActivityIndicator, Modal} from 'react-native';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
`;

const LoadingModal = ({visible}) => {
	return (
		<Modal visible={visible} transparent={true}>
			<Container>
				<ActivityIndicator size="small" color={ColorRed} />
			</Container>
		</Modal>
	);
};

export default LoadingModal;
