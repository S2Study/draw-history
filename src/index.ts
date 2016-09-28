import APIS from "@s2study/draw-api";

import NumberGenerator = APIS.history.NumberGenerator;
import KeyGenerator = APIS.history.KeyGenerator;
import {History} from "./History";
export class DrawHistory {
	createInstance(
		numberGenerator?: NumberGenerator,
		layerNumberGenerator?: KeyGenerator): History {
		return new History(numberGenerator, layerNumberGenerator);
	}
}
const Instance = new DrawHistory();
export default Instance;