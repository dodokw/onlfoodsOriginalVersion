import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, ScrollView} from 'react-native';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import ic_option from '~/Assets/Images/ic_option_color.svg';
import BannerIndicator from '~/Components/BannerIndicator';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import CompanyCard from '~/Components/CompanyCard';
import LoadingSpinner from '~/Components/LoadingSpinner';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {floatingShow, setScreen} from '~/Modules/Action';
import DistanceModal from '~/Components/Modal/DistanceModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APICallDeliverList} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/Feather';
import {Alert} from 'react-native';
import {RefreshControl} from 'react-native';
import {Easing} from 'react-native';
import MainHeader from '~/Components/MainHeader';
import DeliverPickupCheck from './DeliverPickupCheck';
import axios from 'axios';
import { originURL, testURL } from '~/API/default';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled.View`
	flex: 1;
	background-color:#ffffff;
`;
const BannerContainer = styled.View`
	position: relative;
	margin-right: 20px;
	margin-bottom: 20px;
`;
const ListBox = styled.View`
	width: ${WIDTH - 20}px;
	height: 100px;
	border-top-right-radius: 25px;
	border-bottom-right-radius: 25px;
	overflow: hidden;
`;
const BannerBox = styled.TouchableOpacity`
	width: ${WIDTH - 20}px;
	justify-content: center;
	align-items: center;
	height: 100px;
`;
const BannerImage = styled.Image`
	width: 100%;
	height: 100%;
`;

const TabContainer = styled.View`
	flex-direction: row;
	border-bottom-width: 0.5px;
	border-bottom-color: ${ColorLineGrey};
	margin: 20px 20px 0 20px;
`;
const TabWrap = styled.TouchableOpacity`
	flex: 1;
	padding-bottom: 10px;
	border-bottom-width: ${props => (props.selected ? '3px' : '0')};
	border-bottom-color: ${ColorRed};
`;
const TabLabel = styled.Text`
	text-align: center;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${props => (props.selected ? ColorRed : '#7b7b7b')};
`;

const ContentContainer = styled.View`
	flex: 1;
	background-color: #ffffff;
	padding: 0 20px;
`;
const ContentOptions = styled.View`
	flex-direction: row;
	margin: 10px 0;
	justify-content: space-between;
`;

const StandardWrap = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
`;

const StandardButton = styled.TouchableOpacity`
	justify-content: center;
	background-color: ${props => (props.standard ? '#f1f1f1' : '#ffffff')};
	border-radius: 25px;
	padding: 5px 10px;
	margin: 5px;
`;

const StandardButtonLabel = styled.Text`
	text-align: center;
	color: #333333;
`;

const ContentWrap = styled.View``;

const DistanceButton = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
`;

const DistanceButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	margin: 0 5px;
	color: #333333;
`;

const ContentCategory = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin: 0 0 5px 0;
`;
const CategoryButton = styled.TouchableOpacity`
	border-radius: 25px;
	padding: 10px 15px;
	margin-right: 5px;
	background-color: ${props => (props.selected ? '#fed4d6' : '#ffffff')};
`;
const CategoryButtonLabel = styled.Text`
	color: ${props => (props.selected ? ColorRed : '#7b7b7b')};
`;

const ListWarningLabel = styled.Text`
	text-align: center;
	margin: 60px 0;
	font-family: ${FONTNanumGothicRegular};
`;

const defaultCategoryList = [
	{name: '전체', selected: true, no: 0},
	{name: '마트', selected: false, no: 1},
	{name: '식자재', selected: false, no: 2},
	{name: '도매', selected: false, no: 3},
	{name: '소매', selected: false, no: 4},
	{name: '제조', selected: false, no: 5},
	{name: '생산', selected: false, no: 6},
];

const RenderItem = ({item, navigation}) => {
	return (
		<BannerBox onPress={() => navigation.navigate('BannerDetail', {item})}>
			<BannerImage
				source={{
					uri: item.img,
				}}
				resizeMode="cover"
			/>
		</BannerBox>
	);
};

