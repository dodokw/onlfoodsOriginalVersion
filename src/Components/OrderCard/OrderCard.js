import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APISendComplete} from '~/API/ChattingAPI/ChattingAPI';
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
import OrderItem from './OrderItem/OrderItem';

const Container = styled.View``;
const Box = styled.View`
	border-width: 1px;
	border-radius: 10px;
	border-color: ${ColorLineGrey};
	margin: 10px;
	overflow: hidden;
`;
const Header = styled.View`
	background-color: #ffffff;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;
const TypeBox = styled.View`
	background-color: ${ColorBlue};
	padding: 5px;
	border-radius: 5px;
`;

const Type = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #ffffff;
`;
const Content = styled.View`
	background-color: #dfdfdf;
	padding: 10px;
`;
const ContentHeader = styled.View`
	flex-direction: row;
	margin-bottom: 5px;
	padding: 0 5px;
`;
const ContentMain = styled.View`
	max-height: 450px;
`;
const HeaderBox = styled.View`
	flex: ${props => props.flex};
`;
const HeaderText = styled.Text`
	text-align: ${props => (props.left ? 'left' : 'center')};
	color: #333333;
`;

const TotalBox = styled.View`
	background-color: #ffffff;
	padding: 10px 20px;
	flex-direction: row;
	justify-content: space-between;
`;
const TotalLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;
const TotalText = styled.Text`
	font-size: 15px;
	font-family: ${FONTNanumGothicRegular};
`;

const StateBox = styled.View`
	flex-direction: row;
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
`;

const ButtonBox = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 15px;
	background-color: #ffffff;
`;
const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;

const AddressBox = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	padding: 10px 20px;
	align-items: center;
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
`;

const AddressLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;

const AddressText = styled.Text`
	flex: 1;
`;

function OrderCard({
	data,
	zzim,
	od_idx,
	getData,
	getDetailData,
	state,
	reOrder,
}) {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [showCancel, setShowCancel] = useState(false);
	const checkStock = data.delivery_item.filter(
		element => element.reorder === 'on',
	);
	const sendComplete = async () => {
		try {
			const res = await APISendComplete('complete', user.mt_idx, od_idx);
			if (res.result === 'true') {
				console.log('??????');
				getDetailData();
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
				od_idx,
				cancel_reason,
			);
			if (res.result === 'true') {
				console.log('??????');
				getDetailData();
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
			<Box>
				<Header>
					<Title>?????? ??????</Title>
					{/* <TypeBox>
						<Type>{data.delivery_type}</Type>
					</TypeBox> */}
				</Header>
				<Content>
					<ContentHeader>
						<HeaderBox flex={1}>
							<HeaderText>??????</HeaderText>
						</HeaderBox>
						<HeaderBox flex={2}>
							<HeaderText>????????????</HeaderText>
						</HeaderBox>
						<HeaderBox flex={4}>
							<HeaderText ellipsizeMode="tail">?????????</HeaderText>
						</HeaderBox>
						<HeaderBox flex={1}>
							<HeaderText>??????</HeaderText>
						</HeaderBox>
						<HeaderBox flex={2}>
							<HeaderText ellipsizeMode="middle">??????</HeaderText>
						</HeaderBox>
					</ContentHeader>
					<ContentMain>
						<ScrollView bounces={false}>
							{data.delivery_item.map((item, index) => (
								<OrderItem key={index} item={item} items={data} />
							))}
						</ScrollView>
					</ContentMain>
				</Content>
				<TotalBox>
					<TotalLabel style={{width: 80}}>??? ??????</TotalLabel>
					<TotalText>
						<TotalLabel>{NumberComma(data.tot_price)}</TotalLabel>???
					</TotalText>
				</TotalBox>

				{data.delivery_type === '????????????' && (
					<AddressBox>
						<AddressLabel style={{width: 80}}>?????????</AddressLabel>
						<AddressText>{` ${data.od_addr} ${data.od_addr2}`}</AddressText>
						{/* (${data.od_zip}) */}
					</AddressBox>
				)}

				{data.od_status === '1' && (
					<StateBox>
						<ButtonBox
							style={{
								borderColor: ColorLineGrey,
								borderRightWidth: 1,
								backgroundColor: ColorLowBlue,
							}}
							onPress={() =>
								Alert.alert(
									'??????',
									// ${
									// 	data.delivery_type === '????????????' ? '??????' : '??????'
									// }
									`
									?????? ?????? ?????????????????????????`,
									[
										{text: '??????', onPress: () => sendComplete()},
										{text: '??????'},
									],
								)
							}>
							<ButtonLabel
								style={{
									color: ColorBlue,
								}}>
								{/* {data.delivery_type === '????????????' ? '??????' : '??????'} ?????? */}
								?????? ??????
							</ButtonLabel>
						</ButtonBox>
						<ButtonBox
							onPress={() => setShowCancel(true)}
							style={{backgroundColor: ColorLowRed}}>
							<ButtonLabel style={{color: ColorRed}}>?????? ??????</ButtonLabel>
						</ButtonBox>
					</StateBox>
				)}
				{data.od_status === '2' && (
					<>
						<StateBox>
							<ButtonBox
								style={{backgroundColor: ColorLowBlue}}
								disabled={true}>
								<ButtonLabel
									style={{
										color: ColorBlue,
									}}>
									{/* {data.delivery_type === '????????????' ? '??????' : '??????'}?????? */}
									?????? ?????? ????????? ??????????????? .
								</ButtonLabel>
							</ButtonBox>
						</StateBox>
						{!state && checkStock.length > 0 && (
							<StateBox>
								<ButtonBox
									style={{backgroundColor: ColorLowBlue}}
									onPress={() =>
										Alert.alert(
											'??????',
											'????????? ?????? ????????? ?????? ????????? ???????????????????',
											[
												{text: '??????', onPress: () => reOrder(2, od_idx)},
												{text: '??????'},
											],
										)
									}>
									<ButtonLabel
										style={{
											color: ColorBlue,
										}}>
										?????????
									</ButtonLabel>
								</ButtonBox>
							</StateBox>
						)}
					</>
				)}
				{data.od_status === '3' && (
					<StateBox>
						<ButtonBox style={{backgroundColor: ColorLowRed}} disabled={true}>
							<ButtonLabel
								style={{
									color: ColorRed,
								}}>
								???????????? ????????? ???????????????.
							</ButtonLabel>
						</ButtonBox>
					</StateBox>
				)}
			</Box>
			<CancelModal
				visible={showCancel}
				setVisible={setShowCancel}
				doCancel={doCancel}
			/>
		</Container>
	);
}

export default OrderCard;
