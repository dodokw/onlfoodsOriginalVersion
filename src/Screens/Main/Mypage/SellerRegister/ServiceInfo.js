import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Modal, Platform} from 'react-native';
import {SvgXml} from 'react-native-svg';
import checkOn from '~/Assets/Images/autoLogin_checkedOn.svg'
import checkOff from '~/Assets/Images/autoLogin_checkedOff.svg'
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
import { useNavigation } from '@react-navigation/core';

const Container = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.7);
	justify-content: center;
	padding: 0 10px;
`;

const Box = styled.SafeAreaView`
	border-radius: 20px;
	border-color: ${ColorLineGrey};
	// justify-content: center;
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
	// align-items: center;
	width:100%
`;

const SubInfoLabel = styled.Text`
	// width: ${Dimensions.get('screen').width / 2}px;
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

const SellerTermWrap = styled.TouchableOpacity`
	padding-left: 5px;
	justify-content:center;
	align-items:center;
`;
const SellerTermLabel = styled.Text`
	color:#fff;
	border-width:1px;
	padding:5px 10px;
	border-color:#fff;
`;
const ContractWrap = styled.View`
	padding-left: 55px;
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;
const ContranctCheckButton = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

function ServiceInfo({visible, setVisible, checkSubscribe}) {
	const navigation = useNavigation();
	const [check, setCheck] = useState(false);
	const goTerms = async type => {
		setVisible(false);
		return navigation.navigate('Terms', {type});
	};
	const [subscription, setSubscription] = useState({
		title: '????????? ??????',
		localizedPrice: '',
	});

	const checkContract = () => {
		if(!check){
			Alert.alert('??????', '???????????? ??????????????? ????????? ???????????????. ??????????????? ??????????????????.', [
				{text: '??????'},
			]);
		}else{
			setVisible(false);
			checkSubscribe();
		}
	}

	async function init() {
		if (Platform.OS === 'ios') RNIap.clearProductsIOS();
		try {
			const result = await RNIap.initConnection();
			if (Platform.OS === 'android')
				await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
			if (result === false) {
				Alert.alert('??????', '?????? ?????? ????????? ???????????? ???????????????.', [
					{text: '??????'},
				]);
				return;
			}
			const subscriptions = await RNIap.getSubscriptions(itemSubs);
			console.log('????????????', subscriptions);
			setSubscription({...subscriptions[0]});
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (visible) {
			init();
		}else{
			setCheck(false);
		}
	}, [visible]);
	
	return (
		<Modal visible={visible} setVisible={setVisible} transparent={true}>
			<Container>
				<Box>
					<LogoBox>
						<SvgXml xml={Logo} />
					</LogoBox>
					<LogoLabel>?????? ??????</LogoLabel>
					<LogoSubLabel>??????????????? ????????? ?????? ????????? ???????????????.</LogoSubLabel>
					<SubInfoBox>
						<SubInfoLabel>
							- <RedLabel>?????????</RedLabel> ?????? ??????
						</SubInfoLabel>
						<SubInfoLabel>
							- <RedLabel>????????????/????????????</RedLabel> ?????? ??? <RedLabel>????????????</RedLabel>
						</SubInfoLabel>
						<SubInfoLabel>
							- <RedLabel>?????? ????????????</RedLabel> ????????? ??????
						</SubInfoLabel>
						<SubInfoLabel>
							- ????????? <RedLabel>?????? ????????????</RedLabel> ??????
						</SubInfoLabel>
					</SubInfoBox>
					<ContractWrap>
					<ContranctCheckButton onPress={() => setCheck(true)}>
					<SvgXml xml={check ? checkOn : checkOff}/>
					<SellerTermWrap onPress={()=>goTerms(5)}><SellerTermLabel>???????????? ????????????</SellerTermLabel></SellerTermWrap>
					</ContranctCheckButton>
					</ContractWrap>
					<ButtonBox>
						<Button
							style={{backgroundColor: ColorRed}}
							onPress={() => {
								checkContract();
							}}>
							<ButtonLabel>???????????? ???????????? ????????????</ButtonLabel>
							{subscription.localizedPrice !== '' && (
								<SubInfoLabel style={{fontSize: 12, textAlign: 'center'}}>
									VAT?????? {subscription.localizedPrice}
								</SubInfoLabel>
							)}
						</Button>
						<Button onPress={() => setVisible(false)}>
							<ButtonLabel>????????????. ????????? ?????????</ButtonLabel>
						</Button>
					</ButtonBox>
				</Box>
			</Container>
		</Modal>
	);
}

export default ServiceInfo;
