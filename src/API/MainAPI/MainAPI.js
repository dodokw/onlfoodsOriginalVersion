import axios from 'axios';
import API, {secretKey} from '../default';

//배너요청
export const APICallBanner = async () => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		const res = await API.post('banner_list.php', form);
		if (res.data.result === 'true') return res.data;
		else throw Error(res.data.message);
	} catch (err) {
		throw Error(err.message);
	}
};

//알림불러오기
export const APICallAlramList = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		const res = await API.post('push_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallAlramCheck = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		const res = await API.post('push_check.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallAlramCount = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		const res = await API.post('push_count.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//검색
export const APICallProductSearch = async (
	search_txt,
	lat,
	lng,
	dist,
	page,
	user,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('search_txt', search_txt);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('dist', dist);
		form.append('page', page);
		form.append('mt_idx', user);
		console.log(form);
		const res = await API.post('product_search.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallSellerSearch = async (
	search_txt,
	lat,
	lng,
	dist,
	page,
	user,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('search_txt', search_txt);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('dist', dist);
		form.append('page', page);
		form.append('mt_idx', user);
		console.log(form);

		const res = await API.post('seller_search.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//관심등록
export const APICallLikeCompany = async (company, user) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('srt_idx', company);
		form.append('mt_idx', user);
		const res = await API.post('wish_store_input.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//오늘만 리스트
export const APICallTodayInList = async (
	user,
	lat,
	lng,
	orderby,
	dist,
	category,
	page,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('order_by', orderby);
		form.append('dist', dist);
		form.append('category', category);
		form.append('page', page);
		console.log(form);
		const res = await API.post('main_today_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//오늘만 상세
export const APICallTodayInDetail = async (lat, lng, pt_idx, mt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('pt_idx', pt_idx);
		form.append('mt_idx', mt_idx);
		const res = await API.post('today_list_detail.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//오늘의 공지 리스트
export const APICallTodayEvnetList = async (
	lat,
	lng,
	orderby,
	dist,
	page,
	mt_idx,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('order_by', orderby);
		form.append('dist', dist);
		form.append('page', page);
		form.append('mt_idx', mt_idx);
		const res = await API.post('event_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallTodayEvnetDetail = async (lat, lng, et_idx, mt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('et_idx', et_idx);
		form.append('mt_idx', mt_idx);
		const res = await API.post('event_detail.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallDeliverList = async (
	type,
	lat,
	lng,
	orderBy,
	cate,
	dist,
	page,
	user,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('type', type);
		form.append('lat', lat);
		form.append('lng', lng);
		form.append('orderby', orderBy);
		form.append('cate', cate);
		if (type === 'dist') {
			form.append('dist', dist);
		}
		form.append('page', page);
		console.log('폼', form);
		const res = await API.post('seller_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallDeliverDetail = async (slt_idx, user, addr) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('slt_idx', slt_idx);
		form.append('mt_idx', user);
		form.append('mt_addr', addr);
		const res = await API.post('product_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallOrderStart = async (
	user,
	slt_idx,
	delivery_type,
	items,
	location,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('slt_idx', slt_idx);
		form.append('delivery_type', delivery_type);
		form.append('mt_addr', location.address_name);
		form.append('mt_addr2', location.sangse);
		form.append('mt_zip', location.zip);
		items.forEach((element, index) => {
			form.append(`item[${index}][pt_idx]`, element.pt_idx);
			form.append(`item[${index}][pt_qty]`, element.pt_qty);
		});

		console.log(form);
		const res = await API.post('order_chat_start.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallLocalList = async (step, code) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('step', step);
		form.append('code', code);
		const res = await API.post('select_local.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallReport = async (
	slt_idx,
	mt_idx,
	mrt_reason,
	mrt_detail,
	mrt_image,
) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('slt_idx', slt_idx);
		form.append('mt_idx', mt_idx);
		form.append('mrt_reason', mrt_reason);
		form.append('mrt_detail', mrt_detail);
		form.append('mrt_image', mrt_image);
		const res = await API.post('seller_report.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

//좌표로 주소 변환
export const APICallAddr = async (x, y) => {
	console.log(x, y);
	try {
		const apikey = 'e719b6fe76915af72ccaa72f4c77027b';
		const res = await axios.get(
			'https://dapi.kakao.com/v2/local/geo/coord2address.json',
			{
				params: {x, y},
				headers: {
					Authorization: `KakaoAK ${apikey}`,
				},
			},
		);
		if (res.status === 200) {
			const json = JSON.parse(res.request._response);
			return json.documents[0];
		} else {
			throw Error(res.statusText);
		}
	} catch (err) {
		throw Error(err.message);
	}
};

//주소를 좌표로 변환
export const APICallGeo = async address => {
	try {
		const apikey = 'e719b6fe76915af72ccaa72f4c77027b';
		const res = await axios.get(
			'https://dapi.kakao.com/v2/local/search/address.json',
			{
				params: {
					query: address,
					analyze_type: 'exact',
				},
				headers: {
					Authorization: `KakaoAK ${apikey}`,
				},
			},
		);
		if (res.status === 200) {
			const json = JSON.parse(res.request._response);
			return json.documents[0];
		} else {
			throw Error(res.statusText);
		}
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallAlramCheckOne = async idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('plt_idx', idx);
		const res = await API.post('push_check_one.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

// APICallGeo('부산광역시 금정구 구서1동').then(res => {
// 	console.log(res);
// });

// APICallAddr('129.086899563252', '35.2450873651546').then(res => {
// 	console.log(res);
// });
