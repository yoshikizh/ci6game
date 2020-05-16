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

  // 根据index查询tile_id是否为范围内(48个组成之一)
  isCurrentTileByIndex(index,tile_id,layer){
    if (index < 0) return false;
    const target_tile_id = $dataMap.data[index + layer * $gameMap.gridCount()];
    return target_tile_id >= tile_id && target_tile_id < tile_id + 48;
  }

  // 根据pos查询tile_id是否为范围内(48个组成之一)
  isCurrentTile(x,y,tile_id,layer){
    const target_index = x + y * $gameMap.width();
    return this.isCurrentTileByIndex(target_index,tile_id,layer);
  };

  // 通过 index 获取 tile_id 的 index
  getTileIndexByTileId(tile_id){
    return parseInt((tile_id - this.start_tile_id) / 48);
  };

  // 通过 pos 获取 tile_index
  getTileIndexByTilePos(x,y,layer){
    const tile_id = this.getTileIdByPos(x,y,layer);
    const tile_index = this.getTileIndexByTileId(tile_id);
    return tile_index;
  };

  clearTileLayerByPos(x,y,layer){
    const target_index = x + y * $gameMap.width();
    const clear_target_id = $dataMap.data[target_index + layer * $gameMap.gridCount()];
    if (clear_target_id !== 0){
      $dataMap.data[target_index + layer * $gameMap.gridCount()] = 0;
    }
  };

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

  // [自动图块使用] 扫描检测周边格子是满足条件, conditions 为一组周边8个格子的情况 -> 0: 不包含 1: 包含  null: 不检测跳过
  // 超过地图边界这返回 -> 包含
  conditionScanRoundAutoTiles(conditions, x, y, tile_id, layer){

    const pos_left  = [x-1, y];
    const pos_up    = [x, y-1];
    const pos_right = [x+1, y];
    const pos_down  = [x, y+1];
    const pos_left_top   = [x-1, y-1];
    const pos_right_top  = [x+1, y-1];
    const pos_left_down  = [x-1, y+1];
    const pos_right_down = [x+1, y+1];

    let result = true;
    for(let i = 0; i < conditions.length; i++){
      if (conditions[i] === null){
        continue;
      }
      let dir = i + 1;
      let exist = conditions[i] === 1;

      if (dir === 1){
        if (exist !== (this.checkTileIsPadding(pos_left_down[0],pos_left_down[1]) || this.isCurrentTile(pos_left_down[0],pos_left_down[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 2){
        if (exist !== (this.checkTileIsPadding(pos_down[0],pos_down[1]) || this.isCurrentTile(pos_down[0],pos_down[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 3){
        if (exist !== (this.checkTileIsPadding(pos_right_down[0],pos_right_down[1]) || this.isCurrentTile(pos_right_down[0],pos_right_down[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 4){
        if (exist !== (this.checkTileIsPadding(pos_left[0],pos_left[1]) || this.isCurrentTile(pos_left[0],pos_left[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 6){
        if (exist !== (this.checkTileIsPadding(pos_right[0],pos_right[1]) || this.isCurrentTile(pos_right[0],pos_right[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 7){
        if (exist !== (this.checkTileIsPadding(pos_left_top[0],pos_left_top[1]) || this.isCurrentTile(pos_left_top[0],pos_left_top[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 8){
        if (exist !== (this.checkTileIsPadding(pos_up[0],pos_up[1]) || this.isCurrentTile(pos_up[0],pos_up[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      if (dir === 9){
        if (exist !== (this.checkTileIsPadding(pos_right_top[0],pos_right_top[1]) || this.isCurrentTile(pos_right_top[0],pos_right_top[1],tile_id,layer))){
          result = false;
          break;
        }
      }
      
    }
    return result;
  }

  // [自动图块使用] 根据周边tile_id状况来获取中心tile的内部tile_id
  getCenterAutoTileIdByAround(x,y,tile_id,layer){

    let center_inner_target_id;
    if (this.conditionScanRoundAutoTiles([1,1,1,1,null,1,1,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 0;
    } 
    else if (this.conditionScanRoundAutoTiles([1,1,1,1,null,1,0,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 1;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,1,1,null,1,1,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 2;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,1,1,null,1,0,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 3;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,0,1,null,1,1,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 4;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,0,1,null,1,0,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 5;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,0,1,null,1,1,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 6;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,0,1,null,1,0,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 7;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,1,1,null,1,1,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 8;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,1,1,null,1,0,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 9;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,1,1,null,1,1,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 10;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,1,1,null,1,0,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 11;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,0,1,null,1,1,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 12;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,0,1,null,1,0,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 13;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,0,1,null,1,1,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 14;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,0,1,null,1,0,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 15;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,1,0,null,1,null,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 16;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,1,0,null,1,null,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 17;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,0,0,null,1,null,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 18;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,0,0,null,1,null,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 19;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,1,1,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 20;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,0,1,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 21;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,1,1,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 22;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,0,1,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 23;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,null,1,null,0,1,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 24;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,null,1,null,0,1,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 25;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,null,1,null,0,0,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 26;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,null,1,null,0,0,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 27;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,1,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 28;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,0,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 29;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,1,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 30;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,0,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 31;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,0,null,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 32;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 33;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,1,0,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 34;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 35;
    }
    else if (this.conditionScanRoundAutoTiles([1,1,null,1,null,0,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 36;
    }
    else if (this.conditionScanRoundAutoTiles([0,1,null,1,null,0,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 37;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,0,1,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 38;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,0,0,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 39;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,1,null,1,1],x,y,tile_id,layer)){
      center_inner_target_id = 40;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,1,null,1,0],x,y,tile_id,layer)){
      center_inner_target_id = 41;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,0,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 42;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,1,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 43;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,0,null,1,null],x,y,tile_id,layer)){
      center_inner_target_id = 44;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,0,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 45;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,0,null,0,null],x,y,tile_id,layer)){
      center_inner_target_id = 46;
    }
    return center_inner_target_id;
  }


}

export default TileHandle;