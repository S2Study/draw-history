import * as APIS from "@s2study/draw-api";
import * as assert from "power-assert";
import DrawMomentBuilder = APIS.history.DrawMomentBuilder;
import {History} from "../src/History";
import {TransformFactory} from "@s2study/draw-api/lib/structures/Transform";
import {ClipFactory} from "@s2study/draw-api/lib/structures/Clip";
import {MoveToFactory} from "@s2study/draw-api/lib/structures/MoveTo";
import {GraphicsDrawFactory} from "@s2study/draw-api/lib/structures/GraphicsDraw";

function createMomentBuilder(): Promise<DrawMomentBuilder> {
	const history = new History();
	return history.lock().then((session) => {
		return session.addMoment();
	});
}

describe("Historyのテスト", () => {

	let momentBuilder: DrawMomentBuilder | null = null;
	beforeEach((done) => {
		createMomentBuilder().then((builder) => {
			momentBuilder = builder;
			done();
		});
	});

	describe("setTransForm", () => {
		it("transFormが反映されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").setTransForm(
				TransformFactory.createInstance(0, 0, 4)
			).commit().commit();
			assert(moment.getLayerMoment("test")!.getTransform()!.a === 4);
		});
	});

	describe("setClip", () => {
		it("clipが反映されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").setClip(
				ClipFactory.createInstance([
					MoveToFactory.createInstance(1, 2)
				])
			).commit().commit();
			assert((<any>moment.getLayerMoment("test")!.getClip()!.path[0]).y === 2);
		});
	});

	describe("addDraw", () => {
		it("drawが追加されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").addDraw(
				GraphicsDrawFactory.createInstance([], null, 6)
			).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
		});
	});

	describe("addDraws", () => {
		it("drawsが全て追加されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").addDraws([
				GraphicsDrawFactory.createInstance([], null, 6),
				GraphicsDrawFactory.createInstance([], null, 2)
			]).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()!.length === 2);
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
			assert(moment.getLayerMoment("test")!.getDraws()[1]!.compositeOperation === 2);
		});
	});
});