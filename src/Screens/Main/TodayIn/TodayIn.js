import React, {useState, useEffect, useRef} from 'react';
import {
	Dimensions,
	FlatList,
	Platform,
	RefreshControl,
	Animated,
	Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Footer from '~/Components/Footer';
import ItemCard from '~/Components/ItemCard';
import ic_option_color from '~/Assets/Images/ic_option_color.svg';
import BannerIndicator from '~/Components/BannerIndicator';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {
	alramCount,
	chatCount,
	floatingShow,
	login,
	logout,
	reset,
	saleroff,
	saleron,
	setNavigation,
	setScreen,
	settingLocation,
} from '~/Modules/Action';
import MainHeader from '~/Components/MainHeader';
import LoadingSpinner from '~/Components/LoadingSpinner';
import DistanceModal from '~/Components/Modal/DistanceModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APICallAlramCount, APICallTodayInList} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import ImageViewModal from '~/Components/Modal/ImageViewModal/ImageViewModal';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {APICallUserInfoRefresh} from '~/API/MyPageAPI/MyPageAPI';
import {Easing} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled.View`
	flex: 1;
`;

const BannerContainer = styled.View``;

const ListBox = styled.View``;

const BannerBox = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
`;
const BannerImage = styled.Image`
	width: 100%;
	height: 100%;
`;

const BannerMask = styled.Image`
	height: 60px;
	width: ${WIDTH}px;
	position: absolute;
	bottom: 0px;
`;

const ContentContainer = styled.View`
	background-color: #ffffff;
	padding: 0 20px;
	border-top-left-radius: ${props => (props.radius ? '25px' : '0px')};
`;

const ContentTitleLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 20px;
`;
const ContentTitleColorLabel = styled.Text`
	color: ${ColorRed};
`;

const ContentOptions = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

const ListWarningLabel = styled.Text`
	text-align: center;
	padding: 30px 0;
	background-color: #ffffff;
	font-family: ${FONTNanumGothicRegular};
`;

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

const StandardWrap = styled.View`
	flex-direction: row;
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

const ContentCategory = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding-bottom: 10px;
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

const ContentItem = styled.View`
	height: ${HEIGHT - 50}px;
	background-color: #ffffff;
`;

const ImageBox = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;
const BigImage = styled.Image`
	width: 100%;
	height: 80%;
`;

const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: ${Platform.OS === 'ios' ? '60px' : '20px'};
	right: 10px;
`;

const defaultCategoryList = [
	{name: '전체', selected: true, no: 99},
	{name: '공산', selected: false, no: 1},
	{name: '농산', selected: false, no: 2},
	{name: '수산', selected: false, no: 3},
	{name: '축산', selected: false, no: 4},
	{name: '기타', selected: false, no: 5},
];

const RenderItem = ({item, navigation}) => {
	return (
		<BannerBox onPress={() => navigation.navigate('BannerDetail', {item})}>
			<Animated.Image
				style={{height: 210, width: WIDTH}}
				source={{
					uri: item.img,
				}}
				resizeMode="cover"
			/>
		</BannerBox>
	);
};

const TodayIn = ({navigation}) => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const {location, chat} = useSelector(state => state.dataReducer);
	const screen = useSelector(state => state.dataReducer.screen);
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [bannerData, setBannerData] = useState();
	const [footerData, setFooterData] = useState();
	const [data, setData] = useState();
	const [dataLoading, setDataLoading] = useState(false);
	const [categoryList, setCategoryList] = useState(defaultCategoryList);
	const distance = useSelector(state => state.dataReducer.distance);
	const [standard, setStandard] = useState('distance');
	const [showDistance, setShowDistance] = useState(false);
	const isSet = useRef(false);
	const bannerIndex = useRef(0);
	const BannerRef = useRef();
	const PageRef = useRef(1);
	const [nowIndex, setNowIndex] = useState();
	const [showModal, setShowModal] = useState('');
	const [mainLoading, setMainLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [hideBanner, setHideBanner] = useState(false);

	const aniValue = useRef(new Animated.Value(1)).current;
	const changeValue = aniValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-210, 0],
	});

	const changeRadius = aniValue.interpolate({
		inputRange: [0, 0.9, 1],
		outputRange: [0, 25, 25],
	});

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

	const getInfo = async () => {
		const res = await APICallUserInfoRefresh(user.mt_idx);
		if (res.result === 'true') {
			const decode = jwtDecode(res.jwt);
			dispatch(login(decode.data));
		} else {
			Alert.alert(
				'알림',
				'정보를 제대로 갱신하지 못했습니다. 다시 로그인해주세요.',
				[{text: '확인', onPress: () => dispatch(logout())}],
			);
		}
	};

	const getCount = async () => {
		try {
			const res = await APICallAlramCount(user.mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				dispatch(alramCount(parseInt(decode.data)));
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			console.log('✈️ 푸시메세지 :::::: ', remoteMessage);
			console.log(screen);
			getCount();
			if (remoteMessage.data.intent === 'ChangeSeller') {
				getInfo();
			} else if (remoteMessage.data.intent === 'Pause') {
				dispatch(logout());
				dispatch(reset());
				return Alert.alert('알림', '계정이 정지 되었습니다.', [{text: '확인'}]);
			} else if (remoteMessage.data.intent === 'ChattingDetail') {
				dispatch(chatCount(parseInt(remoteMessage.data.content_idx2)));
			}
			if (chat && remoteMessage.data.intent === 'ChattingDetail') {
				console.log('채팅중');
			} else {
				Toast.show({
					type: 'success',
					position: 'top',
					text1: remoteMessage.notification.title,
					text2: remoteMessage.notification.body,
					visibilityTime: 3000,
					autoHide: true,
					topOffset: Platform.OS === 'ios' ? getStatusBarHeight() + 10 : 10,
					style: {backgroundColor: 'red'},
					bottomOffset: 100,
					onShow: () => {},
					onHide: () => {},
					onPress: () => {
						console.log('눌러짐');
						if (remoteMessage.data.intent === 'ChattingDetail') {
							navigation.navigate(screen, {
								screen: 'ChattingPage',
								params: {
									chatID: remoteMessage.data.content_idx,
								},
								initial: false,
							});
						} else if (remoteMessage.data.intent === 'TodayEventDetail') {
							navigation.navigate(screen, {
								screen: 'TodayEventDetail',
								params: {
									et_idx: remoteMessage.data.content_idx,
									seller_idx: remoteMessage.data.content_idx2,
									mt_idx: user.mt_idx,
									lat: location.y,
									lng: location.x,
								},
								inital: false,
							});
						} else if (remoteMessage.data.intent === 'TodayInDetail') {
							navigation.navigate(screen, {
								screen: 'TodayInDetail',
								params: {
									pt_idx: remoteMessage.data.content_idx,
									slt_idx: remoteMessage.data.content_idx2,
									mt_idx: user.mt_idx,
									lat: location.y,
									lng: location.x,
								},
								inital: false,
							});
						} else if (remoteMessage.data.intent === 'DeliverPickupDetail') {
							navigation.navigate(screen, {
								screen: 'DeliverPickupDetail',
								params: {
									slt_idx: remoteMessage.data.content_idx,
									before: 'TodayIn',
								},
								inital: false,
							});
						} else if (remoteMessage.data.intent === 'CustomService') {
							if (remoteMessage.data.content_idx2 === '1') {
								dispatch(saleroff());
							} else {
								dispatch(saleron());
							}
							navigation.navigate(screen, {
								screen: 'CustomService',
								params: {
									qt_idx: remoteMessage.data.content_idx,
								},
								inital: false,
							});
						} else if (remoteMessage.data.intent === 'InventoryManagement') {
							dispatch(saleron());
							navigation.navigate(screen, {
								screen: 'InventoryManagement',
								inital: false,
							});
						}

						Toast.hide();
					},
				});
			}
		});

		return unsubscribe;
	}, [location, chat, screen]);

	useEffect(() => {
		messaging().onNotificationOpenedApp(remoteMessage => {
			console.log(
				'Notification caused app to open from background state:',
				remoteMessage.notification,
			);
			getCount();
			if (remoteMessage.data.intent === 'ChangeSeller') {
				getInfo();
			} else if (remoteMessage.data.intent === 'Pause') {
				dispatch(logout());
				dispatch(reset());
				return Alert.alert('알림', '계정이 정지 되었습니다.', [{text: '확인'}]);
			} else if (remoteMessage.data.intent === 'ChattingDetail') {
				dispatch(chatCount(parseInt(remoteMessage.data.content_idx2)));
			}
			if (chat && remoteMessage.data.intent === 'ChattingDetail') {
				console.log('채팅중');
			}
		});
	}, []);

	//배너 슬라이딩
	const onViewableItemsChanged = useRef(({viewableItems}) => {
		if (viewableItems.length > 0) {
			bannerIndex.current = viewableItems[0].index;
			setNowIndex(viewableItems[0].index);
		}
	});

	//저장된 배너 가져오기
	const settingBanner = async () => {
		const str = await AsyncStorage.getItem('Banner');
		const banner = JSON.parse(str);
		console.log(banner.today);
		setBannerData(banner.today);
		setFooterData(banner.setup);
	};

	//오늘만 리스트 불러오기
	const getList = async () => {
		PageRef.current = 1;
		try {
			if (location) {
				setMainLoading(false);
				const selectedCategory = categoryList.find(
					item => item.selected === true,
				);
				const res = await APICallTodayInList(
					user.mt_idx,
					location.y,
					location.x,
					standard,
					distance,
					selectedCategory.no,
					PageRef.current,
				);
				if (res.result === 'true') {
					const decode = jwtDecode(res.jwt);
					console.log('오늘만 data', decode.data);
					setData(decode.data);
				} else {
					console.log(res);
					setData(undefined);
				}
			}
		} catch (err) {
			console.error(err);
		}
		setDataLoading(false);
	};

	const addList = async () => {
		PageRef.current += 1;
		console.log('페이지', PageRef.current);
		try {
			const selectedCategory = categoryList.find(
				item => item.selected === true,
			);
			const res = await APICallTodayInList(
				user.mt_idx,
				location.y,
				location.x,
				standard,
				distance,
				selectedCategory.no,
				PageRef.current,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData([...data, ...decode.data]);
			} else {
				console.log(res.message);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const initLocation = async () => {
		const list = await AsyncStorage.getItem('LocationList');
		const arr = JSON.parse(list);
		console.log('리스트', arr);
		if (arr === null || arr.length === 0) {
			navigation.navigate('LocationSetting');
		} else {
			const address = arr[0];
			dispatch(settingLocation(address));
		}
	};

	// FAB버튼 나타내기
	useEffect(() => {
		if (isFocused) {
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: true});
			dispatch(setScreen('TodayInNav'));
			dispatch(floatingShow());
			if (location !== null) {
				setDataLoading(true);
				getList();
			} else {
				initLocation();
			}
		}
		return () => setDataLoading(false);
	}, [isFocused, distance, standard, categoryList, location]);

	// useEffect(() => {
	// 	if (location !== null) {
	// 		getList();
	// 	}
	// }, []);

	//배너 슬라이딩 2초당 1회
	useEffect(() => {
		if (!isSet.current && bannerData !== undefined) {
			isSet.current = true;
			const BannerControl = BannerRef.current;
			// eslint-disable-next-line no-unused-vars
			const movingBanner = setTimeout(function () {
				isSet.current = false;
				if (bannerData !== undefined)
					BannerControl.scrollToIndex({
						animated: true,
						index:
							bannerIndex.current === bannerData.length - 1
								? 0
								: bannerIndex.current + 1,
					});
			}, 2000);
		}
	}, [nowIndex]);

	//Init
	useEffect(() => {
		settingBanner();
		setMainLoading(true);
		dispatch(setNavigation(navigation)); //FAP버튼을 위한 네비게이션
	}, []);

	return (
		<Container>
			<Animated.View
				style={{
					flex: 1,
					marginTop: 50,
					transform: [{translateY: changeValue}],
					backgroundColor: '#ffffff',
				}}>
				<BannerContainer>
					<ListBox>
						{bannerData !== undefined && (
							<FlatList
								onViewableItemsChanged={onViewableItemsChanged.current}
								viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
								ref={BannerRef}
								bounces={false}
								data={bannerData}
								keyExtractor={(item, index) => `banner-${index}`}
								renderItem={({item}) => (
									<RenderItem
										item={item}
										navigation={navigation}
										scaleY={aniValue}
									/>
								)}
								horizontal={true}
								pagingEnabled={true}
								showsHorizontalScrollIndicator={false}
								initialNumToRender={1}
								// onScrollToIndexFailed={info => {
								// 	const wait = new Promise(resolve => setTimeout(resolve, 1000));
								// 	wait.then(() => {
								// 		BannerRef.current?.scrollToIndex({
								// 			index: info.index,
								// 			animated: true,
								// 		});
								// 	});
								// }}
							/>
						)}
					</ListBox>
					<BannerMask
						source={require('~/Assets/Images/masked.png')}
						resizeMode="cover"
					/>
					<BannerIndicator
						count={nowIndex}
						all={bannerData === undefined ? 0 : bannerData.length}
						bottom={20}
						onPress={() => navigation.navigate('BannerList', {bannerData})}
					/>
				</BannerContainer>

				<Animated.View
					style={{
						backgroundColor: '#ffffff',
						padding: 20,
						borderTopLeftRadius: changeRadius,
					}}>
					<ContentTitleLabel>
						내 주변 <ContentTitleColorLabel>오늘만</ContentTitleColorLabel>
					</ContentTitleLabel>
					<ContentOptions>
						<DistanceButton onPress={() => setShowDistance(true)}>
							<SvgXml xml={ic_option_color} />
							<DistanceButtonLabel>거리설정 {distance}km</DistanceButtonLabel>
						</DistanceButton>
						<StandardWrap>
							<StandardButton
								onPress={() => setStandard('distance')}
								standard={standard === 'distance' ? true : false}>
								<StandardButtonLabel>거리순</StandardButtonLabel>
							</StandardButton>
							<StandardButton
								onPress={() => setStandard('latest')}
								standard={standard === 'latest' ? true : false}>
								<StandardButtonLabel>최신순</StandardButtonLabel>
							</StandardButton>
						</StandardWrap>
					</ContentOptions>
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
				</Animated.View>
				{dataLoading ? (
					<LoadingSpinner />
				) : (
					<ContentItem>
						<FlatList
							style={{flex: 1}}
							contentContainerStyle={{
								paddingBottom: 300,
								backgroundColor: '#ebebeb',
							}}
							data={data}
							keyExtractor={item => `InCard-${item.pt_idx}`}
							renderItem={({item}) => (
								<ItemCard
									key={`InCard-${item.pt_idx}`}
									item={item}
									onPress={() =>
										navigation.navigate('TodayInDetail', {
											pt_idx: item.pt_idx,
											mt_idx: user.mt_idx,
											lat: location.y,
											lng: location.x,
											slt_idx: item.mt_seller_idx,
										})
									}
									setShowModal={setShowModal}
								/>
							)}
							onEndReachedThreshold={0.5}
							onEndReached={addList}
							ListEmptyComponent={
								!dataLoading && (
									<ListWarningLabel>오늘만 상품이 없습니다.</ListWarningLabel>
								)
							}
							// ListFooterComponent={footerData && <Footer item={footerData} />}
							refreshing={true}
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
									setHideBanner(true);
								}
							}}
						/>
					</ContentItem>
				)}
					{footerData && <Footer item={footerData} />}

			</Animated.View>
			<MainHeader
				navigation={navigation}
				setLat={setLat}
				setLng={setLng}
				distance={distance}
			/>
			<DistanceModal
				isShow={showDistance}
				setIsShow={setShowDistance}
				distance={distance}
			/>
			<ImageViewModal isShow={showModal} setShow={setShowModal} />
		</Container>
	);
};

export default TodayIn;
