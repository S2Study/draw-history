import APIS from "@s2study/draw-api";

import DrawMomentBuilder = APIS.history.DrawMomentBuilder;
import DrawLayerMomentBuilder = APIS.history.DrawLayerMomentBuilder;
import DrawMoment = APIS.history.DrawMoment;

import {LayerMomentBuilder} from "./LayerMomentBuilder";
import {LayerMoment} from "./LayerMoment";
import {HistorySession} from "./HistorySession";
export class MomentBuilder implements DrawMomentBuilder {

	layerMap: {[key: string]: LayerMoment};
	sequences: string[];
	private session: HistorySession;

	constructor(session: HistorySession) {
		this.session = session;
	}

	putLayerMoment(key: string): DrawLayerMomentBuilder {
		return new LayerMomentBuilder(key, this);
	}

	setSequence(sequence: string[]): DrawMomentBuilder {
		this.sequences = sequence;
		return this;
	}

	commit(): DrawMoment {
		return this.session.pushHistory(this.layerMap, this.sequences);
	}
}