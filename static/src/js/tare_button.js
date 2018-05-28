odoo.define('pos.tare.button', function (require) {
    "use strict";

    var BaseWidget = require('point_of_sale.BaseWidget');
    var screens = require('point_of_sale.screens');
    var field_utils = require('web.field_utils');
    var utils = require('web.utils');
    var round_pr = utils.round_precision;

    var TareButton = BaseWidget.extend({
        template: 'TareButton',
        init:function(parent,options){
            this._super(parent);
            this.label = "";
            this.scaleScreen = parent;
        },
        renderElement: function(){
            var self = this;
            this._super();
            this.$el.click(function(){
                self.click_tare();
            });
        },
        click_tare: function(){
            var self  = this;
            var tare  = this.scaleScreen.get_tare();
            var value = tare;

            this.gui.show_popup('number',{
                'title': 'Set Tare',
                'value': value,
                'confirm': function(value) {
                    self.set_label(field_utils.parse.float(value));
                    self.scaleScreen.set_tare(field_utils.parse.float(value));
                },
            });
        },
        set_label: function(value){
            if (!value) {
              this.label = "";
              return this.renderElement();
            }

            var product = this.scaleScreen.get_product();
            var defaultstr = (value || 0).toFixed(3) + ' Kg';
            if(!product || !this.pos){
                return defaultstr;
            }
            var unit_id = product.uom_id;
            if(!unit_id){
                return defaultstr;
            }
            var unit = this.pos.units_by_id[unit_id[0]];
            var weight = round_pr(value || 0, unit.rounding);
            var weightstr = weight.toFixed(Math.ceil(Math.log(1.0/unit.rounding) / Math.log(10) ));
            weightstr += ' ' + unit.name;
            this.label = 'Tare: ' + weightstr;
            this.renderElement();
        },
    });

    // Add the credit button to the payment screen
    screens.ScaleScreenWidget.include({
        renderElement: function(){
          this._super();
          this.tare_button = new TareButton(this,{});
          this.tare_button.insertBefore(this.$('.centered-content .js-weight'));
        },
        show: function(){
            this.tare = 0;
            this._super();
        },
        set_weight: function(weight){
            this.weight = weight - this.tare;
            this.$('.weight').text(this.get_product_weight_string());
            this.$('.computed-price').text(this.get_computed_price_string());
        },
        get_tare: function(){
            return this.tare;
        },
        set_tare: function(tare){
            this.tare = tare;
        },
    });
});
