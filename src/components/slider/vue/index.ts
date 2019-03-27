const MDCSliderPlugin = {
    install(Vue) {
        Vue.registerElement('MDCSlider', () => require('../slider').Slider, {
            model: {
                prop: 'value',
                event: 'valueChange'
            }
        });
    }
};

export default MDCSliderPlugin;
