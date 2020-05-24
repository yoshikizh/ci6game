import TileHandle from "./tile_handle";

class TileHandleA3 extends TileHandle {

  constructor(x,y,config_str){
    super(x,y);
    const config_arr = config_str.split("|");
    this.tile_index = parseInt(config_arr[2]);
    this.start_tile_id = Tilemap.TILE_ID_A3;
    this.tile_id = this.start_tile_id + this.tile_index * 48;
  };


  static createTileHandleA3(x,y,tile_id){
    const tile_index = parseInt((tile_id - Tilemap.TILE_ID_A3) / 48);
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
    this.clearTileLayerByPos(x,y,1);

    // step2 根据周围4格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
    this.drawCurrentPosTile();

    // step3 绘制周围8格
    this.drawAround8(x,y);

  }

  drawTileByPos(x,y,tile_id,layer){
    const start_tile_id = tile_id - (tile_id - this.start_tile_id) % 48;
    const tile_index = this.getTileIndexByTilePos(x,y,layer);

    this.drawTileCore(x, y, start_tile_id, layer);
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
    let inner_tile_id = this.getCenterAutoTileIdByAround16(x,y,tile_id,layer);
    tile_id += inner_tile_id

    const map_width = $gameMap.width();
    const pos_index = x + y * map_width;
    $dataMap.data[pos_index + layer * $gameMap.gridCount()] = tile_id;
  }
}


export default TileHandleA3;