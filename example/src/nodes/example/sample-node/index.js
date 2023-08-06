/**
 * @param {import('node-red').NodeAPI} RED
 */
export default function (RED) {
    function ConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
    }

    // __NODE_NAME__ is 'example.sample-node' in this case
    RED.nodes.registerType(__NODE_NAME__, ConfigNode);
}
