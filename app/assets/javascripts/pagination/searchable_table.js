$.fn.searchableTable = function(opts){
  opts.selector = $(this).selector;
  var table = new SearchableTable(opts);
  $(this).data('ajaxTable',table);
}
var SearchableTable = AccessoryTable.extend({
  settings: {
    search_param: 'search',
    placeholder: 'Search'
  },

  search_html: '<form class="navbar-search" autocomplete="off">' +
               '<input id="search-box" type="text" class="search-query" placeholder="{{placeholder}}">' +
               '</form>',

  init: function(opts){
    this._super(opts);
    this.wrapper.prepend(Mustache.to_html(this.search_html,this.settings));
    this.search_box = this.wrapper.find('#search-box');
    var ajaxTable =this;
    this.search_box.bind('input',function(){
      ajaxTable.refresh(false);
    });
  },

  url: function(page, per_page){
    var baseUrl = this._super(page,per_page);
    return baseUrl + "&" + this.settings.search_param + "=" + this.search_box.val();
  }
});
