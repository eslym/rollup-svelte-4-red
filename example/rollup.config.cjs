const rs4r = require('@eslym/rs4r');

module.exports = rs4r({
    packageJsonOverride: {
        name: '@eslym/rs4r-example',
        scripts: {},
        devDependencies: {}
    },
    sourceMap: true
});
