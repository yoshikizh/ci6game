const Ut = function(){};

Ut.rangeToArray = function(num1, num2){
  const sorted_range = [num1,num2].sort(function(a,b){return a-b});
  let array = [];
  for(var i = sorted_range[0]; i <= sorted_range[1]; i++){
    array.push(i);
  }
  return array;
}

Ut.rectToArray = function(x1,y1,x2,y2){
  const x_array = Ut.rangeToArray(x1,x2);
  const y_array = Ut.rangeToArray(y1,y2);
  let array = [];
  x_array.forEach(function(_x){
    y_array.forEach(function(_y){
      array.push(`${_x}_${_y}`);
    });
  });
  return array;
}

window.Ut = Ut;