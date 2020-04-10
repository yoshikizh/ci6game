const _ = require('lodash');

const getCurrentMapTilesetNames = () => {
  const game_data = App.game_data;
  const map_info = game_data.map_infos[1];
  const map_id = map_info.id;
  const game_map = game_data.maps[map_id];

  const tileset_id = game_data.maps[map_id].tilesetId;
  const tileset = game_data.tilesets[tileset_id];
  const tileset_filenames = tileset.tilesetNames;

  return tileset_filenames;
}


export default {
  namespace: "tool_tileset",
  state: {
    current_tab: 'A',
    selected_tile_id: null,
    tileset_filenames: getCurrentMapTilesetNames()
  },
  reducers: {
    setTab: (state,params) => {
      state.current_tab = params.tab;
      return _.clone(state);
    },
    selectTile: (state, params) => {
      state.selected_tile_id = params.tile_id;
      return _.clone(state);
    }
  }
}