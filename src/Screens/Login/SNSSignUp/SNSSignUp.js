import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallGeo} from '~/API/MainAPI/MainAPI';
import checkOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import checkOn from '~/Assets/Images/autoLogin_checkedOn.svg';
import {
	APICheckPhoneAuth,
	APIFindID,
	APICallPhoneAuth,
	APISNSMoreInfo,
	APICheckBizno,
} from '~/API/SignAPI/SignAPI';
import {
	ColorGreen,
	ColorLineGrey,
	ColorLowRed,
	ColorRed,
} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import {login, logout} from '~/Modules/Action';
import {phoneReg} from '~/Tools/Reg';
import PostcodeModal from '~/Components/Modal/PostcodeModal';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const Content = styled.View`
	padding: 40px 20px;
`;

const MainTitle = styled.Text`
	font-size: 18px;
	font-family: ${FONTNanumGothicBold};
	margin-bottom: 10px;
`;
const SubTitle = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicRegular};
	margin-bottom: 40px;
	line-height: 20px;
`;

const SubjectTitle = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicBold};
	margin: 10px 0;
`;
const InputBox = styled.View`
	flex: 1;
	border-width: 1px;
	border-color: ${props => props.color};
	border-radius: 5px;
	height: 50px;
	padding: 0 10px;
	align-items: center;
	margin-bottom: 10px;
	flex-direction: row;
`;
const TextInput = styled.TextInput`
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

const Button = styled.TouchableOpacity`
	width: 100px;
	height: 50px;
	background-color: ${props =>
		props.backgroundColor ? props.backgroundColor : ColorLineGrey};
	justify-content: center;
	align-items: center;
	padding: 0 25px;
	border-radius: 5px;
	margin-left: ${props => (props.marginLeft ? props.marginLeft + 'px' : '0px')};
`;

const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
`;

const Box = styled.View`
	flex: 1;
	justify-content: flex-end;
	padding: 20px;
`;

const Dive = styled.View`
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	margin: 20px 0;
`;

const SubText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 13px;
	color: #989898;
	letter-spacing: -0.5px;
	margin-bottom: 10px;
`;

const ContranctCheckButton = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

const ContractWrap = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;
const ContractTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-left: 10px;
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

const RedLabel = styled.Text`
	color: ${ColorRed};
`;

const GreyLabel = styled.Text`
	color: #989898;
