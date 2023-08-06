/**
 * @param {import('node-red').NodeAPI} RED
 */
export default function (RED) {
    function ConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
    }

    RED.nodes.registerType(__NODE_NAME__, ConfigNode, {
        credentials: {
            password: { type: 'password' }
        }
    });
}
