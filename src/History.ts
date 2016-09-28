import APIS from "@s2study/draw-api";

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

export class History implements DrawHistory {

	private prop: HistoryProperty;
	private queue: SessionQueue;

	constructor(
		numberGenerator?: NumberGenerator,
		layerNumberGenerator?: KeyGenerator
	) {
		this.prop = new HistoryProperty();
		this.prop.numberGenerator = numberGenerator ? numberGenerator : new HistoryNumberGenerator();
		this.prop.layerNumberGenerator = layerNumberGenerator ? layerNumberGenerator : new LayerNumberGenerator();
		this.queue = new SessionQueue(this.prop);
	}

	getLayers(historyNumber?: number, ignoreLocal: boolean = false): string[] {
		return this.prop.getLayers(historyNumber, ignoreLocal);
	}

	getHistoryNumbers(): number[] {
		return this.prop.historyNumbers;
	}

	getNowHistoryNumber(): number {
		return this.prop.historyNumberNow;
	}

	getLastHistoryNumber(): number {
		if (!this.prop.historyNumbers || this.prop.historyNumbers.length === 0) {
			return -1;
		}
		return this.prop.historyNumbers[this.prop.historyNumbers.length - 1];
	}

	getFirstHistoryNumber(): number {
		if (!this.prop.historyNumbers || this.prop.historyNumbers.length === 0) {
			return -1;
		}
		return this.prop.historyNumbers[0];
	}

	isAvailable(historyNumber?: number): boolean {
		return this.prop.map.has(historyNumber);
	}

	getMoments(
		from: number,
		to: number): DrawMoment[] {
		let fromIndex = HistoryNumberUtil.getHistoryIndex(this.prop.historyNumbers, from);
		if (fromIndex < 0) {
			fromIndex = this.getFirstHistoryNumber();
		}
		if (this.prop.historyNumbers[fromIndex] < from) {
			fromIndex++;
		}
		let toIndex = HistoryNumberUtil.getHistoryIndex(this.prop.historyNumbers, to);
		if (toIndex < 0) {
			return [];
		}
		let result: DrawMoment[] = [];
		while (fromIndex <= toIndex) {
			result.push(this.prop.map.get(this.prop.historyNumbers[fromIndex]));
			fromIndex = (fromIndex + 1) | 0;
		}
		return result;
	}

	generateMessage(ignoreLocal: boolean = false): Message {
		return DrawMessageBuilder.createDrawMessage(
			this.prop.historyNumbers,
			this.prop.map,
			ignoreLocal ? null : this.prop.localLayers
		);
	}

	awaitUpdate(callback: (historyNumber: number) => void): void {
		this.prop.listeners.push(callback);
	}

	lock(noWait?: boolean): Promise<DrawHistoryEditSession> {
		return new Promise((resolve, reject) => {
			this.queue.enqueue(resolve, reject);
		});
	}
}