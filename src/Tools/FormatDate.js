export const getFormatDate = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	if (month < 10 && day < 10) return `${year}.0${month}.0${day}`;
	else if (month > 10 && day < 10) return `${year}.${month}.0${day}`;
	else if (month < 10 && day > 10) return `${year}.0${month}.${day}`;
	else return `${year}.${month}.${day}`;
};
