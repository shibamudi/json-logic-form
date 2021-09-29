/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

function extendConf(conf) {
  // register our boot file
  conf.boot.push('~quasar-app-extension-json-logic-form/src/boot/register.js');

  // make sure app extension files & ui package gets transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-json-logic-form[\\/]src/);

  conf.framework.plugins.push('Dialog');
}

module.exports = ({ compatibleWith, extendQuasarConf }) => {
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  compatibleWith('quasar', '^2.0.0');
  compatibleWith('@quasar/app', '^3.0.0');

  // Uncomment the line below if you provide a JSON API for your component
  // api.registerDescribeApi(
  //   'JsonLogicForm',
  //   '~quasar-ui-json-logic-form/src/components/JsonLogicForm.json'
  // )

  // We extend /quasar.conf.js
  extendQuasarConf(extendConf);
};