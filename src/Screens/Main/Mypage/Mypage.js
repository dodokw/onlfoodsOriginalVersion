import React, {useEffect, useState} from 'react';
import {ScrollView, Share} from 'react-native';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import ic_setting from '~/Assets/Images/ic_setting.svg';
import {SvgXml} from 'react-native-svg';
import ic_mymenu01 from '~/Assets/Images/ic_mymenu01.svg';
import ic_mymenu02 from '~/Assets/Images/ic_mymenu02.svg';
import ic_salermenu01 from '~/Assets/Images/ic_salermenu01.svg';
import ic_salermenu02 from '~/Assets/Images/ic_salermenu02.svg';
import ic_salermenu03 from '~/Assets/Images/ic_salermenu03.svg';
import ic_salermenu04 from '~/Assets/Images/ic_salermenu04.svg';
import MyMenuButton from '~/Components/MyMenuButton';
import Menubar from '~/Components/Menubar';
import SwitchingButton from '~/Components/SwitchingButton';
import {useDispatch, useSelector} from 'react-redux';
import {
	floatingHide,
	logout,
	reset,
	saleroff,
	saleron,
	setScreen,
} from '~/Modules/Action';
import user_profile from '~/Assets/Images/user_profile.svg';
import {useIsFocused} from '@react-navigation/core';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '~/Components/Modal/CustomModal/index';
import Sharing from '~/Tools/Share';
import {APICallMemberInfo, APICallSellerCheck} from '~/API/MyPageAPI/MyPageAPI';
import jwtDecode from 'jwt-decode';
import ServiceInfo from '~/Screens/Main/Mypage/SellerRegister/ServiceInfo';
import Footer from '~/Components/Footer';

const Container = styled.View`
	flex: 1;
`;

const MyInfoContainer = styled.View`
	background-color: #ffffff;
	flex-direction: row;
	margin-bottom: 5px;
	padding: 10px 20px;
	align-items: center;
`;

const MyProfileImageWrap = styled.View`
	width: 60px;
	height: 60px;
	background-color: #f8f8f8;
	border-width: 1px;
	border-color: #e6ebee;
	border-radius: 50px;
	justify-content: center;
	align-items: center;
`;

const MyProfileImage = styled.Image`
	width: 60px;
	height: 60px;
	border-radius: 50px;
`;

const MyInfoWrap = styled.View`
	flex: 1;
	margin-left: 10px;
	justify-content: center;
`;

const MyNameText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 18px;
`;
const MyNameLabel = styled.Text`
	font-size: 14px;
`;
const MyGradeWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const MyGradeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #444;
`;

const AdminWeb = styled.View``;
const AdminWebLabel = styled.Text`
	font-size:11px;
	color:#777;
`;

const RedLabel = styled.Text`
	color: #ec636b;
	font-size: 14px;
`;

const SubscribeButton = styled.TouchableOpacity`
	border-width: 0.5px;
	border-color: #e6ebee;
	padding: 5px 10px;
	justify-content: center;
	align-items: center;
	margin-left: 5px;
`;

const SubscribeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #7b7b7b;
`;

const MyInfoSettingButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	padding: 10px;
	border-radius: 50px;
	background-color: #f8f8f8;
`;

const MyMenuContainer = styled.View`
	background-color: #ffffff;
	flex-direction: row;
	padding: 20px;
	margin-bottom: 5px;
	justify-content: space-around;
`;

const SubConatiner = styled.View`
	flex: 1;
	background-color: #ffffff;
	padding: 20px;
	padding-bottom: 60px;
`;

const TitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin: 10px 0;
`;

const Dive = styled.View`
	border-top-width: 1px;
	border-color: #dfdfdf;
	margin: 10px 0;
