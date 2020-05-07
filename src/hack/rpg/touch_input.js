TouchInput.initialize = function() {
  this.clear();
  if (SceneManager.isRunMode()){
    this._setupEventHandlers();
  } else {
    this._setupEventHandlers("container-map-area");
  }
};

TouchInput._setupEventHandlers = function(dom_id) {
  var isSupportPassive = Utils.isSupportPassiveEvent();

  var dom = document;
  if (dom_id){
    dom = document.getElementById(dom_id);
  }

  dom.addEventListener('mousedown', this._onMouseDown.bind(this));
  dom.addEventListener('mousemove', this._onMouseMove.bind(this));
  dom.addEventListener('mouseup', this._onMouseUp.bind(this));
  dom.addEventListener('wheel', this._onWheel.bind(this));
  dom.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {passive: false} : false);
  dom.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {passive: false} : false);
  dom.addEventListener('touchend', this._onTouchEnd.bind(this));
  dom.addEventListener('touchcancel', this._onTouchCancel.bind(this));
  dom.addEventListener('pointerdown', this._onPointerDown.bind(this));
};
