$.fn.ajaxTable = function(opts){
  opts.selector = $(this).selector;
  var table = new AjaxTable(opts);
  $(this).data('ajaxTable',table);
}

$.fn.refreshTable = function(merge){
  $(this).data('ajaxTable').refresh(merge);
}

var AjaxTable = Class.extend({
  settings: {
    selector: null,
    url: null,
    columns: [],
    row_id: 'id',
    per_page: 10,
    row_click_fn: null,
    row_dbclick_fn: null,
  },

  init: function(opts){
    this.settings = $.extend({},this.settings,opts);
    this.wrapper = $(this.settings.selector);
    this.body = this.wrapper.find('tbody');
  },
 
  page: 1,

  refresh: function(merge){
    var url = this.url(this.page, this.settings.per_page);
    if(url){
      var ajaxTable = this;
      $.getJSON(url,function(data){
        ajaxTable.renderTable(data.results,merge);
        ajaxTable.updatePaginationLinks(data.pagination);
        ajaxTable.data = data.results;
        ajaxTable.pagination = data.pagination;
      });
    }else{
      this.body.html('');
      this.wrapper.find('.pagination').html('');
    }
  },

  renderTable: function(data,merge){
    if(typeof(merge) == 'undefined') merge = false;
    merge ? this.renderTableWithMerge(data) : this.renderTableWithReplace(data); 
  },

  renderTableWithReplace: function(data){
    var items = [];
    var ajaxTable = this;
    $.each(data, function(index,val) {
      items.push(ajaxTable.rowForData(val).outerHTML());
    });
    this.body.html(items.join(''));
    this.rebindRowEvents();
  },

  rowForData: function(obj){
    var row = $('<tr id="' + this.getRowId(obj) + '"></tr>');
    var ajaxTable = this;
    $.each(this.settings.columns, function(colIndex,col){
      var td = $('<td>').append(ajaxTable.getColumnText(col, obj));
      row.append(td);
    });
    return row;
  },

  renderTableWithMerge: function(data){
    var actions = edit_distance(this.data,data,this.settings.row_id).moves;
    var ajaxTable = this;
    var rows = this.body.children('tr');
    var rowIndex = 0;
    $.each(actions,function(index,action){
      if(action.action == 'delete'){
        $(rows[rowIndex]).removeRow('fast'); 
      }else if(action.action == 'insert'){
        var new_row = null;
        if(rowIndex < rows.length){
          new_row = $(rows[rowIndex]).insertRowBefore(ajaxTable.rowForData(actions[index].obj).outerHTML()); 
        }else{
          new_row = ajaxTable.wrapper.children('table').appendRow(ajaxTable.rowForData(actions[index].obj).outerHTML()); 
        }
        rowIndex--;
        ajaxTable.bindRowEvents(new_row);
      }
      rowIndex++;
    });
  },

  bindRowEvents: function(row){
    if(this.settings.row_dbclick_fn) row.dblclick(this.settings.row_dbclick_fn);
    if(this.settings.row_click_fn) row.click(this.settings.row_click_fn);
  },

  rebindRowEvents: function(){
    if(this.settings.row_dbclick_fn) this.body.children('tr').dblclick(this.settings.row_dbclick_fn);
    if(this.settings.row_click_fn) this.body.children('tr').click(this.settings.row_click_fn);
  },
  
  url: function(page, per_page){
    var baseURL = null;
    if($.isFunction(this.settings.url)){
      baseURL = this.settings.url.call();
    }else{
      baseURL = this.settings.url;
    }
    if(baseURL) baseURL += '&page=' + page + '&per_page=' + per_page;
    return baseURL;
  },

  getRowId: function(val){
    if($.isFunction(this.settings.row_id)){
      return this.settings.row_id.call(val);
    }else{
      return val[this.settings.row_id];
    }
  },

  getColumnText: function(col,val){
    if($.isFunction(col)){
      return col.call(null,val);
    }else{
      return val[col];
    }
  },

  updatePaginationLinks: function(pagination){
    this.wrapper.find('.pagination').replaceWith(this.paginationLinks(pagination));
  },

  paginationLinks:  function(paging){
    if(paging.total_pages <= 1) return $('<div class="pagination" />');
    var links = $('<div>').addClass('pagination pagination-centered');
    links.append('<ul>');
    $.each(this.createLinks(paging), function(index, val){
      links.children().append(val); 
    });
    return links;
  },

  createLinks: function (paging){
    var start = 0, stop = 0;
    var links = [];
    if(paging.page - 2 < 1){
      start = 1;
      stop = Math.min(5,paging.total_pages);
    }else if(paging.page + 2 > paging.total_pages){
      start = Math.max(1,paging.total_pages - 4);
      stop = paging.total_pages;
    }else{
      start = paging.page - 2;
      stop = paging.page + 2;
    }
    links.push(this.prevLink(paging));
    for(var i = start; i <= stop; i++){
      links.push(this.innerLink(paging, i));
    }
    links.push(this.nextLink(paging));
    return links;
  },
 
  innerLink: function (paging, number){
    var li = this.createLink(paging, number, number);
    if(number == paging.page) li.addClass('active');
    return li;
  },
  
  prevLink: function(paging){
    var li = this.createLink(paging, this.prevPage(paging), '«');
    if (paging.page == 1) li.addClass('disabled');
    return li;
  },

  nextLink: function (paging){
    var li = this.createLink(paging, this.nextPage(paging), '»');
    if (paging.page == paging.total_pages) li.addClass('disabled');
    return li;
  },

  createLink: function (paging, number, text){
    var li = $('<li>');
    var link = li.append('<a href="javascript:;">').children();
    link.html(text);
    var ajaxTable = this;
    link.click(function(e){ 
      ajaxTable.page = number;
      ajaxTable.refresh();
      return false;
    });
    return li;
  },

  prevPage: function (paging) {
    return Math.max(paging.page -1,1);
  },

  nextPage: function (paging) {
    return Math.min(paging.page +1, paging.total_pages);
  }
});