`;

function Mypage({navigation}) {
	const {state} = useSelector(state => state.loginReducer);
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const seller = useSelector(state => state.loginReducer.user.slt_info);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [showSub, setShowSub] = useState(false);
	const [footerData, setFooterData] = useState();
	
	const changeState = () => {
		if (seller === null) {
			Alert.alert('??????', ' ?????? ?????? ??? ?????? ???????????????.', [{text: '??????', onPress:()=>setShowSub(true)}]);
		} else {
			if (state) dispatch(saleroff());
			else dispatch(saleron());
		}
	};

	const goLogout = async () => {
		await AsyncStorage.removeItem('login');
		await AsyncStorage.removeItem('key');
		await AsyncStorage.removeItem('biz');
		await AsyncStorage.removeItem('me');
		dispatch(logout());
		dispatch(reset());
	};

	const checkSubscribe = async () => {
		try {
			const res = await APICallMemberInfo(user.mt_idx);
			const decode = jwtDecode(res.jwt);
			console.log(decode.data);
			if (
				decode.data.slt_file1 === '' ||
				decode.data.slt_file2 === ''
			 	//decode.data.slt_file3 === ''
			) {
				Alert.alert(
					'??????',
					'????????? ?????? ????????? ????????????. ?????? ?????? ??? ?????? ????????? ????????????.',
					[
						{text: '??????', onPress: () => navigation.navigate('MyProfileEdit')},
						{text: '??????'},
					],
				);
			} else {
				const address = {
					zip: decode.data.slt_zip,
					address: decode.data.slt_addr,
					sangse: decode.data.slt_addr2,
					lat: decode.data.slt_lat,
					lng: decode.data.slt_lng,
					dong: decode.data.slt_dong,
				};
				navigation.navigate('SellerRegister', {address: address});
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (isFocused) {
			dispatch(floatingHide());
			dispatch(setScreen('MyPageNav'));
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: true});
			if (user.mt_hp === null) {
				Alert.alert('??????', '??????????????? ??????????????????. ?????????????????????????', [
					{text: '??????', onPress: () => navigation.navigate('SNSSignUp')},
					{text: '??????', onPress: () => navigation.goBack()},
				]);
			}
		}
	}, [isFocused]);

	useEffect(()=>{
		settingBanner();
	});

	const settingBanner = async ()=>{
		const str=await AsyncStorage.getItem('Banner');
		const banner=JSON.parse(str);
		// console.log(banner.setup);
		setFooterData(banner.setup);
	}

	return (
		<Container>
			<Header
				title="???????????????"
				headerRight={
					<SwitchingButton onToggle={state} onPress={() => changeState()} />
				}
			/>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingBottom: 50}}>
				<MyInfoContainer>
					<MyProfileImageWrap>
						<MyProfileImage
							source={{uri: user.mt_image1}}
							resizeMode="stretch"
						/>
					</MyProfileImageWrap>
					<MyInfoWrap>
						<MyNameText>
							{user.mt_name}
							<MyNameLabel>???</MyNameLabel>
						</MyNameText>
						<MyGradeWrap>
							<MyGradeLabel>
								???????????? ??????{' '}
								<RedLabel>
									{user.mt_level == 5 ? '?????????' : '????????????'}
								</RedLabel>
							</MyGradeLabel>
							{/* <SubscribeButton
										>
										<SubscribeLabel>??????</SubscribeLabel>
									</SubscribeButton> */}

							{user.mt_level !== 5 && (
								<SubscribeButton onPress={() => setShowSub(true)}>
									<SubscribeLabel>??????</SubscribeLabel>
								</SubscribeButton>
							)}
						</MyGradeWrap>
						{user.mt_level ==5 &&
						<AdminWeb><AdminWebLabel>????????? ???????????? (onlfoods.com/seller)</AdminWebLabel></AdminWeb>
					}
					</MyInfoWrap>
					<MyInfoSettingButton
						onPress={() =>
							navigation.navigate(state ? 'SellerProfileEdit' : 'MyProfileEdit')
						}>
						<SvgXml xml={ic_setting} />
					</MyInfoSettingButton>
				</MyInfoContainer>
				<MyMenuContainer>
					{state ? (
						<>
							<MyMenuButton
								icon={<SvgXml xml={ic_salermenu01} />}
								label="????????????"
								onPress={() => navigation.navigate('InventoryManagement')}
							/>
							<MyMenuButton
								icon={<SvgXml xml={ic_salermenu02} />}
								label="????????????"
								onPress={() => {
									if (user.mt_level == 4)
										Alert.alert('??????', '?????????????????? ?????? ???????????????.', [
											{text: '??????'},
										]);
									else navigation.navigate('EventManagement');
								}}
							/>
							{/* <MyMenuButton
								icon={<SvgXml xml={ic_salermenu03} />}
								label="????????????"
								onPress={() => navigation.navigate('RegularCustomer')}
							/> */}
							<MyMenuButton
								icon={<SvgXml xml={ic_salermenu04} />}
								label="????????????"
								onPress={() =>
									navigation.navigate('OrderHistory', {
										od_mt_idx: undefined,
										before: 'Mypage',
									})
								}
							/>
						</>
					) : (
						<>
							<MyMenuButton
								icon={<SvgXml xml={ic_mymenu01} />}
								label="????????????"
								onPress={() => navigation.navigate('RegularCompany')}
							/>
							<MyMenuButton
								icon={<SvgXml xml={ic_mymenu02} />}
								label="????????????"
								onPress={() =>
									navigation.navigate('OrderHistory', {
										od_mt_idx: undefined,
										before: 'Mypage',
									})
								}
							/>
						</>
					)}
				</MyMenuContainer>
				<SubConatiner>
					<TitleLabel>?????? ??????</TitleLabel>
					<Menubar
						label="???????????? ??????"
						onPress={() => navigation.navigate('PushSetting', {state})}
					/>
					<Dive />
					<TitleLabel>??????</TitleLabel>
					<Menubar
						label="????????????"
						onPress={() => navigation.navigate('NoticeList')}
					/>
					<Menubar
						label="??????????????????(FAQ)"
						onPress={() => navigation.navigate('FAQ')}
					/>
					<Menubar
						label="1:1 ???????????????"
						onPress={() =>
							navigation.navigate('CustomService', {qt_idx: undefined})
						}
					/>
					<Menubar label="???????????? ??? ??????" onPress={() => Sharing()} />
					<Menubar
						label="????????????"
						onPress={() => navigation.navigate('Terms', {type: 1})}
					/>
					<Menubar
						label="????????????????????????"
						onPress={() => navigation.navigate('Terms', {type: 2})}
					/>
					<Menubar
						label="????????????"
						onPress={() =>
							Alert.alert('??????', '???????????? ???????????????????', [
								{text: '????????????', onPress: () => goLogout()},
								{text: '??????'},
							])
						}
					/>
					<Menubar
						label="????????????"
						onPress={() => navigation.navigate('ExitService')}
					/>

					{/* {!seller && (
						<>
							<Dive />
							<TitleLabel>????????????</TitleLabel>
							<Menubar label="???????????????" />
							<Dive />
						</>
					)} */}
				</SubConatiner>

				{/* {footerData && <Footer item={footerData} />} */}
			</ScrollView>
			{/* <CustomModal
				visible={user.mt_id === 'no' && isFocused}
				title="????????? ??????"
				subText={
					'???????????? ????????? ????????? ???????????? ?????? ????????? ??????????????? ????????????.\n????????? ???????????????????'
				}
				cancelLabel="?????????"
				cancelAction={() => navigation.navigate('TodayInNav')}
				confirmLabel="?????????"
				confirmAction={() => goLogout()}
			/> */}

			
			<ServiceInfo
				visible={showSub}
				setVisible={setShowSub}
				checkSubscribe={checkSubscribe}
			/>
			
		</Container>
	);
}

export default Mypage;
