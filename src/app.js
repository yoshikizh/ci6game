// 初始化配置
function initializeConfig(){

  // 初始化 app 配置

  // 初始化 多语言 配置

}

// 初始化游戏数据
function initializeGameData(){

  // 角色数据

  // 敌人数据

  // 地图数据

  // ...
}

// 初始化管理器(单例管理器)
function initializeManagement(){

  // 初始化 Cache 管理器

  // 初始化 主题 管理器

  // 初始化 Api 管理器

}

// 初始化 React 组件
function initializeReactComponent(){

  // 初始化 index 组件 (内部加载其他组件)

}

// 入口函数
function main(){
  initializeConfig();
  initializeGameData();
  initializeManagement();
  initializeReactComponent();
}

window.addEventListener('load', function () {
  main();
});