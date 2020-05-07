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