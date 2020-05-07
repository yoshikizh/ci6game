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
