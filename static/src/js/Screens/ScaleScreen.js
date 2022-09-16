odoo.define('pos_tare_scales.ScaleScreen', function(require) {
    "use strict";

    const ScaleScreen = require('point_of_sale.ScaleScreen');
    const Registries = require('point_of_sale.Registries');
    const { useState } = owl.hooks;

    const TareScaleScreen = ScaleScreen => class extends ScaleScreen {
        constructor() {
            super(...arguments);

            this.state = useState({
              ...this.state,
              tare: 0,
            });

            this.updateTare = this._updateTare.bind(this);
        }
        async _setWeight() {
            const reading = await this.env.pos.proxy.scale_read();
            this.state.weight = reading.weight - this.state.tare;
        }
        get currentTare() {
          return this.state.tare;
        }
        _updateTare(tare) {
          this.state.tare = tare;
        }
    };

    Registries.Component.extend(ScaleScreen, TareScaleScreen);

    return ScaleScreen;
});
