export function getNum(number)  {
	if (number >= 1000000 && number < 1000000000) {
		return (number / 1000000).toFixed(2) + "M"
	}
	else if (number >= 1000000000) {
		return (number / 1000000000).toFixed(2) + "B"
	}
	else if (number < 1000000) {
		return (number / 1000).toFixed(2) + "K";
	}
	else {
		return "N/A"
	}
}

export default getNum;