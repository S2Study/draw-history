import * as APIS from "@s2study/draw-api";

import DrawMoment = APIS.history.DrawMoment;
import DrawLayerMoment = APIS.history.DrawLayerMoment;

export class Moment implements DrawMoment {

	private historyNumber: number;
	private sequences: string[];
	private layerMoments: {[key: string]: ( DrawLayerMoment | undefined )};

	constructor(
		historyNumber: number,
		layerMoments?: {[key: string]: ( DrawLayerMoment | undefined ) },
		sequences?: string[]) {
		this.historyNumber = historyNumber;
		this.layerMoments = APIS.DrawUtils.complement(layerMoments, {});
		this.sequences = APIS.DrawUtils.isNull(sequences) === false ? sequences! : [];
	}

	getHistoryNumber(): number {
		return this.historyNumber;
	}

	getKeys(): string[] {
		return this.layerMoments ? Object.keys(this.layerMoments) : [];
	}

	getLayerMoment(key: string): DrawLayerMoment | null {
		return APIS.DrawUtils.complement<DrawLayerMoment | null>(this.layerMoments[key], null);
	}

	getSequence(): string[] {
		return this.sequences;
	}
}