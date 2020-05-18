import TileHandle from "./tile_handle";

class TileHandleA2 extends TileHandle {

  static LAYER0_TILE_IDS = [0,2,8,10,16,18,24,26];
  static LAYER1_TILE_IDS = [4,5,6,7,12,13,14,15,20,21,22,23,28,29,30,31];
  static LAYER0AND1_TILE_IDS = [1,3,9,11,17,19,25,27];

  constructor(x,y,config_str){
    super(x,y);
    const config_arr = config_str.split("|");
    this.tile_index = parseInt(config_arr[2]);
    this.start_tile_id = Tilemap.TILE_ID_A2;
    this.tile_id = this.start_tile_id + this.tile_index * 48;

    this.is_current_tile_layer0 = TileHandleA2.LAYER0_TILE_IDS.includes(this.tile_index);
    this.is_current_tile_layer1 = TileHandleA2.LAYER1_TILE_IDS.includes(this.tile_index);
    this.is_current_layer1and2 = TileHandleA2.LAYER0AND1_TILE_IDS.includes(this.tile_index);

  };

  static createTileHandleA2(x,y,tile_id){
    const tile_index = parseInt(tile_id - Tilemap.TILE_ID_A2) / 48;
    const config_str = `||${tile_index}`;
    const tile_handle = new TileHandleA2(x,y,config_str);
    return tile_handle;
  }

  refresh(){
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    this.refreshCore();
    SceneManager._scene._spriteset._tilemap.refresh();
  };

  isLayer0(tile_index){
    return TileHandleA2.LAYER0_TILE_IDS.includes(tile_index);
  }

  isLayer1(tile_index){
    return TileHandleA2.LAYER1_TILE_IDS.includes(tile_index);
  }

  isLayer0And1(tile_index){
    return TileHandleA2.LAYER0AND1_TILE_IDS.includes(tile_index);
  }

  refreshCore(){
    const x = this.x;
    const y = this.y;

    // stap1 清空当前坐标的 tile (第一, 第二层), 需判断当前绘制是第一层,还是第二层
    if (this.is_current_tile_layer0){
      this.clearTileLayerByPos(x,y,0);
    }
    if (this.is_current_tile_layer1){
      this.clearTileLayerByPos(x,y,1);
    }
    if (this.is_current_layer1and2){
      this.clearTileLayerByPos(x,y,0);
      this.clearTileLayerByPos(x,y,1);
    }

    // step2 根据周围8格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
    this.drawCurrentPosTile();

    // step3 绘制周围8格
    this.drawAround8(x,y);

  }

  drawTileByPosA2(x,y,tile_id,layer){
    const start_tile_id = tile_id - (tile_id - this.start_tile_id) % 48;
    const tile_index = this.getTileIndexByTilePos(x,y,layer);

    if (layer === 0){
      if (this.isLayer0(tile_index)){
        this.drawTileCore(x, y, start_tile_id, layer);
      }
    }
    if (layer === 1){
      if (this.isLayer1(tile_index) || this.isLayer0And1(tile_index)){
        this.drawTileCore(x, y, start_tile_id, layer);
      }
    }
  }

  // 绘制当前位置的 tile
  drawCurrentPosTile(){
    // 超过边界则返回
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    if (this.is_current_tile_layer0){
      this.drawTileCore(this.x, this.y, this.tile_id, 0);
    }
    if (this.is_current_tile_layer1){
      this.drawTileCore(this.x, this.y, this.tile_id, 1);
    }
    if (this.is_current_layer1and2){
      const prev_tile_id = this.start_tile_id + (this.tile_index - 1) * 48;
      this.drawTileCore(this.x, this.y, prev_tile_id, 0);
      this.drawTileCore(this.x, this.y, this.tile_id, 1);
    }
  }


  // 设置光标位置tile到地图 -> 在 x,y,layer 上绘制 tile_id
  // 检测周边是否同类tile, 在 start_tile_id 上加上 内部 inner_tile_id 来绘制
  drawTileCore(x,y,start_tile_id,layer){

    if (!start_tile_id || start_tile_id === 0) return;

    // 最终需要绘制的 tile_id;
    let tile_id = start_tile_id;

    // 根据周围8各自计算出 需要增加的 inner_tile_id
    let inner_tile_id = this.getCenterAutoTileIdByAround(x,y,tile_id,layer);
    tile_id += inner_tile_id

    const map_width = $gameMap.width();
    const pos_index = x + y * map_width;
    $dataMap.data[pos_index + layer * $gameMap.gridCount()] = tile_id;
  }
}

export default TileHandleA2;