import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {FlatList} from 'react-native';
import {Modal} from 'react-native';
import {onChange} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {
	APICallItemCodeList,
	APIUpdateStockList,
} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import InventoryCard from '~/Components/InventoryCard/InventoryCard';
import LongButton from '~/Components/LongButton/LongButton';

const Container = styled.View`
	flex: 1;
`;

const Box = styled.SafeAreaView`
	flex: 1;
	padding: 20px 10px;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const HeaderTitle = styled.Text`
	flex: 1;
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const ContentTitleWrap = styled.View`
	flex-direction: row;
	padding: 10px 5px;
	margin: 0px 10px;
`;
const ContentTitle = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
	text-align: center;
`;

const Bar = styled.TouchableOpacity`
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
	padding: 10px 0;
`;

const ItemTitle = styled.Text`
	width: 80px;
	font-size: 14px;
	font-family: ${FONTNanumGothicRegular};
	color: ${ColorLineGrey};
	text-align: center;
`;

const ItemContent = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicBold};
`;

const OptionBox = styled.KeyboardAvoidingView`
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
	padding: 20px;
`;

const OptionLabel = styled.Text`
	width: 70px;
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
`;

const OptionInput = styled.TextInput`
	flex: 1;
	text-align: center;
	padding: 5px;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;

const OptionButton = styled.TouchableOpacity`
	background-color: ${ColorBlue};
	border-radius: 10px;
	padding: 10px;
	margin: 0 5px;
`;

const OptionButtonLabel = styled.Text`
	color: #ffffff;
	text-align: center;
	font-size: 12px;
	font-family: ${FONTNanumGothicBold};
`;

const EmptyLabel = styled.Text`
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	color: ${ColorLineGrey};
	margin: 5px 0;
