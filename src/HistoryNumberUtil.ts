export class HistoryNumberUtil {

	/**
	 * HistoryNumberのリストから指定値のhistoryNumberを検索する。
	 * 一致するものがなければ直近のものを返す。
	 * @param historyNumbers
	 * @param historyNumber
	 * @returns {number}
	 */
	static getHistoryIndex(
		historyNumbers: number[],
		historyNumber: number): number {

		if (historyNumber < 0) {
			return -1;
		}

		// ２分木探索で特定
		let min = 0 | 0;
		let max = (historyNumbers.length - 1) | 0;
		if ((<number>historyNumbers[max]!) <= historyNumber) {
			return max;
		}
		if (historyNumbers[0] === historyNumber) {
			return 0;
		}

		let index = -1;
		let diff = 0 | 0;

		while (max >= min) {
			diff = (max - min) | 0;
			index = min + (((diff) / 2) | 0);
			if (diff === 0) {
				break;
			}
			let number1 = historyNumbers[index]!;
			if (number1 === historyNumber) {
				return index;
			}
			if (diff === 1) {
				index = historyNumbers[max]! > historyNumber ? min : max;
				break;
			}
			if (number1 > historyNumber) {
				max = index;
				continue;
			}
			min = index;
		}

		if (index < 0) {
			return index;
		}
		if (historyNumbers[index]! > historyNumber) {
			return index - 1;
		}
		return index;
	}
}
export default HistoryNumberUtil;