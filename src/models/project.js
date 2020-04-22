var _ = require('lodash');

export default {
  namespace: "project",
  state: {
    user_name: "Guest",
    proj_name: App.game_data.system.gameTitle,
    current_map_id: App.game_data.map_infos[1].id,
    current_map_cursor_pos: [0,0]
  },

  effects: {
    * changeMap ( params, { call, put, select }) {
      const map_id = params.map_id;
      const current_map_id = yield select(state => state.project.current_map_id);
      if (map_id === current_map_id) return;
      yield put({ type: 'setCurrentMapId', map_id: map_id });
      yield put({ type: 'tool_tileset/setCurrentTilesetNames', map_id: map_id });

      const map_info = App.game_data.map_infos[map_id];
      const data_map = App.game_data.maps[map_id];

      yield put({ type: 'status_bar/setMapInfo', info: {
        id: map_id,
        name: map_info.name,
        width: data_map.width,
        height: data_map.height
      }});

      SceneManager._runMapIdForEditor = map_id;
      $gamePlayer.reserveTransfer(map_id,0,0,2,1);
    },
    * changeCurrentMapPos (params, { call, put, select }) {
      yield put({ type: 'setCurrentMapCursorPos', pos: params.pos });
      yield put({ type: 'status_bar/setCurrentCursorPos', pos: params.pos });
    }
  },

  reducers: {
    setCurrentMapId: (state,params) => {
      state.current_map_id = params.map_id;
      return _.clone(state);
    },
    setCurrentMapCursorPos: (state, params) => {
      state.current_map_cursor_pos = params.pos;
      return _.clone(state);
    }

  }
}