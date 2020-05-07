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