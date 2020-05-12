class TileHandle {

  // static A1_START_TILE_ID = Tilemap.TILE_ID_A1;
  static SPECIAL_A1_TILE_ID = [1,2,3];
  static AUTO_A1_TILE_INDEX = [0,1,2,3,4,6,8,10,12,14]; 

  constructor(x,y){
    this.x = x;                                             // => 光标位置的 x
    this.y = y;                                             // => 光标位置的 y
    this.tile_x = null;                                     // => 图块的 x
    this.tile_y = null;                                     // => 图块的 y
    this.tile_index = null;                                 // => 图块的 index
    this.tile_id = null;                                    // => 图块id
  }

  checkTileIsPadding(x,y){
    return x < 0 || y < 0 || x >= $gameMap.width() || y >= $gameMap.height();
  }

}

export default TileHandle;