export default class CacheManagement {

	static __object__ = null;

	static shareObject(){
		if (!this.__object__) {
			this.__object__ = new CacheManagement();
		}
		return this.__object__;
	}

	constructor() {
		this.images = {};
	}

	getImage(key){
		return this.images[key];
	}

	setImage(key,value){
		this.images[key] = value;
	}
}