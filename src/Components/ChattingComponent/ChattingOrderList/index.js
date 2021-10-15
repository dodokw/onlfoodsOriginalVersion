import React from 'react';
import {useState} from 'react';
import {Modal} from 'react-native';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
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
import LongButton from '~/Components/LongButton/LongButton';
import CancelModal from '~/Components/Modal/CancelModal/CancelModal';
import PostcodeModal from '~/Components/Modal/PostcodeModal';
import OrderSettingModal from '~/Screens/Main/ChattingList/ChattingPage/OrderSettingModal/OrderSettingModal';
import NumberComma from '~/Tools/NumberComma';
import ChattingItemBox from './ChattingItemBox';

const Container = styled.View`
	width:100%;
	flex-direction: ${props => (props.me ? 'row-reverse' : 'row')};
	align-items: flex-start;
`;
const Box = styled.View`
	border-width: 5px;
	border-radius: 10px;
	border-color: ${props => props.color};
	margin: 10px;
	overflow: hidden;
	width:80%;
`;
const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
`;

const Wrap = styled.View`
	flex-direction: row;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
`;
const TypeBox = styled.View`
	background-color: #555555;
	padding: 5px;
	border-radius: 5px;
`;

const Type = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
`;
const Content = styled.View`
	background-color: #eee;
	padding: 10px;
`;
const ContentHeader = styled.View`
	flex-direction: row;
	margin-bottom: 5px;
`;
const ContentMain = styled.View``;
const HeaderBox = styled.View`
	flex: ${props => props.flex};
`;
const HeaderText = styled.Text`
	text-align: ${props => (props.left ? 'left' : 'center')};
	color: #333333;
`;

const ButtonBox = styled.TouchableOpacity`
	background-color: ${props => props.color};
	padding: 10px 20px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const ButtonLabel = styled.Text`
	color: ${props => props.color};
	font-family: ${FONTNanumGothicBold};
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

const TimeLabel = styled.Text`
	color: ${ColorLineGrey};
	font-family: ${FONTNanumGothicRegular};
	text-align: right;
	padding: 0 10px;
`;

const ModalBackground = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
	padding: 0 10px;
`;
const ModalBox = styled.View`
	width: 100%;
	background-color: #ffffff;
	padding: 10px;
	border-radius: 5px;
`;

const ModalTitle = styled.Text`
	color: ${ColorRed};
	font-family: ${FONTNanumGothicBold};
	text-align: center;
	font-size: 16px;
	margin: 10px 0px;
`;

const RowWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	border-radius: 5px;
	border-color: #cecece;
	border-width: 1px;
	align-items: center;

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

const ActionButton = styled.TouchableOpacity`
	border-color: ${ColorRed};
	border-width: 1px;
	justify-content: center;
	align-items: center;
	height: 50px;
	padding: 10px 25px;
	border-radius: 5px;
	background-color: ${props => props.color};
