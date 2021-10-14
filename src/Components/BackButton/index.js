import React from 'react';
import styled from 'styled-components/native';

const Container = styled.TouchableOpacity``;

const Image = styled.Image`
	width: 25px;
	height: 25px;
`;

const BackButton = ({onPress}) => {
	return (
		<Container onPress={onPress}>
			<Image source={require('~/Assets/Images/back_btn.png')} />
		</Container>
	);
};

export default BackButton;
