const withTM = require('next-transpile-modules');

module.exports = withTM(['@material-ui/core', '@material-ui/icons'])({
  transpileModules: ['@material-ui/core', '@material-ui/icons'],
});

module.exports = {
  reactStrictMode: true,
};
