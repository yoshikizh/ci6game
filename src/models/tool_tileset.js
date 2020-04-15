const _ = require('lodash');

const getCurrentMapTilesetNames = (map_id) => {
  const game_data = App.game_data;


  // const map_info = game_data.map_infos[current_map_id];
  // const map_id = map_info.id;
  // const game_map = game_data.maps[map_id];

  const tileset_id = game_data.maps[map_id].tilesetId;
  const tileset = game_data.tilesets[tileset_id];
  const tileset_filenames = tileset.tilesetNames;

  return tileset_filenames;
}


export default {
  namespace: "tool_tileset",
  state: {
    current_map_id: App.game_data.map_infos[1].id,
    current_tab: 'A',
    selected_tile_id: null,
    tileset_filenames: getCurrentMapTilesetNames(App.game_data.map_infos[1].id)
  },
  reducers: {
    setCurrentTilesetNames: (state, params) => {
      state.tileset_filenames = getCurrentMapTilesetNames(params.map_id);
      return _.clone(state);
    },
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