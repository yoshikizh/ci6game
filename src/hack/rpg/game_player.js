Game_Player.prototype.initialize = function() {
  Game_Character.prototype.initialize.call(this);
  this.setTransparent($dataSystem.optTransparent);
  if (SceneManager.isEditorMode()) this.setTransparent(true);
};
