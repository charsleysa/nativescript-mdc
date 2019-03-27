const MDCButtonPlugin = {
  install(Vue) {
      Vue.registerElement('MDCButton', () => require('../button').Button, {});
  }
};

export default MDCButtonPlugin;
