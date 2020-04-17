import React from "react";

export const requireRtp = (path) => {
	let value = CacheManager.shareObject().getRtp(path);
	if (!value) {
		try {
			value = require(`./assets/rtp/${path}`).default;
		} catch(e){
			console.log("error",e)
			value = null
		}
		if (value) CacheManager.shareObject().setRtp(path,value);
	} else {
		console.log("hit!")
	}
	return value;
}
