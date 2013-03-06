function edit_distance(left,right,id_prop){
  return edit_distance_memo(left,right,id_prop);
}

function edit_distance_memo(left,right,id_prop){
  if(typeof(edit_distance.memory) == 'undefined') edit_distance.memory = {};
  var key = get_ed_key(left,id_prop) + '|' + get_ed_key(right,id_prop);
  if(!(key in edit_distance.memory)) edit_distance.memory[key] = edit_distance_r(left,right,id_prop);
  var res = edit_distance.memory[key];
  return {cost:res.cost, moves:res.moves.slice(0)};
}

function edit_distance_r(left,right,id_prop){
  var length_l = left.length; var length_r = right.length;
  var moves = [];
  if(length_l == 0){
    for(var i = 0; i < length_r; i++){
      moves.push({ action:'insert', obj:right[i]});
    }
    return { cost:length_r, moves: moves };
  }else if(length_r == 0){
    for(var i = 0; i < length_l; i++){
      moves.push({ action:'delete'});
    }
    return { cost:length_l, moves: moves };
  }
  //check 
  var rem_left = edit_distance_memo(left.slice(0,length_l-1),right,id_prop);
  rem_left.cost += 1;
  var rem_right = edit_distance_memo(left,right.slice(0,length_r-1),id_prop);
  rem_right.cost += 1;
  var rem_both = edit_distance_memo(left.slice(0,length_l-1),right.slice(0,length_r-1),id_prop);
  rem_both.cost += (left[length_l-1][id_prop] == right[length_r-1][id_prop]) ? 0 : 2;
  if(rem_left.cost <= rem_right.cost && rem_left.cost <= rem_both.cost){
    rem_left.moves.push({action:'delete'});
    return rem_left;
  }else if(rem_right.cost <= rem_both.cost){
    rem_left.moves.push({action:'delete'});
    rem_right.moves.push({action:'insert',obj:right[length_r-1]});
    return rem_right;
  }else if(left[length_l-1][id_prop] == right[length_r-1][id_prop]) {
    rem_both.moves.push({action:'skip'});
    return rem_both;
  }else{
    rem_both.moves.push({action: 'delete'});
    rem_both.moves.push({action: 'insert', obj: right[length_r-1]});
    return rem_both;
  }
}

function get_ed_key(list, id_prop){
  var ids = new Array(list.length);
  for(var i = 0; i < list.length; i++){
    ids[i] = list[i][id_prop];
  }
  return ids + "";
}
