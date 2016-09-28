import APIS from "@s2study/draw-api";

import NumberGenerator = APIS.history.NumberGenerator;
export class HistoryNumberGenerator implements NumberGenerator {

	private num: number;

	constructor() {
		this.num = 0 | 0;
	}

	/**
	 * 採番処理を行います。
	 * @returns {number}
	 */
	generateNumber(): number {
		this.num = (this.num + 1) | 0;
		return this.num;
	}
}