import DrawMomentBuilder = drawchat.core.DrawMomentBuilder;
import {LayerMomentBuilder} from "./LayerMomentBuilder";
import {LayerMoment} from "./LayerMoment";
import {HistorySession} from "./HistorySession";
export class MomentBuilder implements DrawMomentBuilder{

	layerMap:{[key:string]:LayerMoment};
	sequences:string[];
	private session:HistorySession;

	constructor(session:HistorySession){
		this.session = session;
	}

	putLayerMoment(key:string):drawchat.core.DrawLayerMomentBuilder {
		return new LayerMomentBuilder(key,this);
	}

	setSequence(sequence:string[]):drawchat.core.DrawMomentBuilder {
		this.sequences = sequence;
		return this;
	}

	commit():drawchat.core.DrawMoment {
		return this.session.pushHistory(this.layerMap,this.sequences);
	}
}