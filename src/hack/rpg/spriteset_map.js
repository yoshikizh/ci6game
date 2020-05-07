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

