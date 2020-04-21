SceneManager._runMode = null;
SceneManager._runElementId = null;
SceneManager._runMapIdForEditor = null;
SceneManager._frame_count = 0;

Game_Temp.prototype.clearDestination = function() {
  if (SceneManager.isEditorMode()) return;
  this._destinationX = null;
  this._destinationY = null;
};
Game_Temp.prototype.setDestination = function(x, y) {
  if (SceneManager.isEditorMode()) {
    console.log(x,y)
    if (x === undefined || y === undefined) {
      return;
    }
  }
  this._destinationX = x;
  this._destinationY = y;
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

// Sprite_Character.prototype.updatePosition = function() {
//     this.x = this._character.screenX();
//     this.y = this._character.screenY();
//     this.z = this._character.screenZ();
//     if (SceneManager.isEditorMode) {
//       this.y = this._character.screenY();
//     }
// };


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
                Scene_Map.current_drag_event.locate(x,y);
              }
            }
          }
          if (App.props.Header.toolbar.current_mode === "map"){
              // 绘制地图
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
        params: {pos: [x,y]}
      });

      Scene_Map.current_drag_event = $gameMap.findEvent(x,y) || null;
    }
  }

  // 松开 - 拖动事件
  if (TouchInput.isReleased()){
    console.log("released!")
    if (App.props.Header.toolbar.current_mode === "event"){

      var x = $gameMap.canvasToMapX(TouchInput.x);
      var y = $gameMap.canvasToMapY(TouchInput.y);

      if (Scene_Map.current_drag_event && !$gameMap.existEventExcept(Scene_Map.current_drag_event,x,y)) {
        Scene_Map.current_drag_event.locate(x,y);
        Scene_Map.current_drag_event = null;
        console.log("!!!!")
      }
      $gameTemp.setDestination(x, y);
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

