const MDCFloatingActionButtonPlugin = {
    install(Vue) {
        Vue.registerElement('MDCFloatingActionButton', () => require('../floatingactionbutton').FloatingActionButton, {});
    }
};

export default MDCFloatingActionButtonPlugin;
