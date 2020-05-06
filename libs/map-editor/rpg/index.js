SceneManager._runMode = null;
SceneManager._runElementId = null;
SceneManager._runMapIdForEditor = null;
SceneManager._frame_count = 0;

TouchInput.initialize = function() {
  this.clear();
  if (SceneManager.isRunMode()){
    this._setupEventHandlers();
  } else {
    this._setupEventHandlers("container-map-area");
  }
};

TouchInput._setupEventHandlers = function(dom_id) {
  var isSupportPassive = Utils.isSupportPassiveEvent();

  var dom = document;
  if (dom_id){
    dom = document.getElementById(dom_id);
  }

  dom.addEventListener('mousedown', this._onMouseDown.bind(this));
  dom.addEventListener('mousemove', this._onMouseMove.bind(this));
  dom.addEventListener('mouseup', this._onMouseUp.bind(this));
  dom.addEventListener('wheel', this._onWheel.bind(this));
  dom.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {passive: false} : false);
  dom.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {passive: false} : false);
  dom.addEventListener('touchend', this._onTouchEnd.bind(this));
  dom.addEventListener('touchcancel', this._onTouchCancel.bind(this));
  dom.addEventListener('pointerdown', this._onPointerDown.bind(this));
};


Game_Temp.prototype.clearDestination = function() {
  if (SceneManager.isEditorMode()) return;
  this._destinationX = null;
  this._destinationY = null;
};

Game_Temp.prototype.setDestination = function(x, y) {
  if (SceneManager.isEditorMode()) {
    if (x === undefined || y === undefined) {
      return;
    }
  }
  this._destinationX = x;
  this._destinationY = y;

  if ($gameMap.existEvent(x,y)){
    App.props.Footer.dispatch({
      type: "status_bar/setShowEditBtn",
      is_show: true
    });
  } else {
    App.props.Footer.dispatch({
      type: "status_bar/setNewEditBtn",
      is_show: true
    });
  }
};

Game_Temp.prototype.isDestinationValid = function() {
  if (SceneManager.isEditorMode()) {
    return true;
  }
  return this._destinationX !== null;
};

Sprite_Character.prototype.initialize = function(character) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);

    if (SceneManager.isEditorMode()) { 
      this.spriteEditorEventRect = new Sprite();
      this.spriteEditorEventRect.x = this.x;
      this.spriteEditorEventRect.y = this.y + 1;
      this.spriteEditorEventRect.z = this.z - 1;
      this.spriteEditorEventRect.opacity = 50;
      this.spriteEditorEventRect.bitmap = new Bitmap(38,38);
      this.spriteEditorEventRect.bitmap.fillRect(0,0,38,38,'black');
      this.spriteEditorEventRect.anchor.x = this.anchor.x;
      this.spriteEditorEventRect.anchor.y = this.anchor.y;
      this.addChild(this.spriteEditorEventRect)

      this.spriteEditorEventBorder = new Sprite();
      this.spriteEditorEventBorder.x = this.x;
      this.spriteEditorEventBorder.y = this.y + 1;
      this.spriteEditorEventBorder.z = this.z - 1;
      this.spriteEditorEventBorder.bitmap = new Bitmap(38,38);
      this.spriteEditorEventBorder.bitmap.fillRect(0,0,38,1,'white');
      this.spriteEditorEventBorder.bitmap.fillRect(0,0,1,38,'white');
      this.spriteEditorEventBorder.bitmap.fillRect(37,0,1,38,'white');
      this.spriteEditorEventBorder.bitmap.fillRect(0,37,38,1,'white');
      this.spriteEditorEventBorder.anchor.x = this.anchor.x;
      this.spriteEditorEventBorder.anchor.y = this.anchor.y;
      this.addChild(this.spriteEditorEventBorder)
    }
};

Sprite_Character.prototype.updateOther = function() {
  this.opacity = this._character.opacity();
  this.blendMode = this._character.blendMode();
  this._bushDepth = this._character.bushDepth();

  if (SceneManager.isEditorMode()) {
    if (this._character.constructor.name === "Game_Event") {
      if (App.props.Header.toolbar.current_mode === "map"){
        this.opacity = 100;
      }
    }
  }
};

