import React from 'react';
import {Dimensions, Modal, View} from 'react-native';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';
import {Alert} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';

const WIDTH = Dimensions.get('screen').width;

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
`;
const Box = styled.View`
	width: ${WIDTH - 20}px;
	background-color: #ffffff;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	border-radius: 5px;
`;
const Title = styled.Text`
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	padding: 20px;
`;
const ReportInput = styled.TextInput`
	border-color: ${ColorLineGrey};
	border-width: 1px;
	border-radius: 5px;
	padding: 10px;
	height: 200px;
	margin: 10px 20px;
	font-size: 15px;
	color: #000000;
`;
const ButtonWrap = styled.View`
	flex-direction: row;
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
`;
const ReportButton = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 20px;
`;
const ReportButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
`;

const reportOption = {
	user: [
		{key: 1, label: '욕설/비난', value: '욕설/비난'},
		{key: 2, label: '허위매물', value: '허위매물'},
		{key: 3, label: '거래 불이행', value: '거래 불이행'},
		{key: 4, label: '기타', value: '기타'},
	],
	seller: [
		{key: 1, label: '욕설/비난', value: '욕설/비난'},
		{key: 2, label: '허위매물', value: '허위매물'},
		{key: 3, label: '채무 불이행', value: '채무 불이행'},
		{key: 4, label: '기타', value: '기타'},
	],
};

function CancelModal({visible, setVisible, doCancel, setBlock}) {
	const [cancelReason, setCancelReason] = useState('');

	const onCancel = () => {
		if (cancelReason.length < 10) {
			return Alert.alert('알림', '사유는 최소 10자 이상 적어주세요.', [
				{text: '확인'},
			]);
		}
		Alert.alert('알림', '주문을 취소하시겠습니까?', [
			{
				text: '확인',
				onPress: () => {
					if (setBlock) setBlock(true);
					doCancel(cancelReason);
				},
			},
			{text: '취소'},
		]);
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			onRequestClose={() => setVisible(false)}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Container>
					<Box>
						<Title>취소사유</Title>
						<ReportInput
							placeholder="사유를 입력해주세요. (최소 10자 이상)"
							placeholderTextColor={ColorLineGrey}
							multiline={true}
							value={cancelReason}
							onChangeText={text => setCancelReason(text)}
							style={{textAlignVertical: 'top'}}
							maxLength={100}
						/>
						<ButtonWrap>
							<ReportButton
								style={{borderRightWidth: 1, borderColor: ColorLineGrey}}
								onPress={onCancel}>
								<ReportButtonLabel
									style={{
										color: ColorRed,
									}}>
									주문취소
								</ReportButtonLabel>
							</ReportButton>
							<ReportButton onPress={() => setVisible(false)}>
								<ReportButtonLabel>돌아가기</ReportButtonLabel>
							</ReportButton>
						</ButtonWrap>
					</Box>
				</Container>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

export default CancelModal;