`;

const CodeBox = ({item, onPress}) => {
	return (
		<Bar onPress={onPress}>
			<Wrap>
				<ItemTitle>?????????</ItemTitle>
				<ItemContent>{item.pt_title}</ItemContent>
			</Wrap>
			<Wrap>
				<ItemTitle>????????????</ItemTitle>
				<ItemContent>{item.pt_code}</ItemContent>
			</Wrap>
		</Bar>
	);
};

const StockSetModal = ({visible, setVisible, stockList, getData}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [data, setData] = useState([]);
	const [qty, setQty] = useState('');
	const [price, setPrice] = useState('');
	const [status, setStatus] = useState('?????????');
	const [isLoading, setLoading] = useState(false);

	const onCheck = pt_idx => {
		const newData = data.map(item =>
			item.pt_idx === pt_idx ? {...item, check: !item.check} : item,
		);
		setData(newData);
	};

	const onChange = (list, type, value) => {
		const newData = data.map(item =>
			list.includes(item.pt_idx) ? {...item, [type]: value} : item,
		);
		setData(newData);
	};

	const onUpdate = async () => {
		try {
			setLoading(true);
			const res = await APIUpdateStockList(user.mt_idx, data);
			if (res.result === 'true') {
				console.log(res);
				Alert.alert('??????', '?????? ????????? ?????????????????????.', [
					{
						text: '??????',
						onPress: () => {
							getData();
							setVisible(false);
						},
					},
				]);
			}
		} catch (error) {
			console.error();
		}
		setLoading(false);
	};

	useEffect(() => {
		if (visible) {
			const newData = stockList.filter(item => item.check);
			const newData2 = newData.map(item => ({...item, check: false}));
			setData(newData2);
		}
	}, [visible]);

	return (
		<Modal animationType="fade" visible={visible} transparent={true}>
			<Container>
				<Box>
					<Wrap
						style={{
							alignItems: 'center',
							margin: 10,
						}}>
						<Wrap style={{flex: 1}}>
							<BackButton onPress={() => setVisible(false)} />
						</Wrap>
						<HeaderTitle>?????? ??????</HeaderTitle>
						<Wrap style={{flex: 1}}></Wrap>
					</Wrap>
					<ContentTitleWrap>
						<ContentTitle style={{flex: 1.5}}>??????</ContentTitle>
						<ContentTitle style={{flex: 2}}>????????????</ContentTitle>
						<ContentTitle style={{flex: 2.2, marginHorizontal: 3}}>
							????????????
						</ContentTitle>
						<ContentTitle style={{flex: 4}}>?????????</ContentTitle>
						<ContentTitle style={{flex: 2}}>??????</ContentTitle>
						<ContentTitle style={{flex: 3}}>??????</ContentTitle>
					</ContentTitleWrap>
					<FlatList
						bounces={false}
						data={data}
						keyExtractor={(item, index) => `Inventory-${item.pt_idx}`}
						renderItem={({item}) => (
							<InventoryCard
								item={item}
								onCheck={onCheck}
								onChange={onChange}
								edit
							/>
						)}
						contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 50}}
					/>
					<OptionBox
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						keyboardVerticalOffset={44}>
						<EmptyLabel>* ????????? ???????????? ??????????????? ????????????.</EmptyLabel>
						<Wrap style={{marginBottom: 10}}>
							<OptionLabel>??????</OptionLabel>
							<OptionInput
								value={qty}
								onChangeText={text => setQty(text.replace(/[^0-9]/g, ''))}
								placeholder="?????? ??????????????????."
								maxLength={10}
							/>
							<OptionButton
								onPress={() =>
									onChange(
										data.filter(item => item.check).map(item => item.pt_idx),
										'pt_qty',
										qty === '' ? '0' : qty,
									)
								}>
								<OptionButtonLabel>????????????</OptionButtonLabel>
							</OptionButton>
						</Wrap>
						<Wrap style={{marginBottom: 10}}>
							<OptionLabel>??????</OptionLabel>
							<OptionInput
								value={price}
								onChangeText={text => setPrice(text.replace(/[^0-9]/g, ''))}
								placeholder="?????? ??????????????????."
								maxLength={10}
							/>
							<OptionButton
								onPress={() =>
									onChange(
										data.filter(item => item.check).map(item => item.pt_idx),
										'pt_price',
										price === '' ? '0' : price,
									)
								}>
								<OptionButtonLabel>????????????</OptionButtonLabel>
							</OptionButton>
						</Wrap>
						<Wrap style={{marginBottom: 10}}>
							<OptionLabel>????????????</OptionLabel>
							<Wrap style={{flex: 1}}>
								<OptionButton
									onPress={() => setStatus('?????????')}
									style={{
										flex: 1,
										backgroundColor:
											status === '?????????' ? ColorBlue : '#ffffff',
									}}>
									<OptionButtonLabel
										style={{
											color: status === '?????????' ? '#ffffff' : ColorBlue,
										}}>
										?????????
									</OptionButtonLabel>
								</OptionButton>
								<OptionButton
									onPress={() => setStatus('????????????')}
									style={{
										flex: 1,
										backgroundColor:
											status === '????????????' ? ColorRed : '#ffffff',
									}}>
									<OptionButtonLabel
										style={{
											color: status === '????????????' ? '#ffffff' : ColorRed,
										}}>
										????????????
									</OptionButtonLabel>
								</OptionButton>
							</Wrap>
							<OptionButton
								onPress={() =>
									onChange(
										data.filter(item => item.check).map(item => item.pt_idx),
										'pt_status',
										status,
									)
								}>
								<OptionButtonLabel>????????????</OptionButtonLabel>
							</OptionButton>
						</Wrap>
						<Wrap style={{margin: 10}}>
							<LongButton
								text="?????? ??????"
								color={ColorBlue}
								radius={10}
								onPress={onUpdate}
								disabled={isLoading}
							/>
						</Wrap>
					</OptionBox>
				</Box>
			</Container>
		</Modal>
	);
};

export default StockSetModal;
