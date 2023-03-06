<template>
  <v-container v-if="isMounted">
    <v-dialog
      :retain-focus="false"
      :value="videos.intro.ended && model === 0"
      class="elevation-0 mx-auto"
      content-class="elevation-0"
      max-width="700"
      overlay-opacity="0"
      scrollable
      persistent
    >
      <div v-if="isLoading" class="splash-screen_loading">
        <lottie-animation
          :height="100"
          :path="require('@/assets/animated/spinner.json')"
          :width="100"
          loop
        ></lottie-animation>
      </div>
      <template v-else-if="isLoading === false">
        <face-scan
          v-if="step === 'face-scan'"
          :step-id="stepId"
          @next="nextFaceScanHandler"
        />
        <brazil-survey v-if="step === 'survey'" @next="brazilSurveyNext" />
        <mini-game
          v-if="step === 'mini-game'"
          :is-mini-game="step === 'mini-game'"
          @next="
            step = 'ranking';
            result.perc = $event;
          "
        />
        <ranking-card v-if="step === 'ranking'" @next="submitGame" />
      </template>
    </v-dialog>
    <score-board-inline
      :model="result.model"
      :passed="result.passed"
      :perc="result.perc"
      :step-id="stepId"
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

export default {
  components: {
    RankingCard,
    FaceScan,
    MiniGame,
    BrazilSurvey,
    ScoreBoardInline,
  },
  mixins: [ImpressStep],
  data: () => ({
    stepId: 'brazil',
    step: null,
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
    isMounted: true,
  }),
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
    this.$nuxt.$on(`video-${this.stepId}-x2-ended`, () => {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$set(this, 'step', 'face-scan');
      }, 1000);
    });
    this.$nuxt.$on(`video-${this.stepId}-x3-ended`, () => {
      this.replaceBg(`${this.stepId}-x2`);
      this.step = 'survey';
      this.$nuxt.$emit('play-main-audio');
    });
  },
  methods: {
    stepEnter() {
      // Always leave method `stepEnter` even if not used
    },
    stepLeave() {
      // Always leave method `stepLeave` even if not used
      this.$set(this, 'isLoading', null);
      this.$set(this, 'step', 'face-scan');
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'model', 0);
      this.$set(this, 'isMounted', false);
      setTimeout(() => {
        this.$set(this, 'isMounted', true);
      }, 1000);
    },
    restart() {
      this.stepLeave();
      this.replaceBg('brazil');
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: '',
        steps: ['screens.brazil.a1'],
        nextText: this.$t('take_a_photo'),
        nextMethod: this.startGame,
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
    startGame(nextEvent) {
      nextEvent.target['data-video-start'] = `${this.stepId}-x2`;
      this.$store.commit('SET_VIDEO_IS_SKIPPABLE', false);
      this.$store.commit('PLAY_VIDEO', `${this.stepId}-x2`);
      setTimeout(() => {
        nextEvent.target['data-video-start'] = null;
      }, 2000)
    },
    nextFaceScanHandler(event) {
      this.step = null;
      const videoId = `${this.stepId}-x3`;
      event.target['data-video-start'] = videoId;
      this.$store.commit('PLAY_VIDEO', videoId);
      setTimeout(() => {
        event.target['data-video-start'] = null;
      }, 2000);
    },
    reset() {
      this.isLoading = null;
      this.$set(this, 'step', 'face-scan');
      window.impressAPI.goto('map');
    },
    brazilSurveyNext() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        steps: ['screens.brazil.a2'],
        nextMethod: (event) => {
          event.target['data-video-start'] = null;
          this.step = 'mini-game'
        },
      });
    },
    async submitGame() {
      try {
        const score = 100;
        const info = this.getActiveTaskInfo();
        let gameScore = Number(this.result.perc);
        const highestGameScore = Number(
          localStorage.getItem('game-room-highest-score') || '0'
        );
        if (highestGameScore > gameScore) {
          gameScore = highestGameScore;
        } else {
          localStorage.setItem('game-room-highest-score', `${gameScore}`);
        }
        await this.$store.dispatch('createTask', {
          task_result: score,
          questions: [],
          task_id: info.taskId,
          task_name: info.taskName,
          score: gameScore,
        });
        this.$set(this.result, 'perc', score);
        this.$set(this.result, 'passed', score === 100);
        this.stepLeave();
        this.showResultDialog();
        this.$store.commit('SET_SCORE_BOARD_DIALOG', {
          model: false,
          score,
          game: 'brazil',
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/game-brazil.scss';
</style>
