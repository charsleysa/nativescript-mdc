const MDCActivityIndicatorPlugin = {
    install(Vue) {
        Vue.registerElement('MDCActivityIndicator', () => require('../activityindicator').ActivityIndicator, {});
    }
};

export default MDCActivityIndicatorPlugin;