`;

const defaultData = {
	name: '',
	phoneNum: '',
	phoneAuth: '',
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
	checkService: false,
	checkPrivacy: false,
	checkMarketing: false,
};

function SNSSignUp({navigation}) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [data, setData] = useState(defaultData);
	const [onFocus, setOnFocus] = useState();
	const [minute, setMinute] = useState(0);
	const [second, setSecond] = useState(0);
	const [pass, setPass] = useState(false);
	const [isBizno, setIsBizno] = useState(false);
	const [showPost, setShowPost] = useState(false);

	const goTerms = async type => {
		return navigation.navigate('Terms', {type});
	};

	const callAuth = async () => {
		if (data.name === '') {
			return Alert.alert('??????', '????????? ??????????????????.', [{text: '??????'}]);
		}
		const check = phoneReg.exec(data.phoneNum);
		if (check === null) {
			return Alert.alert('??????', '??????????????? ???????????? ??????????????????.', [
				{text: '??????'},
			]);
		}
		try {
			const res = await APICallPhoneAuth('reg', data.phoneNum);
			if (res.result === 'true') {
				setSecond(0);
				setMinute(3);
				Alert.alert('??????', '??????????????? ?????? ???????????????.', [{text: '??????'}]);
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (err) {
			Alert.alert('??????', err.message, [{text: '??????'}]);
		}
	};

	const checkAuth = async () => {
		try {
			const res = await APICheckPhoneAuth(data.phoneNum, data.phoneAuth);
			if (res.result === 'true') {
				setPass(true);
				setMinute(0);
				setSecond(0);
				Alert.alert('??????', '??????????????? ?????????????????????.', [{text: '??????'}]);
			} else {
				Alert.alert('??????', '??????????????? ?????? ????????????.', [{text: '??????'}]);
			}
		} catch (err) {
			Alert.alert('??????', err.message, [{text: '??????'}]);
		}
	};

	const checkBizno = async () => {
		try {
			await APICheckBizno(data.bizno);
			setIsBizno(true);
		} catch (err) {
			setIsBizno(false);
			Alert.alert('??????', err.message, [{text: '??????'}]);
		}
	};

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
				zip: res.road_address.zone_no,
				address: getAddress.address_name,
				dong: getAddress.region_3depth_name,
				lng: getAddress.x,
				lat: getAddress.y,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const ConfirmMoreInfo = async () => {
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
		if (!data.checkPrivacy || !data.checkService) {
			return Alert.alert('??????', '?????? ????????? ???????????? ??????????????????.', [
				{text: '??????'},
			]);
		}
		try {
			const res = await APISNSMoreInfo(
				user.mt_idx,
				data.name,
				data.phoneNum,
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
				data.checkMarketing,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				dispatch(login(decode.data));
				return Alert.alert('??????', '?????? ?????? ?????? ??????!', [
					{
						text: '??????',
						onPress: () => navigation.goBack(),
					},
				]);
			} else {
				console.log(res);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const countdown = setInterval(() => {
			if (second > 0) {
				setSecond(second - 1);
			}
			if (second === 0) {
				if (minute === 0) {
					clearInterval(countdown);
				} else {
					setMinute(minute - 1);
					setSecond(59);
				}
			}
		}, 1000);
		return () => clearInterval(countdown);
	}, [minute, second]);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
	}, []);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				SubjectTitle="??????????????????"
				border={true}
			/>
			<ScrollView>
				<Content>
					<MainTitle>?????? ????????? ??????????????????.</MainTitle>
					<SubjectTitle>
						{
							'?????? ????????? ???????????????, ????????? ???????????? ??????????????? ???????????? ??? ????????????.'
						}
					</SubjectTitle>
					<SubjectTitle>??????</SubjectTitle>
					<Wrap>
						<InputBox color={onFocus === 0 ? ColorRed : '#cecece'}>
							<TextInput
								placeholder="??????"
								placeholderColor={ColorLineGrey}
								value={data.name}
								onChangeText={text => setData({...data, name: text})}
								onFocus={() => setOnFocus(0)}
							/>
						</InputBox>
					</Wrap>
					<SubjectTitle>????????????</SubjectTitle>
					<Wrap>
						<InputBox color={onFocus === 1 ? ColorRed : '#cecece'}>
							<TextInput
								placeholder="????????????"
								placeholderColor={ColorLineGrey}
								value={data.phoneNum}
								onChangeText={text => setData({...data, phoneNum: text})}
								onFocus={() => setOnFocus(1)}
								maxLength={11}
								editable={minute === 0 && second === 0 && !pass}
								keyboardType="number-pad"
							/>
						</InputBox>
						<Button
							marginLeft={5}
							backgroundColor={pass ? ColorLineGrey : ColorRed}
							onPress={callAuth}
							disabled={pass}>
							<ButtonLabel>
								{minute === 0 && second === 0 ? '??????' : '?????????'}
							</ButtonLabel>
						</Button>
					</Wrap>
					<Wrap>
						<InputBox color={onFocus === 2 ? ColorRed : '#cecece'}>
							<TextInput
								placeholder="????????????"
								placeholderColor={ColorLineGrey}
								value={data.phoneAuth}
								onChangeText={text => setData({...data, phoneAuth: text})}
								onFocus={() => setOnFocus(2)}
								keyboardType="number-pad"
								maxLength={6}
								editable={!pass}
							/>
							<InputLabel color="red">
								{minute > 0 || second > 0
									? second >= 10
										? String(minute) + ' : ' + String(second)
										: String(minute) + ' : ' + '0' + String(second)
									: ''}
							</InputLabel>
						</InputBox>
						<Button
							marginLeft={5}
							backgroundColor={
								minute === 0 && second === 0 ? ColorLineGrey : ColorRed
							}
							disabled={minute === 0 && second === 0}
							onPress={checkAuth}>
							<ButtonLabel>??????</ButtonLabel>
						</Button>
					</Wrap>
					<SubjectTitle>?????????????????????</SubjectTitle>
					<InputBox color={onFocus === 3 ? ColorRed : '#cecece'}>
						<TextInput
							value={data.bizno}
							onChangeText={text =>
								setData({
									...data,
									bizno: text.replace(/[^0-9]/g, ''),
								})
							}
							placeholder="?????????????????????"
							onFocus={() => setOnFocus(3)}
							onBlur={() => checkBizno()}
							maxLength={10}
							keyboardType="number-pad"
						/>
						<SvgXml xml={isBizno ? checkOn : checkOff} />
						<InputLabel color={isBizno ? 'red' : 'grey'}>????????????</InputLabel>
					</InputBox>
					<SubjectTitle>?????????</SubjectTitle>
					<InputBox color={onFocus === 4 ? ColorRed : '#cecece'}>
						<TextInput
							value={data.bizname}
							onChangeText={text => setData({...data, bizname: text})}
							onFocus={() => setOnFocus(4)}
							placeholder="?????????"
							maxLength={15}
						/>
					</InputBox>
					<SubjectTitle>????????????</SubjectTitle>
					<InputBox color={onFocus === 5 ? ColorRed : '#cecece'}>
						<TextInput
							value={data.ceoname}
							onChangeText={text => setData({...data, ceoname: text})}
							onFocus={() => setOnFocus(5)}
							placeholder="????????????"
							maxLength={15}
						/>
					</InputBox>

					<SubjectTitle>??????</SubjectTitle>
					<Wrap>
						<InputBox
							color={onFocus === 6 ? ColorRed : '#cecece'}
							style={{
								flex: 1,
							}}>
							<TextInput
								value={data.address}
								onFocus={() => setOnFocus(6)}
								placeholder="??????"
								editable={false}
							/>
							<InputLabel color="red"></InputLabel>
						</InputBox>
						<Button
							onPress={() => setShowPost(true)}
							marginLeft={5}
							backgroundColor={ColorRed}>
							<ButtonLabel>??????</ButtonLabel>
						</Button>
					</Wrap>
					<InputBox color={onFocus === 7 ? ColorRed : '#cecece'}>
						<TextInput
							value={data.detailAddress}
							onChangeText={text => setData({...data, detailAddress: text})}
							onFocus={() => setOnFocus(7)}
							placeholder="????????????"
						/>
					</InputBox>

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
						<ContractSubTitle>????????????</ContractSubTitle>
						<MoreDetailButton onPress={() => pickImg('bankImg')}>
							<MoreDetailLabel>??????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<SvgXml xml={data.reportImg === null ? checkOff : checkOn} />
						<ContractSubTitle>????????????????????????</ContractSubTitle>
						<MoreDetailButton onPress={() => pickImg('reportImg')}>
							<MoreDetailLabel>??????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>

					<Dive />
					<SubText>
						*????????? ????????? ????????? ?????? ?????? ???????????? ????????? ????????? ?????????.
					</SubText>

					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								data.checkService && data.checkPrivacy && data.checkMarketing
									? setData({
											...data,
											checkService: false,
											checkPrivacy: false,
											checkMarketing: false,
									  })
									: setData({
											...data,
											checkService: true,
											checkPrivacy: true,
											checkMarketing: true,
									  })
							}>
							<SvgXml
								xml={
									data.checkService && data.checkPrivacy && data.checkMarketing
										? checkOn
										: checkOff
								}
							/>
							<ContractTitle>?????? ?????? ??????</ContractTitle>
						</ContranctCheckButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkService: !data.checkService})
							}>
							<SvgXml xml={data.checkService ? checkOn : checkOff} />
							<ContractSubTitle>
								<RedLabel>(??????)</RedLabel>????????? ????????????
							</ContractSubTitle>
						</ContranctCheckButton>
						<MoreDetailButton onPress={() => goTerms(1)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkPrivacy: !data.checkPrivacy})
							}>
							<SvgXml xml={data.checkPrivacy ? checkOn : checkOff} />
							<ContractSubTitle>
								<RedLabel>(??????)</RedLabel>???????????? ????????????
							</ContractSubTitle>
						</ContranctCheckButton>
						<MoreDetailButton onPress={() => goTerms(2)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
					<ContractWrap>
						<ContranctCheckButton
							onPress={() =>
								setData({...data, checkMarketing: !data.checkMarketing})
							}>
							<SvgXml xml={data.checkMarketing ? checkOn : checkOff} />
							<ContractSubTitle>
								<GreyLabel>(??????)</GreyLabel>????????? ?????? ??????
							</ContractSubTitle>
						</ContranctCheckButton>

						<MoreDetailButton onPress={() => goTerms(3)}>
							<MoreDetailLabel>???????????????</MoreDetailLabel>
						</MoreDetailButton>
					</ContractWrap>
				</Content>
				<Box>
					<Button
						onPress={ConfirmMoreInfo}
						style={{width: '100%'}}
						backgroundColor={pass ? ColorRed : ColorLineGrey}
						disabled={!pass}>
						<ButtonLabel>??????</ButtonLabel>
					</Button>
				</Box>
			</ScrollView>
			<PostcodeModal
				isShow={showPost}
				setIsShow={setShowPost}
				getPost={getPost}
			/>
		</Container>
	);
}

export default SNSSignUp;
