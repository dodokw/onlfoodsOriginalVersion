import {Checkbox} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import LongButton from '~/Components/LongButton/LongButton';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {FONTNanumGothicRegular} from '../../../../../Assets/Style/Fonts';
import {ActivityIndicator} from 'react-native';
import {Alert} from 'react-native';
import {parse} from 'react-native-svg';

const Container = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.5);
	justify-content: center;
	align-items: center;
	padding: 50px 20px;
`;

const Header = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 20px;
`;

const HeaderTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	text-align: center;
`;

const CancelButton = styled.TouchableOpacity``;

const Box = styled.View`
	background-color: #ffffff;
	border-radius: 5px;
	width: 100%;
	height: 100%;
`;

const ItemSection = styled.View`
	flex: 1;
`;

const ContentHeader = styled.View`
	padding: 10px;
	flex-direction: row;
	margin-bottom: 5px;
	border-bottom-width: 1px;
	border-color: ${ColorLineGrey};
`;
const HeaderBox = styled.View`
	flex: ${props => props.flex};
`;
const HeaderText = styled.Text`
	text-align: ${props => (props.left ? 'left' : 'center')};
	color: #333333;
`;

const ButtonSection = styled.View``;

const ItemBar = styled.View`
	background-color: #ffffff;
	flex-direction: row;
	align-items: center;
	border-radius: 10px;
	margin-top: 3px;
	margin-bottom: 3px;
	padding: 10px 5px;
`;
const ItemBox = styled.View`
	flex: ${props => props.flex};
	margin: 0 3px;
`;
const ItemText = styled.Text`
	color: #333333;
	font-family: ${FONTNanumGothicRegular};
	text-align: ${props => props.textAlign};
`;
const ItemInputText = styled.TextInput`
	text-align: center;
	font-family: ${FONTNanumGothicRegular};
	border-width: 1px;
	border-color: ${ColorLineGrey};
	padding: 0px;
	color: #000000;
`;

const LoadingBox = styled.View`
	width: 100%;
	height: 50px;
	background-color: ${ColorRed};
	justify-content: center;
	align-items: center;
`;

const StockItemCard = ({items, item, setItems}) => {
	const onChagneCount = text => {
		setItems(
			items.map(value =>
				value.pt_idx === item.pt_idx ? {...value, pt_qty: text} : value,
			),
		);
	};

	const onChangePrice = text => {
		setItems(
			items.map(value =>
				value.pt_idx === item.pt_idx ? {...value, pt_price: text} : value,
			),
		);
	};

	return (
		<ItemBar>
			<ItemBox flex={1}>
				<Checkbox.Android
					color={ColorBlue}
					status={item.check ? 'checked' : 'unchecked'}
					onPress={() => {
						setItems(
							items.map(value => {
								if (value.pt_idx === item.pt_idx) {
									return {...value, check: !value.check};
								} else {
									return value;
								}
							}),
						);
					}}
				/>
			</ItemBox>
			<ItemBox flex={2}>
				<ItemText textAlign="center">{item.pt_code}</ItemText>
			</ItemBox>
			<ItemBox flex={3}>
				<ItemText textAlign="left" ellipsizeMode="tail" numberOfLines={2}>
					{item.pt_title}
				</ItemText>
			</ItemBox>
			<ItemBox flex={1}>
				<ItemInputText
					value={item.pt_qty}
					onChangeText={text => onChagneCount(text.replace(/[^0-9]/g, ''))}
					keyboardType="number-pad"
					maxLength={4}
				/>
			</ItemBox>
			<ItemBox flex={2}>
				<ItemInputText
					value={item.pt_price}
					onChangeText={text => onChangePrice(text.replace(/[^0-9]/g, ''))}
					keyboardType="number-pad"
				/>
			</ItemBox>
		</ItemBar>
	);
};

function OrderSettingModal({
	visible,
	setVisible,
	items,
	od_idx,
	sendOrderList,
}) {
	const [data, setData] = useState(items);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) {
			const checkData = data.filter(element => element.check === true);
			const emptyCheck = checkData.filter(
				element => element.pt_qty === '' || element.pt_price === '',
			);
			if (emptyCheck.length > 0) {
				return Alert.alert('알림', '수량 및 가격을 입력해주세요.', [
					{text: '확인', onPress: () => setLoading(false)},
				]);
			}

			if (checkData.length > 0) {
				Alert.alert('알림', '견적을 발송하시겠습니까?', [
					{
						text: '확인',
						onPress: () => {
							sendOrderList(od_idx, checkData);
							setVisible(false);
						},
					},
					{
						text: '취소',
						onPress: () => setLoading(false),
					},
				]);
			} else {
				Alert.alert('알림', '상품을 하나도 선택하지 않았습니다.', [
					{text: '확인', onPress: () => setLoading(false)},
				]);
			}
		}
	}, [loading]);

	return (
		<Modal visible={visible} transparent={true}>
			<Container>
				<Box>
					<Header>
						<ItemSection></ItemSection>
						<ItemSection>
							<HeaderTitle>견적 작성하기</HeaderTitle>
						</ItemSection>
						<ItemSection style={{alignItems: 'flex-end'}}>
							<CancelButton onPress={() => setVisible(false)}>
								<Icon name="x" size={20} />
							</CancelButton>
						</ItemSection>
					</Header>
					<ItemSection>
						<ContentHeader>
							<HeaderBox flex={1}>
								<HeaderText>선택</HeaderText>
							</HeaderBox>
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
							<HeaderBox flex={2}>
								<HeaderText ellipsizeMode="middle">가격</HeaderText>
							</HeaderBox>
						</ContentHeader>
						<ScrollView>
							{data.map(element => (
								<StockItemCard
									key={element.pt_idx}
									item={element}
									setItems={setData}
									items={data}
								/>
							))}
						</ScrollView>
					</ItemSection>
					<ButtonSection>
						{loading ? (
							<LoadingBox>
								<ActivityIndicator size="small" color="#ffffff" />
							</LoadingBox>
						) : (
							<LongButton
								text="견적 작성"
								color={ColorRed}
								onPress={() => setLoading(true)}
								disabled={loading}
							/>
						)}
					</ButtonSection>
				</Box>
			</Container>
		</Modal>
	);
}

export default OrderSettingModal;
