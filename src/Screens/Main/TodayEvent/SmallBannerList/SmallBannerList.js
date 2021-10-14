import React, {useEffect} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import {floatingHide} from '~/Modules/Action';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const BannerBox = styled.TouchableOpacity`
	margin-bottom: 10px;
`;
const Banner = styled.Image`
	height: 100px;
`;

const BannerItem = ({item, navigation}) => {
	return (
		<BannerBox onPress={() => navigation.navigate('BannerDetail', {item})}>
			<Banner source={{uri: item.img}} />
		</BannerBox>
	);
};

const SmallBannerList = ({navigation, route}) => {
	const bannerData = route.params.bannerData;

	const dispatch = useDispatch();

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
	}, []);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="전체보기"
			/>
			<FlatList
				data={bannerData}
				contentContainerStyle={{paddingBottom: 50}}
				keyExtractor={(item, index) => `banner-${index}`}
				renderItem={({item}) => (
					<BannerItem item={item} navigation={navigation} />
				)}
			/>
		</Container>
	);
};

export default SmallBannerList;
