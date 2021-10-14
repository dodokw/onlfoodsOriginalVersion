import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {SvgXml} from 'react-native-svg';
import ic_plain from '~/Assets/Images/ic_plain.svg';
import ic_plain_on from '~/Assets/Images/ic_plain_on.svg';
import {ColorLineGrey, ColorLowRed, ColorRed} from '~/Assets/Style/Colors';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import {Animated, Easing} from 'react-native';
import {Keyboard} from 'react-native';

const ChattingInputContainer = styled.View`
	flex-direction: row;
	align-items: center;
	background-color: #f8f8f8;
	padding: 10px 5px;
	max-height: 100px;
`;

const InputBox = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	background-color: #ffffff;
	justify-content: space-between;
	border-radius: 25px;
	padding: 0px 20px;
	border-width: 1px;
	border-color: #dfdfdf;
`;

const ChattingInput = styled.TextInput`
	flex: 1;
	font-size: 15px;
	padding: 5px 5px;
	font-family: ${FONTNanumGothicRegular};
	color: #000000;
`;

const Button = styled.TouchableOpacity`
	padding: 0 5px;
`;

const ChattingComposer = ({
	texting,
	setTexting,
	onSend,
	showMenu,
	setShowMenu,
	otherName,
}) => {
	const textInputRef = useRef();

	return (
		<ChattingInputContainer>
			<Button onPress={() => setShowMenu(true)} disabled={otherName}>
				<Icon name="plus" size={30} color={ColorLineGrey} />
			</Button>
			<InputBox>
				<ChattingInput
					ref={textInputRef}
					placeholder={
						otherName
							? '탈퇴 회원에겐 보낼수 없습니다.'
							: '메세지를 입력하세요.'
					}
					value={texting}
					onChangeText={text => setTexting(text)}
					placeholderColor="#787878"
					returnKeyType="send"
					multiline={true}
					editable={!otherName}
				/>
				<Button
					onPress={() => {
						if (texting !== '') {
							onSend(texting);
							setTexting('');
							textInputRef.current.focus();
						}
					}}
					disabled={otherName}>
					<SvgXml xml={texting === '' ? ic_plain : ic_plain_on} />
				</Button>
			</InputBox>
		</ChattingInputContainer>
	);
};

export default ChattingComposer;
