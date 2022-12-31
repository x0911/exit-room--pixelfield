<template>
  <div class="px-4">
    <!-- preload images - Browser will not load images twice -->
    <div style="opacity: 0; z-index: -1" class="p-fixed pointer-event-none">
      <v-img
        v-for="(lang, i) in langs"
        :key="i"
        :src="require(`@/assets/images/langs/${lang.image}.svg`)"
      ></v-img>
    </div>
    <!-- ../preload images -->
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
          <div v-else-if="step === 0" key="start-game-button">
            <v-btn
              x-large
              color="primary"
              depressed
              class="py-8 px-10"
              data-video-start="game-intro-0"
              @click="play0Video()"
            >
              {{ $t('start_game') }}
              <v-icon class="ms-3">
                mdi-keyboard-backspace mdi-rotate-180
              </v-icon>
            </v-btn>
          </div>
          <div v-else-if="step === 1" key="languages" style="max-width: 90vw">
            <div class="text-center mb-3 language_title">
              <template v-for="(w, i) in wordsToSplit">
                <div :key="i" class="word">
                  <template v-for="(letter, li) in w.split('')">
                    <span
                      :key="`${letter}_${li}`"
                      class="no-user-select white--text"
                      :style="`background-color: ${colors[li % colors.length]}`"
                    >
                      {{ letter }}
                    </span>
                  </template>
                </div>
                <div :key="`spacer_${i}`" class="word">
                  <span> </span>
                </div>
              </template>
            </div>
            <v-card
              class="info-screen darken mx-auto"
              tile
              flat
              max-width="1200"
              min-width="400"
              dark
            >
              <v-card-text
                class="d-flex flex-wrap gap-row-2 justify-center px-4 py-2"
              >
                <template v-for="(lang, i) in langs">
                  <v-card
                    :key="i"
                    class="transparent hoverable-card text-center d-flex flex-column justify-center"
                    width="100"
                    height="70"
                    tile
                    flat
                    @click="selectLang(lang.value)"
                  >
                    <div class="lang-icon">
                      <img
                        :src="
                          require(`@/assets/images/langs/brick${i + 1}.svg`)
                        "
                      />
                    </div>
                    <div class="no-user-select">
                      {{ lang.name }}
                    </div>
                  </v-card>
                </template>
              </v-card-text>
            </v-card>
          </div>
        </v-slide-y-reverse-transition>
      </v-layout>
    </v-bottom-sheet>
    <cookie-modal v-model="cookiesModel" :self-activate="false"></cookie-modal>
  </div>
</template>

<script>
import LottieAnimation from '@/components/LottieAnimation.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
import CookieModal from '@/components/ui/cookie-modal.vue';
export default {
  name: 'SplashScreen',
  components: {
    LottieAnimation,
    CookieModal,
  },
  mixins: [ImpressStep, SoundPlayer],
  data() {
    return {
      wordsToSplit: ['SELECT', 'YOUR', 'PREFERRED', 'LANGUAGE'],
      colors: ['#64202f', '#3a121b'],
      stepId: 'splash',
      locale: null,
      acceptCookies: true,
      cookiesModel: false,
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
  watch: {
    cookiesModel(v) {
      if (!v) {
        this.acceptCookies = true;
      }
    },
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
    selectLang(locale = 'en') {
      this.playGameSound('big-button-press-1');
      localStorage.setItem('data-protection-language', locale);
      this.$i18n.setLocale(locale);
      this.$set(this, 'locale', locale);
      localStorage.setItem('novartis-dp-cookie-accepted', true);
      window.impressAPI.goto('map');
      this.$store.dispatch('updateLang', locale);
    },
    video0Ended() {
      this.$set(this, 'step', 1);
      this.$store.commit('SET_HINT', this.$t('choose-lang-alert'));
      setTimeout(() => {
        this.$set(this, 'model', true);
      }, 1200);
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
@import '~/assets/scss/pages/splash';
</style>
