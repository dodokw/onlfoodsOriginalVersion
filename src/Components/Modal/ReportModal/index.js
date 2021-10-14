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
import {APICallReport} from '~/API/MainAPI/MainAPI';
import {Alert} from 'react-native';
import {Keyboard} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const WIDTH = Dimensions.get('screen').width;

const BackTouch = styled.TouchableWithoutFeedback``;
const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
	padding: 150px 20px;
`;
const Box = styled.View`
	width: ${WIDTH - 20}px;
	background-color: #ffffff;
	border-color: ${ColorLineGrey};
	border-radius: 5px;
	overflow: hidden;
`;
const Title = styled.Text`
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	padding: 20px;
	color: ${ColorRed};
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

const Wrap = styled.View`
	padding: 10px 20px;
`;

const SubLabel = styled.Text`
	font-size: 12px;
	color: #000000;
	margin: 5px 0;
`;

const ImageBox = styled.Image`
	width: 120px;
	height: 120px;
	border-width: 1px;
	border-color: #dfdfdf;
	background-color: #dfdfdf;
	justify-content: center;
	align-items: center;
`;

const ImageAddButton = styled.TouchableOpacity`
	width: 120px;
	height: 120px;
	border-width: 1px;
	border-color: #dfdfdf;
	background-color: #dfdfdf;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
	border-radius: 10px;
	overflow: hidden;
`;

const reportOption = {
	user: [
		{key: 1, label: '욕설/비난', value: '1'},
		{key: 2, label: '허위매물', value: '2'},
		{key: 3, label: '거래 불이행', value: '3'},
		{key: 4, label: '기타', value: '4'},
	],
	seller: [
		{key: 1, label: '욕설/비난', value: '1'},
		{key: 2, label: '허위매물', value: '2'},
		{key: 3, label: '채무 불이행', value: '3'},
		{key: 4, label: '기타', value: '4'},
	],
};

const ReportModal = ({visible, setVisible, type, slt_idx, mt_idx}) => {
	const [reportType, setReportType] = useState('');
	const [reportReason, setReportReason] = useState('');
	const [img, setImg] = useState();

	const pickImg = (type, num) => {
		launchImageLibrary(
			{mediaType: 'photo', quality: 0.5, maxHeight: 1000, maxWidth: 1000},
			response => {
				if (response.didCancel) {
					return console.log('취소함');
				} else if (response.error) {
					return console.log(response.error);
				}
				try {
					console.log('Response = ', response.assets);
					const imgs = response.assets[0];
					const imgData = {
						name: imgs.fileName,
						type: imgs.type,
						uri: imgs.uri,
					};
					// You can also display the image using data:
					// const source = { uri: 'data:image/jpeg;base64,' + response.data };
					console.log(imgData);
					setImg(imgData);
				} catch (err) {
					console.log(err);
				}
			},
		);
	};

	const doReport = async () => {
		try {
			const res = await APICallReport(
				slt_idx,
				mt_idx,
				reportType,
				reportReason,
				img,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '신고처리 되었습니다.', [
					{
						text: '확인',
						onPress: () => {
							setReportReason('');
							setImg();
							setVisible(false);
						},
					},
				]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const onCancel = () => {
		if (reportReason === '') {
			setImg();
			setReportReason('');
			setVisible(false);
		} else {
			Alert.alert('알림', '신고 작성을 취소하시겠습니까?', [
				{
					text: '확인',
					onPress: () => {
						setReportReason('');
						setImg();
						setVisible(false);
					},
				},
				{text: '취소'},
			]);
		}
	};

	return (
		<Modal
			animationType="fade"
			visible={visible}
			transparent={true}
			onRequestClose={() => setVisible(false)}>
			<BackTouch onPress={() => Keyboard.dismiss()}>
				<Container>
					<Box>
						<Title>신고사유</Title>
						<View
							style={{
								borderWidth: 1,
								borderColor: ColorLineGrey,
								borderRadius: 5,
								padding: 10,
								marginHorizontal: 20,
								height: 50,
							}}>
							<RNPickerSelect
								items={reportOption[type]}
								onValueChange={value => setReportType(value)}
								placeholder={{key: 0, label: '사유 선택', value: '없음'}}
								fixAndroidTouchableBug={true}
								doneText="확인"
								style={{
									inputIOSContainer: {
										flexDirection: 'row',
										position: 'relative',
										height: '100%',
										paddingLeft: 10,
									},
									inputIOS: {
										position: 'relative',
										width: '100%',
										fontSize: 15,
										fontFamily: FONTNanumGothicRegular,
										paddingRight: 20,
									},
									inputAndroidContainer: {
										flexDirection: 'row',
										position: 'relative',
										height: '100%',
										paddingLeft: 10,
										alignItems: 'center',
									},
									inputAndroid: {
										position: 'relative',
										width: '100%',
										fontSize: 15,
										height: 35,
										fontFamily: FONTNanumGothicRegular,
										color: '#000000',
										padding: 0,
										paddingRight: 20,
									},
									iconContainer: {top: 6},
								}}
								Icon={() => <Icon name="chevron-down" size={20} />}
								useNativeAndroidPickerStyle={false}
							/>
						</View>
						{/* <ModalDropdown
						
						defaultValue="사유를 선택해주세요."
						defaultTextStyle={{
							color: ColorLineGrey,
							fontFamily: FONTNanumGothicRegular,
							fontSize: 15,
						}}
						textStyle={{fontFamily: FONTNanumGothicRegular, fontSize: 15}}
						dropdownStyle={{width: '100%'}}
						dropdownTextStyle={{
							fontFamily: FONTNanumGothicRegular,
							fontSize: 15,
						}}
						options={reportOption[type]}
						onSelect={(index, option) => setReportType(option)}
					/> */}
						<ReportInput
							placeholder="자세한 사유를 입력해주세요."
							placeholderTextColor={ColorLineGrey}
							multiline={true}
							style={{textAlignVertical: 'top'}}
							value={reportReason}
							onChangeText={text => setReportReason(text)}
						/>
						<Wrap>
							<SubLabel>*필요시 이미지를 한 장 첨부할 수 있습니다.</SubLabel>
							<ImageAddButton onPress={() => pickImg('main')}>
								{img === undefined ? (
									<Icon name="plus" size={20} />
								) : (
									<ImageBox source={{uri: img.uri}} />
								)}
							</ImageAddButton>
						</Wrap>
						<ButtonWrap>
							<ReportButton
								style={{
									borderRightWidth: 1,
									borderColor: ColorLineGrey,
									backgroundColor: ColorRed,
								}}
								onPress={doReport}>
								<ReportButtonLabel
									style={{
										color: '#ffffff',
									}}>
									신고하기
								</ReportButtonLabel>
							</ReportButton>
							<ReportButton onPress={onCancel}>
								<ReportButtonLabel>취소하기</ReportButtonLabel>
							</ReportButton>
						</ButtonWrap>
					</Box>
				</Container>
			</BackTouch>
		</Modal>
	);
};

export default ReportModal;
