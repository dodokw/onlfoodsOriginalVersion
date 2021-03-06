import React, {useCallback, useEffect, useState} from 'react';
import Svg, {G, Path} from 'react-native-svg';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import LinearGradient from 'react-native-linear-gradient';

import {ColorRed} from '~/Assets/Style/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {floatingHide, login} from '~/Modules/Action';
import BackButton from '~/Components/BackButton';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import LoadingModal from '~/Components/LoadingModal';
import {ScrollView} from 'react-native';
import {APISellerSignUp} from '~/API/SignAPI/SignAPI';
import {APICallUserInfoRefresh, APIPaymentLog} from '~/API/MyPageAPI/MyPageAPI';
import jwtDecode from 'jwt-decode';
import {logout} from '@react-native-seoul/kakao-login';
import RNIap, {
	finishTransaction,
	purchaseErrorListener,
	purchaseUpdatedListener,
} from 'react-native-iap';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 18px;
	text-align: center;
	margin: 10px 0;
`;

const Content = styled.View`
	flex: 1;
`;

const CardContainer = styled.TouchableOpacity`
	border-width: 1px;
	border-color: #ec636b;
	border-radius: 5px;
	margin-bottom: 10px;
`;
const LeftWrap = styled.View`
	flex: 1;
`;
const TitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 18px;
	color: ${props => (props.selected ? '#ffffff' : '#FF7199')};
	margin-bottom: 10px;
`;
const Desc = styled.View`
	flex: 1;
	margin-bottom: 10px;
`;

const PriceLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${props => (props.selected ? '#ffffff' : '#FF7199')};
	text-align: center;
`;

const PriceSubLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: ${props => (props.selected ? '#ffffff' : '#000000')};
	text-align: center;
`;

const RightWrap = styled.View`
	align-items: center;
`;
const SubWrap = styled.View`
	flex: 1;
	justify-content: center;
`;
const ServiceLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: ${props => (props.selected ? '#ffffff' : '#CBCBCB')};
	margin-bottom: 10px;
`;
const EventLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: ${props => (props.selected ? '#ffffff' : '#6A6A6A')};
	margin-bottom: 10px;
`;

const SubLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: ${props => (props.selected ? '#ffffff' : '#cbcbcb')};
	margin-bottom: 10px;
`;

const ConfrimButton = styled.TouchableOpacity`
	background-color: ${ColorRed};
	border-radius: 4px;
	height: 60px;
	justify-content: center;
	align-items: center;
	margin: 20px;
`;
const ConfrimLabel = styled.Text`
	color: #ffffff;
	font-family: ${FONTNanumGothicBold};
`;

const DescWrap = styled.View`
	flex: 1;
	align-items: center;
`;

const DescButton = styled.TouchableOpacity`
	margin: 10px;
`;

const DescLabel = styled.Text`
	color: ${ColorRed};
	font-family: ${FONTNanumGothicBold};
