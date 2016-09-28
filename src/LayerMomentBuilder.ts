import APIS from "@s2study/draw-api";

import DrawLyaerMomentBuilder = APIS.history.DrawLayerMomentBuilder;
import DrawLayerMoment = APIS.history.DrawLayerMoment;
import Transform = APIS.structures.Transform;
import Clip = APIS.structures.Clip;
import Draw = APIS.structures.Draw;
import DrawLayerMomentBuilder = APIS.history.DrawLayerMomentBuilder;
import DrawMomentBuilder = APIS.history.DrawMomentBuilder;

import {MomentBuilder} from "./MomentBuilder";
import {LayerMoment} from "./LayerMoment";
export class LayerMomentBuilder implements DrawLyaerMomentBuilder {

	private layerId: string;

	private transform: Transform;
	private clip: Clip;
	private draws: Draw[];

	private momentBuilder: MomentBuilder;

	constructor(
		layerId: string,
		momentBuilder: MomentBuilder) {
		this.layerId = layerId;
		this.momentBuilder = momentBuilder;
	}

	setTransForm(transform: Transform): DrawLayerMomentBuilder {
		this.transform = transform;
		return this;
	}

	setClip(clip: Clip): DrawLayerMomentBuilder {
		this.clip = clip;
		return this;
	}

	addDraw(draw: Draw): DrawLayerMomentBuilder {
		if (!this.draws) {
			this.draws = [];
		}
		this.draws.push(draw);
		return this;
	}

	addDraws(draws: Draw[]): DrawLayerMomentBuilder {
		if (!this.draws) {
			this.draws = [];
		}
		for (let draw of draws) {
			this.draws.push(draw);
		}
		return this;
	}

	commit(): DrawMomentBuilder {
		if (!this.clip && !this.transform && !this.draws) {
			return this.momentBuilder;
		}
		if (!this.momentBuilder.layerMap) {
			this.momentBuilder.layerMap = {};
		}
		this.momentBuilder.layerMap[this.layerId] = new LayerMoment(
			this.layerId,
			{
				transform: this.transform,
				clip: this.clip,
				draws: this.draws
			}
		);
		return this.momentBuilder;
	}
}