odoo.define('pos_tare_scales.TareButton', function (require) {
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useState } = owl.hooks;
    const { parse } = require('web.field_utils');
    const { round_precision } = require('web.utils');

    class TareButton extends PosComponent {
        constructor() {
            super(...arguments);
            this.state = useState({ label: '' });
        }
        async clickTare() {
            const { confirmed, payload: value } = await this.showPopup('NumberPopup', {
                startingValue: this.props.currentTare,
                title: 'Set Tare',
            });
            if (confirmed) {
              this.setLabel(parse.float(value));
              this.props.updateTare(parse.float(value));
            }
        }
        setLabel(value) {
            if (!value) {
              this.state.label = "";
              return this.render();
            }

            var defaultstr = (value || 0).toFixed(3) + ' Kg';
            if (!this.props.product || !this.env.pos) {
                return defaultstr;
            }
            const unit_id = this.props.product.uom_id;
            if(!unit_id){
                return defaultstr;
            }
            const unit = this.env.pos.units_by_id[unit_id[0]];
            const weight = round_precision(value || 0, unit.rounding);
            let weightstr = weight.toFixed(Math.ceil(Math.log(1.0 / unit.rounding) / Math.log(10)));
            weightstr += ' ' + unit.name;
            this.state.label = 'Tare: ' + weightstr;
            this.render();
        }
    }

    TareButton.template = 'TareButton';

    Registries.Component.add(TareButton);

    return TareButton;
});
