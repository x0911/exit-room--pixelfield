<template>
  <v-container>
    <v-dialog
      :value="videos.intro.ended"
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
      <usa-survey
        v-if="isQuestionsOpen"
        @cancel="isQuestionsOpen = false"
        @next="completeSurveyHandler"
      />
      <phone-questions
        v-else-if="isPhoneOpen"
        @next="completePhoneQuestionsHandler"
      />
      <missing-piece
        v-else-if="isMissingPieceOpen"
        @next="completeMissingPieceHandler"
      />
      <div class="d-flex justify-end">
        <v-btn
          v-if="!isGameStarted"
          color="primary"
          tile
          class="px-6 mr-4"
          large
          fixed
          bottom
          style="bottom: 30px; right: 3rem"
          @click="isQuestionsOpen = true"
        >
          <span class="mr-3">{{ $t('start') }}</span>
          <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </div>
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
import SoundPlayer from '~/mixins/sound-player.js';
import ImpressStep from '~/mixins/impress-step.js';
import UsaSurvey from '~/components/impress/game/usa/usa-survey';
import MissingPiece from '~/components/impress/game/usa/missing-piece';
import PhoneQuestions from '~/components/impress/game/usa/phone-questions';

export default {
  components: {
    PhoneQuestions,
    UsaSurvey,
    MissingPiece,
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'usa',
    isQuestionsOpen: false,
    isPhoneOpen: false,
    isMissingPieceOpen: false,
    isChartOpen: false,
    isLoading: false,
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
  computed: {
    isGameStarted() {
      return (
        this.isLoading ||
        this.isQuestionsOpen ||
        this.isPhoneOpen ||
        this.isMissingPieceOpen ||
        this.isChartOpen
      );
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
  },
  methods: {
    addLoading(ms = 1000) {
      this.isLoading = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isLoading = false;
          resolve();
        }, ms);
      });
    },
    restart() {
      this.isQuestionsOpen = false;
      this.isPhoneOpen = false;
      this.isMissingPieceOpen = false;
      this.isChartOpen = false;
      this.isLoading = false;
      setTimeout(this.introEnded, 100);
    },
    introEnded(immediate = false) {
      this.$set(this.result, 'model', false);
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
        },
        immediate ? 0 : 1000
      );
    },
    async completePhoneQuestionsHandler() {
      this.isPhoneOpen = false;
      await this.addLoading();
      this.isMissingPieceOpen = true;
    },
    async completeMissingPieceHandler() {
      this.isMissingPieceOpen = false;
      this.isChartOpen = true;
      await this.addLoading();
      this.startChat();
    },
    async completeSurveyHandler() {
      this.isQuestionsOpen = false;
      await this.addLoading();
      this.isPhoneOpen = true;
    },
    startChat() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: '',
        steps: ['screens.usa.games.2.a1'],
        nextText: this.$t('confirm'),
        nextMethod: this.finishChat,
      });
    },
    finishChat() {
      this.$store.commit('SET_INSTRUCTIONS', {
        bottomModel: true,
        title: this.$t('franklin'),
        steps: ['screens.usa.games.2.steps.1.title'],
        image: 'avatars/franklin.jpg',
        nextText: this.$t('screens.usa.games.2.steps.1.next'),
        nextMethod: this.finishGame,
      });
    },
    finishGame() {
      const score = 100;
      this.result.model = true;
      this.result.perc = score;
      this.result.passed = true;
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score,
        game: 'usa',
      });
    },
  },
};
</script>
