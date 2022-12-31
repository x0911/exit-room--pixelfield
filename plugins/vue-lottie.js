import Vue from 'vue';
import lottie from 'lottie-web';
import LottieAnimation from '@/components/LottieAnimation.vue';

Vue.prototype.$lottie = lottie;
Vue.component('LottieAnimation', LottieAnimation);
