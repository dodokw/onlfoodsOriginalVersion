import React from 'react';
import styled from 'styled-components/native';
import Postcode from '@actbase/react-daum-postcode';
import Icon from 'react-native-vector-icons/Feather';
import {
	Modal,
	Dimensions,
	KeyboardAvoidingView,
	SafeAreaView,
} from 'react-native';
import {Platform} from 'react-native';

const Header = styled.View`
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	height: 50px;
	padding: 0 10px;
`;
const CloseButton = styled.TouchableOpacity`
	padding: 5px;
`;

const PostcodeModal = ({isShow, setIsShow, getPost}) => {
	return Platform.OS === 'android' ? (
		<Modal animationType="fade" visible={isShow}>
			<Header>
				<CloseButton onPress={() => setIsShow(false)}>
					<Icon name="x" size={25} color="#000000" />
				</CloseButton>
			</Header>
			<Postcode
				style={{
					width: Dimensions.get('window').width,
					height: Dimensions.get('window').height - 50,
				}}
				jsOptions={{animated: true, hideMapBtn: true}}
				onSelected={address => {
					getPost(address);
					setIsShow(false);
				}}
				onError={error => console.log(error)}
			/>
		</Modal>
	) : (
		<Modal animationType="fade" visible={isShow}>
			<SafeAreaView>
				<Header>
					<CloseButton onPress={() => setIsShow(false)}>
						<Icon name="x" size={25} color="#000000" />
					</CloseButton>
				</Header>
				<Postcode
					style={{
						width: Dimensions.get('window').width,
						height: Dimensions.get('window').height - 70,
					}}
					jsOptions={{animated: true, hideMapBtn: true}}
					onSelected={address => {
						getPost(address);
						setIsShow(false);
					}}
					onError={error => console.log(error)}
				/>
			</SafeAreaView>
		</Modal>
	);
};

export default PostcodeModal;
