import * as APIS from "@s2study/draw-api";
import DrawMoment = APIS.history.DrawMoment;
import Message = APIS.structures.Message;
import Layer = APIS.structures.Layer;
import DrawLayerMoment = APIS.history.DrawLayerMoment;
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";

export class DrawMessageBuilder {

	static createDrawMessage(
		historyNumbers: number[],
		map: Map<number, DrawMoment>,
		localLayers?: {[key: string]: string | undefined } | null
	): Message {

		let resultTo: {[key: string]: Layer | undefined } = {};
		let sequences: ( string | undefined )[] | null = null;

		for (let historyNumber of historyNumbers) {

			let moment = map.get(historyNumber);
			if (DrawAPIUtils.isNull(moment) ) {
				continue;
			}

			if (DrawAPIUtils.isNull(moment!.getSequence()) === false) {
				sequences = moment!.getSequence();
			}

			DrawMessageBuilder.parseMoment(
				resultTo,
				moment!,
				localLayers
			);
		}

		let layers: Layer[] = [];
		if (sequences === null) {
			return {
				time: new Date().getTime(),
				canvas: layers
			};
		}

		sequences = DrawMessageBuilder.removeLocalLayer(
			sequences, localLayers
		);

		for (let sequence of sequences) {
			layers.push(
				DrawAPIUtils.containsKey(sequence, resultTo) === true ? resultTo[sequence!]! : { draws: []}
			);
			// layers.push(resultTo[sequence]!);
		}

		return {
			time: new Date().getTime(),
			canvas: layers
		};
	}

	static removeLocalLayer(
		layers: ( string | undefined )[],
		localLayers?: {[key: string]: string | undefined } | null
	): ( string | undefined )[] {

		if (DrawAPIUtils.isNull(localLayers)) {
			return layers;
		}

		let result: ( string | undefined )[] = [];
		let i = 0 | 0;
		while (i < layers.length) {
			let key = layers[i];
			if (DrawAPIUtils.containsKey(key, localLayers) === false) {
				result.push(key);
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
		resultTo: {[key: string]: Layer | undefined },
		moment: DrawMoment,
		localLayers?: {[key: string]: string | undefined } | null
	): void {

		let keys = moment.getKeys();
		let key: string;
		let i = 0 | 0;
		let layerMoment: DrawLayerMoment | null;
		let layer: Layer | undefined;

		while (i < keys.length) {

			key = DrawAPIUtils.complementString(keys[i]);
			i = (i + 1) | 0;

			if (DrawAPIUtils.containsKey(key, localLayers)) {
				continue;
			}
			layerMoment = moment.getLayerMoment(key);
			if (DrawAPIUtils.isNull(layerMoment) === true) {
				continue;
			}
			layer = resultTo[layerMoment!.getCanvasId()];

			if ( layer === undefined ) {
				layer = {draws: []};
				resultTo[layerMoment!.getCanvasId()] = layer;
			}
			if ( DrawAPIUtils.isNull(layerMoment!.getClip()) === false ) {
				layer.clip = layerMoment!.getClip();
			}
			if ( DrawAPIUtils.isNull(layerMoment!.getTransform()) === false ) {
				layer.transform = layerMoment!.getTransform();
			}
			if ( DrawAPIUtils.isNull(layerMoment!.getDraws()) === true ) {
				continue;
			}
			let draws = layerMoment!.getDraws();
			for (let draw of draws) {
				layer.draws.push(draw);
			}
		}
	}
}
export default DrawMessageBuilder;