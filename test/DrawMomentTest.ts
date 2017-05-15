import * as APIS from "@s2study/draw-api";
import * as assert from "power-assert";
import DrawHistoryEditSession = APIS.history.DrawHistoryEditSession;
import {History} from "../src/History";
import {GraphicsDrawFactory} from "@s2study/draw-api/lib/structures/GraphicsDraw";
import {TransformFactory} from "@s2study/draw-api/lib/structures/Transform";

function createSession(): Promise<DrawHistoryEditSession> {
	const history = new History();
	return history.lock();
}

describe("DrawMomentBuilderのテスト", () => {

	let session: DrawHistoryEditSession | null = null;
	beforeEach((done) => {
		createSession().then((session1) => {
			session = session1;
			done();
		});
	});

	describe("putLayerMoment", () => {

		describe("1件", () => {

			it("layerMomentが反映されること。", () => {
				let builder: APIS.history.DrawMomentBuilder = session!.addMoment();
				let moment = builder.putLayerMoment("test2").setTransForm(
					TransformFactory.createInstance(0, 0, 1, 2)
				).commit().commit();
				assert(moment.getLayerMoment("test2")!.getTransform()!.b === 2);
			});

		});

		describe("複数件", () => {

			it("layerMomentが反映されること。", () => {

				let builder: APIS.history.DrawMomentBuilder = session!.addMoment();
				let moment = builder
						.putLayerMoment("test3").setTransForm(
							TransformFactory.createInstance(0, 0, 1, 2)
						).commit()
						.putLayerMoment("test4").setTransForm(
							TransformFactory.createInstance(0, 0, 1, 0, 3)
						).commit()
					.commit();

				assert(moment.getLayerMoment("test3")!.getTransform()!.b === 2);
				assert(moment.getLayerMoment("test4")!.getTransform()!.c === 3);

			});

		});

		describe("複数件＋putLayerMomentとcommitの順が逆", () => {


			it("layerMomentが反映されること。", () => {

				let builder: APIS.history.DrawMomentBuilder = session!.addMoment();
				let layer1 = builder.putLayerMoment("test1").setTransForm(
					TransformFactory.createInstance(0, 0, 1, 2)
				);
				let layer2 = builder.putLayerMoment("test2").setTransForm(
					TransformFactory.createInstance(0, 0, 1, 0, 3)
				);

				layer2.commit();
				let moment = layer1.commit().commit();

				assert(moment.getLayerMoment("test1")!.getTransform()!.b === 2);
				assert(moment.getLayerMoment("test2")!.getTransform()!.c === 3);

			});

		});

		describe("layerMomentBuilderのコミットなし", () => {

			it("コミットされていないlayerMomentは反映されないこと。", () => {

				let builder: APIS.history.DrawMomentBuilder = session!.addMoment();

				let layer1 = builder.putLayerMoment("test1").setTransForm(
					TransformFactory.createInstance(0, 0, 1, 2)
				);
				builder.putLayerMoment("test2").setTransForm(
					TransformFactory.createInstance(0, 0, 1, 0, 3)
				);

				// layer2.commit();
				let moment = layer1.commit().commit();

				assert(moment.getLayerMoment("test2") === null);
				assert(moment.getLayerMoment("test1")!.getTransform()!.b === 2);


			});

		});
	});

	describe("setSequence", () => {

		it("sequenceが反映されること。", () => {
			let builder: APIS.history.DrawMomentBuilder = session!.addMoment();

			builder.putLayerMoment("test1").setTransForm(
				TransformFactory.createInstance(0, 0, 1, 2)
			).commit();
			builder.putLayerMoment("test2").setTransForm(
				TransformFactory.createInstance(0, 0, 1, 3)
			).commit();

			builder.setSequence(["test2", "test1"]);
			let moment = builder.commit();

			assert(moment.getSequence()[0] === "test2");
			assert(moment.getSequence()[1] === "test1");

		});

	});

	describe("commit", () => {

		let builder: APIS.history.DrawMomentBuilder | null = null;
		beforeEach((done) => {
			builder = session!.addMoment();
			done();
		});

		it("momentが追加されること。", () => {
			let moment = builder!.putLayerMoment("test").addDraw(
				GraphicsDrawFactory.createInstance(null, null, 6)
			).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
		});

		describe("commit後の操作", () => {

			describe("putLayerMoment", () => {
				it("エラーとなること。", (done) => {
					builder!.commit();
					try {
						builder!.putLayerMoment("1");
					} catch (e) {
						done();
					}
				});
			});

			describe("setSequence", () => {
				it("エラーとなること。", (done) => {
					builder!.commit();
					try {
						builder!.setSequence([]);
					} catch (e) {
						done();
					}
				});
			});

			describe("commit", () => {
				it("エラーとなること。", (done) => {
					builder!.commit();
					try {
						builder!.commit();
					} catch (e) {
						done();
					}
				});
			});
		});
	});
});