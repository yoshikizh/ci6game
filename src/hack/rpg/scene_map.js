import TileHandle from "./module/tile_handle";
import TileHandleA1 from "./module/tile_handle_a1";
import TileHandleA2 from "./module/tile_handle_a2";
import TileHandleA3 from "./module/tile_handle_a3";
import TileHandleA4 from "./module/tile_handle_a4";
import TileHandleA5 from "./module/tile_handle_a5";
import TileHandleBToE from "./module/tile_handle_btoe";


// 当前选中事件(拖动用)
Scene_Map.current_drag_event = null;
Scene_Map.current_draw_tile_process = null;


// 绘图模式 on touch start
Scene_Map.prototype.onDrawTileTouchStart = function(x,y){
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
  if (current_draw === 'square'){
    const tile_handle = this.refreshCurrentTileAndTheRound(x,y);

    const tile_config_str = App.props.tool_tileset.tool_tileset.selected_tile_id;
    if (!tile_config_str) return;

    const split_arr = tile_config_str.split("|");
    const tile_type = split_arr[0];

    Scene_Map.current_draw_tile_process = {
      start_pos: [x,y],
      last_pos: [x,y],
      last_dir: 5,
      origin_tile_handle: tile_handle,
      tile_type: tile_type,
      covered_tiles: {},
      fill_tiles: {},
      origin_data: Object.assign([],$dataMap.data)
    }
  }
  if (current_draw === 'ellipse'){

  }
  if (current_draw === 'fill'){

  }
  if (current_draw === 'shadow_pen'){

  }
}

function Utils(){};
Utils.rangeToArray = function(num1, num2){
  const sorted_range = [num1,num2].sort(function(a,b){return a-b});
  let array = [];
  for(var i = sorted_range[0]; i <= sorted_range[1]; i++){
    array.push(i);
  }
  return array;
}

Utils.rectToArray = function(x1,y1,x2,y2){
  const x_array = Utils.rangeToArray(x1,x2);
  const y_array = Utils.rangeToArray(y1,y2);
  let array = [];
  x_array.forEach(function(_x){
    y_array.forEach(function(_y){
      array.push(`${_x}_${_y}`);
    });
  });
  return array;
}

Scene_Map.prototype.getdir8 = function(x, y, ori_x, ori_y){
  let dir = 5;
  if (x === ori_x){
    // 上方
    if (y < ori_y){
      dir = 8;
    }
    // 下方
    if (y > ori_y){
      dir = 2;
    }
  }
  if (y === ori_y){
    // 左边
    if (x < ori_y){
      dir = 4;
    }
    // 右边
    if (x > ori_x){
      dir = 6;
    }
  }
  if (x < ori_x){
    // 左上方
    if (y < ori_y){
      dir = 7;
    }
    // 左下方
    if (y > ori_y){
      dir = 1;
    }
  }
  if (x > ori_x){
    // 右上方
    if (y < ori_y){
      dir = 9;
    }
    // 右下方
    if (y > ori_y){
      dir = 3;
    }
  }
  return dir;
}


