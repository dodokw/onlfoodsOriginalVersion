import React, {useEffect, useRef} from 'react';
import {ic_search} from '~/Assets/Images/ic_search.svg';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {floatingHide} from '~/Modules/Action';
import {ScrollView} from 'react-native';
import {APICallProductSearch, APICallSellerSearch} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import ItemCard from '~/Components/ItemCard';
import {Modal} from 'react-native';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CompanyCard from '~/Components/CompanyCard';
import {Alert} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const HeaderContainer = styled.View`
	flex-direction: row;
	height: 50px;
	align-items: center;
	justify-content: space-between;
	background-color: #ffffff;
	border-bottom-width: ${props => (props.border ? '1px' : '0px')};
	border-color: #dfdfdf;
	padding: 0px 10px;
`;
const HeaderLeftWrap = styled.View`
	width: 50px;
	justify-content: center;
	align-items: flex-start;
`;
const HeaderRightWrap = styled.View`
	width: 50px;
	justify-content: center;
	align-items: center;
`;

const HeaderWrap = styled.View`
	flex: 1;
	justify-content: center;
`;

const SearchBox = styled.View`
	flex-direction: row;
	border-radius: 5px;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	align-items: center;
`;
const SearchBar = styled.TextInput`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	color: #000000;
	padding: 7px 5px;
`;

const SearchButton = styled.TouchableOpacity``;

const Title = styled.Text`
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
	margin: 10px;
`;

const SearchPlzLabel = styled.Text`
	margin: 40px 10px;
	text-align: center;
`;

const ImageBox = styled.View`
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;
const BigImage = styled.Image`
	width: ${WIDTH}px;
	height: 100%;
`;

const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: 50px;
	right: 10px;
`;

const MoreButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
`;
const MoreLabel = styled.Text`
	color: ${ColorLineGrey};
`;

const Search = ({navigation, route}) => {
	const {distance} = route.params;
	const dispatch = useDispatch();
	const {location} = useSelector(state => state.dataReducer);
	const {user} = useSelector(state => state.loginReducer);
	const [keyword, setKeyword] = useState('');
	const [todayInData, setTodayInData] = useState();
	const [sellerData, setSellerData] = useState();
	const [showModal, setShowModal] = useState();
	const todayInPageRef = useRef(1);
	const sellerPageRef = useRef(1);

	const getTodayIn = async num => {
		todayInPageRef.current += num;
		try {
			const res = await APICallProductSearch(
				keyword.trim(),
				location.y,
				location.x,
				distance,
				todayInPageRef.current,
				user.mt_info.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('오늘만', decode.data);
				if (num === 0) setTodayInData(decode.data);
				else {
					if (decode.data.length === 0)
						return Alert.alert('알림', '더보기 상품이 없습니다.', [
							{text: '확인'},
						]);
					setTodayInData([...todayInData, ...decode.data]);
				}
			} else {
				if (num === 0) setTodayInData([]);
			}
		} catch (err) {
			console.error('오늘만', err);
		}
	};

	const getSeller = async num => {
		sellerPageRef.current += num;
		try {
			const res = await APICallSellerSearch(
				keyword.trim(),
				location.y,
				location.x,
				distance,
				sellerPageRef.current,
				user.mt_info.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('판매자', decode.data);
				if (num === 0) setSellerData(decode.data);
				else {
					if (decode.data.length === 0)
						return Alert.alert('알림', '더보기 업체가 없습니다.', [
							{text: '확인'},
						]);
					setSellerData([...sellerData, ...decode.data]);
				}
			} else {
				if (num === 0) setSellerData([]);
			}
		} catch (err) {
			console.error('판매자', err);
		}
	};

	const getData = async () => {
		getSeller(0);
		getTodayIn(0);
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		return () => parent?.setOptions({tabBarVisible: true});
	}, []);

	return (
		<Container>
			<HeaderContainer border={true}>
				<HeaderLeftWrap>
					<BackButton onPress={() => navigation.goBack()} />
				</HeaderLeftWrap>
				<HeaderWrap>
					<SearchBox>
						<SearchBar
							placeholder="상품명 또는 업체명을 입력하세요."
							value={keyword}
							onChangeText={text => setKeyword(text)}
							onSubmitEditing={getData}
						/>
						{keyword.length > 0 && (
							<SearchButton
								onPress={() => setKeyword('')}
								style={{
									margin: 5,
									padding: 5,
									backgroundColor: '#777777',
									borderRadius: 50,
									justifyContent: 'center',
									alignContent: 'center',
								}}>
								<Icon name="x" size={12} color="#ffffff" />
							</SearchButton>
						)}
					</SearchBox>
				</HeaderWrap>
				<HeaderRightWrap>
					<SearchButton onPress={getData}>
						<SvgXml xml={ic_search} />
					</SearchButton>
				</HeaderRightWrap>
			</HeaderContainer>
			{todayInData === undefined ? (
				<SearchPlzLabel>검색어를 입력해주세요.</SearchPlzLabel>
			) : (
				<ScrollView contentContainerStyle={{marginHorizontal: 10}}>
					<Title>오늘만</Title>
					{todayInData.length > 0 ? (
						<>
							{todayInData.map(item => (
								<ItemCard
									key={`InCard-${item.pt_idx}`}
									item={item}
									onPress={() =>
										navigation.navigate('TodayInDetail', {
											pt_idx: item.pt_idx,
											mt_idx: user.mt_info.mt_idx,
											lat: location.y,
											lng: location.x,
											slt_idx: item.mt_seller_idx,
										})
									}
									setShowModal={setShowModal}
								/>
							))}
							<MoreButton onPress={() => getTodayIn(1)}>
								<MoreLabel>
									더 보기{' '}
									<Icon name="chevron-down" size={15} color={ColorRed} />
								</MoreLabel>
							</MoreButton>
						</>
					) : (
						<SearchPlzLabel>검색 내용이 없습니다.</SearchPlzLabel>
					)}
					<Title>추천업체</Title>
					{sellerData === undefined || sellerData.length === 0 ? (
						<SearchPlzLabel>검색 내용이 없습니다.</SearchPlzLabel>
					) : (
						<>
							{sellerData.map(item => (
								<CompanyCard
									key={`CompanyCard-${item.mt_idx}`}
									item={item}
									onPress={() =>
										navigation.navigate('DeliverPickupDetail', {
											slt_idx: item.mt_idx,
											before: 'TodayIn',
										})
									}
								/>
							))}
							<MoreButton onPress={() => getSeller(1)}>
								<MoreLabel>
									더 보기{' '}
									<Icon name="chevron-down" size={15} color={ColorRed} />
								</MoreLabel>
							</MoreButton>
						</>
					)}
				</ScrollView>
			)}
			<Modal
				visible={showModal !== undefined}
				animationType="slide"
				transparent={true}>
				<ImageBox>
					<BigImage
						source={{
							uri:
								showModal !== undefined
									? todayInData.find(element => element.pt_idx === showModal)
											.pt_thumbnail
									: '',
						}}
						resizeMode="contain"
					/>
					<CloseButton onPress={() => setShowModal(undefined)}>
						<Icon name="x" size={20} color="#ffffff" />
					</CloseButton>
				</ImageBox>
			</Modal>
		</Container>
	);
};

export default Search;
