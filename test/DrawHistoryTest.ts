describe("DrawLayerMomentBuilderのテスト", () => {

	describe("getLayers", () => {
		describe("履歴が空", () => {
		});
		describe("sequence指定の履歴が無し", () => {
		});
		describe("ignoreLocal指定あり", () => {
			describe("historyNumber指定あり", () => {
				describe("全てlocal履歴", () => {
				});
				describe("global履歴を含む", () => {
				});
			});
			describe("historyNumber指定なし", () => {
			});
		});
		describe("ignoreLocal指定なし", () => {
			describe("historyNumber指定あり", () => {
				describe("全てglobal履歴", () => {
				});
				describe("local履歴を含む", () => {
				});
			});
			describe("historyNumber指定なし", () => {
			});
		});
	});

	describe("getHistoryNumbers", () => {
	});

	describe("getNowHistoryNumber", () => {
	});

	describe("getLastHistoryNumber", () => {
		describe("履歴なしの場合", () => {
		});
		describe("履歴ありの場合", () => {
		});
	});

	describe("getFirstHistoryNumber", () => {
		describe("履歴なしの場合", () => {
		});
		describe("履歴ありの場合", () => {
		});
	});

	describe("isAvailable", () => {
		describe("引数あり", () => {
		});
		describe("引数なし", () => {
		});
	});

	describe("generateMessage", () => {
		describe("ignoreLocal指定あり", () => {
		});
		describe("ignoreLocal指定なし", () => {
		});
	});

	describe("awaitUpdate", () => {

	});

	describe("lock", () => {

	});

});
