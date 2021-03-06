import React, {useState} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APISendComplete} from '~/API/ChattingAPI/ChattingAPI';
import {APIDelOrderList} from '~/API/MyPageAPI/MyPageAPI';
import {
	ColorBlue,
	ColorLineGrey,
	ColorLowBlue,
	ColorLowRed,
	ColorRed,
} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import CancelModal from '~/Components/Modal/CancelModal/CancelModal';
import NumberComma from '~/Tools/NumberComma';

const Container = styled.View`
	border-radius: 10px;
	border-width: 1px;
	border-color: #dfdfdf;
	background-color: #ffffff;
	margin-bottom: 5px;
	overflow: hidden;
`;

const ItemHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 20px;
	border-color: #dfdfdf;
	border-bottom-width: 0.5px;
`;
const ItemCodeWrap = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;
const ItemCodeLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 12px;
	margin-right: 5px;
`;
const ItemCodeText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
`;

const ItemDelButton = styled.TouchableOpacity``;

const ItemContent = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 10px;
`;

const ItemImageWrap = styled.View`
	width: 100px;
	height: 100px;
	padding: 5px;
	border-radius: 50px;
	border-width: 1px;
	border-color: #dfdfdf;
`;

const ItemImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
`;

const ItemContentInfo = styled.View`
	flex: 1;
	margin-left: 10px;
`;

const ItemUser = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-bottom: 5px;
`;

const ItemHp = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	margin-bottom: 5px;
`;

const ItemTitle = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 16px;
`;
const ItemPrice = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	margin-bottom: 10px;
`;
const ItemPriceBold = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-bottom: 10px;
`;
const Dive = styled.View`
	height: 0.5px;
	background-color: #dfdfdf;
`;
const DiveR = styled.View`
	width: 1px;
	background-color: #dfdfdf;
`;

const ItemPeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
	font-size: 10px;
	margin-bottom: 3px;
`;

const ItemLocation = styled.View`
	flex-direction: row;
	align-items: center;
	margin: 10px 0;
`;
const ItemLocationText = styled.Text`
	flex: 1;
	margin-left: 5px;
	font-size: 11px;
`;

const ItemButtonContainer = styled.View`
	flex-direction: row;
	border-top-width: 1px;
	border-color: #dfdfdf;
`;

const ItemButton = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 15px;
`;
const ItemButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: ${ColorRed};
`;
const ItemButtonCancel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
`;

const InventoryStateBox = styled.View`
	border-width: 1px;
	border-color: ${props => (props.color ? ColorRed : ColorBlue)};
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	margin: 5px;
	padding: 3px 0;
`;
const InventoryStateLabel = styled.Text`
	color: ${props => (props.color ? ColorRed : ColorBlue)};
	font-size: 10px;
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
`;

