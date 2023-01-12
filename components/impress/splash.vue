<template>
  <div class="px-4">
    <!-- preload images - Browser will not load images twice -->
    <div class="p-fixed pointer-event-none" style="opacity: 0; z-index: -1">
      <v-img
        v-for="(lang, i) in langs"
        :key="i"
        :src="require(`@/assets/images/langs/${lang.image}.svg`)"
      ></v-img>
    </div>
    <!-- ../preload images -->
    <v-bottom-sheet
      v-model="model"
      :retain-focus="false"
      class="elevation-0"
      content-class="elevation-0"
      fullscreen
      hide-overlay
      max-width="810"
      no-click-animation
      persistent
    >
      <v-layout align-center align-content-center fill-height justify-center>
        <v-slide-y-reverse-transition group hide-on-leave>
          <div v-if="!hasLoaded" key="loader" class="splash-screen_loading">
            <lottie-animation
              :height="100"
              :path="require('@/assets/animated/spinner.json')"
              :width="100"
              loop
            ></lottie-animation>
          </div>
          <div v-else-if="step === 0" key="loader">
            <div key="languages" style="max-width: 90vw">
              <div class="text-center mb-3 language_title">
                <template v-for="(w, i) in wordsToSplit">
                  <div :key="i" class="word">
                    <template v-for="(letter, li) in w.split('')">
                      <span
                        :key="`${letter}_${li}`"
                        :style="`background-color: ${
                          colors[li % colors.length]
                        }`"
                        class="no-user-select white--text"
                      >
                        {{ letter }}
                      </span>
                    </template>
                  </div>
                  <div
                    v-if="i !== wordsToSplit.length - 1"
                    :key="`spacer_${i}`"
                    class="word"
                  >
                    <span> </span>
                  </div>
                </template>
              </div>
              <v-card
                class="info-screen darken mx-auto"
                flat
                light
                max-width="1000"
                min-width="400"
                tile
              >
                <v-card-text class="d-flex justify-center px-0 py-2">
                  <swiper :options="swiperOptions">
                    <template v-for="(lang, i) in langs">
                      <swiper-slide :key="i" style="width: auto !important">
                        <v-card
                          :class="{
                            'transparent text-center': true,
                          }"
                          flat
                          tile
                          width="90"
                          @click="selectLang($event, lang.value)"
                        >
                          <div>
                            <div>
                              <v-avatar size="70">
                                <v-img
                                  :src="
                                    require(`@/assets/images/langs/${lang.image}.svg`)
                                  "
                                ></v-img>
                              </v-avatar>
                            </div>
                            <div class="no-user-select white--text">
                              {{ lang.name }}
                            </div>
                          </div>
                        </v-card>
                      </swiper-slide>
                    </template>
                  </swiper>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-slide-y-reverse-transition>
      </v-layout>
    </v-bottom-sheet>
  </div>
</template>

<script>
import LottieAnimation from '@/components/LottieAnimation.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';

export default {
  name: 'SplashScreen',
  components: {
    LottieAnimation,
  },
  mixins: [ImpressStep, SoundPlayer],
  data() {
    return {
      wordsToSplit: ['SELECT', 'YOUR', 'PREFERRED', 'LANGUAGE'],
      colors: ['#64202f', '#3a121b'],
      stepId: 'splash',
      locale: null,
      model: false,
      step: 0,
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
  mounted() {
    this.$nuxt.$on(`video-game-intro-0-ended`, this.video0Ended);
  },
  methods: {
    stepEnter() {
      this.$set(this, 'model', true);
      this.$store.commit('SET_APP_LOADED', false);
      setTimeout(() => {
        this.$set(this, 'hasLoaded', true);
        this.$store.commit('SET_APP_LOADED', true);
      }, 3500);
      this.$store.commit('STOP_VIDEOS');
    },
    stepLeave() {
      this.$set(this, 'hasLoaded', false);
      this.$set(this, 'model', false);
      this.$set(this, 'step', 0);
    },
    selectLang(event, locale = 'en') {
      this.playGameSound('big-button-press-1');
      localStorage.setItem('data-protection-language', locale);
      this.$i18n.setLocale(locale);
      this.$set(this, 'locale', locale);
      this.$set(this, 'step', 1);
      event.target['data-video-start'] = 'game-intro-0';
      this.$store.dispatch('updateLang', locale);
      this.play0Video();
    },
    video0Ended() {
      window.impressAPI.goto('map')
    },
    play0Video() {
      this.$set(this, 'model', false);
      this.playGameSound('big-button-press-1');
      this.$store.commit('PLAY_VIDEO', 'game-intro-0');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/splash.scss';
</style>
