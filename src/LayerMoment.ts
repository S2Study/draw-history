import DrawLayerMoment = drawchat.core.DrawLayerMoment;
import Layer = drawchat.Layer;
export class LayerMoment implements DrawLayerMoment{

	private _canvasId:string;

	private _layer:Layer;

	constructor(canvasId:string,layer:Layer){
		this._canvasId = canvasId;
		this._layer = layer;
	}

	getCanvasId():string {
		return this._canvasId;
	}

	getTransform():drawchat.Transform {
		return this._layer ? this._layer.transform : null;
	}

	getClip():drawchat.Clip {
		return this._layer ? this._layer.clip : null;
	}

	getDraws():drawchat.Draw[] {
		return this._layer ? this._layer.draws : null;
	}
}