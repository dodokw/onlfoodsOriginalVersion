import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import Header from '~/Components/Header';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {ColorLineGrey, ColorLowRed, ColorRed} from '~/Assets/Style/Colors';
import checkOff from '~/Assets/Images/autoLogin_checkedOff.svg';
import checkOn from '~/Assets/Images/autoLogin_checkedOn.svg';
import {useDispatch, useSelector} from 'react-redux';
import SwitchingButton from '~/Components/SwitchingButton';
import BackButton from '~/Components/BackButton';
import {launchImageLibrary} from 'react-native-image-picker';
import {
	APICallMemberInfo,
	APICallUserInfoRefresh,
	APIUpdateMyProfile,
	APIUpdateMyProfileAll,
} from '~/API/MyPageAPI/MyPageAPI';
import {Alert} from 'react-native';
import {
	APICallPhoneAuth,
	APICheckBizno,
	APICheckPhoneAuth,
} from '~/API/SignAPI/SignAPI';
import {changeImg, login, logout} from '~/Modules/Action';
import {Platform} from 'react-native';
import LongButton from '~/Components/LongButton/LongButton';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import {APICallGeo} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import LoadingModal from '~/Components/LoadingModal';

const Container = styled.KeyboardAvoidingView`
	flex: 1;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const ProfileImageContainer = styled.View`
	align-items: center;
	padding: 20px;
	margin-bottom: 5px;
	background-color: #ffffff;
`;

const PressableText = styled.TouchableOpacity``;

const MyProfileImageWrap = styled.View`
	width: 90px;
	height: 90px;
	background-color: #f8f8f8;
	border-width: 1px;
	border-color: #e6ebee;
	border-radius: 50px;
	justify-content: center;
	align-items: center;
	margin-bottom: 10px;
`;

const MyProfileImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
	background-color: #ffffff;
`;

const ProfileImageLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #989898;
`;

const ProfileInfoContainer = styled.View`
	flex: 1;
	background-color: #ffffff;
	padding: 20px;
`;

const ProfileInfoWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const ProfileInfoLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	margin-bottom: 10px;
`;
const ProfileInfoText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const Dive = styled.View`
	background-color: #dfdfdf;
	height: 0.5px;
	margin: 10px 0;
`;

const PhoneWrap = styled.View`
	align-items: center;
	margin-bottom: 10px;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: #cecece;
	border-width: 1px;
	align-items: center;
	padding: 10px;
	margin: 5px 0;
	height: 50px;
`;

const InputLabel = styled.Text`
	margin-left: 5px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: ${props => (props.color === 'red' ? ColorRed : ColorLineGrey)};
`;

const TextInput = styled.TextInput`
	flex: 1;
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
	padding: 0;
	color: #000000;
`;

