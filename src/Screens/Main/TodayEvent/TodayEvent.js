import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Easing, FlatList, ScrollView} from 'react-native';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import ic_distance from '~/Assets/Images/ic_option_color.svg';
import EventCard from '~/Components/EventCard';
import LoadingSpinner from '~/Components/LoadingSpinner';
import BannerIndicator from '~/Components/BannerIndicator';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {floatingShow, setScreen} from '~/Modules/Action';
import {APICallTodayEvnetList} from '~/API/MainAPI/MainAPI';
import DistanceModal from '~/Components/Modal/DistanceModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import {Alert} from 'react-native';
import {RefreshControl} from 'react-native';
import {ColorRed} from '~/Assets/Style/Colors';
import {Animated} from 'react-native';

const WIDTH = Dimensions.get('screen').width;

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
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

const ContentContainer = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const ContentOptions = styled.View`
	flex-direction: row;
	margin: 10px 0;
	justify-content: space-between;
	padding: 0px 20px;
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

const ListWarningLabel = styled.Text`
	text-align: center;
	margin: 60px 0;
	font-family: ${FONTNanumGothicRegular};
`;

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

const TodayEvent = ({navigation}) => {
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const location = useSelector(state => state.dataReducer.location);
	const [bannerData, setBannerData] = useState();
	const [data, setData] = useState();
	const [dataLoading, setDataLoding] = useState(false);
	const distance = useSelector(state => state.dataReducer.distance);
	const [standard, setStandard] = useState('distance');
	const [showDistance, setShowDistance] = useState(false);
	const isSet = useRef(false);
	const bannerIndex = useRef(0);
	const BannerRef = useRef();
	const pageRef = useRef(1);
	const [nowIndex, setNowIndex] = useState();
	const [refreshing, setRefreshing] = useState(false);
	const [hideBanner, setHideBanner] = useState(false);
	const aniValue = useRef(new Animated.Value(1)).current;

	const HEIGHT = Dimensions.get('screen').height;

	const changeValue = aniValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-120, 0],
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

	const onViewableItemsChanged = useRef(({viewableItems}) => {
		if (viewableItems.length > 0) {
			bannerIndex.current = viewableItems[0].index;
			setNowIndex(viewableItems[0].index);
		}
	});

	const settingBanner = async () => {
		const str = await AsyncStorage.getItem('Banner');
		const banner = JSON.parse(str);
		console.log('배너', banner.event);
		setBannerData(banner.event);
	};

	const getList = async () => {
		setRefreshing(true);
		try {
			pageRef.current = 1;
			const res = await APICallTodayEvnetList(
				location.y,
				location.x,
				standard,
				distance,
				pageRef.current,
				user.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('데이터', decode.data);
				setData(decode.data);
				setRefreshing(false);
				setDataLoding(false);
			} else {
				setDataLoding(false);
				setRefreshing(false);
				setData(undefined);
			}
		} catch (err) {
			setDataLoding(false);
			setRefreshing(false);
			console.error(err);
		}
	};

	const addList = async () => {
		pageRef.current += 1;
		console.log(pageRef.current);

		try {
			const res = await APICallTodayEvnetList(
				location.y,
				location.x,
				standard,
				distance,
				pageRef.current,
				user.mt_idx,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log(decode.data);
				setData([...data, ...decode.data]);
			} else {
				console.log('추가', res.message);
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
			setDataLoding(true);
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: true});
			dispatch(setScreen('TodayEventNav'));
			dispatch(floatingShow());
			getList();
			if (user.mt_hp === null) {
				Alert.alert('알림', '추가정보를 필요로합니다. 입력하시겠습니까?', [
					{text: '확인', onPress: () => navigation.navigate('SNSSignUp')},
					{text: '취소', onPress: () => navigation.goBack()},
				]);
			}
		}
	}, [standard, distance, location.y, location.x, isFocused]);

	// useEffect(() => {
	// 	console.log(standard, distance, location.y, location.x);
	// 	getList();
	// }, [standard, distance, location.y, location.x]);

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

	return (
		<Container>
			<Animated.View
				style={{
					height: HEIGHT,
					transform: [{translateY: changeValue}],
					backgroundColor: '#ffffff',
					marginTop: 50,
				}}>
				<BannerContainer>
					<ListBox>
						{bannerData !== undefined && (
							<FlatList
								style={{
									width: WIDTH - 20,
									height: 100,
									borderTopRightRadius: 25,
									borderBottomRightRadius: 25,
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
				</BannerContainer>
				<ContentContainer>
					<ContentOptions>
						<DistanceButton onPress={() => setShowDistance(true)}>
							<SvgXml xml={ic_distance} />
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
					{dataLoading ? (
						<LoadingSpinner />
					) : (
						<ContentWrap
							style={{height: Dimensions.get('screen').height - 130}}>
							<FlatList
								style={{flex: 1}}
								contentContainerStyle={{
									paddingBottom: 100,
									paddingHorizontal: 20,
								}}
								showsVerticalScrollIndicator={false}
								data={data}
								keyExtractor={item => `EventCard-${item.et_idx}`}
								renderItem={({item}) => (
									<EventCard
										key={`EventCard-${item.et_idx}`}
										item={item}
										dong={location.region_3depth_name}
										onPress={() =>
											navigation.navigate('TodayEventDetail', {
												et_idx: item.et_idx,
												seller_idx: item.mt_seller_idx,
												mt_idx: user.mt_idx,
												lat: location.y,
												lng: location.x,
											})
										}
									/>
								)}
								onEndReachedThreshold={0.5}
								onEndReached={addList}
								ListEmptyComponent={
									!dataLoading && (
										<ListWarningLabel>공지가 없습니다.</ListWarningLabel>
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
										if (data !== undefined) setHideBanner(true);
									}
								}}
							/>
						</ContentWrap>
					)}
				</ContentContainer>
				<DistanceModal
					isShow={showDistance}
					setIsShow={setShowDistance}
					distance={distance}
				/>
			</Animated.View>
			<Header title="공지사항" absolute />
		</Container>
	);
};

export default TodayEvent;
