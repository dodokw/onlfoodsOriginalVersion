import React from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_new from '~/Assets/Images/ic_new.svg';
import {SvgXml} from 'react-native-svg';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {Checkbox} from 'react-native-paper';
import NumberComma from '~/Tools/NumberComma';
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

const Box = styled.View`
	flex: ${props => props.flex};
	justify-content: center;
`;

const InventoryStateBox = styled.View`
	border-width: 1px;
	border-color: ${props => (props.color ? ColorRed : ColorBlue)};
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	padding: 3px 0;
`;
const InventoryStateLabel = styled.Text`
	color: ${props => (props.color ? ColorRed : ColorBlue)};
	font-size: 10px;
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
	letter-spacing: -0.3px;
`;

const InventoryText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
	font-size: 12px;
	color: #333333;
	margin: 0 3px;
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

const InventoryInput = styled.TextInput`
	border-width: 1px;
	border-color: ${ColorLineGrey};
	padding: 0;
	margin: 0 1px;
	text-align: center;
`;

function InventoryCard({item, onCheck, edit, onChange}) {
	return (
		<Container>
			<Box flex={1.5}>
				<Checkbox.Android
					color={ColorBlue}
					status={item.check ? 'checked' : 'unchecked'}
					onPress={() => onCheck(item.pt_idx)}
				/>
			</Box>
			<Box flex={2}>
				<InventoryStateBox color={item.pt_status === '판매정지'}>
					<InventoryStateLabel color={item.pt_status === '판매정지'}>
						{item.pt_status}
					</InventoryStateLabel>
				</InventoryStateBox>
			</Box>
			<Box flex={2.2}>
				<InventoryText
					style={{fontSize: 9, letterSpacing: -0.3}}
					numberOfLines={2}>
					{item.pt_code + '\n' + item.pt_code2}
				</InventoryText>
			</Box>
			<Box flex={4}>
				<InventoryNameWrap>
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
			</Box>
			<Box flex={2}>
				{edit ? (
					<InventoryInput
						value={item.pt_qty}
						onChangeText={text =>
							onChange([item.pt_idx], 'pt_qty', text.replace(/[^0-9]/g, ''))
						}
						maxLength={10}
					/>
				) : (
					<InventoryText style={{color: item.pt_status ? '#000000' : ColorRed}}>
						{item.pt_qty}
					</InventoryText>
				)}
			</Box>
			<Box flex={3}>
				{edit ? (
					<InventoryInput
						value={item.pt_price}
						onChangeText={text =>
							onChange([item.pt_idx], 'pt_price', text.replace(/[^0-9]/g, ''))
						}
						maxLength={10}
					/>
				) : (
					<InventoryText>
						{item.pt_price === '0'
							? '채팅문의'
							: NumberComma(item.pt_price) + '원'}
					</InventoryText>
				)}
			</Box>
		</Container>
	);
}

export default InventoryCard;
