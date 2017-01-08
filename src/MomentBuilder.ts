import * as APIS from "@s2study/draw-api";

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
	private committed: boolean;

	constructor(session: HistorySession) {
		this.session = session;
		this.layerMap = {};
		this.sequences = [];
		this.committed = false;
	}

	putLayerMoment(key: string): DrawLayerMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		return new LayerMomentBuilder(key, this);
	}

	setSequence(sequence: string[]): DrawMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.sequences = sequence;
		return this;
	}

	commit(): DrawMoment {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.committed = true;
		return this.session.pushHistory(this.layerMap, this.sequences);
	}
}