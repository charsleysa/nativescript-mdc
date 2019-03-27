const MDCTextFieldPlugin = {
    install(Vue) {
        Vue.registerElement('MDCTextField', () => require('../textfield').TextField, {
            model: {
                prop: 'text',
                event: 'textChange'
            }
        });
    }
};

export default MDCTextFieldPlugin;
