var AccessoryTable = AjaxTable.extend({
  settings: {
    left_accessory: null,
    right_accessory: null,
  },

  left_template: "<div class='left-accessory pull-left {{#hidden}}hidden{{/hidden}}'><i class='icon-{{icon}}'></i></div>{{oldHTML}}",
  right_template: "{{oldHTML}}<div class='right-accessory pull-right {{#hidden}}hidden{{/hidden}}'><i class='icon-{{icon}}'></i></div>",

  init: function(opts){
    this._super(opts);
    if(isString(this.settings.left_accessory)){
      this.settings.left_accessory = {icon: this.settings.left_accessory}
    }
    if(isString(this.settings.right_accessory)){
      this.settings.right_accessory = {icon: this.settings.right_accessory}
    }
  },

  rowForData: function(obj){
    var row = this._super(obj);
    if(this.settings.left_accessory != null){
      var oldHTML = $(row).find("td:first").html();
      var data = $.extend({},this.settings.left_accessory,{oldHTML: oldHTML});
      $(row).find("td:first").html(Mustache.to_html(this.left_template,data));
    }
    if(this.settings.right_accessory != null){
      var oldHTML = $(row).find("td:last").html();
      var data = $.extend({},this.settings.right_accessory,{oldHTML: oldHTML});
      $(row).find("td:last").html(Mustache.to_html(this.right_template,data));
    }
    return row;
  },

  toggleLeftAccessory: function(){
    var isHidden = (this.settings.left_accessory.hidden == true);
    this.settings.left_accessory =  {icon: this.settings.left_accessory.icon, hidden: !isHidden};
    this.redraw();
  },

  toggleRightAccessory: function(){
    var isHidden = (this.settings.right_accessory.hidden == true);
    this.settings.right_accessory =  {icon: this.settings.right_accessory.icon, hidden: !isHidden};
    this.redraw();
  }
});
