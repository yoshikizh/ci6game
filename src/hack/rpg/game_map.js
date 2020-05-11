
Game_Map.prototype.findEvent = function(x,y){
  return this.events().filter((e)=>{ return e.x === x && e.y === y})[0];
};

Game_Map.prototype.existEvent = function(x,y){
  return this.events().filter((e)=>{ return e.x === x && e.y === y}).length > 0;
};

Game_Map.prototype.existEventExcept = function(except_event,x,y){
  return this.events().filter((e)=>{ return e._eventId !== except_event._eventId && e.x === x && e.y === y}).length > 0;
};

Game_Map.prototype.gridCount = function(x,y){
  return this.width() * this.height();
};