import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {
	ColorBlue,
	ColorLineGrey,
	ColorLowBlue,
	ColorRed,
} from '~/Assets/Style/Colors';
import ic_search from '~/Assets/Images/ic_search.svg';
import {SvgXml} from 'react-native-svg';
import InventoryCard from '~/Components/InventoryCard/InventoryCard';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {useSelector} from 'react-redux';
import {
	APICallSellerProductList,
	APIDelStockList,
} from '~/API/MyPageAPI/MyPageAPI';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/Feather';
import {Alert, FlatList, Modal} from 'react-native';
import LoadingSpinner from '~/Components/LoadingSpinner';
import {check} from 'prettier';
import {useIsFocused} from '@react-navigation/core';
import StockSetModal from '~/Components/Modal/StockSetModal/StockSetModal';

const Container = styled.View`
	flex: 1;
`;

const SearchBox = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	padding: 5px 10px;
	border-width: 1px;
	border-radius: 5px;
	border-color: ${ColorLineGrey};
`;

const SearchInput = styled.TextInput`
	flex: 1;
	padding: 5px;
	color: #000000;
`;

const CategoryWrap = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	padding: 5px 10px;
	align-items: center;
	justify-content: space-between;
`;

const CategoryButton = styled.TouchableOpacity`
	flex: 1;
	border-radius: 25px;
	padding: 10px 15px;
	background-color: ${props => (props.selected ? ColorLowBlue : '#ffffff')};
`;
const CategoryButtonLabel = styled.Text`
	color: ${props => (props.selected ? ColorBlue : '#7b7b7b')};
	text-align: center;
`;

const SearchWrap = styled.View`
	flex-direction: row;
	align-items: center;
	background-color: #ffffff;
	padding: 5px;
`;

const SearchButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
`;

const ContentWrap = styled.View`
	flex: 1;
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

const ListWarning = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
	margin-top: 60px;
`;

const ContentOptionWrap = styled.View`
	flex-direction: row;
	padding: 15px;
	align-items: center;
	justify-content: space-between;
	background-color: #ffffff;
	border-top-width: 1px;
	border-color: ${ColorLineGrey};
`;

const OptionButton = styled.TouchableOpacity`
	flex: 1;
	padding: 10px;
	margin: 5px;
	background-color: ${ColorBlue};
	border-radius: 5px;
`;

const OptionButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	font-size: 15px;
	text-align: center;
`;

const defaultCategoryList = [
	{name: '??????', key: ''},
	{name: '??????', key: 1},
	{name: '??????', key: 2},
	{name: '??????', key: 3},
	{name: '??????', key: 4},
	{name: '??????', key: 5},
];

const InventoryState = ({navigation, date}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const isFocused = useIsFocused();
	const [category, setCategory] = useState('');
	const [data, setData] = useState([]);
	const [list, setList] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [showEdit, setShowEdit] = useState(false);

	const getData = async () => {
		setLoading(true);
		try {
			const res = await APICallSellerProductList(user.mt_idx, '', date);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				const newData = decode.data.map(item => ({...item, check: false}));
				setData(newData);
				setList(newData);
			} else {
				setData([]);
				setList([]);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const onSearch = () => {
		const newData = data.filter(item =>
			category === '' ? true : item.ct_id == category,
		);
		const newData2 = newData.filter(item => {
			if (item.pt_title === null) return false;
			return item.pt_title.indexOf(keyword) === -1 ? false : true;
		});
		setList(newData2);
	};

	const onClear = () => {
		setKeyword('');
		setList(data);
	};

	const onCheck = pt_idx => {
		const newData = data.map(item =>
			item.pt_idx === pt_idx ? {...item, check: !item.check} : item,
		);
		setData(newData);
	};

	const onRemove = async () => {
		const newData = data.filter(item => item.check);
		const delList = newData.map(item => item.pt_idx);
		try {
			const res = await APIDelStockList(delList.join(','));
			if (res.result === 'true') {
				getData();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const goEdit = () => {
		const newData = data.filter(item => item.check);
		if (newData.length === 0) {
			Alert.alert('??????', '????????? ????????? ????????????.', [{text: '??????'}]);
		} else {
			setShowEdit(true);
		}
	};

	useEffect(() => {
		console.log(data);
		onSearch();
	}, [data]);

	useEffect(() => {
		if (isFocused) getData();
	}, [isFocused, date]);

	useEffect(() => {
		const newData = data.filter(item =>
			category === '' ? true : item.ct_id == category,
		);
		setList(newData);
	}, [category]);

	return (
		<Container>
			<CategoryWrap>
				{defaultCategoryList.map((item, index) => (
					<CategoryButton
						key={index}
						selected={item.key === category}
						onPress={() => setCategory(item.key)}>
						<CategoryButtonLabel selected={item.key === category}>
							{item.name}
						</CategoryButtonLabel>
					</CategoryButton>
				))}
			</CategoryWrap>
			<SearchWrap>
				<SearchBox>
					<SearchInput
						placeholder="????????? ??????"
						placeholderColor="#7b7b7b"
						value={keyword}
						onChangeText={text => setKeyword(text)}
					/>
					{keyword.length > 0 && (
						<SearchButton
							onPress={onClear}
							style={{
								marginHorizontal: 5,
								padding: 3,
								backgroundColor: '#777777',
								borderRadius: 50,
							}}>
							<Icon name="x" size={12} color="#ffffff" />
						</SearchButton>
					)}
				</SearchBox>
				<SearchButton
					style={{paddingVertical: 5, paddingHorizontal: 10}}
					onPress={onSearch}>
					<SvgXml xml={ic_search} />
				</SearchButton>
			</SearchWrap>
			<ContentWrap>
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
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<FlatList
						data={list}
						keyExtractor={(item, index) => `Inventory-${item.pt_idx}`}
						renderItem={({item}) => (
							<InventoryCard item={item} onCheck={onCheck} />
						)}
						contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 50}}
						ListEmptyComponent={
							<ListWarning>????????? ????????? ????????????.</ListWarning>
						}
					/>
				)}
			</ContentWrap>
			<ContentOptionWrap>
				<OptionButton onPress={() => navigation.navigate('EnrollInventory')}>
					<OptionButtonLabel>????????????</OptionButtonLabel>
				</OptionButton>
				<OptionButton onPress={goEdit}>
					<OptionButtonLabel>????????????</OptionButtonLabel>
				</OptionButton>
				<OptionButton
					onPress={() =>
						Alert.alert('??????', '????????? ?????????????????????????', [
							{text: '??????', onPress: () => onRemove()},
							{text: '??????'},
						])
					}>
					<OptionButtonLabel>????????????</OptionButtonLabel>
				</OptionButton>
			</ContentOptionWrap>
			<StockSetModal
				visible={showEdit}
				setVisible={setShowEdit}
				stockList={data}
				getData={getData}
			/>
		</Container>
	);
};

export default InventoryState;
