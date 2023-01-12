<template>
  <v-img
    width="100vw"
    height="100vh"
    class="image-background"
    :src="require('~/assets/images/bg/china-bg.jpg')"
  >
    <div v-if="isLoading" class="loading splash-screen_loading">
      <lottie-animation
        loop
        :width="100"
        :height="100"
        :path="require('@/assets/animated/spinner.json')"
      ></lottie-animation>
    </div>
    <div
      :class="{ 'is-selected': isSelected }"
      class="missing-piece d-flex align-center justify-center"
      @click="isSelected = true"
    >
      <v-icon v-if="isSelected" large>mdi-email</v-icon>
    </div>
    <v-btn
      v-if="showNext"
      color="primary"
      class="px-6"
      tile
      large
      fixed
      right
      bottom
      style="bottom: 30px; right: 2rem"
      :data-video-start="`usa-x${step}`"
      :disabled="!isSelected"
      @click="processNext"
    >
      {{ $t('next') }}
    </v-btn>
  </v-img>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player';

export default {
  name: 'MissingPiece',
  mixins: [SoundPlayer],
  data() {
    return {
      isSelected: false,
      isLoading: false,
      showNext: true,
      step: 2,
    };
  },
  async mounted() {
    this.$store.commit('SET_INSTRUCTIONS', {
      model: true,
      title: this.$t('screens.usa.games.1.title'),
      steps: ['screens.usa.games.1.a1'],
    });
    this.$nuxt.$on('confirm-current-video', this.progressOnVideo);
    this.$nuxt.$on('stop-current-video', this.finishStep);
    await this.addLoading(1000);
  },
  methods: {
    addLoading(ms) {
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isLoading = false;
          resolve();
        }, ms);
      });
    },
    processNext() {
      this.playGameSound('big-button-press-2');
      this.showNext = false;
      this.$store.commit('SET_VIDEO_IS_SKIPPABLE', true);
      this.$store.commit('HIDE_GLOBAL_BTNS');
      this.$store.commit('PLAY_VIDEO', `usa-x${this.step}`);
    },
    async progressOnVideo() {
      this.$store.commit('SET_VIDEO_IS_SKIPPABLE', false);
      this.$store.commit('SHOW_GLOBAL_BTNS');
      this.showNext = true;
      this.step === 4 ? await this.finishStep() : this.step++;
    },
    async finishStep() {
      this.playGameSound('big-button-press-1');
      await this.addLoading(2000);
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: true,
        score: 100,
        game: 'usa',
        next: () => {
          this.$emit('next');
          window.impressAPI.goto('map');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/missing-piece.scss';
</style>
