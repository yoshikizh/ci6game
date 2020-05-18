import TileHandle from "./tile_handle";

class TileHandleA3 extends TileHandle {

  constructor(x,y,config_str){
    super(x,y);
    const config_arr = config_str.split("|");
    this.tile_index = parseInt(config_arr[2]);
    this.start_tile_id = Tilemap.TILE_ID_A3;
    this.tile_id = this.start_tile_id + this.tile_index * 48;

    // this.is_current_tile_layer0 = TileHandleA2.LAYER0_TILE_IDS.includes(this.tile_index);
    // this.is_current_tile_layer1 = TileHandleA2.LAYER1_TILE_IDS.includes(this.tile_index);
    // this.is_current_layer1and2 = TileHandleA2.LAYER0AND1_TILE_IDS.includes(this.tile_index);

  };


  static createTileHandleA3(x,y,tile_id){
    const tile_index = parseInt(tile_id - Tilemap.TILE_ID_A3) / 48;
    const config_str = `||${tile_index}`;
    const tile_handle = new TileHandleA3(x,y,config_str);
    return tile_handle;
  }

  refresh(){
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    this.refreshCore();
    SceneManager._scene._spriteset._tilemap.refresh();
  };


  refreshCore(){
    const x = this.x;
    const y = this.y;

    // stap1 清空当前坐标的 tile
    this.clearTileLayerByPos(x,y,0);

    // step2 根据周围4格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
    this.drawCurrentPosTile();

    // step3 绘制周围8格
    this.drawAround8(x,y);

  }

  drawTileByPosA3(x,y,tile_id,layer){
    const start_tile_id = tile_id - (tile_id - this.start_tile_id) % 48;
    const tile_index = this.getTileIndexByTilePos(x,y,layer);

    this.drawTileCore(x, y, start_tile_id, layer);

    // if (layer === 0){
    //   if (this.isLayer0(tile_index)){
    //     this.drawTileCore(x, y, start_tile_id, layer);
    //   }
    // }
    // if (layer === 1){
    //   if (this.isLayer1(tile_index) || this.isLayer0And1(tile_index)){
    //     this.drawTileCore(x, y, start_tile_id, layer);
    //   }
    // }
  }

  // 绘制当前位置的 tile
  drawCurrentPosTile(){
    // 超过边界则返回
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    this.drawTileCore(this.x, this.y, this.tile_id, 0);
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



  // [自动图块使用] 根据周边tile_id状况来获取中心tile的内部tile_id
  getCenterAutoTileIdByAround(x,y,tile_id,layer){

    let center_inner_target_id;

    if (this.conditionScanRoundAutoTiles([null,1,null,1,null,1,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 0;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,1,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 1;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,1,null,1,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 2;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,1,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 3;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,1,null,0,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 4;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,0,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 5;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,1,null,0,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 6;
    }
    else if (this.conditionScanRoundAutoTiles([null,1,null,0,null,0,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 7;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 8;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,1,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 9;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,1,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 10;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,1,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 11;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,0,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 12;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,0,null,1,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 13;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,1,null,0,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 14;
    }
    else if (this.conditionScanRoundAutoTiles([null,0,null,0,null,0,null,0,null],x,y,tile_id,layer,false)){
      center_inner_target_id = 15;
    }

    // Todo
    // 65(两边有)  64(右边有)  61(左边有)  60(两边无)

    return center_inner_target_id;
  }
}


export default TileHandleA3;