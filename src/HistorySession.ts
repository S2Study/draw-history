import * as APIS from "@s2study/draw-api";

import DrawHistory = APIS.history.DrawHistory;
import DrawMoment = APIS.history.DrawMoment;
import DrawLayerMoment = APIS.history.DrawLayerMoment;
import DrawHistoryEditSession = APIS.history.DrawHistoryEditSession;
import Layer = APIS.structures.Layer;
import DrawMomentBuilder = APIS.history.DrawMomentBuilder;

import {Moment} from "./Moment";
import {MomentBuilder} from "./MomentBuilder";
import {HistoryNumberUtil} from "./HistoryNumberUtil";
import {HistoryProperty} from "./HistoryProperty";
import {SessionQueue} from "./SessionQueue";

export class HistorySession implements DrawHistoryEditSession {

	alive: boolean = false;

	private prop: HistoryProperty;
	private queue: SessionQueue;

	constructor(
		queue: SessionQueue,
		historyProperty: HistoryProperty) {
		this.prop = historyProperty;
		this.queue = queue;
	}

	setHistoryNumberNow(historyNumber: number, clearFuture?: boolean| null): number {
		if (!this.alive) {
			this.noticeSessionError();
			return -1;
		}
		let index = HistoryNumberUtil.getHistoryIndex(
			this.prop.historyNumbers, historyNumber
		);
		if (index < 0) {
			return index;
		}
		let number1 = this.prop.historyNumbers[index];
		if (number1 === undefined ) {
			return index;
		}
		this.prop.historyNumberNow = number1;
		if (clearFuture === true) {
			this.cleanupHistory();
		}
		this.noticeUpdate();
		return this.prop.historyNumberNow;
	}

	clear(): void {
		if (!this.alive) {
			this.noticeSessionError();
			return;
		}
		this.prop.historyNumbers = [];
		this.prop.map = new Map();
		this.prop.historyNumberNow = -1;
		this.noticeUpdate();
	}

	addLayer(
		layer: Layer,
		isLocal?: boolean | null
	): DrawMoment {

		if (!this.alive) {
			this.noticeSessionError();
			throw new Error("This session is not alive.");
		}

		let builder = this.addMoment();
		let layers = this.prop.getLayers(this.prop.historyNumberNow);
		let layerId = this.prop.layerNumberGenerator.generateKey();
		layers.push(layerId);
		builder.setSequence(layers);
		let layerBuilder = builder.putLayerMoment(
			layerId
		);
		if (APIS.DrawUtils.isNull(layer.clip) === false) {
			layerBuilder.setClip(
				layer.clip!
			);
		}
		if (APIS.DrawUtils.isNull(layer.transform) === false) {
			layerBuilder.setTransForm(
				layer.transform!
			);
		}
		layerBuilder.addDraws(
			layer.draws
		);
		layerBuilder.commit();
		if (isLocal) {
			this.prop.localLayers[layerId] = layerId;
		}
		return builder.commit();
	}

	removeLayer(layerId: string): void {

		if (!this.alive) {
			this.noticeSessionError();
			return;
		}

		let layers = this.prop.getLayers(this.prop.historyNumberNow);
		let result: string[] = [];
		for (let id of layers) {
			if (layerId === id) {
				continue;
			}
			result.push(id);
		}
		this.addMoment().setSequence(result).commit();
	}

	addMoment(): DrawMomentBuilder {
		if (!this.alive) {
			this.noticeSessionError();
			throw new Error("This session is not alive.");
		}
		return new MomentBuilder(this);
	}

	/**
	 * MomentBuilderから変更内容を受け取るメソッド。
	 * @param layerMoments
	 * @param sequences
	 * @returns {Moment}
	 */
	pushHistory(
		layerMoments: {[key: string]: DrawLayerMoment },
		sequences: string[] | null
	): Moment {

		this.cleanupHistory();
		let num = this.prop.numberGenerator.generateNumber();
		let moment = new Moment(num, layerMoments, sequences);
		this.prop.map.set(num, moment);
		this.prop.historyNumbers.push(num);
		if (APIS.DrawUtils.isNull(moment.getSequence()) === false ) {
			this.prop.sequencesHistoryNumbers.push(num);
		}
		this.prop.historyNumberNow = num;
		this.noticeUpdate();
		return moment;
	}

	isAlive(): boolean {
		return this.alive;
	}

	/**
	 * 編集セッション切れ通知
	 */
	private noticeSessionError(): void {
		// とりあえずエラーメッセージのみ
		console.log("This session is not alive.");
	}

	/**
	 * リスナーに更新を通知する。
	 */
	private noticeUpdate(): void {
		let list = this.prop.listeners;
		let len = (this.prop.listeners.length) | 0;
		let i = 0;
		this.prop.listeners = [];
		while (i < len) {
			list[i](this.prop.historyNumberNow);
			i = (i + 1) | 0;
		}
	}

	/**
	 * 現在の履歴番号よりも後の履歴を削除する。
	 */
	private cleanupHistory() {
		let index = HistoryNumberUtil.getHistoryIndex(
			this.prop.historyNumbers, this.prop.historyNumberNow
		);
		if (index >= this.prop.historyNumbers.length) {
			return;
		}

		// 全編集履歴の更新
		let deleted = this.prop.historyNumbers.slice(
			index + 1, this.prop.historyNumbers.length
		);

		let i = 0 | 0;
		while (i < deleted.length) {
			let historyNumber = deleted[i];
			if (historyNumber !== undefined) {
				this.prop.map.delete(historyNumber);
			}
			i = (i + 1) | 0;
		}
		this.prop.historyNumbers = this.prop.historyNumbers.slice(0, index + 1);

		// sequencesの更新
		index = HistoryNumberUtil.getHistoryIndex(
			this.prop.sequencesHistoryNumbers, this.prop.historyNumberNow
		);
		if (index >= this.prop.sequencesHistoryNumbers.length) {
			return;
		}
		this.prop.sequencesHistoryNumbers
			= this.prop.sequencesHistoryNumbers.slice(0, index + 1);
	}

	release(): void {
		if (this.alive) {
			this.queue.dequeue();
		}
	}
}