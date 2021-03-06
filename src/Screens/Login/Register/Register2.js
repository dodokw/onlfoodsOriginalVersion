import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Text} from 'react-native';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import BackButton from '~/Components/BackButton';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import checkOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import checkOn from '~/Assets/Images/autoLogin_checkedOn.svg';
import {
	ColorGreen,
	ColorLineGrey,
	ColorLowRed,
	ColorRed,
} from '~/Assets/Style/Colors';
import {ScrollView} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {APICheckBizno, APIMemberSignUp} from '~/API/SignAPI/SignAPI';
import {launchImageLibrary} from 'react-native-image-picker';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {APICallGeo} from '../../../API/MainAPI/MainAPI';
import {useSelector} from 'react-redux';
import LoadingModal from '~/Components/LoadingModal';
import axios from 'axios';
import { originURL, secretKey, testURL } from '~/API/default';
import jwtDecode from 'jwt-decode';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
`;

const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin-top: 20px;
	margin-bottom: 10px;
`;
const InputBox = styled.View`
	flex-direction: row;
	border-color: ${props => (props.focus ? ColorRed : ColorLineGrey)};
	border-width: 0.5px;
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
	align-items: center;
`;
const Input = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #000000;
`;
const InputLabel = styled.Text`
	margin-left: 5px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: ${props =>
		props.color === 'red'
			? ColorRed
			: props.color === 'green'
			? ColorGreen
			: ColorLineGrey};
`;
const TextInput = styled.TextInput`
	border-color: #cecece;
	border-width: 0.5px;
	border-radius: 5px;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	height: 50px;
	padding: 0 10px;
	color: #000000;
`;
const Wrap = styled.View`
	flex-direction: row;
	margin-bottom: 10px;
`;
const ButtonBox = styled.TouchableOpacity`
	width: 100px;
	padding: 15px 20px;
	background-color: ${props => (props.pass ? ColorLineGrey : ColorRed)};
	border-radius: 5px;
	margin-left: 5px;
	align-items: center;
	justify-content: center;
`;
const ButtonBoxLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const Dive = styled.View`
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	margin: 20px 0;
`;
const ContractWrap = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;
const ContractTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-left: 5px;
`;
const ContractTitleSub = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 10px;
	margin-left: 5px;
	color: #ff0000;
`;
const ContractSubTitle = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
	margin-left: 10px;
`;
const MoreDetailButton = styled.TouchableOpacity`
	background-color: ${ColorLowRed};
	width: 80px;
	height: 32px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`;
const MoreDetailLabel = styled.Text`
	color: ${ColorRed};
	font-size: 14px;
`;
const RegiButton = styled.TouchableOpacity`
	border-radius: 8px;
	background-color: ${ColorRed};
	margin: 10px 0;
`;
const RegiLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	font-size: 16px;
	text-align: center;
	padding: 20px 0;
