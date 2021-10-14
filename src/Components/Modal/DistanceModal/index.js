import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import {Modal} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorLowRed, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {setDistance} from '~/Modules/Action';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
	justify-content: flex-end;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.5);
`;
const Box = styled.View`
	width: 100%;
	height: 200px;
	background-color: #ffffff;
	padding: 10px;
	border-top-left-radius: 30px;
	border-top-right-radius: 30px;
`;

const Wrap = styled.View`
	flex-direction: row;
	margin: 10px 0;
	align-items: center;
	justify-content: center;
`;

const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
	text-align: center;
`;

const DistanceInput = styled.TextInput`
	width: 40px;
	font-size: 18px;
	color: #000000;
	font-family: ${FONTNanumGothicBold};
`;

const DistanceLabel = styled.Text`
	font-size: 18px;
	text-align: center;
	font-family: ${FONTNanumGothicBold};
`;

const DistanceButton = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`;
const Label = styled.Text`
	margin-left: 5px;
	font-family: ${FONTNanumGothicRegular};
`;

const ButtonWrap = styled.View`
	flex: 1;
	flex-direction: row;
`;
const Button = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const ButtonLabel = styled.Text`
	font-size: 18px;
	color: ${props => (props.color ? props.color : '#000000')};
	font-family: ${FONTNanumGothicBold};
`;

const DistanceModal = ({isShow, setIsShow}) => {
	const distance = useSelector(state => state.dataReducer.distance);
	const dispatch = useDispatch();
	const [nowDistance, setNowDistance] = useState(0);

	const setDistanceInModal = text => {
		const num = parseInt(text);
		if (num > 100) {
			setNowDistance(100);
		} else if (num > 0) {
			setNowDistance(num);
		} else {
			setNowDistance('');
		}
	};

	const confirmAction = () => {
		if (nowDistance === '') {
			return Alert.alert('알림', '거리를 설정해주세요.', [{text: '확인'}]);
		}
		setIsShow(false);
		dispatch(setDistance(nowDistance));
	};

	useEffect(() => {
		setNowDistance(distance);
	}, []);

	return (
		<Modal animationType="fade" visible={isShow} transparent={true}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
					<Box>
						<Title>내 주변 반경 설정</Title>
						<Wrap>
							<DistanceInput
								value={String(nowDistance)}
								onChangeText={text =>
									setDistanceInModal(
										text.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1'),
									)
								}
								keyboardType="number-pad"
							/>
							<DistanceLabel>km</DistanceLabel>
						</Wrap>
						<Slider
							style={{marginVertical: 10, height: 30}}
							minimumValue={1}
							maximumValue={100}
							minimumTrackTintColor={ColorRed}
							maximumTrackTintColor={ColorLowRed}
							thumbTintColor={ColorRed}
							value={nowDistance ? nowDistance : 1}
							step={5}
							onValueChange={value => {
								if (value > 0 && value < 97) setNowDistance(value - 1);
								else setNowDistance(value);
							}}
						/>

						<ButtonWrap>
							<Button onPress={confirmAction}>
								<ButtonLabel>적용</ButtonLabel>
							</Button>
							<Button onPress={() => setIsShow(false)}>
								<ButtonLabel color={ColorRed}>취소</ButtonLabel>
							</Button>
						</ButtonWrap>
					</Box>
				</Container>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default DistanceModal;
