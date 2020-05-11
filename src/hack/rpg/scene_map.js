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

// A1 的自动元件 index
const AUTO_A1_TILE_INDEX = [0,1,2,3,4,6,8,10,12,14];
const SPECIAL_A1_TILE_ID = [1,2,3];
const A1_START_TILE_ID = Tilemap.TILE_ID_A1;

// 根据 pos 获得 tile_id
Scene_Map.prototype.getTileIdByPos = function(x,y,layer){
  const map_width = $gameMap.width();
  const pos_index = x + y * map_width;
  return $dataMap.data[pos_index + layer * $gameMap.gridCount()];
}

// 根据index查询tile_id是否为范围内(48个组成之一)
Scene_Map.prototype.isCurrentTileA1ByIndex = function(index,tile_id,layer){
  if (index < 0) return false;
  const target_tile_id = $dataMap.data[index + layer * $gameMap.gridCount()];
  return target_tile_id >= tile_id && target_tile_id < tile_id + 48;
}

// 根据pos查询tile_id是否为范围内(48个组成之一)
Scene_Map.prototype.isCurrentTileA1 = function(x,y,tile_id,layer){
  const target_index = x + y * $gameMap.width();
  return this.isCurrentTileA1ByIndex(target_index,tile_id,layer);
};

// 通过 index 获取 tile_id 的 index
Scene_Map.prototype.getTileIndexByTileId = function(tile_id){
  return parseInt((tile_id - A1_START_TILE_ID) / 48);
};

// 通过 pos 获取 tile_index
Scene_Map.prototype.getTileIndexByTilePos = function(x,y,layer){
  const tile_id = this.getTileIdByPos(x,y,layer);
  const tile_index = this.getTileIndexByTileId(tile_id);
  return tile_index;
};

// 通过 pos 检查当前位置是否为 auto_tile
Scene_Map.prototype.checkIsAutoTileByPos = function(x,y,layer){
  const tile_index = this.getTileIndexByTilePos(x,y,layer);
  return AUTO_A1_TILE_INDEX.includes(tile_index);
};

// 通过 tile_id 检测是否为自动图块
Scene_Map.prototype.checkIsAutoTileByTileId = function(tile_id){
  const tile_index = this.getTileIndexByTileId(tile_id);
  return AUTO_A1_TILE_INDEX.includes(tile_index);
};

// 通过 tile_id 检测是否为特殊图块
Scene_Map.prototype.checkIsSpecialTileByTileId = function(tile_id){
  const tile_index = this.getTileIndexByTileId(tile_id);
  const is_special_tile = SPECIAL_A1_TILE_ID.includes(tile_index);
  return is_special_tile;
}

// 通过 tile pos 检查是否 特殊自动元件
Scene_Map.prototype.checkIsSpecialTileByTilePos = function(tile_x,tile_y,layer){
  const start_tile_index = (tile_x + tile_y * 8);
  const tile_id = A1_START_TILE_ID + start_tile_index * 48;
  const tile_index = this.getTileIndexByTileId(tile_id);
  const is_special_tile = SPECIAL_A1_TILE_ID.includes(tile_index);
  return is_special_tile;
};

// 绘图模式 on touch start
Scene_Map.prototype.onDrawTileTouchStart = function(x,y){
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
  if (current_draw === 'square'){

  }
  if (current_draw === 'ellipse'){

  }
  if (current_draw === 'fill'){

  }
  if (current_draw === 'shadow_pen'){

  }
}

// 绘图模式 on touch move
Scene_Map.prototype.onDrawTileTouchMove = function(x,y){
  const current_draw = App.props.Header.toolbar.current_draw;
  if (current_draw === 'pencil'){
    this.refreshCurrentTileAndTheRound(x,y);
  }
}

// 绘图模式 on touch end
Scene_Map.prototype.onDrawTileTouchEnd = function(x,y){
  
}

Scene_Map.prototype.checkTileIsPadding = function(x,y){
  return x < 0 || y < 0 || x >= $gameMap.width() || y >= $gameMap.height();
}

