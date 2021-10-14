import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import {floatingHide} from '~/Modules/Action';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const BannerBox = styled.View`
	margin-bottom: 10px;
`;
const Banner = styled.Image`
	width: ${Dimensions.get('screen').width};
	height: 200px;
`;

const Wrap = styled.View`
	padding: 0px 20px;
`;
const Title = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 20px;
	margin-bottom: 10px;
`;
const Content = styled.Text``;

const BannerDetail = ({navigation, route}) => {
	const {item} = route.params;
	const dispatch = useDispatch();
	console.log(item);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
	}, []);

	return (
		<Container>
			<Header
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
				title="배너 상세"
			/>
			<BannerBox>
				<Banner source={{uri: item.img}} resizeMode="contain" />
			</BannerBox>
			<ScrollView bounces={false}>
				<Wrap>
					<Title>{item.title}</Title>
					<Content>{item.content}</Content>
				</Wrap>
			</ScrollView>
		</Container>
	);
};

export default BannerDetail;
