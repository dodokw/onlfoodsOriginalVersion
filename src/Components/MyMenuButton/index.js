import React from 'react';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';

const MyMenuButtonContainer = styled.TouchableOpacity`
	align-items: center;
`;

const MyMenuIconBox = styled.View`
	margin-bottom: 10px;
`;

const MyMenuButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const MyMenuButton = ({icon, label, onPress}) => {
	return (
		<MyMenuButtonContainer onPress={onPress}>
			<MyMenuIconBox>{icon}</MyMenuIconBox>
			<MyMenuButtonLabel>{label}</MyMenuButtonLabel>
		</MyMenuButtonContainer>
	);
};

export default MyMenuButton;
