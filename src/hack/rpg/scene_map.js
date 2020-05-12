import TileHandleA1 from "./module/tile_handle_a1";

// 绘图模式 on touch start
Scene_Map.prototype.onDrawTileTouchStart = function(x,y){
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
  if (current_draw === 'square'){

  }
  if (current_draw === 'ellipse'){

  }
  if (current_draw === 'fill'){

  }
  if (current_draw === 'shadow_pen'){

  }
}

// 绘图模式 on touch move
Scene_Map.prototype.onDrawTileTouchMove = function(x,y){
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
}

// 绘图模式 on touch end
Scene_Map.prototype.onDrawTileTouchEnd = function(x,y){
  
}

// 刷新当前图块以及周边图块
Scene_Map.prototype.refreshCurrentTileAndTheRound = function(x,y){
  const tile_config_str = App.props.tool_tileset.tool_tileset.selected_tile_id;
  if (tile_config_str){

    const split_arr = tile_config_str.split("|");
    const tile_type = split_arr[0];
    let tile_handle;
    if (tile_type === 'A1'){
      tile_handle = new TileHandleA1(x,y,tile_config_str);
    }
    tile_handle.refresh()
  }
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
