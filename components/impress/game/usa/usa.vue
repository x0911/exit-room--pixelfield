<template>
  <v-container>
    <v-dialog
      :retain-focus="false"
      :value="videos.intro.ended"
      class="elevation-0"
      content-class="elevation-0"
      max-width="700"
      overlay-opacity="0"
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
      <privacy-notice v-if="isPrivacyOpen" v-model="isPrivacyOpen" />
      <usa-questions
        v-if="isUsaQuestionsOpen"
        @next="completeUsaQuestionsHandler"
      />
      <div v-if="false">
        <usa-survey
          v-if="isQuestionsOpen"
          @cancel="isQuestionsOpen = false"
          @next="completeSurveyHandler"
        />
        <phone-questions
          v-else-if="isPhoneOpen"
          v-click-outside="outsideClickConfig"
          @next="completePhoneQuestionsHandler"
        />
      </div>
      <privacy-survey
        v-else-if="isPrivacySurveyOpen"
        @next="completePrivacySurveyHandler"
        @privacy-hidden="canOpenPrivacyNotice = false"
        @privacy-visible="canOpenPrivacyNotice = true"
      />
      <missing-piece
        v-else-if="isMissingPieceOpen"
        @next="completeMissingPieceHandler"
      />
      <div class="d-flex justify-end">
        <v-btn
          v-if="canOpenPrivacyNotice"
          :disabled="isPrivacyOpen"
          class="btn-open-privacy px-6 mr-4"
          color="primary"
          fixed
          large
          right
          style="bottom: 30px; right: 3rem"
          tile
          @click="isPrivacyOpen = true"
        >
          <span class="mr-3">{{ $t('china.privacy-notice.open') }}</span>
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </div>
    </v-dialog>
    <score-board-inline
      :label="$t('usa.score-board-inline')"
      :model="result.model"
      :passed="result.passed"
      :perc="result.perc"
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
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice';
import PrivacySurvey from '~/components/impress/game/usa/privacy-survey';
import UsaQuestions from '~/components/impress/game/usa/usa-questions.vue';

export default {
  components: {
    UsaQuestions,
    PrivacySurvey,
    PrivacyNotice,
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
    isPrivacySurveyOpen: false,
    isUsaQuestionsOpen: false,
    isMissingPieceOpen: false,
    isChatOpen: false,
    isPrivacyOpen: false,
    canOpenPrivacyNotice: true,
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
    outsideClickConfig() {
      return {
        handler: () => {
          this.isPhoneOpen = false;
          this.isPrivacySurveyOpen = true;
          this.$store.commit('SET_HINT', []);
        },
        include: () => {
          return [
            document.querySelector('.instructions-bottom'),
            document.querySelector('.btn-open-privacy'),
            document.querySelector('.privacy-notice'),
            document.querySelector('.privacy-notice-actions'),
            document.querySelector('.btn-hints'),
          ].filter((htmlElement) => htmlElement);
        },
      };
    },
  },
  watch: {
    isPrivacyOpen(value) {
      return value ? this.isPrivacyOpenHandler() : this.isPrivacyCloseHandler();
    },
    isQuestionsOpen(value) {
      if (!value) {
        this.canOpenPrivacyNotice = false;
      }
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
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.resetValues();
    },
    resetValues() {
      this.isQuestionsOpen = false;
      this.isPhoneOpen = false;
      this.isPrivacySurveyOpen = false;
      this.isUsaQuestionsOpen = false;
      this.isMissingPieceOpen = false;
      this.isChatOpen = false;
      this.isLoading = false;
      this.isPrivacyOpen = false;
    },
    restart() {
      this.stepLeave();
      setTimeout(this.introEnded, 100);
    },
    introEnded(immediate = false) {
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          this.isPrivacyOpen = true;
        },
        immediate ? 0 : 1000
      );
    },
    async completePhoneQuestionsHandler() {
      this.isPhoneOpen = false;
      await this.addLoading();
      this.isPrivacySurveyOpen = true;
    },
    completePrivacySurveyHandler() {
      this.canOpenPrivacyNotice = false;
      this.isPrivacySurveyOpen = false;
      this.isMissingPieceOpen = true;
    },
    completeUsaQuestionsHandler() {
      this.isUsaQuestionsOpen = false;
      this.isMissingPieceOpen = true;
    },
    async completeMissingPieceHandler() {
      this.isMissingPieceOpen = false;
      this.isChatOpen = true;
      await this.addLoading();
      this.startChat();
    },
    async completeSurveyHandler() {
      this.isQuestionsOpen = false;
      await this.addLoading();
      this.isPhoneOpen = true;
    },
    isPrivacyOpenHandler() {
      const imageBg = this.$store.getters.roomsBgs[this.stepId];
      if (imageBg.includes('x2')) {
        this.replaceBg(this.stepId);
      }
    },
    async isPrivacyCloseHandler() {
      const isStart = [
        this.isQuestionsOpen,
        this.isPhoneOpen,
        this.isPrivacySurveyOpen,
        this.isUsaQuestionsOpen,
        this.isMissingPieceOpen,
        this.isChatOpen,
      ].every((step) => !step);
      if (isStart) {
        this.canOpenPrivacyNotice = false;
        await this.addLoading();
        this.isUsaQuestionsOpen = true;
      }
    },
    startChat() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: '',
        steps: ['screens.usa.games.2.a1'],
        nextText: this.$t('call-franklin'),
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
    async finishGame() {
      try {
        const score = 100;
        this.result.model = true;
        this.result.perc = score;
        this.result.passed = true;
        const info = this.getActiveTaskInfo();
        await this.$store.dispatch('createTask', {
          task_result: score,
          questions: [],
          task_id: info.taskId,
          task_name: info.taskName,
        });
        this.$store.commit('SET_SCORE_BOARD_DIALOG', {
          model: false,
          score,
          game: 'usa',
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
