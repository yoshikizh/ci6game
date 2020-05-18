class DrawOperationLog {
	constructor(option) {
		this.option = option;
	}
}

class DrawOperationLogs {
	constructor() {
		this.logs = [];
	}

	addLog(option){
		this.logs.push(new DrawOperationLog(option))
	}

}

export default class TempManagement {

	static __object__ = null;

	static shareObject(){
		if (!this.__object__) {
			this.__object__ = new TempManagement();
		}
		return this.__object__;
	}

	constructor() {
		this.draw_operation_logs = new DrawOperationLogs();   // 地图绘制操作日志
	}

	addOperationLog(option){
		this.draw_operation_logs.addLog(option);
	}

	getRtp(key){
		return this.rtp[key];
	}

	setRtp(key,value){
		this.rtp[key] = value;
	}
}