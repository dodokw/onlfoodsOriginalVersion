import React from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_new from '~/Assets/Images/ic_new.svg';
import {SvgXml} from 'react-native-svg';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {Checkbox} from 'react-native-paper';
import NumberComma from '~/Tools/NumberComma';
import {TouchableWithoutFeedback} from 'react-native';
const Container = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	border-width: 1px;
	border-color: #dfdfdf;
	border-radius: 5px;
	padding: 10px 5px;
	margin-bottom: 5px;
`;
const InventoryStateBox = styled.View`
	border-width: 1px;
	border-color: ${props => (props.color ? ColorRed : ColorBlue)};
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	margin-right: 5px;
	padding: 3px 0;
`;
const InventoryStateLabel = styled.Text`
	color: ${props => (props.color ? ColorRed : ColorBlue)};
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
`;

const InventoryText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
	font-size: 12px;
	color: #333333;
`;
const InventoryNewWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const InventoryNewLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 10px;
	color: ${ColorRed};
`;

const InventoryNameWrap = styled.View`
	justify-content: center;
	align-items: flex-start;
`;

const InventorySelectedBox = styled.View``;

const ShippingCard = ({item, onCheck}) => {
	return (
		<TouchableWithoutFeedback
			disabled={item.pt_status}
			onPress={() => onCheck(item.idx)}>
			<Container>
				{item.pt_status ? (
					<InventoryStateBox
						color={item.pt_status === '판매정지'}
						style={{flex: 2}}>
						<InventoryStateLabel color={item.pt_status === '판매정지'}>
							{item.pt_status}
						</InventoryStateLabel>
					</InventoryStateBox>
				) : (
					<InventorySelectedBox style={{flex: 1}}>
						<Checkbox.Android
							status={item.selected ? 'checked' : 'unchecked'}
							color="#639aec"
							onPress={() => onCheck(item.idx)}
						/>
					</InventorySelectedBox>
				)}
				<InventoryText style={{flex: 2, fontSize: 9}}>
					{item.pt_code + '\n' + item.pt_code2}
				</InventoryText>
				<InventoryNameWrap style={{flex: 5}}>
					{item.pt_type === '오늘입고' && (
						<InventoryNewWrap>
							<SvgXml xml={ic_new} />
							<InventoryNewLabel>오늘만</InventoryNewLabel>
						</InventoryNewWrap>
					)}
					<InventoryText
						numberOfLines={item.pt_type === '오늘입고' ? 1 : 2}
						style={{textAlign: 'left'}}>
						{item.pt_title}
					</InventoryText>
				</InventoryNameWrap>
				<InventoryText
					style={{flex: 2, color: item.pt_status ? '#000000' : ColorRed}}>
					{item.pt_qty}
				</InventoryText>
				<InventoryText style={{flex: 3}}>
					{NumberComma(item.pt_price ? item.pt_price : item.pt_in_price)}원
				</InventoryText>
			</Container>
		</TouchableWithoutFeedback>
	);
};

export default ShippingCard;