// 扫描检测周边格子是满足条件, conditions 为一组周边8个格子的情况 -> 0: 不包含 1: 包含  null: 不检测跳过
// 超过地图边界这返回 -> 包含
Scene_Map.prototype.conditionScanRoundTiles = function(conditions, x, y, tile_id, layer){

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
      if (exist !== (this.checkTileIsPadding(pos_left_down[0],pos_left_down[1]) || this.isCurrentTileA1(pos_left_down[0],pos_left_down[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 2){
      if (exist !== (this.checkTileIsPadding(pos_down[0],pos_down[1]) || this.isCurrentTileA1(pos_down[0],pos_down[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 3){
      if (exist !== (this.checkTileIsPadding(pos_right_down[0],pos_right_down[1]) || this.isCurrentTileA1(pos_right_down[0],pos_right_down[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 4){
      if (exist !== (this.checkTileIsPadding(pos_left[0],pos_left[1]) || this.isCurrentTileA1(pos_left[0],pos_left[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 6){
      if (exist !== (this.checkTileIsPadding(pos_right[0],pos_right[1]) || this.isCurrentTileA1(pos_right[0],pos_right[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 7){
      if (exist !== (this.checkTileIsPadding(pos_left_top[0],pos_left_top[1]) || this.isCurrentTileA1(pos_left_top[0],pos_left_top[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 8){
      if (exist !== (this.checkTileIsPadding(pos_up[0],pos_up[1]) || this.isCurrentTileA1(pos_up[0],pos_up[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    if (dir === 9){
      if (exist !== (this.checkTileIsPadding(pos_right_top[0],pos_right_top[1]) || this.isCurrentTileA1(pos_right_top[0],pos_right_top[1],tile_id,layer))){
        result = false;
        break;
      }
    }
    
  }
  return result;
}

// 普通A1图块(非Auto)根据左右情况计算出 需要增加的 inner_tile_id
Scene_Map.prototype.checkNormalA1TileAndSetCurrentTileId = function(x,y,tile_id,layer){
  const current_target_index = y * $gameMap.width() + x;
  let inner_target_id;
  if ( 
    this.isCurrentTileA1ByIndex(current_target_index - 1,tile_id,layer) &&
    this.isCurrentTileA1ByIndex(current_target_index + 1,tile_id,layer))
  {
    inner_target_id = 0;
  } else if (
    !this.isCurrentTileA1ByIndex(current_target_index - 1,tile_id,layer) &&
    !this.isCurrentTileA1ByIndex(current_target_index + 1,tile_id,layer)) 
  {
    inner_target_id = 3;
  } else if (
    this.isCurrentTileA1ByIndex(current_target_index - 1,tile_id,layer) &&
    !this.isCurrentTileA1ByIndex(current_target_index + 1,tile_id,layer)) 
  {
    inner_target_id = 2;
  } else if (
    !this.isCurrentTileA1ByIndex(current_target_index - 1,tile_id,layer) &&
    this.isCurrentTileA1ByIndex(current_target_index + 1,tile_id,layer)) 
  {
    inner_target_id = 1;
  }
  return inner_target_id;
}

// 检测周边tile_id状况来获取中心tile的内部tile_id
Scene_Map.prototype.checkAroundAutoA1TileAndSetCurrentTileId = function(x,y,tile_id,layer){

  let center_inner_target_id;
  if (this.conditionScanRoundTiles([1,1,1,1,null,1,1,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 0;
  } 
  else if (this.conditionScanRoundTiles([1,1,1,1,null,1,0,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 1;
  }
  else if (this.conditionScanRoundTiles([1,1,1,1,null,1,1,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 2;
  }
  else if (this.conditionScanRoundTiles([1,1,1,1,null,1,0,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 3;
  }
  else if (this.conditionScanRoundTiles([1,1,0,1,null,1,1,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 4;
  }
  else if (this.conditionScanRoundTiles([1,1,0,1,null,1,0,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 5;
  }
  else if (this.conditionScanRoundTiles([1,1,0,1,null,1,1,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 6;
  }
  else if (this.conditionScanRoundTiles([1,1,0,1,null,1,0,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 7;
  }
  else if (this.conditionScanRoundTiles([0,1,1,1,null,1,1,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 8;
  }
  else if (this.conditionScanRoundTiles([0,1,1,1,null,1,0,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 9;
  }
  else if (this.conditionScanRoundTiles([0,1,1,1,null,1,1,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 10;
  }
  else if (this.conditionScanRoundTiles([0,1,1,1,null,1,0,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 11;
  }
  else if (this.conditionScanRoundTiles([0,1,0,1,null,1,1,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 12;
  }
  else if (this.conditionScanRoundTiles([0,1,0,1,null,1,0,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 13;
  }
  else if (this.conditionScanRoundTiles([0,1,0,1,null,1,1,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 14;
  }
  else if (this.conditionScanRoundTiles([0,1,0,1,null,1,0,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 15;
  }
  else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 16;
  }
  else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 17;
  }
  else if (this.conditionScanRoundTiles([null,1,0,0,null,1,null,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 18;
  }
  else if (this.conditionScanRoundTiles([null,1,0,0,null,1,null,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 19;
  }
  else if (this.conditionScanRoundTiles([1,1,1,1,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 20;
  }
  else if (this.conditionScanRoundTiles([1,1,0,1,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 21;
  }
  else if (this.conditionScanRoundTiles([0,1,1,1,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 22;
  }
  else if (this.conditionScanRoundTiles([0,1,0,1,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 23;
  }
  else if (this.conditionScanRoundTiles([1,1,null,1,null,0,1,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 24;
  }
  else if (this.conditionScanRoundTiles([0,1,null,1,null,0,1,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 25;
  }
  else if (this.conditionScanRoundTiles([1,1,null,1,null,0,0,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 26;
  }
  else if (this.conditionScanRoundTiles([0,1,null,1,null,0,0,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 27;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,1,1,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 28;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,1,0,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 29;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,1,1,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 30;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,1,0,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 31;
  }
  else if (this.conditionScanRoundTiles([null,1,null,0,null,0,null,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 32;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 33;
  }
  else if (this.conditionScanRoundTiles([null,1,1,0,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 34;
  }
  else if (this.conditionScanRoundTiles([null,1,null,0,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 35;
  }
  else if (this.conditionScanRoundTiles([1,1,null,1,null,0,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 36;
  }
  else if (this.conditionScanRoundTiles([0,1,null,1,null,0,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 37;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,0,1,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 38;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,0,0,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 39;
  }
  else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,1,1],x,y,tile_id,layer)){
    center_inner_target_id = 40;
  }
  else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,1,0],x,y,tile_id,layer)){
    center_inner_target_id = 41;
  }
  else if (this.conditionScanRoundTiles([null,1,null,0,null,0,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 42;
  }
  else if (this.conditionScanRoundTiles([null,0,null,0,null,1,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 43;
  }
  else if (this.conditionScanRoundTiles([null,0,null,0,null,0,null,1,null],x,y,tile_id,layer)){
    center_inner_target_id = 44;
  }
  else if (this.conditionScanRoundTiles([null,0,null,1,null,0,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 45;
  }
  else if (this.conditionScanRoundTiles([null,0,null,0,null,0,null,0,null],x,y,tile_id,layer)){
    center_inner_target_id = 46;
  }
  return center_inner_target_id;
}

// 逻辑刷新某个位置图块(包含特殊)
Scene_Map.prototype.logicUpdateTileByCurrentPosA1 = function(x,y,options=null){

  // 超过边界则返回
  if (this.checkTileIsPadding(x,y)) {
    return;
  }

  let tile_id;
  let is_special_tile;
  let is_auto_tile;

  if (options){
    tile_id = options.tile_id;
    is_special_tile = options.is_special_tile;
    is_auto_tile = options.is_auto_tile;
    if (is_special_tile){
      this.updateDataTileByCurrentPosA1(x, y,A1_START_TILE_ID,is_auto_tile,0);
      this.updateDataTileByCurrentPosA1(x, y,tile_id,is_auto_tile,1);
    } else {
      this.updateDataTileByCurrentPosA1(x, y,tile_id,is_auto_tile,0);
    }
  } else {

    // 如果不存在 option, 根据 x,y 找到 0 和 1 层的 tile_id, 自我更新
    tile_id_layer_0 = this.getTileIdByPos(x,y,0);
    tile_id_layer_1 = this.getTileIdByPos(x,y,1);

    if (tile_id_layer_0 && tile_id_layer_0 !== 0){
      const start_tile_id = tile_id_layer_0 - (tile_id_layer_0 - A1_START_TILE_ID) % 48;
      is_special_tile = this.checkIsSpecialTileByTileId(start_tile_id);
      is_auto_tile = this.checkIsAutoTileByTileId(start_tile_id);
      if (is_special_tile){
        this.updateDataTileByCurrentPosA1(x, y,A1_START_TILE_ID,is_auto_tile,0);
        this.updateDataTileByCurrentPosA1(x, y,start_tile_id,is_auto_tile,1);
      } else {
        this.updateDataTileByCurrentPosA1(x, y,start_tile_id,is_auto_tile,0);
      }
    }
    if (tile_id_layer_1 && tile_id_layer_1 !== 0){
      const start_tile_id = tile_id_layer_1 - (tile_id_layer_1 - A1_START_TILE_ID) % 48;
      is_special_tile = this.checkIsSpecialTileByTileId(start_tile_id);
      is_auto_tile = this.checkIsAutoTileByTileId(start_tile_id);
      if (is_special_tile){
        this.updateDataTileByCurrentPosA1(x, y,A1_START_TILE_ID,is_auto_tile,0);
        this.updateDataTileByCurrentPosA1(x, y,start_tile_id,is_auto_tile,1);
      } else {
        this.updateDataTileByCurrentPosA1(x, y,start_tile_id,is_auto_tile,0);
      }
    }
  }
}

// 刷新当前图块以及周边图块
Scene_Map.prototype.refreshCurrentTileAndTheRound = function(x,y){
  if (this.checkTileIsPadding(x,y)) {
    return;
  }
  const selected_tile_id = App.props.tool_tileset.tool_tileset.selected_tile_id;
  if (selected_tile_id){

    const split_arr = selected_tile_id.split("|");
    const tile_type = split_arr[0];
    if (tile_type === 'A1'){

      // 从获取参数中 tile_x, tile_y 计算出 tile_index 和 实际tile_id
      const tile_x = parseInt(split_arr[3]);
      const tile_y = parseInt(split_arr[2]);
      const start_tile_index = (tile_x + tile_y * 8);
      const start_tile_id = A1_START_TILE_ID;
      const tile_id = start_tile_id + start_tile_index * 48;

      // A1 有特殊情况非自动元件的情况
      const is_auto_tile = AUTO_A1_TILE_INDEX.includes(start_tile_index);
      const is_special_tile = SPECIAL_A1_TILE_ID.includes(start_tile_index);

      // stap1 清空当前坐标的 tile (第一, 第二层)
      this.clearTileLayerByPos(x,y,0);
      this.clearTileLayerByPos(x,y,1);

      // step2 根据周围8格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
      const options = {
        tile_id: tile_id,
        is_special_tile: is_special_tile,
        is_auto_tile: is_auto_tile
      };
      this.logicUpdateTileByCurrentPosA1(x,y,options);

      // step3 更新周围8格的 tile (第一, 第二层)
      // 如果当前不是 自动元件, 周围是自动元件, 则不更新周围
      if (!this.checkIsAutoTileByPos(x,y,0)){
        if (this.checkIsAutoTileByPos(x-1, y, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x-1, y-1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x, y-1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x+1, y-1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x+1, y, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x+1, y+1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x, y+1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
        if (this.checkIsAutoTileByPos(x-1, y+1, 0)){
          SceneManager._scene._spriteset._tilemap.refresh();
          return;
        }
      }

      this.logicUpdateTileByCurrentPosA1(x-1, y);
      this.logicUpdateTileByCurrentPosA1(x-1, y-1);
      this.logicUpdateTileByCurrentPosA1(x, y-1);
      this.logicUpdateTileByCurrentPosA1(x+1, y-1);
      this.logicUpdateTileByCurrentPosA1(x+1, y);
      this.logicUpdateTileByCurrentPosA1(x+1, y+1);
      this.logicUpdateTileByCurrentPosA1(x, y+1);
      this.logicUpdateTileByCurrentPosA1(x-1, y+1);
      
    }

    SceneManager._scene._spriteset._tilemap.refresh();
  }
};

Scene_Map.prototype.clearTileLayerByPos = function(x,y,layer){
  const target_index = x + y * $gameMap.width();
  const clear_target_id = $dataMap.data[target_index + layer * $gameMap.gridCount()];
  if (clear_target_id !== 0){
    $dataMap.data[target_index + layer * $gameMap.gridCount()] = 0;
  }
};

// 设置光标位置tile到地图 -> 在 x,y,layer 上绘制 tile_id
// 检测周边是否同类tile, 在 start_tile_id 上加上 内部 inner_tile_id 来绘制
Scene_Map.prototype.updateDataTileByCurrentPosA1 = function(x,y,start_tile_id,is_auto_tile,layer){
  if (!start_tile_id || start_tile_id === 0) return;

  // 最终需要绘制的 tile_id;
  let tile_id = start_tile_id;

  // 自动图块绘制
  if (is_auto_tile){

    // 根据周围8各自计算出 需要增加的 inner_tile_id
    let inner_tile_id = this.checkAroundAutoA1TileAndSetCurrentTileId(x,y,tile_id,layer);
    tile_id += inner_tile_id

  } else {

    // 普通A1图块(非Auto)根据左右情况计算出 需要增加的 inner_tile_id
    // 非自动图块绘制则根据 index 的规则 -> (左中中中...中中中右) (+1,0,0,0,+2), 单个独立这 +3
    const inner_tile_id = this.checkNormalA1TileAndSetCurrentTileId(x,y,tile_id,layer);
    tile_id += inner_tile_id
  }

  const map_width = $gameMap.width();
  const pos_index = x + y * map_width;

  $dataMap.data[pos_index + layer * $gameMap.gridCount()] = tile_id;
}

Scene_Map.current_drag_event = null;
Scene_Map.prototype.processMapTouch = function() {

  // 拖动中
  if (TouchInput.isTriggered() || this._touchCount > 0) {
    if (TouchInput.isPressed()) {
      if (this._touchCount === 0 || this._touchCount >= 15) {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        if (SceneManager.isRunMode()){
          $gameTemp.setDestination(x, y);
        } else {

          var toolbar = App.props.Header.toolbar;

          if (toolbar.current_mode === "event"){
            if (Scene_Map.current_drag_event) {
              if (!$gameMap.existEvent(x,y)){
                if (x >= 0 && y >= 0)
                  Scene_Map.current_drag_event.locate(x,y);
              }
            }
          }

          // 拖动绘制地图
          if (toolbar.current_mode === "map"){
            this.onDrawTileTouchMove(x,y);
          }
        }
      }
      this._touchCount++;
    } else {
      this._touchCount = 0;
    }
  }

  // 拖动开始
  if (TouchInput.isTriggered()) {
    var x = $gameMap.canvasToMapX(TouchInput.x);
    var y = $gameMap.canvasToMapY(TouchInput.y);
    if (App.props.Header.toolbar.current_mode === "event"){
      $gameTemp.setDestination(x, y);

      // 更新 state
      App.props.Editor.dispatch({
        type: "project/changeCurrentMapPos",
        pos: [x,y]
      });

      Scene_Map.current_drag_event = $gameMap.findEvent(x,y) || null;
    }

    // 开始绘制地图
    if (App.props.Header.toolbar.current_mode === "map"){
      this.onDrawTileTouchStart(x,y);
    }
  }

  // 松开 - 拖动事件
  if (TouchInput.isReleased()){

    var x = $gameMap.canvasToMapX(TouchInput.x);
    var y = $gameMap.canvasToMapY(TouchInput.y);

    if (App.props.Header.toolbar.current_mode === "event"){
      if (x >= 0 && y >= 0) {
        if (Scene_Map.current_drag_event && !$gameMap.existEventExcept(Scene_Map.current_drag_event,x,y)) {
          Scene_Map.current_drag_event.locate(x,y);
          Scene_Map.current_drag_event = null;
        }
        $gameTemp.setDestination(x, y);
      }
    }
    if (App.props.Header.toolbar.current_mode === "map"){
      this.onDrawTileTouchEnd(x,y);
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
