import * as APIS from "@s2study/draw-api";
import * as assert from "power-assert";
import DrawMomentBuilder = APIS.history.DrawMomentBuilder;
import {History} from "../src/History";

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
			let moment = momentBuilder!.putLayerMoment("test").setTransForm({a: 1}).commit().commit();
			assert(moment.getLayerMoment("test")!.getTransform()!.a === 1);
		});
	});

	describe("setClip", () => {
		it("clipが反映されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").setClip({
				path: [<APIS.structures.MoveTo>{type: 0, x: 1, y: 2}]}
			).commit().commit();
			assert((<any>moment.getLayerMoment("test")!.getClip()!.path[0]).y === 2);
		});
	});

	describe("addDraw", () => {
		it("drawが追加されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").addDraw({
				compositeOperation: 6
			}).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
		});
	});

	describe("addDraws", () => {
		it("drawsが全て追加されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").addDraws([{
				compositeOperation: 6
			}, {
				compositeOperation: 2
			}]).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()!.length === 2);
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
			assert(moment.getLayerMoment("test")!.getDraws()[1]!.compositeOperation === 2);
		});
	});
});