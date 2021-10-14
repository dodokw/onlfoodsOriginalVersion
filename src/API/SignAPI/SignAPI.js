import {Platform} from 'react-native';
import API, {secretKey} from '../default';

//로그인 요청
export const APILogin = async (token, id, password) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_app_token', token);
		form.append('mt_id', id);
		form.append('mt_pwd', password);
		console.log(form);
		const res = await API.post('member_login.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIAutoLogin = async (token, mt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_app_token', token);
		form.append('mt_idx', mt_idx);
		const res = await API.post('autologin.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//회원가입 요청
export const APIMemberSignUp = async (
	token,
	id,
	name,
	password,
	rePassword,
	phone,
	slt_company_num,
	slt_company_name,
	slt_company_boss,
	slt_zip,
	slt_addr,
	slt_addr2,
	slt_dong,
	slt_lat,
	slt_lng,
	slt_file1,
	slt_file2,
	slt_file3,
	checkMarketing,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_app_token', token);
		form.append('mt_id', id);
		form.append('mt_name', name);
		form.append('mt_pwd', password);
		form.append('mt_pwd_re', rePassword);
		form.append('mt_hp', phone);
		form.append('mt_agree', checkMarketing ? 'Y' : 'N');
		form.append('slt_company_num', slt_company_num);
		form.append('slt_company_name', slt_company_name);
		form.append('slt_company_boss', slt_company_boss);
		form.append('slt_zip', slt_zip);
		form.append('slt_addr', slt_addr);
		form.append('slt_addr2', slt_addr2);
		form.append('slt_dong', slt_dong);
		form.append('slt_lat', slt_lat);
		form.append('slt_lng', slt_lng);
		form.append('slt_file1', slt_file1);
		form.append('slt_file2', slt_file2);
		form.append('slt_file3', slt_file3);
		console.log('회원가입 폼', form, slt_file1, slt_file2, slt_file3);
		const res = await API.post('member_join.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICheckId = async id => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_id', id);
		const res = await API.post('id_overlap_check.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//인증번호를 요청합니다.
export const APICallPhoneAuth = async (authType, phoneNum) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('type', authType);
		form.append('mt_hp', phoneNum);
		const res = await API.post('hp_certify_send.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//인증번호를 비교하여 올바른지 확인합니다.
export const APICheckPhoneAuth = async (phoneNum, authNum) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_hp', phoneNum);
		form.append('mt_certify', authNum);
		const res = await API.post('hp_certify_check.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIFindID = async (name, phoneNum) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_name', name);
		form.append('mt_hp', phoneNum);
		const res = await API.post('find_info.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIChangePW = async (idx, password, rePassword) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', idx);
		form.append('mt_pwd', password);
		form.append('mt_pwd_re', rePassword);
		const res = await API.post('password_change.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICheckBizno = async bizno => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('slt_company_num', bizno);
		const res = await API.post('company_num_overlap_check.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTerms = async type => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('type', type);
		const res = await API.post('agree.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISellerSignUp = async (
	user,
	category,
	desc,
	time,
	phone,
	slt_addr_chk,
	slt_zip,
	slt_addr,
	slt_addr2,
	slt_dong,
	slt_lat,
	slt_lng,
	slt_etc_zip,
	slt_etc_addr,
	slt_etc_addr2,
	slt_etc_dong,
	slt_etc_lat,
	slt_etc_lng,
	slt_deliver,
	slt_deliver_area,
	slt_deliver_time,
	slt_deliver_pay,
	slt_channel,
	slt_payment,
	receipt,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('slt_company_cate', category);
		form.append('slt_company_item', desc);
		form.append('slt_business_hours', time);
		form.append('slt_company_hp', phone);
		form.append('slt_addr_chk', slt_addr_chk);
		form.append('slt_zip', slt_zip);
		form.append('slt_addr', slt_addr);
		form.append('slt_addr2', slt_addr2);
		form.append('slt_dong', slt_dong);
		form.append('slt_lat', slt_lat);
		form.append('slt_lng', slt_lng);
		form.append('slt_etc_zip', slt_etc_zip);
		form.append('slt_etc_addr', slt_etc_addr);
		form.append('slt_etc_addr2', slt_etc_addr2);
		form.append('slt_etc_lat', slt_etc_lat);
		form.append('slt_etc_lng', slt_etc_lng);
		form.append('slt_etc_dong', slt_etc_dong);
		form.append('slt_deliver', slt_deliver);
		if (slt_deliver === 1) {
			form.append('slt_deliver_area', slt_deliver_area);
			form.append('slt_deliver_time', slt_deliver_time);
			form.append('slt_deliver_pay', slt_deliver_pay);
		}
		form.append('slt_channel', slt_channel);
		form.append('slt_payment', slt_payment);
		form.append('pay_type', Platform.OS === 'android' ? 1 : 2); //1 안드로이드 // 2 애플
		if (Platform.OS === 'android') {
			form.append('orderId', receipt.orderId);
			form.append('packageName', receipt.packageName);
			form.append('productId', receipt.productId);
			form.append('purchaseTime', receipt.purchaseTime);
			form.append('purchaseState', receipt.purchaseState);
			form.append('purchaseToken', receipt.purchaseToken);
		} else {
			form.append('receipt', receipt);
		}
		console.log(form);
		const res = await API.post('seller_join.php', form, {timeout: 30000});
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISNSLogin = async (loginType, app_token, mt_id, mt_email) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_login_type', loginType);
		form.append('mt_app_token', app_token);
		if (loginType === 4) {
			form.append('mt_apple_token', mt_id);
			form.append('mt_id', mt_email);
		} else {
			form.append('mt_id', mt_id);
		}
		console.log('SNS로그인', form);
		const res = await API.post('member_sns_login.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISNSMoreInfo = async (
	mt_id,
	mt_name,
	mt_hp,
	bizno,
	bizname,
	ceoname,
	zip,
	address,
	sangse,
	dong,
	lat,
	lng,
	bizImg,
	bankImg,
	reportImg,
	checkMarketing,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_id);
		form.append('mt_name', mt_name);
		form.append('mt_hp', mt_hp);
		form.append('mt_agree', checkMarketing);
		form.append('slt_company_num', bizno);
		form.append('slt_company_name', bizname);
		form.append('slt_company_boss', ceoname);
		form.append('slt_zip', zip);
		form.append('slt_addr', address);
		form.append('slt_addr2', sangse);
		form.append('slt_dong', dong);
		form.append('slt_lat', lat);
		form.append('slt_lng', lng);
		form.append('slt_file1', bizImg);
		form.append('slt_file2', bankImg);
		form.append('slt_file3', reportImg);
		const res = await API.post('member_sns_edit.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};