const OrderItemCard = ({item, zzim, getData, state, user, reOrder}) => {
	const [showCancel, setShowCancel] = useState(false);

	const sendComplete = async () => {
		try {
			const res = await APISendComplete('complete', user.mt_idx, item.od_idx);
			if (res.result === 'true') {
				console.log('??????');
				getData();
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const doCancel = async reason => {
		setShowCancel(false);
		sendCancel(reason);
	};

	const sendCancel = async cancel_reason => {
		try {
			const res = await APISendComplete(
				'cancel',
				user.mt_idx,
				item.od_idx,
				cancel_reason,
			);
			if (res.result === 'true') {
				console.log('??????');
				getData();
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const sendDel = async () => {
		try {
			const res = await APIDelOrderList(item.od_idx, user.mt_idx);
			if (res.result === 'true') {
				console.log('?????????');
				getData();
			} else {
				Alert.alert('??????', res.message, [{text: '??????'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<Container>
			<ItemHeader>
				<ItemCodeWrap>
					<ItemCodeLabel>????????????</ItemCodeLabel>
					<ItemCodeText>
						{item.ot_code ? item.ot_code : item.pt_item_code}
					</ItemCodeText>
					{item.reorder === 'off' && (
						<InventoryStateBox color={true} style={{width: 45}}>
							<InventoryStateLabel color={true}>????????????</InventoryStateLabel>
						</InventoryStateBox>
					)}
				</ItemCodeWrap>
				{!state && item.od_status !== '1' && (
					<ItemDelButton
						onPress={() =>
							Alert.alert('??????', '?????? ??????????????? ?????????????????????????', [
								{text: '??????', onPress: () => sendDel()},
								{text: '?????? '},
							])
						}>
						<Icon name="x" size={20} />
					</ItemDelButton>
				)}
			</ItemHeader>
			<ItemContent>
				<ItemImageWrap>
					<ItemImage source={{uri: state ? item.mt_image : item.pt_image}} />
				</ItemImageWrap>
				{state ? (
					<ItemContentInfo>
						<ItemUser>{item.mt_name}</ItemUser>
						<ItemHp>????????? {item.mt_hp}</ItemHp>

						<ItemTitle>{item.pt_title}</ItemTitle>
						<ItemPrice>
							????????????
							<ItemPriceBold>
								{item.pt_qty ? item.pt_qty : item.od_qty}
							</ItemPriceBold>
							??? ??????{' '}
							<ItemPriceBold>{NumberComma(item.pt_price)}</ItemPriceBold>???
						</ItemPrice>
						{/* <Dive />
					<ItemLocation>
						<SvgXml xml={ic_location} />
						<ItemLocationText>????????? 4km</ItemLocationText>
					</ItemLocation> */}
						<ItemPeriodText>????????? {item.ot_wdate}</ItemPeriodText>
						{item.ot_dsdate && (
							<ItemPeriodText>?????? ????????? {item.ot_dsdate}</ItemPeriodText>
						)}
						{item.ot_cdate && (
							<ItemPeriodText>?????? ????????? {item.ot_cdate}</ItemPeriodText>
						)}
						{item.ot_cancel_reason && (
							<ItemPeriodText
								style={{
									backgroundColor: '#f1f1f1',
									color: '#555',
									padding: 5,
								}}>
								?????? ?????? : {item.ot_cancel_reason}
							</ItemPeriodText>
						)}
					</ItemContentInfo>
				) : (
					<ItemContentInfo>
						<ItemTitle>{item.pt_title}</ItemTitle>
						<ItemPrice>
							????????????
							<ItemPriceBold>
								{item.pt_qty ? item.pt_qty : item.od_qty}
							</ItemPriceBold>
							??? ??????{' '}
							<ItemPriceBold>{NumberComma(item.pt_price)}</ItemPriceBold>???
						</ItemPrice>
						{/* <Dive />
					<ItemLocation>
						<SvgXml xml={ic_location} />
						<ItemLocationText>????????? 4km</ItemLocationText>
					</ItemLocation> */}
						<ItemPeriodText>????????? {item.od_wdate}</ItemPeriodText>
						{item.ot_dsdate && (
							<ItemPeriodText>?????? ????????? {item.od_dsdate}</ItemPeriodText>
						)}
						{item.ot_cdate && (
							<ItemPeriodText>?????? ????????? {item.od_cdate}</ItemPeriodText>
						)}
						{item.ot_cancel_reason && (
							<ItemPeriodText
								style={{
									backgroundColor: '#f1f1f1',
									color: '#555',
									padding: 5,
								}}>
								?????? ?????? : {item.ot_cancel_reason}
							</ItemPeriodText>
						)}
					</ItemContentInfo>
				)}
			</ItemContent>
			{item.od_status === '1' && (
				<ItemButtonContainer>
					<ItemButton
						style={{backgroundColor: ColorLowBlue}}
						onPress={() =>
							Alert.alert('??????', '???????????? ?????????????????????????', [
								{text: '??????', onPress: () => sendComplete()},
								{text: '??????'},
							])
						}>
						<ItemButtonLabel style={{color: ColorBlue}}>
							?????? ??????
						</ItemButtonLabel>
					</ItemButton>
					<DiveR />
					<ItemButton
						style={{backgroundColor: ColorLowRed}}
						onPress={() => setShowCancel(true)}>
						<ItemButtonCancel style={{color: ColorRed}}>
							?????? ??????
						</ItemButtonCancel>
					</ItemButton>
				</ItemButtonContainer>
			)}
			{item.od_status === '2' && (
				<>
					<ItemButtonContainer>
						<ItemButton style={{backgroundColor: ColorLowBlue}} disabled={true}>
							<ItemButtonLabel style={{color: ColorBlue}}>
								???????????? ????????? ???????????????.
							</ItemButtonLabel>
						</ItemButton>
					</ItemButtonContainer>
					{!state && item.reorder === 'on' && (
						<ItemButtonContainer>
							<ItemButton
								style={{backgroundColor: ColorLowBlue}}
								onPress={() =>
									Alert.alert('??????', '?????? ????????? ????????? ???????????????????', [
										{text: '??????', onPress: () => reOrder(1, item.od_idx)},
										{text: '??????'},
									])
								}>
								<ItemButtonLabel style={{color: ColorBlue}}>
									?????????
								</ItemButtonLabel>
							</ItemButton>
						</ItemButtonContainer>
					)}
				</>
			)}
			{item.od_status === '3' && (
				<ItemButtonContainer>
					<ItemButton style={{backgroundColor: ColorLowRed}} disabled={true}>
						<ItemButtonLabel style={{color: ColorRed}}>
							???????????? ????????? ???????????????.
						</ItemButtonLabel>
					</ItemButton>
				</ItemButtonContainer>
			)}
			<CancelModal
				visible={showCancel}
				setVisible={setShowCancel}
				doCancel={doCancel}
			/>
		</Container>
	);
};

export default OrderItemCard;