`;

const ActionButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${props => props.color};
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

const defualtAddr = {
	addr1: '',
	zip: '',
};

function ChattingOrderList({
	data,
	state,
	showAddress,
	time,
	od_idx,
	me,
	deliver_type,
	sendOrderList,
	sendConfirm,
	sendComplete,
	sendCancel,
	exit,
}) {
	const [items, setItems] = useState(
		data ? data.map(item => ({...item, check: true})) : [],
	);
	const [showOrderSetting, setShowOrderSetting] = useState(false);
	const [showCancel, setShowCancel] = useState(false);
	const [showAddr, setShowAddr] = useState(false);
	const [address, setAddress] = useState(defualtAddr);
	const [sangse, setSangse] = useState('');
	const [showPost, setShowPost] = useState(false);
	const [block, setBlock] = useState(false);
	const getTotal = () => {
		let total = 0;
		items.forEach(element => {
			total += parseInt(element.pt_price) * parseInt(element.pt_qty);
		});
		return NumberComma(total);
	};

	const doCancel = async reason => {
		setShowCancel(false);
		sendCancel(od_idx, reason);
	};

	const getPost = address => {
		console.log(address);
		setAddress({addr1: address.address, zip: res.road_address.zone_no});
		setShowPost(false);
		setShowAddr(true);
	};

	const goRequest = () => {
		Alert.alert('알림', '주문 요청을 하시겠습니까?', [
			{text: '확인', onPress: () => sendConfirm(od_idx)},
			{text: '취소'},
		]);
	};

	const goConfirm = () => {
		if (address.address === '' || sangse === '') {
			Alert.alert('알림', '주소를 입력해주세요.', [{text: '확인'}]);
		} else {
			sendConfirm(od_idx, address, sangse);
		}
	};

	const goCancel = () => {
		setAddress(defualtAddr);
		setSangse('');
		setShowAddr(false);
	};

	return (
		<Container me={me}>
			<Box color={me ? ColorRed : '#eee'}>
				<Header>
					<Title>주문 목록</Title>
					{/* <TypeBox>
						<Type>{deliver_type}</Type>
					</TypeBox> */}
				</Header>
				<Content>
					<ContentHeader>
						{/* {state !== 'req' && (
							<HeaderBox flex={1}>
								<HeaderText>선택</HeaderText>
							</HeaderBox>
						)} */}
						<HeaderBox flex={2}>
							<HeaderText>품목코드</HeaderText>
						</HeaderBox>
						<HeaderBox flex={3}>
							<HeaderText left={true} ellipsizeMode="tail">
								품목명
							</HeaderText>
						</HeaderBox>
						<HeaderBox flex={1}>
							<HeaderText>수량</HeaderText>
						</HeaderBox>
						{state !== 'req' && (
							<HeaderBox flex={2}>
								<HeaderText ellipsizeMode="middle">단가</HeaderText>
							</HeaderBox>
						)}
					</ContentHeader>
					<ContentMain>
						{items.map(item => (
							<ChattingItemBox
								key={`orderItem-${od_idx}-${item.pt_idx}`}
								item={item}
								setItems={setItems}
								items={items}
								state={state}
							/>
						))}
					</ContentMain>
				</Content>
				{state !== 'req' && (
					<TotalBox>
						<TotalLabel>총 금액</TotalLabel>
						<TotalText>
							<TotalLabel>{getTotal()}</TotalLabel>원
						</TotalText>
					</TotalBox>
				)}

				{showAddress.addr1 !== null && (
					<AddressBox>
						<AddressLabel style={{width: 80}}>배송지</AddressLabel>
						<AddressText>
							{`${showAddress.addr1} ${showAddress.addr2}`}
							{/* (${showAddress.zip}) */}
						</AddressText>
					</AddressBox>
				)}

				{state === 'req' && !me && (
					<ButtonBox
						color={ColorLowBlue}
						onPress={() => setShowOrderSetting(true)}
						disabled={exit}>
						<ButtonLabel color={ColorBlue}>{deliver_type} 견적작성</ButtonLabel>
					</ButtonBox>
				)}

				{state === 'res' && !me && (
					<ButtonBox
						color={ColorLowRed}
						onPress={goRequest}
						disabled={block || exit}>
						<ButtonLabel color={ColorRed}>주문요청</ButtonLabel>
					</ButtonBox>
				)}
				{state === 'confirm' && (
					<Wrap>
						<ButtonBox
							style={{flex: 1}}
							color={ColorLowBlue}
							onPress={() =>
								Alert.alert('알림', '거래완료 처리하시겠습니까?', [
									{
										text: '확인',
										onPress: () => {
											setBlock(true);
											sendComplete(od_idx);
										},
									},
									{text: '취소'},
								])
							}
							disabled={block || exit}>
							<ButtonLabel color={ColorBlue}>
								{/* {deliver_type === '배송주문' ? '배송' : '픽업'}완료 */}
								거래완료
							</ButtonLabel>
						</ButtonBox>
						<ButtonBox
							style={{flex: 1}}
							color={ColorLowRed}
							onPress={() => setShowCancel(true)}
							disabled={block || exit}>
							<ButtonLabel color={ColorRed}>주문취소</ButtonLabel>
						</ButtonBox>
					</Wrap>
				)}
				{state === 'complete' && (
					<ButtonBox color={ColorLowBlue} disabled={true}>
						<ButtonLabel color={ColorBlue}>
							{/* {deliver_type === '배송주문' ? '배송' : '픽업'}완료 처리된
							주문입니다. */}
							거래완료 처리된 주문입니다.
						</ButtonLabel>
					</ButtonBox>
				)}
				{state === 'cancel' && (
					<ButtonBox color={ColorLowRed} disabled={true}>
						<ButtonLabel color={ColorRed}>
							거래취소 처리된 주문입니다.
						</ButtonLabel>
					</ButtonBox>
				)}
			</Box>
			<TimeLabel>{time.slice(0, 5)}</TimeLabel>
			<OrderSettingModal
				visible={showOrderSetting}
				setVisible={setShowOrderSetting}
				items={items}
				od_idx={od_idx}
				sendOrderList={sendOrderList}
			/>
			{/* <PostcodeModal
				isShow={showPost}
				setIsShow={setShowPost}
				getPost={getPost}
			/> */}
			{/* <Modal visible={showAddr} transparent={true}>
				<ModalBackground>
					<ModalBox>
						<ModalTitle>배송받으실 주소를 입력해주세요.</ModalTitle>
						<RowWrap>
							<InputBox
								style={{
									flex: 1,
									paddingHorizontal: 10,
								}}>
								<TextInput
									placeholder="주소"
									value={address.addr1}
									editable={false}
								/>
							</InputBox>
							<EditButton
								style={{marginLeft: 5}}
								onPress={() => {
									setShowAddr(false);
									setShowPost(true);
								}}>
								<EditButtonLabel>검색</EditButtonLabel>
							</EditButton>
						</RowWrap>
						<RowWrap>
							<InputBox
								style={{
									flex: 1,
									paddingHorizontal: 10,
								}}>
								<TextInput
									placeholder="상세주소"
									value={sangse}
									onChangeText={text => setSangse(text)}
								/>
							</InputBox>
						</RowWrap>
						<RowWrap>
							<ActionButton
								style={{flex: 1, marginRight: 3}}
								color={ColorRed}
								onPress={() =>
									Alert.alert('알림', '위 주소로 주문하시겠습니까?', [
										{text: '확인', onPress: () => goConfirm()},
										{text: '취소'},
									])
								}>
								<ActionButtonLabel color="#ffffff">주문하기</ActionButtonLabel>
							</ActionButton>
							<ActionButton
								style={{flex: 1, marginLeft: 3}}
								color="#ffffff"
								onPress={() =>
									Alert.alert('알림', '배송지 입력을 취소하시겠습니까?', [
										{text: '확인', onPress: () => goCancel()},
										{text: '취소'},
									])
								}>
								<ActionButtonLabel color={ColorRed}>취소하기</ActionButtonLabel>
							</ActionButton>
						</RowWrap>
					</ModalBox>
				</ModalBackground>
			</Modal> */}
			<CancelModal
				visible={showCancel}
				setVisible={setShowCancel}
				doCancel={doCancel}
				setBlock={setBlock}
			/>
		</Container>
	);
}

export default ChattingOrderList;
