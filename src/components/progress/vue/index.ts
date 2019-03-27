const MDCProgressPlugin = {
    install(Vue) {
        Vue.registerElement('MDCProgress', () => require('../progress').Progress, {});
    }
};

export default MDCProgressPlugin;
