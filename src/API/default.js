import axios from 'axios';

export const secretKey = '1111882EAD94E9C493CEF089E1B023A2122BA778';

const API = axios.create({
	baseURL: 'https://onlfoods.com/api/',
	timeout: 5000,
	headers: {'content-type': 'multipart/form-data'},
});

export default API;