// 绘图模式 on touch move
Scene_Map.prototype.onDrawTileTouchMove = function(x,y){
  var _this = this;
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
  if (current_draw === 'square'){

    const current_draw_tile_process = Scene_Map.current_draw_tile_process;
    if (Scene_Map.current_draw_tile_process){

      // 重复上一次绘制则返回
      console.log("current_draw_tile_process.last_pos",current_draw_tile_process.last_pos[0],x,current_draw_tile_process.last_pos[1],y)
      console.log(y === current_draw_tile_process.last_pos[1])
      if (x === current_draw_tile_process.last_pos[0] && (y === current_draw_tile_process.last_pos[1])){
        return;
      }

      const origin_tile_handle = current_draw_tile_process.origin_tile_handle;
      const tile_id = origin_tile_handle.tile_id;
      const tile_id_extra = origin_tile_handle.tile_id_extra;
      const last_pos = current_draw_tile_process.last_pos;
      const start_pos = current_draw_tile_process.start_pos;
      const start_pos_x = start_pos[0];
      const start_pos_y = start_pos[1];
      const last_pos_x = last_pos[0];
      const last_pos_y = last_pos[1];
      const origin_data = current_draw_tile_process.origin_data;

      const map_width = $gameMap.width();
      const grid_count = $gameMap.gridCount();


      // 上一次的 rect
      const arr1 = Utils.rectToArray(last_pos_x,last_pos_y,start_pos_x,start_pos_y);

      // 当前的 rect
      const arr2 = Utils.rectToArray(x,y,start_pos_x,start_pos_y);

      // 两个集合对比, 计算出增加的部分 和 减少的部分
      const need_delete_arr = arr1.filter(function (val) { return arr2.indexOf(val) === -1 });
      const need_add_arr = arr2.filter(function (val) { return arr1.indexOf(val) === -1 });

      need_add_arr.forEach(function(str){
        const arr = str.split("_");
        const _x = parseInt(arr[0]);
        const _y = parseInt(arr[1]);
        // _this.refreshCurrentTileAndTheRound(_x,_y);

        const pos_index = _x + _y * map_width;
        let tile_id_layer_0 = $dataMap.data[pos_index];
        let tile_id_layer_1 = $dataMap.data[pos_index + grid_count];
        let tile_id_layer_2 = $dataMap.data[pos_index + 2 * grid_count];

        Scene_Map.current_draw_tile_process.covered_tiles[`${_x}_${_y}`] = {
          layer0_tile_id: tile_id_layer_0,
          layer1_tile_id: tile_id_layer_1,
          layer2_tile_id: tile_id_layer_2
        };
      });


      console.log("need_delete_arr",need_delete_arr)

      need_delete_arr.forEach(function(str){
        const arr = str.split("_");
        const _x = parseInt(arr[0]);
        const _y = parseInt(arr[1]);
        const pos_index = _x + _y * map_width;
        const tile_id_layer_0 = $dataMap.data[pos_index];
        const tile_id_layer_1 = $dataMap.data[pos_index + grid_count];
        const tile_id_layer_2 = $dataMap.data[pos_index + 2 * grid_count];

        // 还原逻辑
        const layer0_tile_id = Scene_Map.current_draw_tile_process.covered_tiles[`${_x}_${_y}`].layer0_tile_id;
        const layer1_tile_id = Scene_Map.current_draw_tile_process.covered_tiles[`${_x}_${_y}`].layer1_tile_id;
        const layer2_tile_id = Scene_Map.current_draw_tile_process.covered_tiles[`${_x}_${_y}`].layer2_tile_id;
        let tile_handle0 = TileHandle.getTileHandleByTileId(_x,_y,layer0_tile_id,0);
        let tile_handle1 = TileHandle.getTileHandleByTileId(_x,_y,layer1_tile_id,1);
        let tile_handle2 = TileHandle.getTileHandleByTileId(_x,_y,layer2_tile_id,2);

        $dataMap.data[pos_index] = 0;
        $dataMap.data[pos_index + grid_count] = 0;
        $dataMap.data[pos_index + 2 * grid_count] = 0;

        $dataMap.data[pos_index] = origin_data[pos_index];
        $dataMap.data[pos_index + grid_count] = origin_data[pos_index + grid_count];
        $dataMap.data[pos_index + 2 * grid_count] = origin_data[pos_index + 2 * grid_count];

        if (tile_handle0 && layer0_tile_id !== 0){
          // tile_handle0.refresh()
        }
        if (tile_handle1 && layer1_tile_id !== 0){
          console.log("tile_handle1 refresh");
          tile_handle1.refresh()
        }
        if (tile_handle2){
          console.log("tile_handle2 refresh");
          tile_handle2.refresh()
        }
      });
      
      need_add_arr.forEach(function(str){
        const arr = str.split("_");
        const _x = parseInt(arr[0]);
        const _y = parseInt(arr[1]);
        _this.refreshCurrentTileAndTheRound(_x,_y);
      });


      SceneManager._scene._spriteset._tilemap.refresh();
      Scene_Map.current_draw_tile_process.last_pos = [x,y];
    }

  }


}

// 绘图模式 on touch end
Scene_Map.prototype.onDrawTileTouchEnd = function(x,y){
  var _this = this;
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){

  }
  if (current_draw === 'square'){


    const current_draw_tile_process = Scene_Map.current_draw_tile_process;
    if (Scene_Map.current_draw_tile_process){


      const origin_tile_handle = current_draw_tile_process.origin_tile_handle;
      const tile_id = origin_tile_handle.tile_id;
      const tile_id_extra = origin_tile_handle.tile_id_extra;
      const last_pos = current_draw_tile_process.last_pos;
      const start_pos = current_draw_tile_process.start_pos;
      const start_pos_x = start_pos[0];
      const start_pos_y = start_pos[1];
      const last_pos_x = last_pos[0];
      const last_pos_y = last_pos[1];
      const origin_data = current_draw_tile_process.origin_data;

      const map_width = $gameMap.width();
      const grid_count = $gameMap.gridCount();

      const need_refresh_arr = Utils.rectToArray(x,y,start_pos_x,start_pos_y);

      need_refresh_arr.forEach(function(str){
        const arr = str.split("_");
        const _x = parseInt(arr[0]);
        const _y = parseInt(arr[1]);
        _this.refreshCurrentTileAndTheRound(_x,_y);
      });



    }


    Scene_Map.current_draw_tile_process = null;
  }
}

