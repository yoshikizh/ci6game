export default class CacheManagement {

	static __object__ = null;

	static shareObject(){
		if (!this.__object__) {
			this.__object__ = new CacheManagement();
		}
		return this.__object__;
	}

	constructor() {
		this.rtp = {};
	}

	getRtp(key){
		return this.rtp[key];
	}

	setRtp(key,value){
		this.rtp[key] = value;
	}
}