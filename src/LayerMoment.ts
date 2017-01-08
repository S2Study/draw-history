import * as APIS from "@s2study/draw-api";

import DrawLayerMoment = APIS.history.DrawLayerMoment;
import Layer = APIS.structures.Layer;
import Transform = APIS.structures.Transform;
import Clip = APIS.structures.Clip;
import Draw = APIS.structures.Draw;
export class LayerMoment implements DrawLayerMoment {

	private _canvasId: string;
	private _layer: Layer;

	constructor(
		canvasId: string, layer: Layer
	) {
		this._canvasId = canvasId;
		this._layer = layer;
	}

	getCanvasId(): string {
		return this._canvasId;
	}

	getTransform(): Transform | null {
		return APIS.DrawUtils.complement(this._layer.transform, null );
	}

	getClip(): Clip | null {
		return APIS.DrawUtils.complement(this._layer.clip, null );
	}

	getDraws(): ( Draw | undefined) [] {
		return APIS.DrawUtils.complement< ( Draw | undefined) []>(this._layer.draws, [] );
	}
}