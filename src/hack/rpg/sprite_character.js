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
