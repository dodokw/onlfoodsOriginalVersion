import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, Text, Platform, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import SwitchingButton from '~/Components/SwitchingButton';
import ic_add from '~/Assets/Images/ic_add.svg';
import {SvgXml} from 'react-native-svg';
import {
	ColorBlue,
	ColorGreen,
	ColorLineGrey,
	ColorRed,
} from '~/Assets/Style/Colors';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import dayjs from 'dayjs';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {
	APICallTodayInForm,
	APIEnrollEvent,
	APIEnrollStock,
	APIEnrollTodayIn,
	APIModifyTodayIn,
} from '~/API/MyPageAPI/MyPageAPI';
import LoadingModal from '~/Components/LoadingModal/index';
import jwtDecode from 'jwt-decode';
import {set} from 'react-native-reanimated';
import {Checkbox} from 'react-native-paper';
import CodeSearchModal from '~/Components/Modal/CodeSearchModal/CodeSearchModal';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
`;
const TitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin: 10px 0;
`;

const Section = styled.View`
	background-color: #ffffff;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const StockCodeButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;

const StockCodeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
`;

const ImageWrap = styled.View`
	flex-direction: row;
	margin: 10px 0;
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
`;

const ImageDelButton = styled.TouchableOpacity`
	position: absolute;
	top: 10px;
	right: 5px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 50px;
	padding: 5px;
`;

const SubText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #7b7b7b;
`;

const Dive = styled.View`
	height: 1px;
	background-color: #dfdfdf;
	margin: 10px 0;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;
const TextInput = styled.TextInput`
	flex: 1;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	padding: 0;
	color: #000000;
`;

const MultiTextInput = styled.TextInput`
	flex: 1;
	height: 300px;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	color: #000000;
`;

const DateBox = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;

const DateLabel = styled.Text`
	flex: 1;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	padding: 0;
	color: #000000;
`;

const ButtonWrap = styled.View`
	background-color: #ffffff;
	flex-direction: row;
`;

const SelectedButton = styled.TouchableOpacity`
	height: 50px;
	border-color: ${props => (props.selected ? ColorBlue : ColorLineGrey)};
	border-width: 1px;
	align-items: center;
	justify-content: center;
	padding: 10px 20px;
	border-radius: 5px;
	margin: 5px 0;
`;
const SelectedButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	color: ${props => (props.selected ? ColorBlue : ColorLineGrey)};
	text-align: center;
`;

const RowWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const EditButton = styled.TouchableOpacity`
	border-color: ${ColorRed};
	border-width: 1px;
	justify-content: center;
	align-items: center;
	height: 50px;
	padding: 10px 25px;
	border-radius: 5px;
	background-color: ${ColorRed};
`;
const EditButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const PeriodWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const EnrollButton = styled.TouchableOpacity`
	height: 50px;
	width: 100%;
	border-radius: 5px;
	background-color: ${ColorBlue};
	justify-content: center;
	align-items: center;
	margin-top: 10px;
`;
const EnrollLabel = styled.Text`
	font-size: 15px;
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
`;

const CategoryData = [
	{key: '1', label: '??????', value: '1'},
	{key: '2', label: '??????', value: '2'},
	{key: '3', label: '??????', value: '3'},
	{key: '4', label: '??????', value: '4'},
	{key: '5', label: '??????', value: '5'},
];

const SelectContainer = styled.View`
	height: 50px;
	padding: 0 10px;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-color: ${ColorLineGrey};
