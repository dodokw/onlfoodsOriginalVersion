import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #ffffff;
`;

const LoadingSpinner = () => {
	return (
		<Container>
			<ActivityIndicator size="small" color={ColorRed} />
		</Container>
	);
};

export default LoadingSpinner;
