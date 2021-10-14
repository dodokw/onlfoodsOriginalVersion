import React from 'react';
import styled from 'styled-components/native';
import {Checkbox} from 'react-native-paper';
import {ColorBlue} from '~/Assets/Style/Colors';
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

function ChattingItemBox({item, setItems, items, state}) {
	return (
		<Container>
			{!state && (
				<ItemBox flex={1}>
					<Checkbox.Android
						color={ColorBlue}
						status={item.check ? 'checked' : 'unchecked'}
						onPress={() =>
							setItems(
								items.map(value => {
									if (value.id === item.id) {
										return {...value, check: !value.check};
									} else {
										return value;
									}
								}),
							)
						}
					/>
				</ItemBox>
			)}

			<ItemBox flex={2}>
				<ItemText textAlign="center">{item.pt_code}</ItemText>
			</ItemBox>
			<ItemBox flex={3}>
				<ItemText textAlign="left" ellipsizeMode="tail" numberOfLines={2}>
					{item.pt_title}
				</ItemText>
			</ItemBox>
			<ItemBox flex={1}>
				<ItemText textAlign="center">{item.pt_qty}</ItemText>
			</ItemBox>
			{state !== 'req' && (
				<ItemBox flex={2}>
					<ItemText textAlign="right">{NumberComma(item.pt_price)}원</ItemText>
				</ItemBox>
			)}
		</Container>
	);
}

export default ChattingItemBox;
