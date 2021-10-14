import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import LoadingSpinner from '~/Components/LoadingSpinner';
import {FONTNanumGothicRegular} from '../../../Assets/Style/Fonts';
const WIDTH = Dimensions.get('screen').width;

const Container = styled.View`
	flex-direction: ${props => (props.me ? 'row-reverse' : 'row')};
	align-items: flex-start;
	margin: 5px;
`;

const ChatWrap = styled.View`
	flex: 1;
`;

const Nick = styled.Text`
	color: #333333;
	margin-left: 10px;
	margin-bottom: 5px;
	text-align: left;
	font-family: ${FONTNanumGothicRegular};
`;

const ContentWrap = styled.View`
	flex-direction: ${props => (props.me ? 'row-reverse' : 'row')};
	justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
	align-items: flex-end;
`;

const ContentBox = styled.View`
	max-width: ${WIDTH - 100}px;
	border-radius: 25px;
	background-color: ${props => (props.me ? ColorRed : '#eeeeee')};
	padding: 10px;
	margin-left: 5px;
	margin-right: 5px;
	flex-wrap: wrap;
	align-items: flex-start;
`;
const Content = styled.Text`
	color: ${props => (props.me ? '#ffffff' : '#000000')};
	font-family: ${FONTNanumGothicRegular};
`;

const TimeBox = styled.View`
	flex: 1;
	align-items: ${props => (props.me ? 'flex-end' : 'flex-start')};
`;

const Time = styled.Text`
	color: ${ColorLineGrey};
	text-align: ${props => (props.me ? 'right' : 'left')};
`;
const NoAvatar = styled.View`
	width: 25px;
	height: 25px;
`;

const Avatar = styled.Image`
	border-radius: 50px;
	width: 25px;
	height: 25px;
`;

const ChattingBox = ({me, prevUser, data, otherImg, otherName}) => {
	const time = () => {
		if (data.cdt_date === 'Loading') {
			return <ActivityIndicator size="small" color={ColorRed} />;
		} else {
			const splitTime = data.cdt_date.split(' ')[1];
			const timeOnly = splitTime.slice(0, 5);
			return timeOnly;
		}
	};

	return (
		<Container me={me}>
			{!me ? (
				prevUser ? (
					<Avatar source={{uri: otherImg}} />
				) : (
					<NoAvatar />
				)
			) : null}
			<ChatWrap>
				{!me && prevUser && (
					<Nick ellipsizeMode="tail" me={me}>
						{otherName}
					</Nick>
				)}
				<ContentWrap me={me}>
					<ContentBox me={me}>
						<Content me={me}>{data.cdt_message}</Content>
					</ContentBox>
					<TimeBox me={me}>
						{data.cdt_date === 'Loading ' ? (
							time()
						) : (
							<Time me={me}>{time()}</Time>
						)}
					</TimeBox>
				</ContentWrap>
			</ChatWrap>
		</Container>
	);
};

export default React.memo(ChattingBox);