`;

function EnrollInventory({navigation, route}) {
	const {state, user} = useSelector(state => state.loginReducer);
	const [title, setTitle] = useState('');
	const [category, setCategory] = useState('');
	const [cost, setCost] = useState('');
	const [count, setCount] = useState('');
	const [price, setPrice] = useState('');
	const [tex, setTex] = useState(true);
	const [nonePrice, setNonePrice] = useState(false);
	const [date, setDate] = useState(dayjs('2100-10-01').format('YYYY-MM-DD'));
	const [isLoading, setLoading] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const handleConfirm = date => {
		// if (dayjs(date) < dayjs()) {
		// 	setShowDatePicker(false);
		// 	return Alert.alert('??????', '???????????? ????????? ??????????????????.', [
		// 		{text: '??????'},
		// 	]);
		// }
		// console.log(showDatePicker, date);
		setDate(dayjs('2100-10-01').format('YYYY-MM-DD'));
		// setShowDatePicker(false);
	};

	const handleCancel = () => {
		setShowDatePicker('');
	};

	const goEnroll = async () => {
		if (!nonePrice && price === '') {
			return Alert.alert('??????', '??????????????? ??????????????????.', [{text: '??????'}]);
		}
		if (
			title.replace(/ /g, '').trim() === '' ||
			count === '' ||
			cost === '' ||
			date === ''
		) {
			return Alert.alert(
				'??????',
				'????????? ??? ?????? ????????? ?????????. ?????? ??????????????????.',
				[{text: '??????'}],
			);
		}
		if (
			category !== '1' &&
			category !== '2' &&
			category !== '3' &&
			category !== '4' &&
			category !== '5'
		) {
			return Alert.alert('??????', '??????????????? ??????????????????.', [{text: '??????'}]);
		}
		setLoading(true);
		try {
			const res = await APIEnrollStock(
				user.mt_info.mt_idx,
				category,
				title,
				count,
				cost,
				nonePrice ? 0 : price,
				nonePrice,
				date,
				tex,
			);
			console.log(res);
			if (res.result === 'true') {
				Alert.alert('??????', '????????? ?????????????????????.', [
					{text: '??????', onPress: () => navigation.goBack()},
				]);
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch {
			Alert.alert('??????', '????????? ?????? ????????? ??????????????????.', [{text: '??????'}]);
		}
		setLoading(false);
	};

	return (
		<Container>
			<Header
				title={'?????? ??????'}
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={
					<SwitchingButton onToggle={state} disabled={true} border={true} />
				}
				border={true}
			/>
			<ScrollView contentContainerStyle={{paddingBottom: 30}}>
				<Section style={{paddingHorizontal: 20}}>
					<TitleLabel>?????????</TitleLabel>
					<InputBox>
						<TextInput
							name="title"
							placeholder="?????????"
							placeholderColor={ColorLineGrey}
							value={title}
							onChangeText={text => setTitle(text)}
						/>
					</InputBox>
					<SelectContainer>
						<RNPickerSelect
							items={CategoryData}
							onValueChange={value => {
								setCategory(value);
							}}
							fixAndroidTouchableBug={true}
							value={category}
							doneText="??????"
							placeholder={{
								key: '0',
								label: '????????????',
								value: '0',
							}}
							style={{
								inputIOSContainer: {
									flexDirection: 'row',
									position: 'relative',
									height: '100%',
								},
								inputIOS: {
									position: 'relative',
									width: '100%',
									fontSize: 15,
									fontFamily: FONTNanumGothicRegular,
									paddingRight: 30,
									color: '#000000',
								},
								inputAndroidContainer: {
									flexDirection: 'row',
									position: 'relative',
									height: '100%',
									justifyContent: 'center',
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
								iconContainer: {top: Platform.os === 'ios' ? 0 : 15},
							}}
							Icon={() => (
								<Icon name="chevron-down" size={20} color="#000000" />
							)}
							useNativeAndroidPickerStyle={false}
						/>
					</SelectContainer>
					<TitleLabel>????????????</TitleLabel>
					<InputBox>
						<TextInput
							name="count"
							placeholder="????????????"
							placeholderColor={ColorLineGrey}
							value={count}
							onChangeText={text => setCount(text.replace(/[^0-9]/g, ''))}
							keyboardType="number-pad"
							maxLength={10}
						/>
					</InputBox>
					<TitleLabel>????????????</TitleLabel>
					<TitleWrap>
						<SelectedButton
							style={{flex: 1, marginRight: 5}}
							selected={tex}
							onPress={() => setTex(!tex)}>
							<SelectedButtonLabel selected={tex}>??????</SelectedButtonLabel>
						</SelectedButton>
						<SelectedButton
							style={{flex: 1, marginLeft: 5}}
							selected={!tex}
							onPress={() => setTex(!tex)}>
							<SelectedButtonLabel selected={!tex}>??????</SelectedButtonLabel>
						</SelectedButton>
					</TitleWrap>

					<TitleLabel>????????????</TitleLabel>
					<InputBox>
						<TextInput
							name="cost"
							placeholder="????????????"
							placeholderColor={ColorLineGrey}
							value={cost}
							onChangeText={text => setCost(text.replace(/[^0-9]/g, ''))}
							keyboardType="number-pad"
							maxLength={10}
						/>
					</InputBox>
					<TitleLabel>????????????</TitleLabel>
					<Wrap>
						<InputBox
							style={{backgroundColor: nonePrice ? ColorLineGrey : '#ffffff'}}>
							<TextInput
								name="price"
								placeholder="????????????"
								placeholderColor={ColorLineGrey}
								value={price}
								onChangeText={text => setPrice(text.replace(/[^0-9]/g, ''))}
								keyboardType="number-pad"
								maxLength={10}
							/>
						</InputBox>
						<SelectedButton
							style={{marginLeft: 5}}
							selected={nonePrice}
							onPress={() => setNonePrice(!nonePrice)}>
							<SelectedButtonLabel selected={nonePrice}>
								????????????
							</SelectedButtonLabel>
						</SelectedButton>
					</Wrap>

					{/* <TitleLabel>????????????</TitleLabel>
					<DateBox onPress={() => setShowDatePicker(true)}>
						<DateLabel>{date}</DateLabel>
						<Icon name="calendar" size={20} />
					</DateBox> */}

					<EnrollButton onPress={goEnroll}>
						<EnrollLabel>????????????</EnrollLabel>
					</EnrollButton>
				</Section>
			</ScrollView>
			<DateTimePickerModal
				isVisible={showDatePicker}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				headerTextIOS="????????? ??????????????????."
				locale="ko_KR"
				cancelTextIOS="??????"
				confirmTextIOS="??????"
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
}

export default EnrollInventory;
