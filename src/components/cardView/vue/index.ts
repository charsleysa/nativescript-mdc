const MDCCardViewPlugin = {
    install(Vue) {
        Vue.registerElement('MDCCardView', () => require('../cardView').CardView, {});
    }
};

export default MDCCardViewPlugin;
