import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';

import NumberComma from '~/Tools/NumberComma';

const Container = styled.View`
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
`;
const ItemText = styled.Text`
	color: #333333;
	text-align: ${props => props.textAlign};
`;

function OrderItem({item}) {
	return (
		<Container>
			<ItemBox flex={1}>
				<ItemText textAlign="center" style={{fontSize: 10}}>
					{item.reorder === 'on' ? (
						<Icon name="check" size={16} color={ColorBlue} />
					) : (
						<Icon name="x" size={16} color={ColorRed} />
					)}
				</ItemText>
			</ItemBox>
			<ItemBox flex={2}>
				<ItemText textAlign="center" style={{fontSize: 10}}>
					{item.pt_item_code}
				</ItemText>
			</ItemBox>
			<ItemBox flex={4}>
				<ItemText textAlign="center" ellipsizeMode="tail" numberOfLines={2}>
					{item.pt_title}
				</ItemText>
			</ItemBox>
			<ItemBox flex={1}>
				<ItemText textAlign="center">{item.pt_qty}</ItemText>
			</ItemBox>
			<ItemBox flex={2}>
				<ItemText textAlign="right">{NumberComma(item.pt_price)}원</ItemText>
			</ItemBox>
		</Container>
	);
}

export default OrderItem;
