var _ = require('lodash');

export default {
  namespace: "project",
  state: {
    user_name: "Guest",
    proj_name: App.game_data.system.gameTitle,
    current_map_id: App.game_data.map_infos[1].id
  },

  effects: {
    * changeMap ({ params }, { call, put, select }) {
      const map_id = params.map_id;
      const current_map_id = yield select(state => state.project.current_map_id);
      if (map_id === current_map_id) return;
      yield put({ type: 'setCurrentMapId', map_id: map_id });
      yield put({ type: 'tool_tileset/setCurrentTilesetNames', map_id: map_id });
      SceneManager.gameStart("map_editor","rmmv-map-editor",map_id);
    }
  },


  reducers: {
    setCurrentMapId: (state,map_id) => {
      state.current_map_id = map_id;
      return _.clone(state);
    }

  }
}