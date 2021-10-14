import React, {useCallback, useRef, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import {ScrollView, View} from 'react-native';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import ic_bigsmile from '~/Assets/Images/ic_bigsmile.svg';
import ic_chatting from '~/Assets/Images/ic_chatting.svg';
import ic_viewer from '~/Assets/Images/ic_viewer.svg';
import ic_search from '~/Assets/Images/ic_search.svg';
import ic_report from '~/Assets/Images/ic_report.svg';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import StockItemCard from '~/Components/StockItemCard';
import {useEffect} from 'react';
import BackButton from '~/Components/BackButton';
import {Checkbox} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {floatingHide, saleroff} from '~/Modules/Action';
import Icon from 'react-native-vector-icons/Feather';
import {APICallDeliverDetail, APICallOrderStart} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import {Alert} from 'react-native';
import LoadingModal from '~/Components/LoadingModal';
import ReportModal from '~/Components/Modal/ReportModal';
import {APICallLikeCompany} from '../../../../API/MainAPI/MainAPI';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MapModal from '~/Components/Modal/MapModal/MapModal';
import LoadingSpinner from '~/Components/LoadingSpinner';
import NoticeCard from '~/Components/NoticeCard';
import axios from 'axios';
import dayjs from 'dayjs';
import { secretKey } from '~/API/default';

const Container = styled.View`
	flex: 1;
`;
const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const CompanyContainer = styled.View`
	background-color: #ffffff;
	padding: 10px;
	margin-bottom: 10px;
`;
const CompanyBox = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	padding: 10px;
	align-items: center;
`;
const CompanyImage = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 20px;
	border-width: 1px;
	border-color: #dfdfdf;
`;
const CompanyInfoWrap = styled.View`
	flex: 1;
	margin-left: 10px;
	justify-content: space-between;
`;

const CompnayTitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;
const CompanyTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-bottom: 10px;
`;

const PaymentLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #033333;
	font-size: 16px;
	margin-bottom: 10px;
`;
const CompanyOpenTimeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
	margin-bottom: 10px;
`;

const DeliverPeriodLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: ${ColorRed};
	font-size: 12px;
`;

const CompanyLocationWrap = styled.View`
	flex-direction: row;
	background-color: #ffffff;
	margin-bottom: 10px;
	align-items: center;
	justify-content: space-between;
	padding: 0px 20px;
`;

const CompanyLocationTextWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const CompanyLocationText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
	margin-left: 5px;
`;
const CompnayLocationButton = styled.TouchableOpacity`
	background-color: #d0eefe;
	border-radius: 12px;
	padding: 7px 10px;
	margin-left: 5px;
`;
const CompanyLocationLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #185eba;
	font-size: 11px;
`;
const CompnayLikeWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const CompanyLikeText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
	margin-left: 5px;
`;

const Dive = styled.View`
	height: 1px;
	background-color: ${ColorLineGrey};
`;

const ContentCategory = styled.View`
	flex-direction: row;
	justify-content: space-between;
	background-color: #ffffff;
	padding: 10px 20px;
`;
const CategoryButton = styled.TouchableOpacity`
	border-radius: 25px;
	padding: 10px 15px;
	background-color: ${props => (props.selected ? '#fed4d6' : '#ffffff')};
`;
const CategoryButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${props => (props.selected ? ColorRed : '#7b7b7b')};
`;

const StockContainer = styled.View`
	padding: 20px 0px;
`;

const StockTitleLabel = styled.Text`
	font-size: 16px;
	font-family: ${FONTNanumGothicBold};
`;
const StockRefeshLabel = styled.Text`
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	color: #707070;
`;
const StockOrderHistoryButton = styled.TouchableOpacity`
	padding: 5px;
	border-radius: 15px;
	border-width: 1px;
	border-color: ${ColorLineGrey};
	background-color: #ffffff;
`;
const StockOrderHistoryLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
`;
const ContentHeader = styled.View`
	flex-direction: row;
	margin-bottom: 5px;
	padding: 0 30px;
`;
const HeaderBox = styled.View`
	flex: ${props => props.flex};
	justify-content: center;
`;
const HeaderText = styled.Text`
	text-align: ${props => (props.left ? 'left' : 'center')};
	color: #333333;
`;
const ContentMain = styled.View`
	padding: 0 20px;
`;
const DeliverContainer = styled.View`
	padding: 10px 20px;
`;
const DeliverLabel = styled.Text``;

const SubText = styled.Text`
	font-size: 10px;
	font-family: ${FONTNanumGothicRegular};
	margin-left: 5px;
`;

const DocInfo = styled.View`
	padding: 10px;
	background-color: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const DocWrap = styled.Text`
	flex-direction: row;
	align-items: center;
`;

const DocText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
	margin-left: 5px;
	margin-right: 5px;
`;

const ReportButton = styled.TouchableOpacity`
	border-radius: 5px;
	border-color: #dfdfdf;
	border-width: 0.5px;
	flex-direction: row;
	align-items: center;
	padding: 10px 15px;
`;

const ReportLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
	margin-left: 5px;
`;

const ProductOrder = styled.View`
	padding: 10px;
	padding-bottom: 20px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
	background-color: #ffffff;
	flex-direction: row;
`;
const LikeButton = styled.TouchableOpacity`
	flex: 0.5;
	background-color: ${ColorRed};
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;
const LikeLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
	margin-left: 5px;
`;

const ChatButton = styled.TouchableOpacity`
	flex: 1;
	border-color: ${props => (props.color ? ColorLineGrey : ColorRed)};
	border-width: 1px;
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	margin-left: 5px;
`;
const ChatLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${ColorRed};
	margin-left: 5px;
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

const SearchButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
`;

const ShowMoreButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 10px 0px;

	margin: 5px 0;
`;

const ShowMoreLabel = styled.Text`
	margin-left: 5px;
	color: ${ColorBlue};
	font-family: ${FONTNanumGothicBold};
`;
const TabContainer = styled.View`
	background-color: #ffffff;
`;
const TabWrap = styled.View`
	flex-direction: row;
	border-bottom-width: 1px;
	border-color: #dfdfdf;
	padding-top: 10px;
`;
const TabLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: ${props =>
		props.selected ? (props.state ? ColorRed : ColorLineGrey) : '#7b7b7b'};
	text-align: center;
`;
const StockWrap = styled.View``;

const NoticeWrap = styled.View`
		margin-top:5px;
		background-color:#FFFFFF;
`;
const TabBox = styled.TouchableOpacity`
	flex: 1;
	border-color: ${props => (props.state ? ColorRed : ColorBlue)};
	border-bottom-width: ${props => (props.selected ? '3px' : '0')};
	padding: 10px 0;
	justify-content: center;
	align-content: center;
`;

const defaultCategoryList = [
	{name: '전체', selected: true, no: '0'},
	{name: '공산', selected: false, no: '1'},
	{name: '농산', selected: false, no: '2'},
	{name: '수산', selected: false, no: '3'},
	{name: '축산', selected: false, no: '4'},
	{name: '기타', selected: false, no: '5'},
];

const defualtData = {
	slt_image: undefined,
	slt_store_name: '',
	slt_company_cate: '',
	slt_company_item: '',
	slt_channel: '',
	slt_deliver_time: '',
	slt_deliver_pay: '',
	slt_business_hours: '',
	slt_addr: '',
	zzim: '0',
	slt_qty_udate: '0000-00-00 00:00:00',
};

const DeliverPickupDetail = ({navigation, route}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const location = useSelector(state => state.dataReducer.location);
	const seller_idx = route.params.slt_idx;
	const before = route.params.before;
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [categoryList, setCategoryList] = useState(defaultCategoryList);
	const [data, setData] = useState(defualtData);
	const[datas,setDatas] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [items, setItems] = useState([]); //고유의 상품들
	const [list, setList] = useState([]); //품목리스트에 담긴 상품들
	const [selectedItem, setSelectedItem] = useState([]); //주문목록에 담긴 상품들
	const [deliverType, setDeliverType] = useState(1);
	const [zzimState, setZzimState] = useState(false);
	const [zzimLoading, setZzimLoading] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [showReport, setShowReport] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const zzim = useRef();

	const {state} = useSelector(state=>state.loginReducer);
	const [tabState, setTabState] = useState(0);

	const getData = async () => {
		setLoading(true);
		try {
			const res = await APICallDeliverDetail(
				seller_idx,
				user.mt_idx,
				location.address_name,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData(decode.data.seller);
				zzim.current = parseInt(decode.data.seller.zzim);
				if (decode.data.seller.zzim_on === 'on') {
					setZzimState(true);
				}
				if (decode.data.product_list !== null) {
					const newItems = decode.data.product_list.map(item => ({
						...item,
						check: false,
					}));

					setItems(newItems);
					setList(newItems);
				}
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const getList = async () => {
		const todayDate = dayjs().format('YYYY-MM-DD');
		setLoading(true);
		try {
			const form = new FormData();
			form.append('secretKey', secretKey);
			form.append('sellerIdx', seller_idx);
			form.append('todayDate', todayDate);
			const res = await axios.post('https://onlfoods.com/api/seller_notice_beta.php',form);
			console.log(res.data);
			if(res.data !== null){
				setLoading(false);
				setDatas(res.data);
			// const decode = jwtDecode(res.data.jwt);
			// console.log(decode.data.idx);
			// if(decode.data !== null){
			// 	setLoading(false);
			// 	setDatas([decode.data]);
			// }
			// console.log(datas);
			// if(datas!==null){
			// 	setLoading(false);
			// 	setDatas(res.data);	
			}
		} catch (error) {
			console.log(error);
		}
	}

	const onLike = async () => {
		setZzimLoading(true);
		try {
			const res = await APICallLikeCompany(seller_idx, user.mt_idx);
			if (res.result === 'true') {
				if (res.data.wst_status === 'Y') {
					console.log('관심업체 등록!');
					zzim.current += 1;
					setZzimState(true);
				} else {
					console.log('관심업체 해제!');
					zzim.current -= 1;
					setZzimState(false);
				}
			}
		} catch (err) {
			console.error(err);
		}
		setZzimLoading(false);
	};

	const goChatting = async () => {
		try {
			console.log(user.mt_idx, seller_idx);
			if (selectedItem.length === 0)
				return Alert.alert('알림', '상품을 선택해주세요.', [{text: '확인'}]);
			const receipt = selectedItem.filter(element => element.check === true);
			const res = await APICallOrderStart(
				user.mt_idx,
				seller_idx,
				deliverType,
				receipt,
				location,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('딜리버리', decode);
				if (before !== 'TodayIn') {
					navigation.reset({index: 1, routes: [{name: before}]});
				} else {
					navigation.navigate('TodayIn');
				}
				navigation.navigate('ChattingNav', {
					screen: 'ChattingPage',
					params: {chatID: decode.data.chat_idx},
					initial: false,
				});
			} else {
				console.log(res);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const onSearch = () => {
		const category = categoryList.find(item => item.selected === true);
		if (category !== undefined && category.no !== '0' && keyword !== '') {
			const itemList = items.filter(item => item.ct_id === category.no);
			const searchList = itemList.filter(item => {
				if (item.pt_title === null) return false;
				return item.pt_title.indexOf(keyword) === -1 ? false : true;
			});

			setList(searchList);
		} else {
			const searchList = items.filter(item => {
				if (item.pt_title === null) return false;
				return item.pt_title.indexOf(keyword) === -1 ? false : true;
			});
			setList(searchList);
		}
	};

	const onClear = () => {
		setKeyword('');
		const category = categoryList.find(item => item.selected === true);
		console.log(category);
		if (category !== undefined && category.no !== '0') {
			const itemList = items.filter(item => item.ct_id === category.no);
			setList(itemList);
		} else {
			setList(items);
		}
	};

	useEffect(() => {
		const category = categoryList.find(item => item.selected === true);
		console.log(category);
		if (category !== undefined && category.no !== '0') {
			const itemList = items.filter(item => item.ct_id === category.no);
			setList(itemList);
		} else {
			setList(items);
		}
	}, [categoryList]);

	useEffect(() => {
		const category = categoryList.find(item => item.selected === true);
		if (category !== undefined && category.no !== '0') {
			const itemList = items.filter(item => item.ct_id === category.no);
			const searchList = itemList.filter(item => {
				if (item.pt_title === null) return false;
				return item.pt_title.indexOf(keyword) === -1 ? false : true;
			});
			setList(searchList);
		} else {
			const searchList = items.filter(item => {
				if (item.pt_title === null) return false;
				return item.pt_title.indexOf(keyword) === -1 ? false : true;
			});
			setList(searchList);
		}
	}, [items]);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		getData();
	}, []);

	const noticeFunc = () =>{
		setTabState(1)
		getList()
	}

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title={data.slt_store_name}
				border
			/>
			<ScrollView bounces={false} contentContainerStyle={{paddingBottom: 30}}>
				<CompanyContainer>
					<CompanyBox>
						<CompanyImage source={{uri: data.mt_image1}} resizeMode="cover" />
						<CompanyInfoWrap>
							<CompnayTitleWrap>
								<CompanyTitle>{data.slt_company_cate}</CompanyTitle>
								<CompnayLikeWrap>
									<SvgXml xml={ic_smile} />
									<CompanyLikeText>{zzim.current}</CompanyLikeText>
								</CompnayLikeWrap>
							</CompnayTitleWrap>
							<PaymentLabel>{data.slt_company_item}</PaymentLabel>
							<CompanyOpenTimeLabel>
								영업시간 {data.slt_business_hours}
							</CompanyOpenTimeLabel>
							{data.slt_deliver_time !== null && (
								<DeliverPeriodLabel>
									배송기간{' '}
									{data.slt_deliver_time === 'D-0'
										? '당일배송'
										: data.slt_deliver_time === 'D-1'
										? '익일배송'
										: data.slt_deliver_time}
								</DeliverPeriodLabel>
							)}
						</CompanyInfoWrap>
					</CompanyBox>
					<Dive style={{margin: 10}} />
					<CompanyLocationWrap>
						<CompanyLocationTextWrap>
							<Icon name="map-pin" size={11} color="#333333" />
							<CompanyLocationText>{data.slt_addr}</CompanyLocationText>
						</CompanyLocationTextWrap>
						<CompnayLocationButton onPress={() => setShowMap(true)}>
							<CompanyLocationLabel>업체위치</CompanyLocationLabel>
						</CompnayLocationButton>
					</CompanyLocationWrap>
				</CompanyContainer>

				<TabContainer>
				<TabWrap>
					<TabBox
						state={state}
						selected={tabState === 0}
						onPress={() => setTabState(0)}
						>
						<TabLabel 
						state={state} selected={tabState === 0}
						>
							취급품목
						</TabLabel>
					</TabBox>
					<TabBox
						state={state}
						selected={tabState === 1}
						onPress={() => {
							noticeFunc()
						}}
						>
						<TabLabel 
						state={state} selected={tabState === 1}
						>
							공지사항
						</TabLabel>
					</TabBox>
				</TabWrap>
			</TabContainer>
			
			{tabState===0 && (items === undefined ? (<LoadingSpinner/>):(
				<StockWrap>
				<ContentCategory>
					{categoryList.map((item, index) => (
						<CategoryButton
							key={index}
							selected={item.selected}
							onPress={() =>
								setCategoryList(
									categoryList.map(deepitem =>
										item.name === deepitem.name
											? {...deepitem, selected: true}
											: {...deepitem, selected: false},
									),
								)
							}>
							<CategoryButtonLabel selected={item.selected}>
								{item.name}
							</CategoryButtonLabel>
						</CategoryButton>
					))}
				</ContentCategory>
				<StockContainer>
					<Wrap
						style={{
							justifyContent: 'space-between',
							paddingHorizontal: 20,
							paddingVertical: 5,
						}}>
						<StockTitleLabel>취급가능 품목리스트</StockTitleLabel>
						<StockRefeshLabel>
							품목 갱신일{' '}
							{data.slt_qty_udate.split(' ')[0] === '0000-00-00'
								? '-'
								: data.slt_qty_udate.split(' ')[0]}
						</StockRefeshLabel>
					</Wrap>
					<Wrap
						style={{
							justifyContent: 'space-between',
							paddingHorizontal: 20,
							paddingVertical: 5,
						}}>
						<SearchBox>
							<SearchInput
								placeholder="상품명 검색"
								placeholderColor="#7b7b7b"
								value={keyword}
								onChangeText={text => setKeyword(text)}
								onSubmitEditing={onSearch}
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
					</Wrap>
					<Dive style={{marginVertical: 10, marginHorizontal: 20}} />
					<ContentHeader>
						<HeaderBox flex={1}>
							<HeaderText left>선택</HeaderText>
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
						{/* <HeaderBox flex={2}>
							<HeaderText ellipsizeMode="middle">가격</HeaderText>
						</HeaderBox> */}
					</ContentHeader>
					<ContentMain>
						{list.length > 0 ? (
							list.map((item, index) => {
								if (!showMore && index > 4) {
									return null;
								} else {
									return (
										<StockItemCard
											key={`${item.pt_type}-${item.pt_idx}`}
											item={item}
											setItems={setItems}
											items={items}
											setList={setList}
											list={list}
											setSelectedItem={setSelectedItem}
											selectedItem={selectedItem}
										/>
									);
								}
							})
						) : (
							<HeaderText style={{marginVertical: 20}}>
								상품이 없습니다.
							</HeaderText>
						)}
						{!showMore && list.length > 5 && (
							<ShowMoreButton onPress={() => setShowMore(true)}>
								<Icon name="chevron-down" size={25} color={ColorBlue} />
								<ShowMoreLabel>더보기(+{list.length - 5}개)</ShowMoreLabel>
							</ShowMoreButton>
						)}
					</ContentMain>
					<Dive style={{marginVertical: 10}} />
					<Wrap
						style={{
							justifyContent: 'space-between',
							paddingHorizontal: 20,
							paddingVertical: 5,
						}}>
						<StockTitleLabel>주문 목록</StockTitleLabel>
						<StockOrderHistoryButton
							onPress={() => {
								dispatch(saleroff());
								navigation.navigate('OrderHistory', {
									od_mt_idx: undefined,
									before: before,
								});
							}}>
							<StockOrderHistoryLabel>지난주문내역</StockOrderHistoryLabel>
						</StockOrderHistoryButton>
					</Wrap>
					<Dive style={{marginVertical: 10, marginHorizontal: 20}} />
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
						{/* <HeaderBox flex={2}>
							<HeaderText ellipsizeMode="middle">가격</HeaderText>
						</HeaderBox> */}
					</ContentHeader>
					<ContentMain>
						{selectedItem.length > 0 ? (
							selectedItem.map((item, index) => (
								<StockItemCard
									key={`${item.pt_type}-${item.pt_idx}`}
									item={item}
									setItems={setItems}
									items={items}
									setList={setList}
									list={list}
									setSelectedItem={setSelectedItem}
									selectedItem={selectedItem}
									max={
										items.find(element => element.pt_idx === item.pt_idx).pt_qty
									}
									input
								/>
							))
						) : (
							<HeaderText style={{marginVertical: 20}}>
								선택한 상품이 없습니다. 상품을 선택해주세요.
							</HeaderText>
						)}
					</ContentMain>
					{selectedItem.length > 0 && (
						<DeliverContainer>
							<StockTitleLabel>배송 방법</StockTitleLabel>
							<Wrap>
								<Wrap>
									<Checkbox.Android
										color={ColorRed}
										status={deliverType === 1 ? 'checked' : 'unchecked'}
										onPress={() => setDeliverType(1)}
									/>
									<DeliverLabel>픽업</DeliverLabel>
								</Wrap>
								{data.delivery_ok === 'on' && (
									<Wrap style={{marginLeft: 10}}>
										<Checkbox.Android
											color={ColorRed}
											status={deliverType === 2 ? 'checked' : 'unchecked'}
											onPress={() => setDeliverType(2)}
										/>
										<DeliverLabel>배송</DeliverLabel>
									</Wrap>
								)}
							</Wrap>
							{data.delivery_ok === 'on' && (
								<SubText>* 최소배송금액 {data.slt_deliver_pay}원</SubText>
							)}
						</DeliverContainer>
					)}
				</StockContainer>
				</StockWrap>
			))}
{tabState===1 && (datas === undefined ? (<LoadingSpinner/>):(
				<NoticeWrap>
				{/* <Button title='test' onPress={()=>getList()}/> */}
					<ContentMain>
				
						{datas === null ? (
							<HeaderText style={{marginVertical: 20}}>
							공지가 없습니다.
							</HeaderText>
						) : (
							datas.map((item, index) => (
								<NoticeCard
										key={`NoticeCard-${item.idx}`}
										item={item}
										//dong={location.region_3depth_name}
										onPress={() =>
											navigation.navigate('TodayEventDetail', {
												et_idx: item.idx,
												seller_idx: item.mt_seller_idx,
												mt_idx: user.mt_idx,
												lat: location.y,
												lng: location.x,
											})
										}
									/>
							))
						)}
						
					</ContentMain>

{/* 					
					<FlatList
								style={{flex: 1}}
								contentContainerStyle={{
									paddingBottom: 100,
									paddingHorizontal: 20,
								}}
								showsVerticalScrollIndicator={false}
								data={datas}
								keyExtractor={item => `EventCard-${item.idx}`}
								renderItem={({item}) => (
									<EventCard
										key={`EventCard-${item.idx}`}
										item={item}
										dong={location.region_3depth_name}
										onPress={() =>
											navigation.navigate('TodayEventDetail', {
												et_idx: item.idx,
												seller_idx: item.mt_seller_idx,
												mt_idx: user.mt_idx,
												lat: location.y,
												lng: location.x,
											})
										}
									/>
								)}
								onEndReachedThreshold={0.5}
								// onEndReached={addList}
								ListEmptyComponent={
									!dataLoading && (
										<ListWarningLabel>오늘의 행사가 없습니다.</ListWarningLabel>
									)
								}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={getList}
										tintColor={ColorRed}
									/>
								}
								onScrollEndDrag={event => {
									if (event.nativeEvent.contentOffset.y < 5) {
										setHideBanner(false);
									} else {
										if (datas !== undefined) setHideBanner(true);
									}
								}}
							/> */}
				</NoticeWrap>
				))}
			</ScrollView>

			{tabState===0 ?(
			<View>
			<DocInfo>
				<DocWrap>
					<Wrap>
						<SvgXml xml={ic_chatting} />
						<DocText>채팅 {data.chat_cnt}</DocText>
					</Wrap>
					<Wrap>
						<SvgXml xml={ic_viewer} />
						<DocText>조회 {data.slt_hit}</DocText>
					</Wrap>
				</DocWrap>
				{seller_idx !== user.mt_idx && (
					<ReportButton onPress={() => setShowReport(true)}>
						<SvgXml xml={ic_report} />
						<ReportLabel>신고하기</ReportLabel>
					</ReportButton>
				)}
			</DocInfo>
			
			<ProductOrder>
				{seller_idx !== user.mt_idx && (
					<>
						<LikeButton onPress={() => onLike()} disabled={zzimLoading}>
							<SvgXml xml={ic_bigsmile} />
							<LikeLabel>{zzimState ? '관심해제' : '관심'}</LikeLabel>
						</LikeButton>

						<ChatButton
							onPress={goChatting}
							color={seller_idx === user.mt_idx}
							disabled={seller_idx === user.mt_idx}>
							<ChatLabel>주문하기 (견적)</ChatLabel>
						</ChatButton>
					</>
				)}
			</ProductOrder>
			</View>
			):(false)}
			

			<MapModal isShow={showMap} setShow={setShowMap} idx={seller_idx} />

			<ReportModal
				visible={showReport}
				setVisible={setShowReport}
				type="user"
				slt_idx={seller_idx}
				mt_idx={user.mt_idx}
			/>
			<LoadingModal visible={isLoading} />

			
		</Container>
	);
};

export default DeliverPickupDetail;