import WebView from 'react-native-webview';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import BackButton from '~/Components/BackButton/index';
import Header from '~/Components/Header/index';
import {ActivityIndicator} from 'react-native';
import {ColorRed} from '~/Assets/Style/Colors';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const LoadingBox = styled.View`
	flex: 1;
`;

function NoticeDetail({navigation, route}) {
	const id = route.params.id;

	return (
		<Container>
			<Header
				title="공지사항"
				headerLeft={<BackButton onPress={() => navigation.goBack()} />}
			/>
			<WebView
				style={{flex: 1}}
				startInLoadingState={true}
				renderLoading={() => (
					<LoadingBox>
						<ActivityIndicator size="small" color={ColorRed} />
					</LoadingBox>
				)}
				source={{
					uri: `https://onlfoods.com/view/notice_detail.php?nt_idx=${id}`,
				}}
			/>
		</Container>
	);
}

export default NoticeDetail;
