// import TileHandleA1 from "./tile_handle_a1";
// import TileHandleA2 from "./tile_handle_a2";

class TileHandle {

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

  isA1Tile(tile_id){
    return tile_id >= Tilemap.TILE_ID_A1 && tile_id < Tilemap.TILE_ID_A1 + 16 * 48;
  }

  isA2Tile(tile_id){
    return tile_id >= Tilemap.TILE_ID_A2 && tile_id < Tilemap.TILE_ID_A2 + 32 * 48;
  }

  // 根据 pos 获得 tile_id
  getTileIdByPos(x,y,layer){
    const map_width = $gameMap.width();
    const pos_index = x + y * map_width;
    return $dataMap.data[pos_index + layer * $gameMap.gridCount()];
  }

  // 通过x,y绘制tile
  drawTileByPos(x,y){
    if (this.checkTileIsPadding(x,y)) {
      return;
    }

    const tile_id_layer_0 = this.getTileIdByPos(x,y,0);
    const tile_id_layer_1 = this.getTileIdByPos(x,y,1);

    if (tile_id_layer_0 && tile_id_layer_0 !== 0){
      if (this.isA1Tile(tile_id_layer_0)){
        const TileHandleA1 = require("./tile_handle_a1").default;
        const tile_handle = TileHandleA1.createTileHandleA1(x,y,tile_id_layer_0);
        tile_handle.drawTileByPosA1(x,y,tile_id_layer_0,0);
      }

      if (this.isA2Tile(tile_id_layer_0)){
        const TileHandleA2 = require("./tile_handle_a2").default;
        const tile_handle = TileHandleA2.createTileHandleA2(x,y,tile_id_layer_0);
        tile_handle.drawTileByPosA2(x,y,tile_id_layer_0,0);

      }
    }
    if (tile_id_layer_1 && tile_id_layer_1 !== 0){
      if (this.isA1Tile(tile_id_layer_1)){
        const TileHandleA1 = require("./tile_handle_a1").default;
        const tile_handle = TileHandleA1.createTileHandleA1(x,y,tile_id_layer_1);
        tile_handle.drawTileByPosA1(x,y,tile_id_layer_1,1);
      }
      if (this.isA2Tile(tile_id_layer_1)){
        const TileHandleA2 = require("./tile_handle_a2").default;
        const tile_handle = TileHandleA2.createTileHandleA2(x,y,tile_id_layer_1);
        tile_handle.drawTileByPosA2(x,y,tile_id_layer_1,1);

      }
    }
  }
}

export default TileHandle;