`;

const defaultData = {
	bizno: '',
	bizname: '',
	ceoname: '',
	zip: '',
	address: '',
	detailAddress: '',
	dong: '',
	lat: '',
	lng: '',
	bizImg: null,
	bankImg: null,
	reportImg: null,
};

const defaultFocus = {
	bizno: false,
	bizname: false,
	ceoname: false,
	phoneNum: false,
	password: false,
	rePassword: false,
};

function Register2({navigation, route}) {
	const data1 = route.params.data;
	const [data, setData] = useState(defaultData);
	const [focusedInput, setFocusedInput] = useState(defaultFocus);
	const [isBizno, setIsBizno] = useState(false);
	const [showPost, setShowPost] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const token = useSelector(state => state.dataReducer.token);
	const [alarm, setAlarm] = useState(true);
	const [isPullrequest, setIsPullRequest] = useState(true);

	const checkBizno = async () => {
		try {
			await APICheckBizno(data.bizno);
			setIsBizno(true);
		} catch (err) {
			setIsBizno(true); //false???????????????.
			setAlarm(false);
			Alert.alert('??????', err.message, [{text: '??????'}]);
		}
	};

	//?????????????????????
	const onBizNoSame = async () => {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('bizNo', data.bizno);
		const res = await axios.post(originURL+'getInfo_onSameBizNo.php', form);
		const decode = jwtDecode(res.data.jwt);
		console.log(decode.data);
		setData({
			...data,
			bizname: decode.data.slt_company_name,
			// ceoname: res.data[0].slt_company_boss,
			zip: decode.data.slt_zip,
			address: decode.data.slt_addr,
			detailAddress: decode.data.slt_addr2,
			//bizImg: decode.data.slt_file1,
			//bankImg: decode.data.slt_file2,
			//reportImg: decode.data.slt_file3,
			dong: decode.data.slt_dong,
			lat: decode.data.slt_lat,
			lng: decode.data.slt_lng,

		});
	}

	useEffect(() => {
		console.log(alarm);
		if(alarm === false){
			onBizNoSame();
			setIsPullRequest(false);
		}else{
			console.log('?????????????????????!');
		}
	}, [alarm]);

	const pickImg = type => {
		launchImageLibrary({mediaType: 'photo'}, response => {
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
				if (imgData.uri !== undefined) {
					setData({...data, [type]: imgData});
				}
			} catch (err) {
				console.log(err);
			}
		});
	};

	const getPost = async address => {
		try {
			const res = await APICallGeo(address.address);
			const getAddress = res.address;
			setData({
				...data,
				zip: address.zonecode,
				address: getAddress.address_name,
				dong: getAddress.region_3depth_name,
				lng: getAddress.x,
				lat: getAddress.y,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const goNext = async () => {
		if (
			data.bizno === '' ||
			data.bizname === '' ||
			data.ceoname === '' ||
			data.address === '' ||
			data.detailAddress === ''
		)
			return Alert.alert('??????', '????????? ??? ????????? ????????????.', [
				{text: '??????'},
			]);

		if (!isBizno)
			return Alert.alert('??????', '???????????????????????? ???????????? ???????????????.', [
				{text: '??????'},
			]);
		try {
			const res = await APIMemberSignUp(
				token,
				data1.id,
				data1.name,
				data1.password,
				data1.rePassword,
				data1.phoneNum,
				data.bizno,
				data.bizname,
				data.ceoname,
				data.zip,
				data.address,
				data.detailAddress,
				data.dong,
				data.lat,
				data.lng,
				data.bizImg,
				data.bankImg,
				data.reportImg,
				data1.checkMarketing,
			);
			if (res.result === 'true') {
				return Alert.alert('??????', '?????? ??????!', [
					{
						text: '??????',
						onPress: () =>
							navigation.reset({index: 1, routes: [{name: 'Login'}]}),
					},
				]);
			} else {
				console.log(res);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Container
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={44}>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="????????????"
			/>
			<ScrollView
				style={{padding: 10, backgroundColor: '#ffffff'}}
				contentContainerStyle={{paddingBottom: 20}}
				bounces={false}>
				<Title>?????????????????????</Title>
				<InputBox focus={focusedInput.bizno}>
					<Input
						value={data.bizno}
						onChangeText={text =>
							setData({
								...data,
								bizno: text.replace(/[^0-9]/g, ''),
							})
						}
						placeholder="?????????????????????"
						onFocus={() => setFocusedInput({...defaultFocus, bizno: true})}
						onBlur={() => checkBizno()}
						maxLength={10}
						keyboardType="number-pad"
					/>
					<SvgXml xml={isBizno ? checkOn : checkOff} />
					<InputLabel color={isBizno ? 'red' : 'grey'}>????????????</InputLabel>
				</InputBox>
				<Title>?????????</Title>
				<TextInput
					style={{
						borderColor: focusedInput.bizname ? ColorRed : ColorLineGrey,
					}}
					value={data.bizname}
					onChangeText={text => setData({...data, bizname: text})}
					onFocus={() => setFocusedInput({...defaultFocus, bizname: true})}
					placeholder="?????????"
					maxLength={15}
					editable={isPullrequest}
				/>
				<Title>??????/??????</Title>
				<TextInput
					style={{
						borderColor: focusedInput.ceoname ? ColorRed : ColorLineGrey,
					}}
					value={data.ceoname}
					onChangeText={text => setData({...data, ceoname: text})}
					onFocus={() => setFocusedInput({...defaultFocus, ceoname: true})}
					placeholder="??????/??????"
					maxLength={15}
				/>

				<Title>??????</Title>
				<Wrap>
					<InputBox
						style={{
							flex: 1,
							borderColor: focusedInput.doro ? ColorRed : ColorLineGrey,
						}}>
						<Input
							value={data.address}
							onFocus={() => setFocusedInput({...defaultFocus, doro: true})}
							placeholder="??????"
							editable={false}
						/>
						<InputLabel color="red"></InputLabel>
					</InputBox>
					<ButtonBox 
					onPress={() => setShowPost(true)}
					disabled={!isPullrequest}
					>
						<ButtonBoxLabel>??????</ButtonBoxLabel>
					</ButtonBox>
				</Wrap>
				<TextInput
					style={{
						borderColor: focusedInput.sangse ? ColorRed : ColorLineGrey,
					}}
					value={data.detailAddress}
					onChangeText={text => setData({...data, detailAddress: text})}
					onFocus={() => setFocusedInput({...defaultFocus, sangse: true})}
					placeholder="????????????"
					editable={isPullrequest}
				/>

				<Dive />

				<ContractWrap>
					<ContractTitle>?????? ??????</ContractTitle>
					<ContractTitleSub> *?????????????????? ????????? ??????????????????, ????????? ?????? ?????????????????????.</ContractTitleSub>
				</ContractWrap>
				<ContractWrap>
					<SvgXml xml={data.bizImg === null ? checkOff : checkOn} />
					<ContractSubTitle>??????????????????</ContractSubTitle>
					<MoreDetailButton onPress={() => pickImg('bizImg')}>
						<MoreDetailLabel>??????</MoreDetailLabel>
					</MoreDetailButton>
				</ContractWrap>
				<ContractWrap>
					<SvgXml xml={data.bankImg === null ? checkOff : checkOn} />
					<ContractSubTitle>??????</ContractSubTitle>
					<MoreDetailButton onPress={() => pickImg('bankImg')}>
						<MoreDetailLabel>??????</MoreDetailLabel>
					</MoreDetailButton>
				</ContractWrap>
				<ContractWrap>
					<SvgXml xml={data.reportImg === null ? checkOff : checkOn} />
					<ContractSubTitle>??????</ContractSubTitle>
					<MoreDetailButton onPress={() => pickImg('reportImg')}>
						<MoreDetailLabel>??????</MoreDetailLabel>
					</MoreDetailButton>
				</ContractWrap>

				<RegiButton onPress={goNext}>
					<RegiLabel>????????????</RegiLabel>
				</RegiButton>
			</ScrollView>
			<PostcodeModal
				isShow={showPost}
				setIsShow={setShowPost}
				getPost={getPost}
			/>
		</Container>
	);
}

export default Register2;