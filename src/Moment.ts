import * as APIS from "@s2study/draw-api";

import DrawMoment = APIS.history.DrawMoment;
import DrawLayerMoment = APIS.history.DrawLayerMoment;

export class Moment implements DrawMoment {

	private historyNumber: number;
	private sequences: string[] | null;
	private layerMoments: {[key: string]: DrawLayerMoment };

	constructor(
		historyNumber: number,
		layerMoments: {[key: string]: DrawLayerMoment },
		sequences: string[] | null
	) {
		this.historyNumber = historyNumber;
		this.layerMoments = layerMoments;
		this.sequences = sequences;
	}

	getHistoryNumber(): number {
		return this.historyNumber;
	}

	getKeys(): string[] {
		return Object.keys(this.layerMoments);
	}

	getLayerMoment(key: string): DrawLayerMoment | null {
		return APIS.DrawUtils.complement<DrawLayerMoment | null>(this.layerMoments[key], null);
	}

	getSequence(): string[] | null {
		return this.sequences;
	}
}