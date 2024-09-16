odoo.define('pos_tare_scales.BagButton', function (require) {
    "use strict";

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class BagButton extends PosComponent {
        async clickBag() {
            this.props.updateTare(0.01);
        }
    }

    BagButton.template = 'BagButton';

    Registries.Component.add(BagButton);

    return BagButton;
});
