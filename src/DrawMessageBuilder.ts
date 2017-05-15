import * as APIS from "@s2study/draw-api";
import DrawMoment = APIS.history.DrawMoment;
import Message = APIS.structures.Message;
import Layer = APIS.structures.Layer;
import DrawLayerMoment = APIS.history.DrawLayerMoment;
import {DrawAPIUtils} from "@s2study/draw-api/lib/DrawAPIUtils";
import {LayerFactory} from "@s2study/draw-api/lib/structures/Layer";
import {structures} from "@s2study/draw-api/index";
import Draw = structures.Draw;
import {MessageFactory} from "@s2study/draw-api/lib/structures/Message";

export class DrawMessageBuilder {

	static createDrawMessage(
		historyNumbers: ( number | undefined )[],
		map: Map<number, DrawMoment>,
		localLayers?: {[key: string]: string | undefined } | null
	): Message {

		let resultTo: {[key: string]: Layer } = {};
		let sequences: ( string | undefined )[] | null = null;

		for (let historyNumber of historyNumbers) {

			let moment = map.get(DrawAPIUtils.complement<number>(historyNumber, -1));
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
			return MessageFactory.createInstance(
				layers,
				null,
				null,
				Date.now()
			);
		}

		sequences = DrawMessageBuilder.removeLocalLayer(
			sequences, localLayers
		);

		for (let sequence of sequences) {
			layers.push(
				DrawAPIUtils.containsKey(sequence, resultTo) === true ? resultTo[sequence!]! : LayerFactory.createInstance()
			);
			// layers.push(resultTo[sequence]!);
		}
		return MessageFactory.createInstance(
			layers,
			null,
			null,
			Date.now()
		);
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
	private static parseMoment(
		resultTo: {[key: string]: Layer },
		moment: DrawMoment,
		localLayers?: {[key: string]: string | undefined } | null
	): void {

		let keys = moment.getKeys();
		let key: string;
		let i = 0 | 0;
		let layerMoment: DrawLayerMoment | null;
		let layer: Layer | undefined;
		// const draws: Draw[] = [];

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
			layer = resultTo[key];

			if (DrawAPIUtils.isNull(layer)) {
				resultTo[key] = LayerFactory.createInstance(
					layerMoment!.getDraws().concat(),
					layerMoment!.getTransform(),
					layerMoment!.getClip()
				);
				continue;
			}

			resultTo[key] = LayerFactory.createInstance(
				Array.prototype.push.apply(layer.draws, layerMoment!.getDraws()),
				DrawAPIUtils.complement(layerMoment!.getTransform(), layer.transform),
				DrawAPIUtils.complement(layerMoment!.getClip(), layer.clip)
			);
		}
	}
}
export default DrawMessageBuilder;