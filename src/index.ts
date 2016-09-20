import NumberGenerator = drawchat.core.NumberGenerator;
import KeyGenerator = drawchat.core.KeyGenerator;
import {History} from "./History";
export class DrawHistory{
	createInstance(
		numberGenerator?:NumberGenerator,
		layerNumberGenerator?:KeyGenerator
	):History{
		return new History(numberGenerator,layerNumberGenerator);
	}
}
var Instance = new DrawHistory();
export default Instance;