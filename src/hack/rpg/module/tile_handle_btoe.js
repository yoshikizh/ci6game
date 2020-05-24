import TileHandle from "./tile_handle";

class TileHandleBToE extends TileHandle {

  static START_TILE_ID_HASH = {
    'B': Tilemap.TILE_ID_B,
    'C': Tilemap.TILE_ID_C,
    'D': Tilemap.TILE_ID_D,
    'E': Tilemap.TILE_ID_E
  }

  constructor(x,y,config_str){
    super(x,y);
    const config_arr = config_str.split("|");
    this.tile_type = config_arr[0];
    this.tile_index = parseInt(config_arr[2]);
    this.start_tile_id = TileHandleBToE.START_TILE_ID_HASH[this.tile_type];
    this.tile_id = this.start_tile_id + this.tile_index;
  };


  static createTileHandleBToE(x,y,tile_id,tile_type){
    const tile_index = tile_id;
    const config_str = `${tile_type}||${tile_index}`;
    const tile_handle = new TileHandleBToE(x,y,config_str);
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
    // this.clearTileLayerByPos(x,y,0);

    // step2 根据周围4格情况绘制当前坐标x,y的 tile (中心点强迫绘制)
    this.drawCurrentPosTile();

    // step3 绘制周围8格
    this.drawAround8(x,y);

  }

  drawTileByPos(x,y,tile_id,layer){
    this.drawTileCore(x, y, tile_id, layer);
  }

  // 绘制当前位置的 tile
  drawCurrentPosTile(){
    // 超过边界则返回
    if (this.checkTileIsPadding(this.x,this.y)) {
      return;
    }
    this.drawTileCore(this.x, this.y, this.tile_id, 2);
  }

	// 设置光标位置tile到地图 -> 在 x,y,layer 上绘制 tile_id
  // 检测周边是否同类tile, 在 start_tile_id 上加上 内部 inner_tile_id 来绘制
  drawTileCore(x,y,start_tile_id,layer){

    // if (!start_tile_id || start_tile_id === 0) return;

    // 最终需要绘制的 tile_id;
    const tile_id = start_tile_id;

    const map_width = $gameMap.width();
    const pos_index = x + y * map_width;
    $dataMap.data[pos_index + layer * $gameMap.gridCount()] = tile_id;
  }
}


export default TileHandleBToE;