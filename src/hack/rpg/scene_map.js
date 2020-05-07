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

Scene_Map.prototype.isCurrentTileA1ByIndex = function(index,current_id){
  if (index < 0) return false;
  const target_id = $dataMap.data[index];
  return target_id >= current_id && target_id < current_id + 48;
}

Scene_Map.prototype.isCurrentTileA1 = function(pos,current_id){
  const target_index = pos[0] + pos[1] * $gameMap.width();
  return this.isCurrentTileA1ByIndex(target_index,current_id);
};

// 刷新当前图块以及周边图块
Scene_Map.prototype.refreshCurrentTileAndTheRound = function(x,y){

  const selected_tile_id = App.props.tool_tileset.tool_tileset.selected_tile_id;
  if (selected_tile_id){

    const split_arr = selected_tile_id.split("|");
    const tile_type = split_arr[0];
    if (tile_type === 'A1'){



      const tile_x = parseInt(split_arr[3]);
      const tile_y = parseInt(split_arr[2]);
      const start_index = (tile_x + tile_y * 8);
      const base_id = Tilemap.TILE_ID_A1;
      let target_id = base_id + start_index * 48;

      // A1 有特殊情况非自动元件的情况
      let is_auto_tile = ![5,7,9,11,13,15].includes(start_index);

      // 绘制当前
      this.updateDataTileByCurrentPosA1(x,y,target_id,is_auto_tile);

      // 更新周围8格
      if (this.isCurrentTileA1([x-1, y],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x, y-1,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x+1, y],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x, y+1,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x-1, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y-1,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x+1, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y-1,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x-1, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y+1,target_id,is_auto_tile);
      }
      if (this.isCurrentTileA1([x+1, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y+1,target_id,is_auto_tile);
      }
    }

    SceneManager._scene._spriteset._tilemap.refresh();
  }
};

