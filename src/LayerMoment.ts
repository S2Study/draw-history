import * as APIS from "@s2study/draw-api";

import DrawLayerMoment = APIS.history.DrawLayerMoment;
import Layer = APIS.structures.Layer;
import Transform = APIS.structures.Transform;
import Clip = APIS.structures.Clip;
import Draw = APIS.structures.Draw;
export class LayerMoment implements DrawLayerMoment {

	private _canvasId: string;

	private _layer: Layer;

	constructor(canvasId: string, layer: Layer) {
		this._canvasId = canvasId;
		this._layer = layer;
	}

	getCanvasId(): string {
		return this._canvasId;
	}

	getTransform(): Transform {
		return this._layer ? this._layer.transform : null;
	}

	getClip(): Clip {
		return this._layer ? this._layer.clip : null;
	}

	getDraws(): Draw[] {
		return this._layer ? this._layer.draws : null;
	}
}