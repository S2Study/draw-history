import DrawMoment = drawchat.core.DrawMoment;
import DrawLayerMoment = drawchat.core.DrawLayerMoment;

export class Moment implements DrawMoment{

	private historyNumber:number;
	private sequences:string[];
	private layerMoments:{[key:string]:DrawLayerMoment};

	constructor(
		historyNumber:number,
		layerMoments?:{[key:string]:DrawLayerMoment},
		sequences?:string[]
	){
		this.historyNumber = historyNumber;
		this.layerMoments = layerMoments;
		this.sequences = sequences;
	}

	getHistoryNumber():number {
		return this.historyNumber;
	}

	getKeys():string[] {
		return this.layerMoments ? Object.keys(this.layerMoments) : [];
	}

	getLayerMoment(key:string):drawchat.core.DrawLayerMoment {
		return this.layerMoments ? this.layerMoments[key] : null;
	}

	getSequence():string[] {
		return this.sequences;
	}
}