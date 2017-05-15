import * as APIS from "@s2study/draw-api";

import DrawMoment = APIS.history.DrawMoment;
import NumberGenerator = APIS.history.NumberGenerator;
import KeyGenerator = APIS.history.KeyGenerator;

import {HistoryNumberUtil} from "./HistoryNumberUtil";
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";

/**
 * HistoryとHistorySessionで共有するプロパティ
 */
export class HistoryProperty {

	/**
	 * 現在の履歴番号
	 * @type {number}
	 */
	historyNumberNow: number;

	/**
	 * 履歴番号のリスト
	 * @type {Array}
	 */
	historyNumbers: number[];

	/**
	 * レイヤー増減、順序移動を伴う履歴番号のリスト
	 * @type {Array}
	 */
	sequencesHistoryNumbers: number[];

	/**
	 * 履歴番号とDrawMomentとのマッピング
	 * @type {{}}
	 */
	map: Map<number, DrawMoment> ;

	/**
	 * 変更通知を受け取るリスナー
	 * @type {Array}
	 */
	listeners: any[];

	/**
	 * 履歴番号採番
	 */
	numberGenerator: NumberGenerator;

	/**
	 * レイヤー番号採番
	 */
	layerNumberGenerator: KeyGenerator;

	/**
	 * ローカルレイヤーのマップ
	 */
	localLayers: {[key: string]: string};

	constructor(
		numberGenerator: NumberGenerator,
		layerNumberGenerator: KeyGenerator
	) {
		this.historyNumberNow = -1;
		this.historyNumbers = [];
		this.sequencesHistoryNumbers = [];
		this.map = new Map();
		this.listeners = [];
		this.numberGenerator = numberGenerator;
		this.layerNumberGenerator = layerNumberGenerator;
		this.localLayers = {};
	}

	getLayers(
		historyNumber: number,
		ignoreLocal: boolean = false
	): string[] {

		let historyNum = historyNumber;
		if (historyNum < 0 ) {
			historyNum = this.historyNumberNow;
		}
		let i = (this.sequencesHistoryNumbers.length - 1) | 0;
		if (historyNum) {
			i = HistoryNumberUtil.getHistoryIndex(this.sequencesHistoryNumbers, historyNum);
		}
		// if (i < 0) {
		// 	return [];
		// }
		let sequenceNumber = this.sequencesHistoryNumbers[i];
		if (DrawAPIUtils.isNull(sequenceNumber)) {
			return [];
		}
		let moment = this.map.get(sequenceNumber);
		if (DrawAPIUtils.isNull(moment)) {
			return [];
		}
		if (ignoreLocal === false) {
			return moment!.getSequence().concat();
		}

		let moments = moment!.getSequence();
		let result: string[] = [];

		if (APIS.DrawUtils.isNull(moments)) {
			return result;
		}
		i = 0 | 0;
		const len = moments.length | 0;
		while (i < len) {
			let key = moments[i];
			if (APIS.DrawUtils.containsKey(key, this.localLayers) === false) {
				result.push(key!);
			}
			i = (i + 1) | 0;
		}
		return result;
	}
}