// 0: 不包含 1: 包含  null: 不检测跳过
Scene_Map.prototype.conditionScanRoundTiles = function(conditions, x, y, target_id){

  const pos_left  = [x-1, y];
  const pos_up    = [x, y-1];
  const pos_right = [x+1, y];
  const pos_down  = [x, y+1];
  const pos_left_top   = [x-1, y-1];
  const pos_right_top  = [x+1, y-1];
  const pos_left_down  = [x-1, y+1];
  const pos_right_down = [x+1, y+1];

  var result = true;
  for(var i = 0; i < conditions.length; i++){
    if (conditions[i] === null){
      continue;
    }
    var dir = i + 1;
    var exist = conditions[i] === 1;


      if (dir === 1){
        if (exist !== this.isCurrentTileA1(pos_left_down,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 2){
        if (exist !== this.isCurrentTileA1(pos_down,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 3){
        if (exist !== this.isCurrentTileA1(pos_right_down,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 4){
        if (exist !== this.isCurrentTileA1(pos_left,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 6){
        if (exist !== this.isCurrentTileA1(pos_right,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 7){
        if (exist !== this.isCurrentTileA1(pos_left_top,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 8){
        if (exist !== this.isCurrentTileA1(pos_up,target_id)){
          result = false;
          break;
        }
      }
      if (dir === 9){
        if (exist !== this.isCurrentTileA1(pos_right_top,target_id)){
          result = false;
          break;
        }
      }
    
  }
  return result;
}


// 设置光标位置tile到地图
Scene_Map.prototype.updateDataTileByCurrentPosA1 = function(x,y,target_id,is_auto_tile){

  // 自动图层id排列如
  //                2090,
  //                2080,
  //           2082,2051,2084,
  // 2091,2081,2057,2048,2054,2081,2093
  //           2088,2060,2086,
  //                2080,
  //                2092,

  // 获取 周围8格坐标
  const pos_left  = [x-1, y];
  const pos_up    = [x, y-1];
  const pos_right = [x+1, y];
  const pos_down  = [x, y+1];
  const pos_left_top   = [x-1, y-1];
  const pos_right_top  = [x+1, y-1];
  const pos_left_down  = [x-1, y+1];
  const pos_right_down = [x+1, y+1];

  if (!is_auto_tile){
    
    // 非自动则根据 index 的规则 -> (左中中中...中中中右) (+1,0,0,0,+2), 单个独立这 +3
    const current_target_index = y * 8 + x;
    if ( 
      this.isCurrentTileA1ByIndex(current_target_index - 1,target_id) &&
      this.isCurrentTileA1ByIndex(current_target_index + 1,target_id))
    {
      target_id += 0;
    } else if (
      !this.isCurrentTileA1ByIndex(current_target_index - 1,target_id) &&
      !this.isCurrentTileA1ByIndex(current_target_index + 1,target_id)) 
    {
      target_id += 3;
    } else if (
      this.isCurrentTileA1ByIndex(current_target_index - 1,target_id) &&
      !this.isCurrentTileA1ByIndex(current_target_index + 1,target_id)) 
    {
      target_id += 2;
    } else if (
      !this.isCurrentTileA1ByIndex(current_target_index - 1,target_id) &&
      this.isCurrentTileA1ByIndex(current_target_index + 1,target_id)) 
    {
      target_id += 1;
    }

  } else {

    if (this.conditionScanRoundTiles([1,1,1,1,null,1,1,1,1],x,y,target_id)){
      target_id += 0;
    } 
    else if (this.conditionScanRoundTiles([1,1,1,1,null,1,0,1,1],x,y,target_id)){
      target_id += 1;
    }
    else if (this.conditionScanRoundTiles([1,1,1,1,null,1,1,1,0],x,y,target_id)){
      target_id += 2;
    }
    else if (this.conditionScanRoundTiles([1,1,1,1,null,1,0,1,0],x,y,target_id)){
      target_id += 3;
    }
    else if (this.conditionScanRoundTiles([1,1,0,1,null,1,1,1,1],x,y,target_id)){
      target_id += 4;
    }
    else if (this.conditionScanRoundTiles([1,1,0,1,null,1,0,1,1],x,y,target_id)){
      target_id += 5;
    }
    else if (this.conditionScanRoundTiles([1,1,0,1,null,1,1,1,0],x,y,target_id)){
      target_id += 6;
    }
    else if (this.conditionScanRoundTiles([1,1,0,1,null,1,0,1,0],x,y,target_id)){
      target_id += 7;
    }
    else if (this.conditionScanRoundTiles([0,1,1,1,null,1,1,1,1],x,y,target_id)){
      target_id += 8;
    }
    else if (this.conditionScanRoundTiles([0,1,1,1,null,1,0,1,1],x,y,target_id)){
      target_id += 9;
    }
    else if (this.conditionScanRoundTiles([0,1,1,1,null,1,1,1,0],x,y,target_id)){
      target_id += 10;
    }
    else if (this.conditionScanRoundTiles([0,1,1,1,null,1,0,1,0],x,y,target_id)){
      target_id += 11;
    }
    else if (this.conditionScanRoundTiles([0,1,0,1,null,1,1,1,1],x,y,target_id)){
      target_id += 12;
    }
    else if (this.conditionScanRoundTiles([0,1,0,1,null,1,0,1,1],x,y,target_id)){
      target_id += 13;
    }
    else if (this.conditionScanRoundTiles([0,1,0,1,null,1,1,1,0],x,y,target_id)){
      target_id += 14;
    }
    else if (this.conditionScanRoundTiles([0,1,0,1,null,1,0,1,0],x,y,target_id)){
      target_id += 15;
    }
    else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,1,1],x,y,target_id)){
      target_id += 16;
    }
    else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,1,0],x,y,target_id)){
      target_id += 17;
    }
    else if (this.conditionScanRoundTiles([null,1,0,0,null,1,null,1,1],x,y,target_id)){
      target_id += 18;
    }
    else if (this.conditionScanRoundTiles([null,1,0,0,null,1,null,1,0],x,y,target_id)){
      target_id += 19;
    }
    else if (this.conditionScanRoundTiles([1,1,1,1,null,1,null,0,null],x,y,target_id)){
      target_id += 20;
    }
    else if (this.conditionScanRoundTiles([1,1,0,1,null,1,null,0,null],x,y,target_id)){
      target_id += 21;
    }
    else if (this.conditionScanRoundTiles([0,1,1,1,null,1,null,0,null],x,y,target_id)){
      target_id += 22;
    }
    else if (this.conditionScanRoundTiles([0,1,0,1,null,1,null,0,null],x,y,target_id)){
      target_id += 23;
    }
    else if (this.conditionScanRoundTiles([1,1,null,1,null,0,1,1,null],x,y,target_id)){
      target_id += 24;
    }
    else if (this.conditionScanRoundTiles([0,1,null,1,null,0,1,1,null],x,y,target_id)){
      target_id += 25;
    }
    else if (this.conditionScanRoundTiles([1,1,null,1,null,0,0,1,null],x,y,target_id)){
      target_id += 26;
    }
    else if (this.conditionScanRoundTiles([0,1,null,1,null,0,0,1,null],x,y,target_id)){
      target_id += 27;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,1,1,1,1],x,y,target_id)){
      target_id += 28;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,1,0,1,1],x,y,target_id)){
      target_id += 29;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,1,1,1,0],x,y,target_id)){
      target_id += 30;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,1,0,1,0],x,y,target_id)){
      target_id += 31;
    }
    else if (this.conditionScanRoundTiles([null,1,null,0,null,0,null,1,null],x,y,target_id)){
      target_id += 32;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,1,null,0,null],x,y,target_id)){
      target_id += 33;
    }
    else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,0,null],x,y,target_id)){
      target_id += 34;
    }
    else if (this.conditionScanRoundTiles([null,1,null,0,null,1,null,0,null],x,y,target_id)){
      target_id += 35;
    }
    else if (this.conditionScanRoundTiles([1,1,null,1,null,0,null,0,null],x,y,target_id)){
      target_id += 36;
    }
    else if (this.conditionScanRoundTiles([0,1,null,1,null,0,null,0,null],x,y,target_id)){
      target_id += 37;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,0,1,1,null],x,y,target_id)){
      target_id += 38;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,0,0,1,null],x,y,target_id)){
      target_id += 39;
    }
    else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,1,1],x,y,target_id)){
      target_id += 40;
    }
    else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,1,0],x,y,target_id)){
      console.log("hit 41")
      target_id += 41;
    }
    else if (this.conditionScanRoundTiles([null,1,null,0,null,0,null,0,null],x,y,target_id)){
      console.log("hit 42")
      target_id += 42;
    }
    else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,0,null],x,y,target_id)){
      target_id += 43;
    }
    else if (this.conditionScanRoundTiles([null,0,null,0,null,0,null,1,null],x,y,target_id)){
      target_id += 44;
    }
    else if (this.conditionScanRoundTiles([null,0,null,1,null,0,null,0,null],x,y,target_id)){
      target_id += 45;
    }
    else if (this.conditionScanRoundTiles([null,0,null,0,null,0,null,0,null],x,y,target_id)){
      target_id += 46;
    }

  }

  const target_index = x + y * $gameMap.width();
  $dataMap.data[target_index] = target_id;
}

Scene_Map.current_drag_event = null;
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
          if (App.props.Header.toolbar.current_mode === "event"){
            if (Scene_Map.current_drag_event) {
              if (!$gameMap.existEvent(x,y)){
                if (x >= 0 && y >= 0)
                  Scene_Map.current_drag_event.locate(x,y);
              }
            }
          }

          // 拖动绘制地图
          if (App.props.Header.toolbar.current_mode === "map"){
            this.refreshCurrentTileAndTheRound(x,y);
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
      this.refreshCurrentTileAndTheRound(x,y);
    }
  }

  // 松开 - 拖动事件
  if (TouchInput.isReleased()){
    if (App.props.Header.toolbar.current_mode === "event"){
      var x = $gameMap.canvasToMapX(TouchInput.x);
      var y = $gameMap.canvasToMapY(TouchInput.y);

      if (x >= 0 && y >= 0) {
        if (Scene_Map.current_drag_event && !$gameMap.existEventExcept(Scene_Map.current_drag_event,x,y)) {
          Scene_Map.current_drag_event.locate(x,y);
          Scene_Map.current_drag_event = null;
        }
        $gameTemp.setDestination(x, y);
      }
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
