import API, {secretKey} from '../default';

export const APIUpdateMyProfile = async (
	mt_idx,
	type,
	profile,
	change_pwd,
	change_re,
	current_pwd,
	phone,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('type', type);
		if (type === 'profile') {
			form.append('profile', profile);
		} else if (type === 'password') {
			form.append('change_pwd', change_pwd);
			form.append('change_re', change_re);
			form.append('current_pwd', current_pwd);
		} else if (type === 'phone') {
			form.append('mt_hp', phone);
		}
		const res = await API.post('member_update2.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIUpdateMyProfileAll = async (
	mt_idx,
	mt_name,
	slt_company_num,
	slt_company_name,
	slt_company_boss,
	address,
	bizImg,
	bankImg,
	reportImg,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('mt_name', mt_name);
		form.append('slt_company_name', slt_company_name);
		form.append('slt_company_boss', slt_company_boss);
		form.append('slt_company_num', slt_company_num);
		form.append('slt_zip', address.zip);
		form.append('slt_addr', address.address);
		form.append('slt_addr2', address.sangse);
		form.append('slt_lat', address.lat);
		form.append('slt_lng', address.lng);
		form.append('slt_dong', address.dong);
		if (bizImg !== null) form.append('slt_file1', bizImg);
		if (bankImg !== null) form.append('slt_file2', bankImg);
		if (reportImg !== null) form.append('slt_file3', reportImg);
		console.log(form);
		const res = await API.post('member_update_all.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallMemberInfo = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		const res = await API.post('member_view.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerInfo = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		const res = await API.post('member_seller_view.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIUpdateSellerImg = async (user, img) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('slt_image', img);
		const res = await API.post('member_seller_img.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIUpdataSellerProfile = async (
	user,
	slt_addr_chk,
	address,
	detailAddress,
	slt_company_cate,
	slt_business_hours,
	slt_company_hp,
	slt_company_item,
	etcAddress,
	etcDetailAddress,
	slt_deliver,
	slt_deliver_area,
	slt_deliver_time,
	slt_deliver_pay,
	slt_channel,
	slt_payment,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('slt_zip', address.zip);
		form.append('slt_addr', address.address);
		form.append('slt_addr2', detailAddress);
		form.append('slt_dong', address.dong);
		form.append('slt_lat', address.lat);
		form.append('slt_lng', address.lng);
		form.append('slt_company_cate', slt_company_cate);
		form.append('slt_business_hours', slt_business_hours);
		form.append('slt_company_hp', slt_company_hp);
		form.append('slt_company_item', slt_company_item);
		form.append('slt_addr_chk', slt_addr_chk);
		form.append('slt_etc_zip', etcAddress.zip);
		form.append('slt_etc_addr', etcAddress.address);
		form.append('slt_etc_addr2', etcDetailAddress);
		form.append('slt_etc_lat', etcAddress.lat);
		form.append('slt_etc_lng', etcAddress.lng);
		form.append('slt_etc_dong', etcAddress.dong);
		form.append('slt_deliver', slt_deliver);
		form.append('slt_deliver_area', slt_deliver_area);
		form.append('slt_deliver_time', slt_deliver_time);
		form.append('slt_deliver_pay', slt_deliver_pay);
		form.append('slt_channel', slt_channel);
		form.append('slt_payment', slt_payment);
		console.log('프로필수정', form);
		const res = await API.post('member_seller_update.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallZzimList = async (seller, mt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		const res = await API.post(
			seller ? 'seller_zzim_list.php' : 'my_zzim_list.php',
			form,
		);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallZzimTodayInOrderList = async (seller, user, date) => {
	try {
		console.log('관심 오늘만 리스트');
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', seller);
		form.append('od_mt_idx', user);
		form.append('ot_wdate', date);
		const res = await API.post('seller_zzim_today.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallZzimSupplyOrderList = async (seller, user, date) => {
	try {
		console.log('관심 추천업체 리스트');
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', seller);
		form.append('od_mt_idx', user);
		form.append('ot_wdate', date);
		const res = await API.post('seller_zzim_stock.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerTodayInOrderList = async (mt_idx, date) => {
	try {
		console.log('판매자 오늘만 리스트');

		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('ot_wdate', date);
		const res = await API.post('seller_today_order.php', form);
		console.log(res);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTodayInOrderList = async mt_idx => {
	try {
		console.log('구매자 오늘만 리스트');
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		const res = await API.post('my_today_order_list.php', form);
		console.log(res);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerSupplyOrderList = async (mt_idx, date) => {
	try {
		console.log('판매자 추천업체 리스트');
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('ot_wdate', date);
		const res = await API.post('seller_stock_order.php', form);
		console.log(res);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSupplyOrderList = async mt_idx => {
	try {
		console.log('구매자 추천업체 리스트');

		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		console.log(form);
		const res = await API.post('my_stock_order_list.php', form);
		console.log(res);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSupplyOrderDeatil = async (mt_idx, od_idx) => {
	try {
		console.log('구매자 추천업체 상세 리스트');

		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('od_idx', od_idx);
		const res = await API.post('my_stock_order_view.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerSupplyOrderDeatil = async (mt_idx, od_idx) => {
	try {
		console.log('판매자 추천업체 상세 리스트');

		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('od_idx', od_idx);
		const res = await API.post('seller_stock_order_view.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallZzimSupplyOrderDeatil = async (mt_idx, od_idx) => {
	try {
		console.log('관심 추천업체 상세 리스트', od_idx, mt_idx);

		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('od_idx', od_idx);
		const res = await API.post('seller_zzim_stock_view.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallNoticeList = async page => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('page', page);
		const res = await API.post('notice_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallNoticeDetail = async id => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('nt_idx', id);
		const res = await API.post('notice_detail.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallFAQList = async page => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('page', page);
		const res = await API.post('faq_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallAlramSetting = async mt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		const res = await API.post('notification_view.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIEnrollPushAlram = async (user_idx, seller, status, all) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user_idx);
		form.append('mt_pushing', all ? 'Y' : 'N');
		if (seller) {
			form.append('mt_pushing6', status[0].push);
			form.append('mt_pushing7', status[1].push);
			form.append('mt_pushing8', status[2].push);
			form.append('mt_pushing9', status[3].push);
		} else {
			form.append('mt_pushing1', status[0].push);
			form.append('mt_pushing2', status[1].push);
			form.append('mt_pushing3', status[2].push);
			form.append('mt_pushing4', status[3].push);
			form.append('mt_pushing5', status[4].push);
		}
		console.log('푸쉬', form);

		const res = seller
			? await API.post('notification_seller_setup.php', form)
			: await API.post('notification_setup.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallEventManagementList = async (user, page) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('page', page);
		const res = await API.post('seller_event.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIEnrollEvent = async (
	user,
	title,
	type,
	startDate,
	endDate,
	address,
	info,
	mainImg,
	subImg,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('et_name', title);
		form.append('et_type', type);
		form.append('et_sdate', startDate);
		form.append('et_edate', endDate);
		form.append('et_location', 1);
		form.append('et_addr1', address.address);
		form.append('et_addr2', address.sangse);
		form.append('et_lat', address.lat);
		form.append('et_lng', address.lng);
		form.append('et_content', info);
		form.append('et_thumbnail', mainImg);
		subImg.forEach((item, index) => form.append('et_image[]', item));
		console.log('공지 등록 전송 Form', form);
		const res = await API.post('seller_event_add.php', form);
		console.log(res.data);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIModifyEvent = async (
	user,
	et_idx,
	title,
	type,
	startDate,
	endDate,
	address,
	info,
	mainImg,
	subImg,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('et_idx', et_idx);
		form.append('et_name', title);
		form.append('et_type', type);
		form.append('et_sdate', startDate);
		form.append('et_edate', endDate);
		form.append('et_location', '1');
		form.append('et_addr1', address.address);
		form.append('et_addr2', address.sangse);
		form.append('et_lat', address.lat);
		form.append('et_lng', address.lng);
		form.append('et_content', info);
		form.append('et_thumbnail', mainImg.uri);
		subImg.forEach((item, index) =>
			form.append('et_image[]', item.name === undefined ? item.uri : item),
		);
		console.log('공지 수정 전송 Form', form);
		const res = await API.post('seller_event_edit.php', form);
		console.log(res);
		console.log(res.data);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTodayEventForm = async (user, et_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('et_idx', et_idx);
		const res = await API.post('seller_event_view.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallQuestionList = async (user, seller, page) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('mt_mode', seller ? 2 : 1);
		form.append('page', page);
		const res = await API.post('my_inquiry_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIEnrollQuestion = async (user, seller, title, content, img) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('mt_mode', seller ? 2 : 1);
		form.append('qt_title', title);
		form.append('qt_content', content);
		form.append('qt_file', img);
		const res = await API.post('my_inquiry_add.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTodayInHistoryList = async (user, page, date) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('page', page);
		form.append('pt_wdate', date);
		const res = await API.post('seller_today_list.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIEnrollTodayIn = async (
	user,
	isNew,
	code,
	category,
	title,
	count,
	tex,
	show,
	cost,
	price,
	date,
	content,
	chatting_chk,
	mainImg,
	subImg,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		if (!isNew) form.append('pt_code', code);
		form.append('ct_id', category);
		form.append('pt_title', title);
		form.append('pt_qty', count);
		form.append('pt_vat', tex ? 1 : 2);
		form.append('pt_show', show ? 'Y' : 'N');
		form.append('pt_in_price', cost);
		form.append('pt_price', price);
		form.append('pt_expired_date', date);
		form.append('pt_content', content);
		form.append('pt_chatting_chk', chatting_chk ? 'Y' : '');
		form.append('pt_thumbnail', mainImg);
		subImg.forEach((item, index) => form.append('pt_image[]', item));
		console.log('오늘만 등록', form);
		const res = await API.post('seller_today_add.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIModifyTodayIn = async (
	pt_idx,
	user,
	category,
	title,
	count,
	tex,
	show,
	cost,
	price,
	date,
	content,
	chatting_chk,
	mainImg,
	subImg,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('pt_idx', pt_idx);
		form.append('mt_idx', user);
		form.append('ct_id', category);
		form.append('pt_title', title);
		form.append('pt_qty', count);
		form.append('pt_vat', tex ? 1 : 2);
		form.append('pt_show', show ? 'Y' : 'N');
		form.append('pt_in_price', cost);
		form.append('pt_price', price);
		form.append('pt_expired_date', date);
		form.append('pt_content', content);
		form.append('pt_chatting_chk', chatting_chk ? 'Y' : '');
		form.append('pt_thumbnail', mainImg.uri);
		subImg.forEach((item, index) =>
			form.append('pt_image[]', item.name === undefined ? item.uri : item),
		);
		console.log('오늘만 수정', form);
		const res = await API.post('seller_today_edit.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTodayInForm = async pt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('pt_idx', pt_idx);
		const res = await API.post('seller_today_detail.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIDelTodayIn = async pt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('pt_idx', pt_idx);
		const res = await API.post('seller_today_del.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerProductList = async (user, category, date) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('ct_id', category);
		form.append('pt_wdate', date);
		const res = await API.post('seller_product_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerShipStockList = async (user, date) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('pt_wdate', date);
		const res = await API.post('seller_stock_release.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIDelTodayEvent = async (user, et_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('et_idx', et_idx);
		const res = await API.post('seller_event_del.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerCheck = async mt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		const res = await API.post('member_status.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallExitMember = async (mt_idx, password) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('mt_pwd', password);
		const res = await API.post('member_retire.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallUserInfoRefresh = async mt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		const res = await API.post('member_confirm_seller.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APITodayInRefresh = async (mt_idx, pt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('pt_idx', pt_idx);
		const res = await API.post('today_update_now.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APITodayInExpired = async (mt_idx, pt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('pt_idx', pt_idx);
		const res = await API.post('today_update_end.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIDelOrderList = async (od_idx, mt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('od_idx', od_idx);
		form.append('mt_idx', mt_idx);
		const res = await API.post('my_order_delete.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallItemCodeList = async (mt_idx, keyword) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('search_txt', keyword);
		const res = await API.post('seller_today_code.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIEnrollStock = async (
	mt_idx,
	ct_id,
	title,
	count,
	cost,
	price,
	chatting_chk,
	date,
	tex,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('ct_id', ct_id);
		form.append('pt_title', title);
		form.append('pt_qty', count);
		form.append('pt_vat', tex ? 1 : 2);
		form.append('pt_in_price', cost);
		form.append('pt_price', price);
		form.append('pt_expired_date', date);
		form.append('pt_chatting_chk', chatting_chk ? 'Y' : '');
		console.log(form);
		const res = await API.post('seller_stock_add.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIDelStockList = async pt_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('pt_idx', pt_idx);
		const res = await API.post('seller_stock_del.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIUpdateStockList = async (mt_idx, items) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		items.forEach((element, index) => {
			form.append(`item[${index}][pt_idx]`, element.pt_idx);
			form.append(`item[${index}][pt_qty]`, element.pt_qty);
			form.append(`item[${index}][pt_price]`, element.pt_price);
			form.append(`item[${index}][pt_status]`, element.pt_status);
		});
		const res = await API.post('seller_stock_edit.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIPaymentLog = async (mt_idx, contents) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('log_contents', contents);
		const res = await API.post('log_test.pho', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};
