SceneManager._runMode = null;
SceneManager._runElementId = null;
SceneManager._runMapIdForEditor = null;
SceneManager._frame_count = 0;


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


Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isTriggered() || this._touchCount > 0) {
        if (TouchInput.isPressed()) {
            if (this._touchCount === 0 || this._touchCount >= 15) {
                var x = $gameMap.canvasToMapX(TouchInput.x);
                var y = $gameMap.canvasToMapY(TouchInput.y);
                if (SceneManager.isRunMode()){
                    $gameTemp.setDestination(x, y);
                }
            }
            this._touchCount++;
        } else {
            this._touchCount = 0;
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

