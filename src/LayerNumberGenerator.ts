import KeyGenerator = drawchat.core.KeyGenerator;
export class LayerNumberGenerator implements KeyGenerator{

	private num:number;

	constructor(){
		this.num = 0|0;
	}

	/**
	 * 採番処理を行います。
	 * @returns {number}
	 */
	generateKey():string{
		this.num = (this.num + 1)|0;
		return String(this.num);
	}
}