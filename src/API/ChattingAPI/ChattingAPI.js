import {resolveConfigFile} from 'prettier';
import API, {secretKey} from '../default';

export const APICallChattingList = async user => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		console.log(form);
		const res = await API.post('chat_list.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICallChattingDetail = async (user, chat_idx, date) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', user);
		form.append('chat_idx', chat_idx);
		form.append('cdt_date', date);
		console.log(form);
		const res = await API.post('chat_detail.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendMessage = async (chat_idx, user, msg) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('chat_idx', chat_idx);
		form.append('send_idx', user);
		form.append('chat_msg', msg);
		console.log(form);
		const res = await API.post('order_chat_msg.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendImg = async (chat_idx, user, img) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('chat_idx', chat_idx);
		form.append('send_idx', user);
		form.append('chat_file', img);
		console.log(form);
		const res = await API.post('order_chat_img.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendContract = async (chat_idx, od_idx, items) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('chat_idx', chat_idx);
		form.append('od_idx', od_idx);
		items.forEach((element, index) => {
			form.append(`item[${index}][pt_idx]`, element.pt_idx);
			form.append(`item[${index}][pt_qty]`, element.pt_qty);
			form.append(`item[${index}][pt_price]`, element.pt_price);
		});
		const res = await API.post('order_chat_order.php', form);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendConfirm = async (chat_idx, od_idx, address, sangse) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('chat_idx', chat_idx);
		form.append('od_idx', od_idx);
		if (address) {
			form.append('od_addr', address.addr1);
			form.append('od_addr2', sangse);
			form.append('od_zip', address.zip);
		}
		console.log('오더리스트 폼', form);
		const res = await API.post('order_chat_confirm.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendComplete = async (act, mt_idx, od_idx, cancel_reason) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('act', act);
		form.append('mt_idx', mt_idx);
		form.append('od_idx', od_idx);
		form.append('ot_cancel_reason', cancel_reason);
		const res = await API.post('order_chat_proc.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendTodayReOrder = async od_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('od_idx', od_idx);
		const res = await API.post('reorder_today.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APISendStockReOrder = async od_idx => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('od_idx', od_idx);
		const res = await API.post('reorder_stock.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APICheckZzim = async (mt_idx, slt_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('slt_idx', slt_idx);
		const res = await API.post('zzim_check.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};

export const APIChatOut = async (mt_idx, chat_idx) => {
	try {
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('mt_idx', mt_idx);
		form.append('chat_idx', chat_idx);
		const res = await API.post('chat_out.php', form);
		console.log(res);
		return res.data;
	} catch (err) {
		throw Error(err.message);
	}
};
