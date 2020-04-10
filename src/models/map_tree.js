const _ = require('lodash');

const getCurrentMapOrderedTree = () => {
  const map_tree = App.game_data.map_infos.filter((obj) => { return obj !== null});
  const order_map_tree = map_tree.sort((a,b)=>{return b.order > a.order ? -1 : 1});
  return order_map_tree;
}

export default {
  namespace: "map_tree",
  state: {
    proj_name: App.config.app.default_proj_name,
    list: getCurrentMapOrderedTree()
  },
  reducers: {
    addMap: () => {
      return _.clone(state);
    },
    deleteMap: () => {
      return _.clone(state);
    },

  }
}