odoo.define('pos_tare_scales.ClientScreenButton', function (require) {
    'use strict';

    const ClientScreenButton = require('point_of_sale.ClientScreenButton');
    const Registries = require('point_of_sale.Registries');

    const PosTareClientScreenButton = (ClientScreenButton) =>
        class extends ClientScreenButton {
            /**
             * Copied from point_of_sale.ClientScreenButton to fix a crash
             * when the status loop rejects with an undefined error: the
             * original checks `error.abort` without guarding against
             * `error` being undefined.
             */
            _start() {
                if (this.local) {
                    return;
                }

                const self = this;
                async function loop() {
                    if (self.env.pos.proxy.posbox_supports_display) {
                        try {
                            let ownership = await self.env.pos.proxy.test_ownership_of_client_screen();
                            if (typeof ownership === 'string') {
                                ownership = JSON.parse(ownership);
                            }
                            if (ownership.status === 'OWNER') {
                                self.state.status = 'success';
                            } else {
                                self.state.status = 'warning';
                            }
                            setTimeout(loop, 3000);
                        } catch (error) {
                            if (error && error.abort) {
                                // Stop the loop
                                return;
                            }
                            if (typeof error == 'undefined') {
                                self.state.status = 'failure';
                            } else {
                                self.state.status = 'not_found';
                                self.env.pos.proxy.posbox_supports_display = false;
                            }
                            setTimeout(loop, 3000);
                        }
                    }
                }
                loop();
            }
        };

    Registries.Component.extend(ClientScreenButton, PosTareClientScreenButton);

    return ClientScreenButton;
});