`;

//handler
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

//?????? ?????? ID
const itemSubs = Platform.select({default: ['foodinus.seller']});

const SellerService = ({navigation, route}) => {
	const data = route.params.data;
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [service, setService] = useState(1);
	const [timer, setTimer] = useState(null);
	const dispatch = useDispatch();
	const [subscription, setSubscription] = useState(null);
	const [isLoading, setLoading] = useState(false);

	const requestSubscription = () => {
		setLoading(true);
		console.log('??????????????? ID', subscription.productId);
		if (subscription) RNIap.requestSubscription(subscription.productId);
	};

	const getInfo = async () => {
		const res = await APICallUserInfoRefresh(user.mt_idx);
		if (res.result === 'true') {
			const decode = jwtDecode(res.jwt);
			dispatch(login(decode.data));
			navigation.reset({index: 1, routes: [{name: 'Mypage'}]});
		} else {
			Alert.alert(
				'??????',
				'????????? ????????? ???????????? ???????????????. ?????? ?????????????????????.',
				[{text: '??????', onPress: () => dispatch(logout())}],
			);
		}
	};

	const sellerSignUp = async receipt => {
		try {
			console.log('??????????????? ?????????.');
			const res = await APISellerSignUp(
				user.mt_idx,
				data.category,
				data.desc,
				data.time,
				data.phone,
				data.selectAddress,
				data.nowAddress.zip,
				data.nowAddress.address,
				data.nowAddress.sangse,
				data.nowAddress.dong,
				data.nowAddress.lat,
				data.nowAddress.lng,
				data.address.zip,
				data.address.address,
				data.sangse,
				data.address.dong,
				data.address.lat,
				data.address.lng,
				data.isDeliver,
				data.deliverArea,
				data.deliverTime,
				data.deliverPrice,
				data.channel,
				data.payment,
				receipt,
			);
			if (res.result === 'true') {
				console.log('?????????????????????');
				getInfo();
			} else {
				console.log(res);
				const log = await APIPaymentLog(user.mt_idx, JSON.stringify(res));
				Alert.alert(
					'??????',
					'????????? ????????? ?????????????????????. ????????? ????????????. ?????? ?????????????????? ???????????? ????????????????????????.',
					[{text: '??????'}],
				);
				setTimer(null);
				setLoading(false);
			}
		} catch (error) {
			console.error(error);
			setTimer(null);
			setLoading(false);
		}
	};

	const initIAP = useCallback(async () => {
		setLoading(true);
		if (Platform.OS === 'ios') RNIap.clearProductsIOS();

		try {
			const result = await RNIap.initConnection();
			if (Platform.OS === 'android')
				await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
			if (result === false) {
				setLoading(false);
				Alert.alert('??????', '?????? ?????? ????????? ???????????? ???????????????.', [
					{text: '??????'},
				]);
				return;
			}
		} catch (error) {
			setLoading(false);
			console.debug('initConnection');
			console.error('initConnection Error', error.code, error);
		}

		purchaseUpdateSubscription = purchaseUpdatedListener(purchase => {
			const receipt =
				Platform.OS === 'ios'
					? purchase.transactionReceipt
					: purchase.purchaseToken;
			console.log(receipt);
			if (receipt) {
				finishTransaction(purchase)
					.then(() => {
						console.log(purchase, receipt);
						// navigation.reset({
						// 	index: 1,
						// 	routes: [{name: 'Mypage'}],
						// });
						console.log('?????? ??????.');
						setTimer(
							Platform.OS === 'android'
								? JSON.parse(purchase.dataAndroid)
								: receipt,
						);
					})
					.catch(() => {
						setLoading(false);
						setTimer(null);
						Alert.alert('?????? ??????');
					});
			} else {
				setLoading(false);
			}
		});

		purchaseErrorSubscription = purchaseErrorListener(error => {
			console.debug('purchaseErrorListener');
			console.error(error);
			setTimer(null);
			setLoading(false);
		});

		console.log('???????????? ID', itemSubs);
		const subscriptions = await RNIap.getSubscriptions(itemSubs);
		console.log('????????????', subscriptions);
		setSubscription({...subscriptions[0]});
		setLoading(false);
	}, [subscription]);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		initIAP();

		return () => {
			if (purchaseUpdateSubscription) {
				purchaseUpdateSubscription.remove();
			}
			if (purchaseErrorSubscription) {
				purchaseErrorSubscription.remove();
			}
		};
	}, []);

	useEffect(() => {
		if (timer) {
			sellerSignUp(timer);
		}
	}, [timer]);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="????????? ??????"
				border={true}
			/>
			<Content>
				<ScrollView bounces={false} style={{paddingHorizontal: 20}}>
					<Title>????????? ?????? ??????</Title>
					<CardContainer onPress={() => setService(1)}>
						<LinearGradient
							colors={
								service === 1
									? ['#FF6F76', '#FF8A92', '#FF5B9F']
									: ['#FFFFFF', '#FFFFFF']
							}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0}}
							style={{
								borderRadius: 5,
								padding: 20,
								flexDirection: 'row',
							}}>
							<LeftWrap>
								<TitleLabel selected={service === 1 ? true : false}>
									????????? ??????
								</TitleLabel>
								<ServiceLabel selected={service === 1 ? true : false}>
									??????
								</ServiceLabel>
								<EventLabel selected={service === 1 ? true : false}>
									[????????????] ????????? ?????? ??????
								</EventLabel>
								<EventLabel selected={service === 1 ? true : false}>
									[???????????????] ????????? ?????? ??????
								</EventLabel>
								<EventLabel selected={service === 1 ? true : false}>
									[???????????????] ????????? ???????????????
								</EventLabel>
								<SubLabel selected={service === 1 ? true : false}>
									- ???????????? ????????? ?????? ???????????? ????????????
								</SubLabel>
								<SubLabel selected={service === 1 ? true : false}>
									- ????????????
								</SubLabel>
								<EventLabel selected={service === 1 ? true : false}>
									[????????????] ???????????? ??????
								</EventLabel>
								<EventLabel selected={service === 1 ? true : false}>
									?????? ?????? ?????????
								</EventLabel>
							</LeftWrap>
							<RightWrap>
								<PriceLabel selected={service === 1 ? true : false}>
									{subscription ? subscription.localizedPrice + '\n' : ''}
									<PriceSubLabel selected={service === 1 ? true : false}>
										(vat??????)/???
									</PriceSubLabel>
								</PriceLabel>
								<SubWrap style={{alignSelf: 'flex-end', paddingRight: 10}}>
									<Svg
										id="checked"
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										viewBox="0 0 19 19">
										<G id="??????_76" data-name="?????? 76">
											<Path
												id="??????_87"
												data-name="?????? 87"
												d="M9.5,0A9.5,9.5,0,1,0,19,9.5,9.511,9.511,0,0,0,9.5,0Zm5.31,7L8.738,13.024a.934.934,0,0,1-1.31.024L4.214,10.119a.966.966,0,0,1-.071-1.333.942.942,0,0,1,1.333-.048l2.548,2.333,5.429-5.429A.96.96,0,0,1,14.81,7Z"
												fill={service === 1 ? '#ffffff' : '#FF7199'}
											/>
										</G>
									</Svg>
								</SubWrap>
							</RightWrap>
						</LinearGradient>
					</CardContainer>
					<Desc>
						<EventLabel selected={service === 2 ? true : false}>
							* ?????? ???????????? ?????? ?????? 24?????? ??? ?????? ?????? ????????? ?????? ??????
							?????? ?????? ???????????????.
						</EventLabel>
						<EventLabel selected={service === 2 ? true : false}>
							* ?????? ????????? ???????????? ?????? ???????????? ?????? ?????? ?????? ????????? ?????????
							??? ????????????.
						</EventLabel>
						<DescWrap>
							<DescButton
								onPress={() => navigation.navigate('Terms', {type: 1})}>
								<DescLabel>????????????</DescLabel>
							</DescButton>
							<DescButton
								onPress={() => navigation.navigate('Terms', {type: 2})}>
								<DescLabel>????????????????????????</DescLabel>
							</DescButton>
						</DescWrap>
					</Desc>
				</ScrollView>
			</Content>
			<ConfrimButton
				onPress={() => {
					requestSubscription();
					//navigation.reset({index: 1, routes: [{name: 'Mypage'}]});
				}}>
				<ConfrimLabel>????????????</ConfrimLabel>
			</ConfrimButton>
			<LoadingModal visible={isLoading} />
		</Container>
	);
};

export default SellerService;
