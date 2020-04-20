import React,{ useState } from "react";
import { connect } from 'dva';
var _ = require('lodash');

const MapTree = (props) => {
  const getParentLevel = (map_id) => {
    let level = 0;
    let _id = map_id
    while (_id !== 0){
      const obj = App.game_data.map_infos[_id];
      _id = obj.parentId;
      level++;
    }
    return level;
  };

  const getParentMap = (map_id) => {
    const _map = App.game_data.map_infos(map_id);
    if (!_map) return null;
    return App.game_data.map_infos(_map.parentId);
  };

  const getMap = (map_id) => {
    const _map = App.game_data.map_infos[map_id];
    if (!_map) return null;
    return _map;
  }

  // 获取下一级子地图
  const getNextChildrenMaps = (parent_map_id) => {
    return props.map_tree.list.filter((obj) => {
      return obj.parentId === parent_map_id;
    });
  }

  // 获取所有子地图
  const getAllChildrenMaps = (parent_map_id) => {

    const _map = getMap(parent_map_id);
    let _index = _map.order - 1;
    let _parent_map_id = parent_map_id;

    
    let _children_maps = [];

    // 记录祖先节点
    let _parent_map_ids = [_parent_map_id];

    while(true){
      _index++;
      const _next_map = props.map_tree.list[_index]
      if (!_next_map){
        break;
      }

      if (_parent_map_ids.includes(_next_map.parentId)){
        _children_maps.push(_next_map);

        _parent_map_ids.push(_next_map.id);
      }
    }
    return _children_maps;
  }


  // 是否存在子地图
  const existChildrenMap = (parent_map) => {
    const parent_map_id = parent_map.id;
    let order = parent_map.order;
    const list = props.map_tree.list;
    let exist_child = false;
    while(true){
      const child = list[order];
      if (!child){
        break;
      }
      if (child.parentId === parent_map_id) {
        exist_child = true;
        break;
      }
      order++;
    }
    return exist_child;
  }

  const getDefaultExpansionState = () => {

    // expansion_state 为父节点 展开/收起状态
    // display_state 为子节点 隐藏/显示状态
    let hash = { expansion_state: {}, display_state: {} };

    const map_infos = App.game_data.map_infos;

    // 处于同个父级的子节点显示状态缓存
    let same_parent_children_display = {};

    props.map_tree.list.forEach((obj) => {

      const map_id = obj.id;

      // 确定是否为父节点来显示 (+,-)
      const is_parent = existChildrenMap(obj);
      if (is_parent) {
        hash.expansion_state[map_id] = obj.expanded;
      } else {
        hash.expansion_state[map_id] = null;
      }


      // 节点的隐藏 / 显示逻辑
      // 上一节点为 0 (此节点为第一层), 则显示
      if (obj.parentId === 0) {
        hash.display_state[map_id] = true;
      } else {        
        let parent_map = map_infos[obj.parentId];

        // 是否已经缓存父节点状态, 则直接设置, 不用继续查找
        const parent_map_display = same_parent_children_display[parent_map.id]
        if (parent_map_display != undefined || parent_map_display != null) {
          hash.display_state[map_id] = parent_map_display;
        }

        let _display = true;
        if (parent_map.expanded) {

          // 上一级节点为展开, 这继续往上查找, 如果有一级为收缩, 则此节点为隐藏, 只有所有父节点为展开, 此节点为显示
          while (parent_map.expanded) {
            parent_map = map_infos[parent_map.parentId];
            if (!parent_map){
              break;
            }
            if (!parent_map.expanded) {
              _display = false;
              break;
            }
          }
        } else {

          // 上一级节点为收缩, 则此节点为隐藏
          // hash.display_state[map_id] = false;
          if (parent_map.expanded === false){
            _display = false;
          }
        }

        hash.display_state[map_id] = _display;
        if (parent_map) {
          same_parent_children_display[parent_map.id] = _display;
        }
      }
    });
    return hash;
  }

  const getDefaultDisplayState = () => {
    let hash = {};
    props.map_tree.list.forEach((obj) => {
      if (obj.expanded) {
        hash[obj.id] = obj.expanded;
      }
    });
    return hash;
  }

  const onClickExpansion = (map_id) => {
    let _expansion_state = _.clone(expansion_state);
    let _display_state = _.clone(display_state);
    const new_value = !_expansion_state[map_id]

    // 先设置展开状态
    _expansion_state[map_id] = new_value;
    setExpansionState(_expansion_state);


    // 再设置子树显示/隐藏状态
    if (new_value){

      // 所有子节点,根据父级展开状态来显示或隐藏
      const children_maps = getAllChildrenMaps(map_id);
      children_maps.forEach((obj) => {
        if (obj.parentId === map_id) {
          _display_state[obj.id] = true;
        } else {
          _display_state[obj.id] = expansion_state[obj.parentId];
        }
      });
    } else {

      // 所有级子账号隐藏
      const children_maps = getAllChildrenMaps(map_id);
      children_maps.forEach((obj) => {
        _display_state[obj.id] = false;
      });

    }

    setDisplayState(_display_state);
  }

  const onClickToggleMap = (map_id) => {

    props.dispatch({
      type: 'project/changeMap',
      params: {map_id: map_id}
    });
  }

  const [expansion_state, setExpansionState] = useState(getDefaultExpansionState().expansion_state);
  const [display_state, setDisplayState] = useState(getDefaultExpansionState().display_state);

  return (
    <div id="container-tool-maptree-wrapper" className="area-border-color">
      <ul>
        <li key={`map_tree_li_first`} className="flex flex-row flex-col-center" id="map-tree-projname">
          <img src={require("../assets/images/toolbar/new.png").default} />
          { props.map_tree.proj_name }
        </li>
        { 
          props.map_tree.list.map((obj,index) => {
            const style = { 
              backgroundColor: index % 2 === 0 ? "#e4ecf1" : "#fff",
              display: display_state[obj.id] ? "flex" : "none"
            };
            const obj_id = obj.id;
            const level = getParentLevel(obj_id);
            const a_style = { marginLeft: level * 10 };
            return (
              <li key={`map_tree_li_${index}`} className="map-tree-line flex flex-row flex-col-center" style={style}>

                { 
                  expansion_state[obj.id] !== null ? 
                  (<a onClick={onClickExpansion.bind(this,obj.id)} style={a_style} className="map-tree-expansion">{expansion_state[obj.id] ? "-" : "+"}</a>) :
                  (<a style={a_style} className="map-tree-expansion-blank"></a>) 
                }

                <img src={require("../assets/images/mapfile.png").default} />
                <a onClick={onClickToggleMap.bind(this,obj.id)}>{obj.name}</a>
              </li>
            )
          })
        }
      </ul>

    </div>
  );
};

export default connect(({ map_tree }) => ({ map_tree }))(MapTree);