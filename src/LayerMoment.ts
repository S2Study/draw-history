import * as APIS from "@s2study/draw-api";

import DrawLayerMoment = APIS.history.DrawLayerMoment;
import Layer = APIS.structures.Layer;
import Transform = APIS.structures.Transform;
import Clip = APIS.structures.Clip;
import Draw = APIS.structures.Draw;
export class LayerMoment implements DrawLayerMoment {

	private _canvasId: string;
	// private _layer: Layer;
	private transform: Transform | null;
	private clip: Clip | null;
	private draws: Draw[];


	constructor(
		canvasId: string,
		draws: Draw[],
		transform: Transform | null,
		clip: Clip | null
	) {
		this._canvasId = canvasId;
		this.draws = draws;
		this.transform = transform;
		this.clip = clip;
	}

	getCanvasId(): string {
		return this._canvasId;
	}

	getTransform(): Transform | null {
		return this.transform;
	}

	getClip(): Clip | null {
		return this.clip;
	}

	getDraws(): Draw[] {
		return this.draws;
	}
}