Sprite_Character.prototype.updatePosition = function() {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
    if (SceneManager.isEditorMode) {
      this.y = this._character.screenY();
    }
};


Sprite_Character.prototype.updateTileFrame = function() {
  var pw = this.patternWidth();
  var ph = this.patternHeight();
  var sx = (Math.floor(this._tileId / 128) % 2 * 8 + this._tileId % 8) * pw;
  var sy = Math.floor(this._tileId % 256 / 8) % 16 * ph;

  if (SceneManager.isEditorMode) {
    if (this._character.constructor.name === "Game_Event") {
      sx = (pw - 36) / 2
      sy = (ph - 36) / 2
      pw = 36
      ph = 36
    }
  }
  this.setFrame(sx, sy, pw, ph);
};

Sprite_Character.prototype.updateCharacterFrame = function() {
  var pw = this.patternWidth();
  var ph = this.patternHeight();
  var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
  var sy = (this.characterBlockY() + this.characterPatternY()) * ph;

  if (SceneManager.isEditorMode) {
    if (this._character.constructor.name === "Game_Event") {
      sx = (pw - 36) / 2
      sy = (ph - 36) / 2
      pw = 36
      ph = 36
    }
  }

  this.updateHalfBodySprites();
  if (this._bushDepth > 0) {
    var d = this._bushDepth;
    this._upperBody.setFrame(sx, sy, pw, ph - d);
    this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
    this.setFrame(sx, sy, 0, ph);
  } else {
    this.setFrame(sx, sy, pw, ph);
  }
};

Sprite_Destination.prototype.update = function() {
  Sprite.prototype.update.call(this);
  if (SceneManager.isRunMode()){
    if ($gameTemp.isDestinationValid()){
      this.updatePosition();
      this.updateAnimation();
      this.visible = true;
    } else {
      this._frameCount = 0;
      this.visible = false;
    }
  } else {
    this.updatePosition();
    this.opacity = App.props.Header.toolbar.current_mode === "map" ? 100 : 255;
    this.visible = true;
  }
};

Sprite_Destination.prototype.createBitmap = function() {
  var tileWidth = $gameMap.tileWidth();
  var tileHeight = $gameMap.tileHeight();
  this.bitmap = new Bitmap(tileWidth, tileHeight);
  
  if (SceneManager.isRunMode()){
    this.bitmap.fillAll('white');
    this.blendMode = Graphics.BLEND_ADD;
  } else {
    const color_black = '#000000';
    this.bitmap.fillRect(0,0,tileWidth,1,color_black);
    this.bitmap.fillRect(0,0,1,tileHeight,color_black);
    this.bitmap.fillRect(tileWidth-1,0,1,tileHeight,color_black);
    this.bitmap.fillRect(0,tileHeight-1,tileWidth,1,color_black);

    this.bitmap.fillRect(1,1,tileWidth-2,3,'white');
    this.bitmap.fillRect(1,1,3,tileHeight-2,'white');
    this.bitmap.fillRect(tileWidth-4,1,3,tileHeight-2,'white');
    this.bitmap.fillRect(1,tileHeight-4,tileWidth-2,3,'white');

    this.bitmap.fillRect(4,4,tileWidth-8,1,color_black);
    this.bitmap.fillRect(4,4,1,tileHeight-8,color_black);
    this.bitmap.fillRect(tileWidth-5,4,1,tileHeight-8,color_black);
    this.bitmap.fillRect(4,tileHeight-5,tileWidth-8,1,color_black);
  }
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
};

SceneManager.isRunMode = function(){
  return this._runMode === "run";
};

SceneManager.isEditorMode = function(){
  return this._runMode === "editor";
};


SceneManager.clearRootChildren = function(root_element){
  var ele_children = root_element.children;
  while(ele_children.length > 0)
    root_element.removeChild(ele_children[0]);
}

