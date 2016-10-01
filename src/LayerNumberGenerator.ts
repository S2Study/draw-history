import * as APIS from "@s2study/draw-api";

import KeyGenerator = APIS.history.KeyGenerator;
export class LayerNumberGenerator implements KeyGenerator {

	private num: number;

	constructor() {
		this.num = 0 | 0;
	}

	/**
	 * 採番処理を行います。
	 * @returns {number}
	 */
	generateKey(): string {
		this.num = (this.num + 1) | 0;
		return String(this.num);
	}
}