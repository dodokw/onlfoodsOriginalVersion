import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallSellerShipStockList} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import LoadingSpinner from '~/Components/LoadingSpinner';
import ShippingCard from '~/Components/ShippingCard/ShippingCard';
import NumberComma from '~/Tools/NumberComma';

const Container = styled.View`
	flex: 1;
`;

const ContentTitleWrap = styled.View`
	flex-direction: row;
	padding: 20px;
`;
const ContentTitle = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
`;

const TotalWrap = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	justify-content: space-between;
	padding: 30px 40px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
`;
const TotalLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${ColorBlue};
	font-size: 20px;
`;

const TotalText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const ListWarning = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
	margin-top: 60px;
`;

function Shipping() {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [data, setData] = useState();
	const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(false);

	const getData = async () => {
		setLoading(true);
		try {
			const res = await APICallSellerShipStockList(user.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				const newData = decode.data.map(item => ({...item, selected: false}));
				const onlyData = newData.filter(item => parseInt(item.pt_qty) > 0);
				console.log(onlyData);
				setData(onlyData);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const onCheck = async idx => {
		const newData = data.map(item =>
			item.idx === idx ? {...item, selected: !item.selected} : item,
		);
		setData(newData);
	};

	useEffect(() => getData(), []);

	useEffect(() => {
		if (data) {
			let sum = 0;
			const newData = data.filter(item => item.selected);
			newData.forEach(item => {
				const value = parseInt(item.pt_qty) * parseInt(item.pt_in_price);
				sum += value;
			});
			setTotal(sum);
			console.log(newData);
		}
	}, [data]);

	return (
		<Container>
			<ContentTitleWrap>
				<ContentTitle style={{flex: 1, textAlign: 'center'}}>??????</ContentTitle>
				<ContentTitle style={{flex: 2, textAlign: 'center'}}>
					????????????
				</ContentTitle>
				<ContentTitle style={{flex: 5, textAlign: 'center'}}>
					?????????
				</ContentTitle>
				<ContentTitle style={{flex: 2, textAlign: 'center'}}>
					?????????
				</ContentTitle>
				<ContentTitle style={{flex: 3, textAlign: 'center'}}>??????</ContentTitle>
			</ContentTitleWrap>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<FlatList
					contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 50}}
					data={data}
					keyExtractor={item => `Inven-${item.idx}`}
					renderItem={({item}) => (
						<ShippingCard item={item} onCheck={onCheck} />
					)}
					ListEmptyComponent={
						<ListWarning>????????? ????????? ????????????.</ListWarning>
					}
				/>
			)}
			<TotalWrap>
				<TotalLabel>?????? :</TotalLabel>
				<TotalText>{NumberComma(total)}???</TotalText>
			</TotalWrap>
		</Container>
	);
}

export default Shipping;
