import * as APIS from "@s2study/draw-api/lib";

import DrawHistory = APIS.history.DrawHistory;
import DrawMoment = APIS.history.DrawMoment;
import DrawLayerMoment = APIS.history.DrawLayerMoment;
import NumberGenerator = APIS.history.NumberGenerator;
import KeyGenerator = APIS.history.KeyGenerator;
import DrawHistoryEditSession = APIS.history.DrawHistoryEditSession;
import Message = APIS.structures.Message;

import {HistoryNumberGenerator} from "./HistoryNumberGenerator";
import {LayerNumberGenerator} from "./LayerNumberGenerator";
import {DrawMessageBuilder} from "./DrawMessageBuilder";
import {HistoryNumberUtil} from "./HistoryNumberUtil";
import {HistoryProperty} from "./HistoryProperty";
import {SessionQueue} from "./SessionQueue";

export class History implements APIS.history.DrawHistory {

	private prop: HistoryProperty;
	private queue: SessionQueue;

	constructor(
		numberGenerator?: NumberGenerator,
		layerNumberGenerator?: KeyGenerator
	) {
		this.prop = new HistoryProperty(
			numberGenerator ? numberGenerator : new HistoryNumberGenerator(),
			layerNumberGenerator ? layerNumberGenerator : new LayerNumberGenerator()
		);
		this.queue = new SessionQueue(this.prop);
	}

	getLayers(historyNumber?: number|null, ignoreLocal?: boolean|null): (string|undefined)[] {
		return this.prop.getLayers(historyNumber, ignoreLocal === true);
	}

	getHistoryNumbers(): (number|undefined)[] {
		return this.prop.historyNumbers;
	}

	getNowHistoryNumber(): number {
		return this.prop.historyNumberNow;
	}

	getLastHistoryNumber(): number {
		const numbers = this.prop.historyNumbers;
		const len = numbers.length;
		if (len === 0) {
			return -1;
		}
		const result = numbers[len - 1];
		return APIS.DrawUtils.complementNumber(result, -1);
	}

	getFirstHistoryNumber(): number {
		return APIS.DrawUtils.complementNumber(this.prop.historyNumbers[0], -1);
	}

	isAvailable(historyNumber?: number | null): boolean {
		return APIS.DrawUtils.isNull(historyNumber) === true ? false : this.prop.map.has(historyNumber!);
	}

	getMoments(from: number, to: number, ignoreLocal?: boolean): ( DrawMoment| undefined )[] {
		const numbers = this.prop.historyNumbers;
		let fromIndex: number = HistoryNumberUtil.getHistoryIndex(numbers, from);
		if (fromIndex < 0) {
			fromIndex = 0;
		}
		if (numbers[fromIndex] < from) {
			fromIndex++;
		}
		let toIndex = HistoryNumberUtil.getHistoryIndex(numbers, to);
		if (toIndex < 0) {
			return [];
		}
		let result: ( DrawMoment | undefined )[] = [];
		while (fromIndex <= toIndex) {
			let historyNumber = this.prop.historyNumbers[fromIndex];
			result.push(historyNumber === undefined ? undefined : this.prop.map.get(historyNumber));
			fromIndex = (fromIndex + 1) | 0;
		}
		return result;
	}

	generateMessage(ignoreLocal?: boolean | null): Message {
		return DrawMessageBuilder.createDrawMessage(
			this.prop.historyNumbers,
			this.prop.map,
			ignoreLocal ? null : this.prop.localLayers
		);
	}

	awaitUpdate(callback: (historyNumber: number) => void): void {
		this.prop.listeners.push(callback);
	}

	lock(noWait?: boolean | null): Promise<DrawHistoryEditSession> {
		return new Promise((resolve, reject) => {
			this.queue.enqueue(resolve, reject);
		});
	}
}