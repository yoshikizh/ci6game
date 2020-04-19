const AppApi = function(){};

// 重制编辑器控制层 - 地图初始化或切换地图调用
AppApi.resetMapEditorControlLayer = function(map_id){
	const interface_size = App.config.app.interface_size;
    const dom_map_editor_control_layer = document.getElementById("rmmv-map-editor-control-layer");
    const data_map = App.game_data.maps[map_id];
    map_width_pix = data_map.width * 48;
    map_width_pix = data_map.height * 48;
    dom_map_editor_control_layer.style.width = `${map_width_pix}px`;
    dom_map_editor_control_layer.style.height = `${map_width_pix}px`;
};

AppApi.listenMapEditorScorllEvent = function(){
	
}

window.AppApi = AppApi;