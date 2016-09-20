import DrawLyaerMomentBuilder = drawchat.core.DrawLayerMomentBuilder;
import DrawLayerMoment = drawchat.core.DrawLayerMoment;
import Transform = drawchat.Transform;
import Clip = drawchat.Clip;
import Draw = drawchat.Draw;
import {MomentBuilder} from "./MomentBuilder";
import {LayerMoment} from "./LayerMoment";
export class LayerMomentBuilder implements DrawLyaerMomentBuilder{

	private layerId:string;

	private transform:Transform;
	private clip:Clip;
	private draws:Draw[];

	private momentBuilder:MomentBuilder;

	constructor(
		layerId:string,
		momentBuilder:MomentBuilder
	){
		this.layerId = layerId;
		this.momentBuilder = momentBuilder;
	}

	setTransForm(
		transform:drawchat.Transform
	):drawchat.core.DrawLayerMomentBuilder {
		this.transform = transform;
		return this;
	}

	setClip(
		clip:drawchat.Clip
	):drawchat.core.DrawLayerMomentBuilder {
		this.clip = clip;
		return this;
	}

	addDraw(
		draw:drawchat.Draw
	):drawchat.core.DrawLayerMomentBuilder {
		if(!this.draws){
			this.draws = [];
		}
		this.draws.push(draw);
		return this;
	}

	addDraws(draws:drawchat.Draw[]):drawchat.core.DrawLayerMomentBuilder {
		if(!this.draws){
			this.draws = [];
		}
		for(let draw of draws){
			this.draws.push(draw);
		}
		return this;
	}

	commit():drawchat.core.DrawMomentBuilder {
		if(!this.clip && !this.transform && !this.draws){
			return this.momentBuilder;
		}
		if(!this.momentBuilder.layerMap){
			this.momentBuilder.layerMap = {};
		}
		this.momentBuilder.layerMap[this.layerId] = new LayerMoment(
			this.layerId,
			{
				transform:this.transform,
				clip:this.clip,
				draws:this.draws
			}
		);
		return this.momentBuilder;
	}
}