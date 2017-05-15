import * as APIS from "@s2study/draw-api";

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

	private transform: Transform | null;
	private clip: Clip | null;
	private draws: Draw[];
	private committed: boolean;

	private momentBuilder: MomentBuilder;

	constructor(
		layerId: string,
		momentBuilder: MomentBuilder
	) {
		this.layerId = layerId;
		this.momentBuilder = momentBuilder;
		this.transform = null;
		this.clip = null;
		this.draws = [];
		this.committed = false;
	}

	setTransForm(transform: Transform): DrawLayerMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.transform = transform;
		return this;
	}

	setClip(clip: Clip): DrawLayerMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.clip = clip;
		return this;
	}

	addDraw(draw: Draw): DrawLayerMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.draws.push(draw);
		return this;
	}

	addDraws(draws: Draw[]): DrawLayerMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		for (let draw of draws) {
			this.draws.push(draw);
		}
		return this;
	}

	commit(): DrawMomentBuilder {
		if (this.committed === true) {
			throw new Error("this builder was committed");
		}
		this.committed = true;
		if (
			this.clip === null
		&&	this.transform === null
		&&	this.draws.length === 0
		) {
			return this.momentBuilder;
		}

		this.momentBuilder.layerMap[this.layerId] = new LayerMoment(
			this.layerId,
			this.draws,
			this.transform,
			this.clip
		);
		return this.momentBuilder;
	}
}