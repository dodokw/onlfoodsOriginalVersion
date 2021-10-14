function NumberComma(x) {
	return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default NumberComma;
