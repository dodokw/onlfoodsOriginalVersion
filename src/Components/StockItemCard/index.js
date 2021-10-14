import React from 'react';
import styled from 'styled-components/native';
import {Checkbox} from 'react-native-paper';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {useEffect} from 'react';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import {SvgXml} from 'react-native-svg';
import ic_new from '~/Assets/Images/ic_new.svg';

const Container = styled.View`
	background-color: #ffffff;
	flex-direction: row;
	align-items: center;
	border-radius: 10px;
	margin-top: 3px;
	margin-bottom: 3px;
	padding: 10px 10px;
`;
const ItemBox = styled.View`
	flex: ${props => props.flex};
`;
const ItemText = styled.Text`
	color: #333333;
	text-align: ${props => props.textAlign};
`;
const ItemInputText = styled.TextInput`
	text-align: center;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	padding: 0px;
	color: #000000;
`;

const InventoryNewWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const InventoryNewLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 10px;
	color: ${ColorRed};
	margin-top: 3px;
`;

function StockItemCard({
	item,
	setItems,
	items,
	max,
	input,
	setList,
	list,
	setSelectedItem,
	selectedItem,
}) {
	const onChagneCount = text => {
		console.log(text, max);
		if (parseInt(text) > parseInt(max)) {
			setSelectedItem(
				selectedItem.map(value =>
					value.pt_idx === item.pt_idx ? {...value, pt_qty: max} : value,
				),
			);
		} else {
			setSelectedItem(
				selectedItem.map(value =>
					value.pt_idx === item.pt_idx ? {...value, pt_qty: text} : value,
				),
			);
		}
	};

	const onCheck = () => {
		if (input) {
			const newSelect = selectedItem.map(value =>
				item.pt_idx == value.pt_idx ? {...value, check: !value.check} : value,
			);
			setSelectedItem(newSelect);
		} else {
			const newItems = items.map(value =>
				value.pt_idx === item.pt_idx ? {...value, check: !item.check} : value,
			);
			console.log(newItems);
			const getItem = items.find(value => value.pt_idx === item.pt_idx);
			const inItem = {...getItem, pt_qty: '1', check: !item.check};
			console.log(inItem);
			setItems(newItems);

			if (item.check === false) {
				setSelectedItem([...selectedItem, inItem]);
			} else {
				const newSelect = selectedItem.filter(
					value => inItem.pt_idx !== value.pt_idx,
				);
				setSelectedItem(newSelect);
			}
		}
	};

	return (
		<Container>
			<ItemBox flex={1}>
				<Checkbox.Android
					color={ColorBlue}
					status={item.check ? 'checked' : 'unchecked'}
					onPress={onCheck}
				/>
			</ItemBox>
			<ItemBox flex={2}>
				<ItemText textAlign="center">{item.pt_code}</ItemText>
			</ItemBox>
			<ItemBox flex={3}>
				{item.pt_type === '오늘입고' && (
					<InventoryNewWrap>
						<SvgXml xml={ic_new} />
						<InventoryNewLabel>오늘만</InventoryNewLabel>
					</InventoryNewWrap>
				)}
				<ItemText
					textAlign="left"
					ellipsizeMode="tail"
					numberOfLines={item.pt_type === '오늘입고' ? 1 : 2}>
					{item.pt_title}
				</ItemText>
			</ItemBox>

			
			<ItemBox flex={1}>
				{input ? (
					<ItemInputText
						value={item.pt_qty}
						onChangeText={text => onChagneCount(text)}
						keyboardType="number-pad"
					/>
				) : (
					<ItemText textAlign="center">{item.pt_qty}</ItemText>
				)}
			</ItemBox>
			{/* <ItemBox flex={2}>
				<ItemText textAlign="right">{item.pt_price}원</ItemText>
			</ItemBox> */}
		</Container>
	);
}

export default StockItemCard;
