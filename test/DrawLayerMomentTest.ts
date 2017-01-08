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

describe("DrawLayerMomentBuilderのテスト", () => {

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

	describe("commit", () => {

		describe("clip,layers,drawsが未設定", () => {

			it("LayerMomentが生成されないこと。", () => {
				let moment = momentBuilder!.putLayerMoment("test").commit().commit();
				assert(APIS.DrawUtils.isNull(moment.getLayerMoment("test")) === true);
			});

			it("同インスタンスのmomentBuilderが生成されること。", () => {
				assert(momentBuilder!.putLayerMoment("test").commit() === momentBuilder);
			});

		});

		describe("clip,layers,drawsが設定済み", () => {

			it("同インスタンスのmomentBuilderが生成されること。", () => {
				let builder = momentBuilder!.putLayerMoment("test")
					.setTransForm({a: 1})
					.setClip({
						path: [<APIS.structures.MoveTo>{type: 0, x: 1, y: 2}]}
					)
					.addDraw({
						compositeOperation: 6
					}).commit();

				assert(builder === momentBuilder);
			});
		});

		describe("commit後に対する操作", () => {

			let committed: APIS.history.DrawLayerMomentBuilder | null = null;

			beforeEach(() => {
				committed = momentBuilder!.putLayerMoment("test2");
				committed.commit();
			});

			describe("setTransform", () => {
				it("エラーとなること。", (done) => {
					try {
						committed!.setTransForm({a: 1});
					} catch (e) {
						done();
					}
				});
			});

			describe("setClip", () => {
				it("エラーとなること。", (done) => {
					try {
						committed!.setClip({
							path: [<APIS.structures.MoveTo>{type: 0, x: 1, y: 2}]}
						);
					} catch (e) {
						done();
					}
				});
			});

			describe("addDraw", () => {
				it("エラーとなること。", (done) => {
					try {
						committed!.addDraw({
							compositeOperation: 6
						});
					} catch (e) {
						done();
					}
				});
			});

			describe("addDraws", () => {
				it("エラーとなること。", (done) => {
					try {
						committed!.addDraws([{
							compositeOperation: 6
						}, {
							compositeOperation: 2
						}]);
					} catch (e) {
						done();
					}
				});
			});

			describe("commit", () => {
				it("エラーとなること。", (done) => {
					try {
						committed!.commit();
					} catch (e) {
						done();
					}
				});
			});

			describe("commit後に対する操作", () => {

				it("同インスタンスのmomentBuilderが生成されること。", () => {
					let builder = momentBuilder!.putLayerMoment("test")
						.setTransForm({a: 1})
						.setClip({
							path: [<APIS.structures.MoveTo>{type: 0, x: 1, y: 2}]}
						)
						.addDraw({
							compositeOperation: 6
						}).commit();

					assert(builder === momentBuilder);
				});
			});
		});
	});

});