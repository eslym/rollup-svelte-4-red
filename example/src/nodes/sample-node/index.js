import { RS4R } from '@eslym/rs4r';

/**
 * @param {import('node-red').NodeAPI} RED
 */
export default function (RED) {
    function ConfigNode(config) {
        RED.nodes.createNode(this, config);
        const r = RS4R(this, RED);
        this.name = config.name;
        this.on('input', async (msg, send, done) => {
            try {
                // Use `RS4RNodeWrapper.evaluate` to evaluate the typed input.
                msg.payload = await r.evaluate(msg, config.typed);
                send(msg);
                done();
            } catch (e) {
                done(e);
            }
        });
    }

    RED.nodes.registerType(__NODE_NAME__, ConfigNode);
}
