import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {FlatList} from 'react-native';
import {Modal} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {APICallItemCodeList} from '~/API/MyPageAPI/MyPageAPI';
import {ColorBlue, ColorLineGrey} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';

const Container = styled.View`
	flex: 1;
`;

const Box = styled.SafeAreaView`
	flex: 1;
	padding: 20px;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
`;

const HeaderTitle = styled.Text`
	flex: 1;
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	text-align: center;
`;

const Button = styled.TouchableOpacity``;

const SearchBox = styled.View`
	padding: 10px;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	border-radius: 10px;
	flex-direction: row;
	align-items: center;
	margin: 10px 10px;
`;

const SearchInput = styled.TextInput`
	flex: 1;
	padding: 0;
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

const EmptyLabel = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicRegular};
	text-align: center;
`;

const CodeBox = ({item, onPress}) => {
	return (
		<Bar onPress={onPress}>
			<Wrap>
				<ItemTitle>상품명</ItemTitle>
				<ItemContent>{item.pt_title}</ItemContent>
			</Wrap>
			<Wrap>
				<ItemTitle>상품코드</ItemTitle>
				<ItemContent>{item.pt_code}</ItemContent>
			</Wrap>
		</Bar>
	);
};

const CodeSearchModal = ({visible, setVisible, confirm}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [keyword, setKeyword] = useState('');
	const [data, setData] = useState([]);

	const onSearch = async () => {
		try {
			const res = await APICallItemCodeList(user.mt_idx, keyword);
			if (res.result === 'true') {
				const decdoe = jwtDecode(res.jwt);
				console.log(decdoe);
				setData(decdoe.data);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
				setData([]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (visible) {
			setKeyword('');
			setData([]);
		}
	}, [visible]);

	return (
		<Modal visible={visible} transparent={true}>
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
						<HeaderTitle>상품코드검색 </HeaderTitle>
						<Wrap style={{flex: 1}}></Wrap>
					</Wrap>

					<SearchBox>
						<SearchInput
							value={keyword}
							onChangeText={text => setKeyword(text)}
							placeholder="상품명을 입력해주세요."
							onSubmitEditing={onSearch}
						/>
						<Button onPress={onSearch}>
							<Icon name="search" size={25} color={ColorBlue} />
						</Button>
					</SearchBox>
					<FlatList
						style={{padding: 10}}
						bounces={false}
						data={data}
						keyExtractor={item => `code-${item}`}
						renderItem={({item}) => (
							<CodeBox
								item={item}
								onPress={() => {
									setVisible(false);

									confirm(item);
								}}
							/>
						)}
						ListEmptyComponent={
							<EmptyLabel>상품명으로 검색해주세요.</EmptyLabel>
						}
					/>
				</Box>
			</Container>
		</Modal>
	);
};

export default CodeSearchModal;
