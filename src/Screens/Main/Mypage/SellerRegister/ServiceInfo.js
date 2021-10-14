import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Modal, Platform} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Logo from '~/Assets/Images/seller_sub.svg';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import RNIap, {
	InAppPurchase,
	SubscriptionPurchase,
	finishTransaction,
	purchaseErrorListener,
	purchaseUpdatedListener,
	Subscription,
	PurchaseError,
} from 'react-native-iap';

const Container = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.7);
	justify-content: center;
	padding: 0 10px;
`;

const Box = styled.SafeAreaView`
	border-radius: 20px;
	border-color: ${ColorLineGrey};
	justify-content: center;
	padding: 20px;
`;

const LogoBox = styled.View`
	justify-content: center;
	align-items: center;
`;

const LogoLabel = styled.Text`
	//font-family: ${FONTNanumGothicBold};
	font-weight: bold;
	color: ${ColorRed};
	text-align: center;
	font-size: 24px;
`;

const LogoSubLabel = styled.Text`
	//font-family: ${FONTNanumGothicBold};
	font-weight: bold;
	color: ${ColorRed};
	text-align: center;
	font-size: 18px;
`;

const SubInfoBox = styled.View`
	margin: 10px 50px;
	align-items: center;
`;

const SubInfoLabel = styled.Text`
	width: ${Dimensions.get('screen').width / 2}px;
	padding-left: 10px;
	font-weight: bold;
	color: #ffffff;
	font-size: 16px;
`;

const RedLabel = styled.Text`
	color: ${ColorRed};
`;

const ButtonBox = styled.View`
	margin: 10px 0;
`;

const Button = styled.TouchableOpacity`
	padding: 10px;
	border-radius: 20px;
	margin: 10px;
	align-items: center;
`;

const ButtonLabel = styled.Text`
	font-weight: bold;
	font-size: 18px;
	color: #ffffff;
	text-align: center;
`;

const itemSubs = Platform.select({default: ['foodinus.seller']});

function ServiceInfo({visible, setVisible, checkSubscribe}) {
	const [subscription, setSubscription] = useState({
		title: '판매자 구독',
		localizedPrice: '',
	});

	async function init() {
		if (Platform.OS === 'ios') RNIap.clearProductsIOS();
		try {
			const result = await RNIap.initConnection();
			if (Platform.OS === 'android')
				await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
			if (result === false) {
				Alert.alert('알림', '인앱 상품 정보를 가져오지 못했습니다.', [
					{text: '확인'},
				]);
				return;
			}
			const subscriptions = await RNIap.getSubscriptions(itemSubs);
			console.log('구독상품', subscriptions);
			setSubscription({...subscriptions[0]});
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (visible) {
			init();
		}
	}, [visible]);

	return (
		<Modal visible={visible} setVisible={setVisible} transparent={true}>
			<Container>
				<Box>
					<LogoBox>
						<SvgXml xml={Logo} />
					</LogoBox>
					<LogoLabel>판매자 구독</LogoLabel>
					<LogoSubLabel>구독하시면 아래와 같은 혜택이 제공됩니다.</LogoSubLabel>
					<SubInfoBox>
						<SubInfoLabel>
							- <RedLabel>오늘입고</RedLabel> 상품 등록
						</SubInfoLabel>
						<SubInfoLabel>
							- <RedLabel>오늘의 행사</RedLabel> 글 등록
						</SubInfoLabel>
						<SubInfoLabel>
							- <RedLabel>업체</RedLabel> 노출 및 <RedLabel>재고</RedLabel> 현황
							노출
						</SubInfoLabel>
						<SubInfoLabel>
							- 재고 관리 <RedLabel>웹페이지</RedLabel> 제공
						</SubInfoLabel>
					</SubInfoBox>
					<ButtonBox>
						<Button
							style={{backgroundColor: ColorRed}}
							onPress={() => {
								setVisible(false);
								checkSubscribe();
							}}>
							<ButtonLabel>추가정보 입력하고 구독하기</ButtonLabel>
							{subscription.localizedPrice !== '' && (
								<SubInfoLabel style={{fontSize: 12, textAlign: 'center'}}>
									VAT포함 {subscription.localizedPrice}
								</SubInfoLabel>
							)}
						</Button>
						<Button onPress={() => setVisible(false)}>
							<ButtonLabel>괜찮아요. 다음에 할께요</ButtonLabel>
						</Button>
					</ButtonBox>
				</Box>
			</Container>
		</Modal>
	);
}

export default ServiceInfo;
