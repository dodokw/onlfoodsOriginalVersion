import React from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import {ColorRed, ColorBlue} from '~/Assets/Style/Colors';

const Container = styled.TouchableOpacity`
	flex-direction: row;
	margin: 10px 0;
`;
const ImageBox = styled.View`
	position: relative;
	width: 50px;
	height: 50px;
	align-items: center;
	justify-content: center;
	border-radius: 30px;
	border-width: 2px;
	border-color: #dfdfdf;
`;
const Image = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 30px;
`;

const ImageLabelBox = styled.View`
	position: absolute;
	bottom: -10px;
	background-color: ${props => props.backgroundColor};
	border-radius: 10px;
	width: 50px;
`;

const ImageLabel = styled.Text`
	color: #ffffff;
	font-family: ${FONTNanumGothicRegular};
	padding: 5px 0;
	font-size: 11px;
	text-align: center;
`;

const InfoWrap = styled.View`
	flex: 1;
	margin-left: 10px;
	justify-content: space-around;
`;

const TitleWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const TitleText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size:14px;
`;

const ChatCountBox = styled.View`
	height: 25px;
	width: 25px;
	border-radius: 50px;
	background-color: ${ColorRed};
	align-items: center;
	justify-content: center;
`;

const ChatCount = styled.Text`
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	text-align: center;
	font-size: 10px;
`;

const ContentWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const ContentText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
	font-size: 13px;
`;
const PeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
	font-size: 10px;
`;

const ChattingCard = ({data, user, onPress}) => {
	return (
		<Container onPress={onPress}>
			<ImageBox>
				<Image source={{uri: data.slt_image}} resizeMode="cover" />
				{/* <ImageLabelBox
					backgroundColor={data.slt_idx === user.mt_idx ? ColorBlue : ColorRed}>
					<ImageLabel>
						{data.slt_idx === user.mt_idx ? '구매자' : '판매자'}
					</ImageLabel>
				</ImageLabelBox> */}
			</ImageBox>
			<InfoWrap>
				<TitleWrap>
					<TitleText>{data.slt_name}</TitleText>
					<PeriodText>{data.data}</PeriodText>
				</TitleWrap>
				<ContentWrap>
					<ContentText numberOfLines={1}>{data.content}</ContentText>
					{parseInt(data.read_cnt) > 0 && (
						<ChatCountBox>
							<ChatCount>
								{parseInt(data.read_cnt) > 99 ? '99+' : data.read_cnt}
							</ChatCount>
						</ChatCountBox>
					)}
				</ContentWrap>
				
			</InfoWrap>
		</Container>
	);
};

export default ChattingCard;