const EditButton = styled.TouchableOpacity`
	border-color: ${props => (props.color ? props.color : ColorRed)};
	border-width: 1px;
	justify-content: center;
	align-items: center;
	width: 100px;
	height: 50px;
	padding: 10px 25px;
	border-radius: 5px;
	margin-left: 5px;
`;
const EditButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${props => (props.color ? props.color : ColorRed)}; ;
`;

const ContractWrap = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
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

const defaultAddress = {
	zip: '',
	address: '',
	dong: '',
	sangse: '',
	lat: '',
	lng: '',
};

const MyProfileEdit = ({navigation}) => {
	const dispatch = useDispatch();
	const {user, state} = useSelector(state => state.loginReducer);
	const [phoneNum, setPhoneNum] = useState('');
	const [callAuth, setCallAuth] = useState(false);
	const [authNum, setAuthNum] = useState('');
	const [minute, setMinute] = useState(0);
	const [second, setSecond] = useState(0);
	const [showPost, setShowPost] = useState(false);
	const [checkAuth, setCheckAuth] = useState(false);
	const [name, setName] = useState('');
	const [address, setAddress] = useState(defaultAddress);
	const [bizNum, setBizNum] = useState('');
	const [bizName, setBizName] = useState('');
	const [ceoName, setCeoName] = useState('');
	const [bizImg, setBizImg] = useState(null);
	const [bankImg, setBankImg] = useState(null);
	const [reportImg, setReportImg] = useState(null);
	const [isLoading, setLoading] = useState(false);

	const getData = async () => {
		setLoading(true);
		console.log(user.mt_info.mt_idx);
		try {
			const res = await APICallMemberInfo(user.mt_info.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				setPhoneNum(decode.data.mt_hp.replace(/-/g, ''));
				setName(decode.data.mt_name);
				setAddress({
					zip: decode.data.slt_zip,
					address: decode.data.slt_addr,
					sangse: decode.data.slt_addr2,
					lat: decode.data.slt_lat,
					lng: decode.data.slt_lng,
					dong: decode.data.slt_dong,
				});
				setBizNum(decode.data.slt_company_num);
				setBizName(decode.data.slt_company_name);
				setCeoName(decode.data.slt_company_boss);
				setBizImg(decode.data.slt_file1 === '' ? null : decode.data.slt_file1);
				setBankImg(decode.data.slt_file2 === '' ? null : decode.data.slt_file2);
				setReportImg(
					decode.data.slt_file3 === '' ? null : decode.data.slt_file3,
				);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			}
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const setProfileImg = async Img => {
		try {
			const res = await APIUpdateMyProfile(user.mt_info.mt_idx, 'profile', Img);
			if (res.result === 'true') {
				const uri = res.data;
				dispatch(changeImg(uri));
				Alert.alert('알림', '프로필 사진이 변경되었습니다.', [{text: '확인'}]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const changeProfileImg = () => {
		try {
			launchImageLibrary(
				{
					maxHeight: 500,
					maxWidth: 500,
					quality: 0.5,
					mediaType: 'photo',
				},
				response => {
					if (response.didCancel) {
						return console.log('취소함');
					} else if (response.error) {
						return console.log(response.error);
					}
					const imgData = {
						name: response.assets[0].fileName,
						type: response.assets[0].type,
						uri: response.assets[0].uri,
					};
					setProfileImg(imgData);
				},
			);
		} catch (err) {
			console.error(err);
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
				if (type === 'bizImg') setBizImg(imgData);
				else if (type === 'bankImg') setBankImg(imgData);
				else if (type === 'reportImg') setReportImg(imgData);
			} catch (err) {
				console.log(err);
			}
		});
	};

	const onAuth = async () => {
		try {
			const res = await APICallPhoneAuth('reg', phoneNum);
			if (res.result === 'true') {
				setCallAuth(true);
				setMinute(3);
				Alert.alert('알림', '인증번호가 요청되었습니다.', [{text: '확인'}]);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const changePhoneNum = async () => {
		try {
			const res = await APICheckPhoneAuth(phoneNum, authNum);
			if (res.result === 'true') {
				const res = await APIUpdateMyProfile(
					user.mt_info.mt_idx,
					'phone',
					'',
					'',
					'',
					'',
					phoneNum,
				);
				if (res.result === 'true') {
					Alert.alert('알림', '핸드폰 번호가 수정되었습니다.', [
						{text: '확인'},
					]);
					setMinute(0);
					setSecond(0);
					setCallAuth(false);
				} else {
					console.log('핸드폰번호 수정실패', res.message);
				}
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const getPost = async address => {
		try {
			const res = await APICallGeo(address.address);
			const getAddress = res.address;
			setAddress({
				...address,
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

	const getInfo = async () => {
		const res = await APICallUserInfoRefresh(user.mt_info.mt_idx);
		console.log(res);
		if (res.result === 'true') {
			const decode = jwtDecode(res.jwt);
			dispatch(login(decode.data));
			navigation.goBack();
		} else {
			Alert.alert(
				'알림',
				'정보를 제대로 갱신하지 못했습니다. 다시 로그인해주세요.',
				[{text: '확인', onPress: () => dispatch(logout())}],
			);
		}
	};

	const chagneProfile = async () => {
		if (
			name === '' ||
			address === '' ||
			bizNum === '' ||
			bizName === '' ||
			ceoName === ''
		) {
			return Alert.alert('알림', '비어 있는 내용이 있습니다.', [
				{text: '확인'},
			]);
		}
		setLoading(true);
		try {
			const res = await APIUpdateMyProfileAll(
				user.mt_info.mt_idx,
				name,
				bizNum,
				bizName,
				ceoName,
				address,
				bizImg,
				bankImg,
				reportImg,
			);
			if (res.result === 'true') {
				Alert.alert('알림', '회원정보 수정 완료', [
					{text: '확인', onPress: () => getInfo()},
				]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		getData();
		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

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

	return (
		<Container
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={44}>
			<Header
				title="프로필 수정"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				headerRight={<SwitchingButton onToggle={state} disabled={true} />}
				border={true}
			/>
			<ScrollView bounces={false} contentContainerStyle={{paddingBottom: 20}}>
				<ProfileImageContainer>
					<MyProfileImageWrap>
						<MyProfileImage source={{uri: user.mt_info.mt_image1}} />
					</MyProfileImageWrap>
					<PressableText onPress={() => changeProfileImg('profile')}>
						<ProfileImageLabel>프로필 사진 변경</ProfileImageLabel>
					</PressableText>
				</ProfileImageContainer>
				<ProfileInfoContainer>
					<ProfileInfoWrap>
						<ProfileInfoLabel>아이디</ProfileInfoLabel>
						<ProfileInfoText>{user.mt_info.mt_id}</ProfileInfoText>
					</ProfileInfoWrap>
					<ProfileInfoWrap>
						<ProfileInfoLabel>회원유형</ProfileInfoLabel>
						<ProfileInfoText>
							{user.mt_info.mt_level == 2
								? '일반회원'
								: user.mt_info.mt_level == 4
								? '무료판매자'
								: '유료판매자'}
						</ProfileInfoText>
					</ProfileInfoWrap>
					<Dive />
					<LongButton
						text="비밀번호 변경"
						onPress={() => navigation.navigate('UpdatePW')}
					/>
					<Dive />
					<ProfileInfoLabel style={{marginTop: 10}}>전화번호</ProfileInfoLabel>
					<PhoneWrap>
						<Wrap>
							<InputBox>
								<TextInput
									placeholder="전화번호"
									placeholderTextColor="#7e7e7e"
									value={phoneNum}
									onChangeText={text => setPhoneNum(text)}
									keyboardType="number-pad"
									maxLength={11}
									editable={!callAuth}
								/>
							</InputBox>
							<EditButton onPress={onAuth}>
								<EditButtonLabel>
									{callAuth ? '재요청' : '변경'}
								</EditButtonLabel>
							</EditButton>
						</Wrap>
						{callAuth && (
							<Wrap>
								<InputBox>
									<TextInput
										placeholder="인증번호"
										placeholderTextColor="#7e7e7e"
										value={authNum}
										onChangeText={text => setAuthNum(text)}
										keyboardType="number-pad"
										maxLength={6}
									/>
									<InputLabel color="red">
										{minute > 0 || second > 0
											? second >= 10
												? String(minute) + ' : ' + String(second)
												: String(minute) + ' : ' + '0' + String(second)
											: ''}
									</InputLabel>
								</InputBox>
								<EditButton
									color={
										minute === 0 && second === 0 ? ColorLineGrey : ColorRed
									}
									onPress={changePhoneNum}
									disabled={minute === 0 && second === 0}>
									<EditButtonLabel
										color={
											minute === 0 && second === 0 ? ColorLineGrey : ColorRed
										}>
										확인
									</EditButtonLabel>
								</EditButton>
							</Wrap>
						)}
					</PhoneWrap>
					<Dive />
					<ProfileInfoLabel style={{marginTop: 10}}>이름</ProfileInfoLabel>
					<InputBox>
						<TextInput
							placeholder="이름"
							placeholderTextColor="#7e7e7e"
							value={name}
							onChangeText={text => setName(text)}
							maxLength={5}
						/>
					</InputBox>

					<ProfileInfoLabel style={{marginTop: 10}}>주소</ProfileInfoLabel>
					<Wrap>
						<InputBox>
							<TextInput
								placeholder="주소"
								placeholderTextColor="#7e7e7e"
								value={address.address}
								editable={false}
							/>
						</InputBox>
						<EditButton
							color={
								parseInt(user.mt_info.mt_level) > 4 ? ColorLineGrey : ColorRed
							}
							onPress={() => setShowPost(true)}
							disabled={parseInt(user.mt_info.mt_level) > 4}>
							<EditButtonLabel
								color={
									parseInt(user.mt_info.mt_level) > 4 ? ColorLineGrey : ColorRed
								}>
								검색
							</EditButtonLabel>
						</EditButton>
					</Wrap>
					<InputBox>
						<TextInput
							placeholder="상세주소"
							placeholderTextColor="#7e7e7e"
							value={address.sangse}
							onChangeText={text => setAddress({...address, sangse: text})}
							editable={parseInt(user.mt_info.mt_level) < 5}
						/>
					</InputBox>
					<ProfileInfoLabel style={{marginTop: 10}}>
						사업자등록번호
					</ProfileInfoLabel>
					<InputBox>
						<TextInput
							placeholder="사업자등록번호"
							placeholderTextColor="#7e7e7e"
							value={bizNum}
							onChangeText={text => setBizNum(text.replace(/[^0-9]/g, ''))}
							keyboardType="number-pad"
							maxLength={11}
							editable={!callAuth && parseInt(user.mt_info.mt_level) < 5}
						/>
					</InputBox>
					<ProfileInfoLabel style={{marginTop: 10}}>상호명</ProfileInfoLabel>
					<InputBox>
						<TextInput
							placeholder="상호명"
							placeholderTextColor="#7e7e7e"
							value={bizName}
							onChangeText={text => setBizName(text)}
							maxLength={15}
							editable={parseInt(user.mt_info.mt_level) < 5}
						/>
					</InputBox>
					<ProfileInfoLabel style={{marginTop: 10}}>대표자명</ProfileInfoLabel>
					<InputBox>
						<TextInput
							placeholder="대표자명"
							placeholderTextColor="#7e7e7e"
							value={ceoName}
							onChangeText={text => setCeoName(text)}
							maxLength={15}
							editable={parseInt(user.mt_info.mt_level) < 5}
						/>
					</InputBox>
					{parseInt(user.mt_info.mt_level) < 5 && (
						<>
							<ProfileInfoLabel style={{marginTop: 10}}>
								사진 첨부
							</ProfileInfoLabel>
							<ContractWrap>
								<SvgXml xml={bizImg === null ? checkOff : checkOn} />
								<ContractSubTitle>사업자등록증</ContractSubTitle>
								<MoreDetailButton onPress={() => pickImg('bizImg')}>
									<MoreDetailLabel>첨부</MoreDetailLabel>
								</MoreDetailButton>
							</ContractWrap>
							<ContractWrap>
								<SvgXml xml={bankImg === null ? checkOff : checkOn} />
								<ContractSubTitle>명함</ContractSubTitle>
								<MoreDetailButton onPress={() => pickImg('bankImg')}>
									<MoreDetailLabel>첨부</MoreDetailLabel>
								</MoreDetailButton>
							</ContractWrap>
							<ContractWrap>
								<SvgXml xml={reportImg === null ? checkOff : checkOn} />
								<ContractSubTitle>기타</ContractSubTitle>
								<MoreDetailButton onPress={() => pickImg('reportImg')}>
									<MoreDetailLabel>첨부</MoreDetailLabel>
								</MoreDetailButton>
							</ContractWrap>
						</>
					)}
					<Dive />
				</ProfileInfoContainer>
				<Wrap
					style={{flex: 1, paddingHorizontal: 20, backgroundColor: '#ffffff'}}>
					<LongButton text="회원정보 변경" onPress={chagneProfile} />
				</Wrap>
			</ScrollView>
			<PostcodeModal
				isShow={showPost}
				setIsShow={setShowPost}
				getPost={getPost}
			/>
			<LoadingModal visible={isLoading} />
		</Container>
	);
};

export default MyProfileEdit;