// 刷新当前图块以及周边图块
Scene_Map.prototype.refreshCurrentTileAndTheRound = function(x,y){
  const tile_config_str = App.props.tool_tileset.tool_tileset.selected_tile_id;
  let tile_handle;
  if (tile_config_str){
    const split_arr = tile_config_str.split("|");
    const tile_type = split_arr[0];
    
    if (tile_type === 'A1'){
      tile_handle = new TileHandleA1(x,y,tile_config_str);
    }
    if (tile_type === 'A2'){
      tile_handle = new TileHandleA2(x,y,tile_config_str);
    }
    if (tile_type === 'A3'){
      tile_handle = new TileHandleA3(x,y,tile_config_str);
    }
    if (tile_type === 'A4'){
      tile_handle = new TileHandleA4(x,y,tile_config_str);
    }
    if (tile_type === 'A5'){
      tile_handle = new TileHandleA5(x,y,tile_config_str);
    }
    if (tile_type === 'B'){
      tile_handle = new TileHandleBToE(x,y,tile_config_str);
    }
    if (tile_type === 'C'){
      tile_handle = new TileHandleBToE(x,y,tile_config_str);
    }
    if (tile_type === 'D'){
      tile_handle = new TileHandleBToE(x,y,tile_config_str);
    }
    if (tile_type === 'E'){
      tile_handle = new TileHandleBToE(x,y,tile_config_str);
    }
    tile_handle.refresh()
  }
  return tile_handle;
};

Scene_Map.prototype.createDisplayObjects = function() {
  if (SceneManager.isEditorMode()){
    this.createSpriteset();
    this.createMapNameWindow();
    return;
  }
  this.createSpriteset();
  this.createMapNameWindow();
  this.createWindowLayer();
  this.createAllWindows();
};


Scene_Map.prototype.processMapTouch = function() {

  // 拖动中
  if (TouchInput.isTriggered() || this._touchCount > 0) {
    if (TouchInput.isPressed()) {
      if (this._touchCount === 0 || this._touchCount >= 15) {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        if (SceneManager.isRunMode()){
          $gameTemp.setDestination(x, y);
        } else {

          var toolbar = App.props.Header.toolbar;

          if (toolbar.current_mode === "event"){
            if (Scene_Map.current_drag_event) {
              if (!$gameMap.existEvent(x,y)){
                if (x >= 0 && y >= 0)
                  Scene_Map.current_drag_event.locate(x,y);
              }
            }
          }

          // 拖动绘制地图
          if (toolbar.current_mode === "map"){
            this.onDrawTileTouchMove(x,y);
          }
        }
      }
      this._touchCount++;
    } else {
      this._touchCount = 0;
    }
  }

  // 拖动开始
  if (TouchInput.isTriggered()) {
    var x = $gameMap.canvasToMapX(TouchInput.x);
    var y = $gameMap.canvasToMapY(TouchInput.y);
    if (App.props.Header.toolbar.current_mode === "event"){
      $gameTemp.setDestination(x, y);

      // 更新 state
      App.props.Editor.dispatch({
        type: "project/changeCurrentMapPos",
        pos: [x,y]
      });

      Scene_Map.current_drag_event = $gameMap.findEvent(x,y) || null;
    }

    // 开始绘制地图
    if (App.props.Header.toolbar.current_mode === "map"){
      this.onDrawTileTouchStart(x,y);
    }
  }

  // 松开 - 拖动事件
  if (TouchInput.isReleased()){

    var x = $gameMap.canvasToMapX(TouchInput.x);
    var y = $gameMap.canvasToMapY(TouchInput.y);

    if (App.props.Header.toolbar.current_mode === "event"){
      if (x >= 0 && y >= 0) {
        if (Scene_Map.current_drag_event && !$gameMap.existEventExcept(Scene_Map.current_drag_event,x,y)) {
          Scene_Map.current_drag_event.locate(x,y);
          Scene_Map.current_drag_event = null;
        }
        $gameTemp.setDestination(x, y);
      }
    }
    if (App.props.Header.toolbar.current_mode === "map"){
      this.onDrawTileTouchEnd(x,y);
    }
  }
};

Scene_Map.prototype.start = function() {
  Scene_Base.prototype.start.call(this);
  SceneManager.clearStack();
  if (this._transfer) {
    this.fadeInForTransfer();
    this._mapNameWindow.open();
    $gameMap.autoplay();
  } else if (this.needsFadeIn()) {
    this.startFadeIn(this.fadeSpeed(), false);
  }

  // 编辑器模式仅仅运行一次
  if (SceneManager.isEditorMode()) {
    $gamePlayer.update(true);
  }

  this.menuCalling = false;
};


Scene_Map.prototype.update = function() {
  if (SceneManager.isEditorMode()) {
    if (!SceneManager.isSceneChanging()) {
      this.updateTransferPlayer();
    }
    this.updateDestination();
    var active = this.isActive();
    Scene_Base.prototype.update.call(this);
    return;
  }

  this.updateDestination();
  this.updateMainMultiply();
  if (this.isSceneChangeOk()) {
    this.updateScene();
  } else if (SceneManager.isNextScene(Scene_Battle)) {
    this.updateEncounterEffect();
  }
  this.updateWaitCount();
  Scene_Base.prototype.update.call(this);
};
