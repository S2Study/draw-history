import * as APIS from "@s2study/draw-api";
import * as assert from "power-assert";
import DrawHistoryEditSession = APIS.history.DrawHistoryEditSession;
import {History} from "../src/History";

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

			let builder: APIS.history.DrawMomentBuilder = session!.addMoment();

			it("layerMomentが反映されること。", () => {
				let moment = builder.putLayerMoment("test2").setTransForm({b: 2}).commit().commit();
				assert(moment.getLayerMoment("test2")!.getTransform()!.b === 2);
			});

		});

		describe("複数件", () => {

			let builder: APIS.history.DrawMomentBuilder = session!.addMoment();

			it("layerMomentが反映されること。", () => {

				let moment = builder
						.putLayerMoment("test3").setTransForm({b: 2}).commit()
						.putLayerMoment("test4").setTransForm({c: 3}).commit()
					.commit();

				assert(moment.getLayerMoment("test3")!.getTransform()!.b === 2);
				assert(moment.getLayerMoment("test4")!.getTransform()!.c === 3);

			});

		});

		describe("複数件＋putLayerMomentとcommitの順が逆", () => {

			let builder: APIS.history.DrawMomentBuilder = session!.addMoment();

			it("layerMomentが反映されること。", () => {

				let layer1 = builder.putLayerMoment("test1").setTransForm({b: 2});
				let layer2 = builder.putLayerMoment("test2").setTransForm({c: 3});

				layer2.commit();
				let moment = layer1.commit().commit();

				assert(moment.getLayerMoment("test1")!.getTransform()!.b === 2);
				assert(moment.getLayerMoment("test2")!.getTransform()!.c === 3);

			});

		});

		describe("layerMomentBuilderのコミットなし", () => {

			it("コミットされていないlayerMomentは反映されないこと。", () => {

			});

		});
	});

	describe("setSequence", () => {

		it("sequenceが反映されること。", () => {

		});

	});

	describe("commit", () => {

		it("momentが追加されること。", () => {
			let moment = momentBuilder!.putLayerMoment("test").addDraw({
				compositeOperation: 6
			}).commit().commit();
			assert(moment.getLayerMoment("test")!.getDraws()[0]!.compositeOperation === 6);
		});

		describe("commit後の操作", () => {

			describe("putLayerMoment", () => {
				it("エラーとなること。", () => {
				});
			});

			describe("setSequence", () => {
				it("エラーとなること。", () => {
				});
			});

			describe("commit", () => {
				it("エラーとなること。", () => {
				});
			});
		});
	});
});