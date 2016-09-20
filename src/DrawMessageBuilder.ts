import DrawMoment = drawchat.core.DrawMoment;
import Message = drawchat.Message;
import Layer = drawchat.Layer;
import DrawLayerMoment = drawchat.core.DrawLayerMoment;

export class DrawMessageBuilder {

	static createDrawMessage(
		historyNumbers:number[],
		map:Map<number,DrawMoment>,
		localLayers:{[key:string]:string}
	):Message{

		let resultTo:{[key:string]:Layer} = {};
		let sequences:string[];

		for(let historyNumber of historyNumbers){
			let moment = map.get(historyNumber);
			if(moment.getSequence()){
				sequences = moment.getSequence();
			}
			DrawMessageBuilder.parseMoment(
				resultTo,
				moment,
				localLayers
			);
		}
		sequences = DrawMessageBuilder.removeLocalLayer(
			sequences,localLayers
		);

		let layers:Layer[] = [];
		for(let sequence of sequences){
			layers.push(resultTo[sequence]);
		}

		return {
			time:new Date().getTime(),
			canvas:layers
		}
	}

	static removeLocalLayer(
		layers:string[],
		localLayers:{[key:string]:string}
	):string[]{
		if(localLayers == null){
			return layers;
		}
		let result:string[] = [];
		let i = 0 | 0;
		while( i < layers.length){
			if(localLayers[layers[i]] != null){
				result.push(layers[i]);
			}
			i = ( i + 1) | 0;
		}
		return result;
	}

	/**
	 * 編集履歴をレイヤー毎のマップに挿入する。
	 * @param resultTo
	 * @param moment
	 * @param localLayers
	 */
	static parseMoment(
		resultTo:{[key:string]:Layer},
		moment:DrawMoment,
		localLayers:{[key:string]:string}
	):void{

		let keys = moment.getKeys();
		let key:string;
		let i = 0 | 0;
		let layerMoment:DrawLayerMoment;
		let layer:Layer;

		while( i < keys.length){
			key = keys[i];
			i = (i + 1)|0;
			if(localLayers != null && localLayers[key] != null){
				continue;
			}
			layerMoment = moment.getLayerMoment(keys[i]);
			layer = resultTo[layerMoment.getCanvasId()];
			if(!layer){
				layer = {draws:[]};
			}
			if(layerMoment.getClip()){
				layer.clip = layerMoment.getClip();
			}
			if(layerMoment.getTransform()){
				layer.transform = layerMoment.getTransform();
			}
			if(!layerMoment.getDraws()){
				continue;
			}
			let draws = layerMoment.getDraws();
			for(let draw of draws){
				layer.draws.push(draw);
			}
		}
	}
}
export default DrawMessageBuilder;