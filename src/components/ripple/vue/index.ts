const MDCRipplePlugin = {
    install(Vue) {
        Vue.registerElement('MDCRipple', () => require('../ripple').Ripple, {});
    }
};

export default MDCRipplePlugin;
