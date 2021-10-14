import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import {ColorLineGrey} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
`;
const Box = styled.View`
	width: 70%;
	background-color: #ffffff;
`;
const TextWrap = styled.View`
	justify-content: center;
	align-items: center;
	padding: 20px 10px;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
	margin: 5px 0px;
`;
const SubText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7c7c7c;
	text-align: center;
`;

const ButtonWrap = styled.View`
	flex-direction: row;
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
`;

const Button = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 20px;
`;
const CancelLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
`;
const ConfirmLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
`;

const CustomModal = ({
	visible,
	setVisible,
	title,
	subText,
	cancelLabel,
	cancelAction,
	confirmLabel,
	confirmAction,
}) => {
	return (
		<Modal visible={visible} transparent={true}>
			<Container>
				<Box>
					<TextWrap>
						<Title>{title}</Title>
						{subText && <SubText>{subText}</SubText>}
					</TextWrap>
					<ButtonWrap>
						<Button onPress={confirmAction}>
							<ConfirmLabel>{confirmLabel}</ConfirmLabel>
						</Button>
						{cancelLabel && (
							<Button onPress={cancelAction}>
								<CancelLabel>{cancelLabel}</CancelLabel>
							</Button>
						)}
					</ButtonWrap>
				</Box>
			</Container>
		</Modal>
	);
};

export default CustomModal;
