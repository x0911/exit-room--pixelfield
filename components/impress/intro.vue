<template>
  <div class="px-4">
    <v-bottom-sheet
      v-model="model"
      persistent
      hide-overlay
      max-width="810"
      class="elevation-0"
      content-class="elevation-0"
      fullscreen
      no-click-animation
      :retain-focus="false"
    >
      <v-layout align-center justify-center align-content-center fill-height>
        <v-slide-y-reverse-transition group hide-on-leave>
          <div v-if="!hasLoaded" key="loader" class="splash-screen_loading">
            <lottie-animation
              loop
              :width="100"
              :height="100"
              :path="require('@/assets/animated/spinner.json')"
            ></lottie-animation>
          </div>
          <div v-else key="languages">
            <v-btn
              x-large
              color="primary"
              depressed
              class="py-8 px-10"
              data-video-start="game-intro-0"
              @click="playIntroVideo()"
            >
              {{ $t('start_game') }}
              <v-icon class="ms-3">
                mdi-keyboard-backspace mdi-rotate-180
              </v-icon>
            </v-btn>
          </div>
        </v-slide-y-reverse-transition>
      </v-layout>
    </v-bottom-sheet>
  </div>
</template>

<script>
import LottieAnimation from '@/components/LottieAnimation.vue';

import ImpressStep from '@/mixins/impress-step.js';
export default {
  name: 'IntroScreen',
  components: {
    LottieAnimation,
  },
  mixins: [ImpressStep],
  data() {
    return {
      stepId: 'intro',
      model: false,
      step: 0,
      locale: null,
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: {
          enabled: true,
          sticky: true,
        },
      },
      hasLoaded: false,
      langs: [
        {
          name: 'English',
          image: 'english',
          value: 'en',
        },
        {
          name: 'French',
          image: 'french',
          value: 'fr',
        },
        {
          name: 'Deutsch',
          image: 'nemecko',
          value: 'de',
        },
        {
          name: 'Italian',
          image: 'italian',
          value: 'it',
        },
        {
          name: 'Portuguese',
          image: 'portugalsko',
          value: 'pt',
        },
        {
          name: 'Spanish',
          image: 'spanelsko',
          value: 'es',
        },
        {
          name: 'Russian',
          image: 'russian',
          value: 'ru',
        },
        {
          name: 'Slovenian',
          image: 'slovinsko',
          value: 'sl',
        },
        {
          name: 'Japanese',
          image: 'japanese',
          value: 'ja',
        },
        {
          name: 'Turkish',
          image: 'turkish',
          value: 'tr',
        },
        {
          name: 'Chinese',
          image: 'chinese',
          value: 'zh',
        },
      ],
    };
  },
  methods: {
    stepEnter() {
      this.$set(this, 'model', true);
      this.$store.commit('SET_APP_LOADED', false);
      setTimeout(() => {
        this.hasLoaded = true;
        this.$store.commit('SET_APP_LOADED', true);
      }, 3500);
      this.$store.commit('STOP_VIDEOS');
      this.$store.commit('SET_HINT', this.$t('choose-lang-alert'));
    },
    stepLeave() {
      this.$set(this, 'model', false);
    },
    selectLang(locale = 'en') {
      /** this.playGameSound('big-button-press-1');
      localStorage.setItem('data-protection-language', locale);
      this.$i18n.setLocale(locale);
      window.impressAPI.goto('map');
       **/
    },
    playIntroVideo() {
      this.$set(this, 'model', false);
      this.playGameSound('big-button-press-1');
      this.$store.commit('PLAY_VIDEO', 'game-intro-0');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/splash';
</style>