SceneManager.gameStart = function(mode,run_element_id, run_map_id){

  SceneManager._runMode = mode;

  var element_map_editor = document.getElementById("rmmv-map-editor");
  var element_player = document.getElementById("rmmv-player");

  element_map_editor.style.display = "none";
  element_player.style.display = "none";

  var interface_size = App.config.app.interface_size;
  SceneManager._screenWidth = interface_size.player_width;
  SceneManager._screenHeight = interface_size.player_height;
  SceneManager._boxWidth = interface_size.player_width;
  SceneManager._boxHeight = interface_size.player_height;

  document.getElementById(run_element_id).style.display = "block";

  if (this.isRunMode()) {
    this.clearRootChildren(element_player);
    SceneManager._runElementId = run_element_id;
    SceneManager.run(Scene_Boot);
  } else {
    this.clearRootChildren(element_map_editor);
    this._runMapIdForEditor = run_map_id;

    SceneManager._runElementId = run_element_id;
    document.getElementById("container-map-area").style.height = interface_size.player_height + 'px';
    element_map_editor.style.width = interface_size.player_width + 'px';
    element_map_editor.style.height = interface_size.player_height + 'px';

    DataManager.loadDatabase();
    ConfigManager.load();
    ImageManager.reserveSystem('Window');

    DataManager.setupNewGame();
    SceneManager.run(Scene_Map);

    // clear some element
    var need_delete_elements = [];
    var element_map_editor_children = element_map_editor.children;
    for (var i = 0; i < element_map_editor_children.length; i++){
      if (!["GameCanvas","rmmv-map-editor-control-layer"].includes(element_map_editor_children[i].id))
        need_delete_elements.push(element_map_editor_children[i]);
    }
    need_delete_elements.forEach(function(ele){ ele.remove() });
  }
}

Game_Player.prototype.initialize = function() {
  Game_Character.prototype.initialize.call(this);
  this.setTransparent($dataSystem.optTransparent);
  if (SceneManager.isEditorMode()) this.setTransparent(true);
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

Game_Map.prototype.findEvent = function(x,y){
  return this.events().filter((e)=>{ return e.x === x && e.y === y})[0];
};

Game_Map.prototype.existEvent = function(x,y){
  return this.events().filter((e)=>{ return e.x === x && e.y === y}).length > 0;
};

Game_Map.prototype.existEventExcept = function(except_event,x,y){
  return this.events().filter((e)=>{ return e._eventId !== except_event._eventId && e.x === x && e.y === y}).length > 0;
};



Scene_Map.prototype.isCurrentTileA1 = function(pos,current_id){
  const target_index = pos[0] + pos[1] * $gameMap.width();
  const target_id = $dataMap.data[target_index];

  // console.log("-------start-----")
  // console.log(target_id)
  // console.log(current_id)
  // console.log(target_id >= current_id && target_id < current_id + 48);
  // console.log("-------end-----")

  return target_id >= current_id && target_id < current_id + 48;
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

      this.updateDataTileByCurrentPosA1(x,y,target_id);


      if (this.isCurrentTileA1([x-1, y],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y,target_id);
      }
      if (this.isCurrentTileA1([x, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x, y-1,target_id);
      }
      if (this.isCurrentTileA1([x+1, y],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y,target_id);
      }
      if (this.isCurrentTileA1([x, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x, y+1,target_id);
      }
      if (this.isCurrentTileA1([x-1, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y-1,target_id);
      }
      if (this.isCurrentTileA1([x+1, y-1],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y-1,target_id);
      }
      if (this.isCurrentTileA1([x-1, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x-1, y+1,target_id);
      }
      if (this.isCurrentTileA1([x+1, y+1],target_id)){
        this.updateDataTileByCurrentPosA1(x+1, y+1,target_id);
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
Scene_Map.prototype.updateDataTileByCurrentPosA1 = function(x,y,target_id){

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


Spriteset_Map.prototype.update = function() {
  Spriteset_Base.prototype.update.call(this);

  // 编辑器模式仅更新
  if (SceneManager.isEditorMode()) {
    this.updateParallax();
    this.updateTilemap();
    return;
  }

  this.updateTileset();
  this.updateParallax();
  this.updateTilemap();
  this.updateShadow();
  this.updateWeather();
};
