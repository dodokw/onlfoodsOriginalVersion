import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
const WIDTH = Dimensions.get('screen').width;

const Container = styled.View`
	flex-direction: ${props => (props.me ? 'row-reverse' : 'row')};
	align-items: flex-start;
	margin: 10px;
`;

const ChatWrap = styled.View`
	flex: 1;
`;

const Nick = styled.Text`
	color: #333333;
	margin-left: 10px;
	text-align: left;
`;

const ContentWrap = styled.View`
	flex-direction: ${props => (props.me ? 'row-reverse' : 'row')};
	justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
	align-items: flex-end;
`;

const ContentBox = styled.TouchableOpacity`
	max-width: ${WIDTH - 100}px;
	border-radius: 25px;
	background-color: ${props => (props.me ? ColorRed : '#eeeeee')};
	padding: 10px;
	margin-left: 5px;
	margin-right: 5px;
	flex-wrap: wrap;
	align-items: flex-start;
`;
const Content = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 25px;
	background-color: #ffffff;
`;

const DelImg = styled.Text`
	color: ${props => (props.me ? '#ffffff' : '#000000')};
	font-family: ${FONTNanumGothicBold};
`;

const TimeBox = styled.View`
	flex: 1;
	align-self: flex-end;
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

const ChattingImage = ({
	me,
	prevUser,
	data,
	otherImg,
	otherName,
	setShowModal,
}) => {
	const splitTime = data.cdt_date.split(' ')[1];
	const time = splitTime.slice(0, 5);
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
					<ContentBox
						me={me}
						onPress={() => setShowModal(data.cdt_message)}
						disabled={data.cdt_message === 'expired image'}>
						{data.cdt_message !== 'expired image' ? (
							<Content
								me={me}
								source={{
									uri: `${data.cdt_message.slice(
										0,
										-4,
									)}_thumb.${data.cdt_message.slice(-3)}`,
								}}
							/>
						) : (
							<DelImg me={me}>삭제된 이미지 입니다.</DelImg>
						)}
					</ContentBox>
					<TimeBox>
						<Time me={me}>{time}</Time>
					</TimeBox>
				</ContentWrap>
			</ChatWrap>
		</Container>
	);
};

export default React.memo(ChattingImage);
