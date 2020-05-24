import TileHandle from "./tile_handle";

class TileHandleA1 extends TileHandle {

  static SPECIAL_A1_TILE_ID = [1,2,3];
  static AUTO_A1_TILE_INDEX = [0,1,2,3,4,6,8,10,12,14]; 

  constructor(x,y,config_str){
    super(x,y);
    const config_arr = config_str.split("|");
    this.tile_x = parseInt(config_arr[3]);
    this.tile_y = parseInt(config_arr[2]);
    this.tile_index = (this.tile_x + this.tile_y * 8);
    this.start_tile_id = Tilemap.TILE_ID_A1;
    this.tile_id = this.start_tile_id + this.tile_index * 48;

    // A1 私有属性
    this.is_auto_tile = TileHandleA1.AUTO_A1_TILE_INDEX.includes(this.tile_index);
    this.is_special_tile = TileHandleA1.SPECIAL_A1_TILE_ID.includes(this.tile_index);

    this.tile_id_extra = this.start_tile_id;
  }

  static createTileHandleA1(x,y,tile_id){
    const tile_index = parseInt((tile_id - Tilemap.TILE_ID_A2) / 48);
    const tile_x = tile_index % 8;
    const tile_y = tile_index / 8;
    const config_str = `||${tile_y}|${tile_x}`;
    const tile_handle = new TileHandleA1(x,y,config_str);
    return tile_handle;
  }

  refresh(){
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    this.refreshCore();
    SceneManager._scene._spriteset._tilemap.refresh();
  }


  // 通过 pos 检查当前位置是否为 auto_tile
  checkIsAutoTileByPos(x,y,layer){
    const tile_index = this.getTileIndexByTilePos(x,y,layer);
    return TileHandleA1.AUTO_A1_TILE_INDEX.includes(tile_index);
  };

  // 通过 tile_id 检测是否为自动图块
  checkIsAutoTileByTileId(tile_id){
    const tile_index = this.getTileIndexByTileId(tile_id);
    return TileHandleA1.AUTO_A1_TILE_INDEX.includes(tile_index);
  };

  // 通过 tile_id 检测是否为特殊图块
  checkIsSpecialTileByTileId(tile_id){
    const tile_index = this.getTileIndexByTileId(tile_id);
    const is_special_tile = TileHandleA1.SPECIAL_A1_TILE_ID.includes(tile_index);
    return is_special_tile;
  }

  // 通过 tile pos 检查是否 特殊自动元件
  checkIsSpecialTileByTilePos(tile_x,tile_y,layer){
    const start_tile_index = (tile_x + tile_y * 8);
    const tile_id = this.start_tile_id + start_tile_index * 48;
    const tile_index = this.getTileIndexByTileId(tile_id);
    const is_special_tile = TileHandleA1.SPECIAL_A1_TILE_ID.includes(tile_index);
    return is_special_tile;
  };

  refreshCore(){
    const x = this.x;
    const y = this.y;

    // stap1 清空当前坐标的 tile (第一, 第二层)
    this.clearTileLayerByPos(x,y,0);
    this.clearTileLayerByPos(x,y,1);

    // step2 根据周围8格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
    this.drawCurrentPosTile();

    // step3 更新周围8格的 tile (第一, 第二层)
    // 如果当前不是 自动元件, 周围是自动元件, 则不更新周围
    if (!this.checkIsAutoTileByPos(x,y,0)){
      if (this.checkIsAutoTileByPos(x-1, y, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x-1, y-1, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x, y-1, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x+1, y-1, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x+1, y, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x+1, y+1, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x, y+1, 0)){
        return;
      }
      if (this.checkIsAutoTileByPos(x-1, y+1, 0)){
        return;
      }
    }

    // 更新周围的8格
    this.drawAround8(x,y);
  }

  drawTileByPos(x,y,tile_id,layer){
    const start_tile_id = tile_id - (tile_id - this.start_tile_id) % 48;
    const is_special_tile = this.checkIsSpecialTileByTileId(start_tile_id);
    const is_auto_tile = this.checkIsAutoTileByTileId(start_tile_id);

    if (is_special_tile){
      this.drawTileCore(x, y,this.start_tile_id,is_auto_tile,0);
      this.drawTileCore(x, y,start_tile_id,is_auto_tile,1);
    } else {
      this.drawTileCore(x, y,start_tile_id,is_auto_tile,layer);
    }
  }

  // 绘制当前位置的 tile
  drawCurrentPosTile(){
    // 超过边界则返回
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    if (this.is_special_tile){
      this.drawTileCore(this.x, this.y, this.start_tile_id, this.is_auto_tile, 0);
      this.drawTileCore(this.x, this.y, this.tile_id, this.is_auto_tile, 1);
    } else {
      this.drawTileCore(this.x, this.y, this.tile_id, this.is_auto_tile, 0);
    }
  }


  // 设置光标位置tile到地图 -> 在 x,y,layer 上绘制 tile_id
  // 检测周边是否同类tile, 在 start_tile_id 上加上 内部 inner_tile_id 来绘制
  drawTileCore(x,y,start_tile_id,is_auto_tile,layer){
    if (!start_tile_id || start_tile_id === 0) return;

    // 最终需要绘制的 tile_id;
    let tile_id = start_tile_id;

    // 自动图块绘制
    if (is_auto_tile){

      // 根据周围8各自计算出 需要增加的 inner_tile_id
      let inner_tile_id = this.getCenterAutoTileIdByAround48(x,y,tile_id,layer);
      tile_id += inner_tile_id

    } else {

      // 普通A1图块(非Auto)根据左右情况计算出 需要增加的 inner_tile_id
      // 非自动图块绘制则根据 index 的规则 -> (左中中中...中中中右) (+1,0,0,0,+2), 单个独立这 +3
      const inner_tile_id = this.getTileidByLeftAndRight(x,y,tile_id,layer);
      tile_id += inner_tile_id
    }

    const map_width = $gameMap.width();
    const pos_index = x + y * map_width;

    $dataMap.data[pos_index + layer * $gameMap.gridCount()] = tile_id;
  }

  // 普通A1图块(非Auto)根据左右情况计算出 需要增加的 inner_tile_id
  getTileidByLeftAndRight(x,y,tile_id,layer){
    const current_target_index = y * $gameMap.width() + x;
    let inner_target_id;
    if ( 
      this.isCurrentTileByIndex(current_target_index - 1,tile_id,layer) &&
      this.isCurrentTileByIndex(current_target_index + 1,tile_id,layer))
    {
      inner_target_id = 0;
    } else if (
      !this.isCurrentTileByIndex(current_target_index - 1,tile_id,layer) &&
      !this.isCurrentTileByIndex(current_target_index + 1,tile_id,layer)) 
    {
      inner_target_id = 3;
    } else if (
      this.isCurrentTileByIndex(current_target_index - 1,tile_id,layer) &&
      !this.isCurrentTileByIndex(current_target_index + 1,tile_id,layer)) 
    {
      inner_target_id = 2;
    } else if (
      !this.isCurrentTileByIndex(current_target_index - 1,tile_id,layer) &&
      this.isCurrentTileByIndex(current_target_index + 1,tile_id,layer)) 
    {
      inner_target_id = 1;
    }
    return inner_target_id;
  }
}

export default TileHandleA1;