const DeliverPickup = ({navigation}) => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const user = useSelector(state => state.loginReducer.user);
	const distance = useSelector(state => state.dataReducer.distance);
	const location = useSelector(state => state.dataReducer.location);
	const [bannerData, setBannerData] = useState();
	const [selectedTab, setSelectedTab] = useState(0);
	const [data, setData] = useState();
	const [dataLoading, setDataLoading] = useState(false);
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [categoryList, setCategoryList] = useState(defaultCategoryList);
	const [standard, setStandard] = useState('dist');
	const [showDistance, setShowDistance] = useState(false);
	const isSet = useRef(false);
	const BannerRef = useRef();
	const bannerIndex = useRef(0);
	const PageRef = useRef();
	const [nowIndex, setNowIndex] = useState();
	const [refreshing, setRefreshing] = useState(false);
	const [hideBanner, setHideBanner] = useState(false);
	const aniValue = useRef(new Animated.Value(1)).current;

	const [showSub, setShowSub] = useState(false);
	const [checkDetail,setCheckDetail]=useState([]);

	const changeValue = aniValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-120, 0],
	});

	// const modalFunc=(item) =>{
	// 	setShowSub(true);
	// 	setCheckDetail(item);
	// }
	const getManagerList = async (item) => {
        try{
        const form = new FormData();
        form.append('slt_idx', item.mt_idx);
        const res = await axios.post(originURL+'getManager_list.php', form);
        console.log(res.data);
        if(res.data.length === 1){
             navigation.navigate('DeliverPickupDetail', {
		     slt_idx: item.mt_idx,
			 before: 'DeliverPickup',
	     })
        }else{
            navigation.navigate('DeliverSelectBeforeDetail', {data: res.data});
        }
        }catch(err){
            console.log(err+'에러발생구역-------------------------------------------------------');
        }
    }

	useEffect(() => {
		if(!isFocused){
			setCheckDetail('');
		}
	}, [isFocused])

	useEffect(() => {
		if (!hideBanner) {
			console.log('배너숨김동작함');
			Animated.timing(aniValue, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
				easing: Easing.linear,
			}).start();
		} else {
			console.log('배너펴짐동작함');
			Animated.timing(aniValue, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
				easing: Easing.linear,
			}).start();
		}
	}, [hideBanner]);

	const onViewableItemsChanged = useRef(({viewableItems}) => {
		if (viewableItems.length > 0) {
			bannerIndex.current = viewableItems[0].index;
			setNowIndex(viewableItems[0].index);
		}
	});

	const settingBanner = async () => {
		const str = await AsyncStorage.getItem('Banner');
		const banner = JSON.parse(str);
		setBannerData(banner.supply);
	};

	const getList = async () => {
		try {
			PageRef.current = 1;
			const selectedCategory = categoryList.find(
				item => item.selected === true,
			);
			const res = await APICallDeliverList(
				selectedTab === 0 ? 'deliver' : 'dist',
				location.y,
				location.x,
				standard,
				selectedCategory.no,
				distance,
				PageRef.current,
				user.mt_info.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('SQL', decode);
				console.log('리스트', decode.data);
				setData(decode.data);
			} else {
				setData(undefined);
				//Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.log(err);
		}
		setDataLoading(false);
	};

	const addList = async () => {
		try {
			PageRef.current += 1;
			console.log('페이징리스트', PageRef.current);
			const selectedCategory = categoryList.find(
				item => item.selected === true,
			);
			const res = await APICallDeliverList(
				selectedTab === 0 ? 'deliver' : 'dist',
				location.y,
				location.x,
				standard,
				selectedCategory.no,
				distance,
				PageRef.current,
				user.mt_info.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('SQL', decode);
				console.log('리스트', decode.data);
				setData([...data, ...decode.data]);
			} else {
				console.log('추가데이터 없음.');
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		settingBanner();
	}, []);

	useEffect(() => {
		if (isFocused) {
			setDataLoading(true);
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: true});
			dispatch(floatingShow());
			dispatch(setScreen('DeliverPickupNav'));
			if (user.mt_info.mt_hp === null) {
				Alert.alert('알림', '추가정보를 필요로합니다. 입력하시겠습니까?', [
					{text: '확인', onPress: () => navigation.navigate('SNSSignUp')},
					{text: '취소', onPress: () => navigation.goBack()},
				]);
			}
		}
	}, [isFocused]);

	useEffect(() => {
		if (isFocused) getList();
	}, [isFocused, selectedTab, distance, standard, categoryList]);

	// 상단 배너 사용 시 주석 해제 
	// useEffect(() => {
	// 	if (!isSet.current && bannerData !== undefined) {
	// 		isSet.current = true;
	// 		const BannerControl = BannerRef.current;
	// 		// eslint-disable-next-line no-unused-vars
	// 		const movingBanner = setTimeout(function () {
	// 			isSet.current = false;
	// 			if (bannerData !== undefined)
	// 				BannerControl.scrollToIndex({
	// 					animated: true,
	// 					index:
	// 						bannerIndex.current === bannerData.length - 1
	// 							? 0
	// 							: bannerIndex.current + 1,
	// 				});
	// 		}, 2000);
	// 	}
	// }, [nowIndex]);

	return (
		<Container>
			<Animated.View
				style={{
					height: HEIGHT,
					transform: [{translateY: changeValue}],
					backgroundColor: '#ffffff',
					marginTop: 50,
				}}>
				{/* <BannerContainer>
					<ListBox>
						{bannerData !== undefined && (
							<FlatList
								style={{
									width: WIDTH - 20,
									height: 100,
								}}
								onViewableItemsChanged={onViewableItemsChanged.current}
								viewabilityConfig={{viewAreaCoveragePercentThreshold: 80}}
								ref={BannerRef}
								data={bannerData}
								keyExtractor={(item, index) => `banner-${index}`}
								renderItem={({item}) => (
									<RenderItem item={item} navigation={navigation} />
								)}
								horizontal={true}
								pagingEnabled={true}
								showsHorizontalScrollIndicator={false}
								initialNumToRender={1}
								initialScrollIndex={0}
								bounces={false}
							/>
						)}
					</ListBox>
					<BannerIndicator
						bottom={-10}
						count={nowIndex}
						all={bannerData === undefined ? 0 : bannerData.length}
						onPress={() => navigation.navigate('BannerList', {bannerData})}
					/>
				</BannerContainer> */}

				<TabContainer>
					<TabWrap
						selected={selectedTab === 0 ? true : false}
						onPress={() => setSelectedTab(0)}>
						<TabLabel selected={selectedTab === 0 ? true : false}>
							배달 가능 업체
						</TabLabel>
					</TabWrap>
					<TabWrap
						selected={selectedTab === 1 ? true : false}
						onPress={() => setSelectedTab(1)}>
						<TabLabel selected={selectedTab === 1 ? true : false}>
							내 주변 업체
						</TabLabel>
					</TabWrap>
				</TabContainer>
				<ContentContainer>
					<ContentOptions>
						{selectedTab === 1 && (
							<DistanceButton onPress={() => setShowDistance(true)}>
								<SvgXml xml={ic_option} />
								<DistanceButtonLabel>거리설정 {distance}km</DistanceButtonLabel>
							</DistanceButton>
						)}
						<StandardWrap>
							<StandardButton
								onPress={() => setStandard('dist')}
								standard={standard === 'dist' ? true : false}>
								<StandardButtonLabel>거리순</StandardButtonLabel>
							</StandardButton>
							<StandardButton
								onPress={() => setStandard('wdate')}
								standard={standard === 'wdate' ? true : false}>
								<StandardButtonLabel>최신순</StandardButtonLabel>
							</StandardButton>
						</StandardWrap>
					</ContentOptions>
					<ContentCategory>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							bounces={false}>
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
						</ScrollView>
					</ContentCategory>
					{dataLoading ? (
						<LoadingSpinner />
					) : (
						<ContentWrap
							style={{height: Dimensions.get('screen').height - 130}}>
							<FlatList
								style={{flex: 1}}
								showsVerticalScrollIndicator={false}
								contentContainerStyle={{paddingBottom: 100}}
								data={data}
								keyExtractor={item => `CompanyCard-${item.mt_idx}`}
								renderItem={({item}) => (
									<CompanyCard
										key={`CompanyCard-${item.mt_idx}`}
										item={item}
										onPress={() =>
											// navigation.navigate('DeliverSelectBeforeDetail', {slt_idx: item.mt_idx})
											getManagerList(item)
											// navigation.navigate('DeliverPickupDetail', {
											// 	slt_idx: item.mt_idx,
											// 	before: 'DeliverPickup',
											// })
										}
									/>
								)}
								ListEmptyComponent={
									!dataLoading && (
										<ListWarningLabel>
											설정 거리내 업체가 없습니다.
										</ListWarningLabel>
									)
								}
								onEndReachedThreshold={0.5}
								onEndReached={addList}
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
										if (data !== undefined) setHideBanner(true);
									}
								}}
							/>
						</ContentWrap>
					)}
				</ContentContainer>
			</Animated.View>
			{/* <DeliverPickupCheck
				data={checkDetail}
				visible={showSub}
				setVisible={setShowSub}
			/> */}
			<DistanceModal
				isShow={showDistance}
				setIsShow={setShowDistance}
				distance={distance}
			/>
			<Header title="추천업체" absolute />
			<MainHeader
				navigation={navigation}
				setLat={setLat}
				setLng={setLng}
				distance={distance}
			/>
		</Container>
	);
};

export default DeliverPickup;
