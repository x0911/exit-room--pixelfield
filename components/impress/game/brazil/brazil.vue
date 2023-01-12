<template>
  <v-container>
    <v-dialog
      :value="videos.intro.ended && model === 0"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="700"
    >
      <div v-if="isLoading" class="splash-screen_loading">
        <lottie-animation
          loop
          :width="100"
          :height="100"
          :path="require('@/assets/animated/spinner.json')"
        ></lottie-animation>
      </div>
      <template v-else-if="isLoading === false">
        <face-scan
          v-if="step === 'face-scan'"
          @next="step = 'survey'"
        />
        <countries-scores
          v-if="step === 'countries-score'"
          @next="step = 'mini-game'"
        />
        <brazil-survey v-if="step === 'survey'" @next="step = 'countries-score'" />
        <mini-game
          v-if="step === 'mini-game'"
          @next="
            step = 'ranking';
            result.perc = $event;
          "
        />
        <ranking-card v-if="step === 'ranking'" @finish="submitGame" />
      </template>
    </v-dialog>
    <score-board-inline
      :model="result.model"
      :perc="result.perc"
      :passed="result.passed"
      @restart="restart"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';
import BrazilSurvey from '~/components/impress/game/brazil/brazil-survey';
import ImpressStep from '~/mixins/impress-step.js';
import MiniGame from '~/components/impress/game/brazil/mini-game';
import FaceScan from '~/components/impress/game/brazil/face-scan';
import RankingCard from '~/components/impress/game/brazil/ranking-card';
import CountriesScores from '~/components/impress/game/brazil/countries-scores';

export default {
  components: {
    CountriesScores,
    RankingCard,
    FaceScan,
    MiniGame,
    BrazilSurvey,
    ScoreBoardInline,
  },
  mixins: [ImpressStep],
  data: () => ({
    stepId: 'brazil',
    step: 'face-scan',
    isLoading: null,
    model: 0,
    videos: {
      intro: {
        ended: false,
      },
    },
    result: {
      model: false,
      perc: 0,
      passed: false,
    },
  }),
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
  },
  methods: {
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'model', 0);
    },
    restart() {
      this.stepLeave();
      setTimeout(this.introEnded, 100);
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: '',
        steps: ['screens.brazil.a1'],
        nextMethod: this.startGameLoading,
      });
    },
    introEnded(immediate = false) {
      this.$set(this.result, 'model', false);
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          setTimeout(this.openIntro, 200);
        },
        immediate ? 0 : 1000
      );
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    startGameLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    reset() {
      this.step = 'face-scan';
      this.isLoading = null;
      window.impressAPI.goto('map');
    },
    submitGame() {
      const score = 100
      this.$set(this.result, 'perc', score);
      this.$set(this.result, 'passed', score === 100);
      this.showResultDialog();
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score,
        game: 'brazil',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/game-brazil.scss';
</style>
