<template>
  <v-container>
    <component
      :is="isUsaQuestionsOpen ? 'div' : 'v-dialog'"
      :retain-focus="false"
      :value="videos.intro.ended"
      class="elevation-0"
      content-class="elevation-0"
      overlay-opacity="0"
      persistent
      scrollable
      style="max-width: 700px; margin: 0 auto"
    >
      <div v-if="isLoading" class="splash-screen_loading">
        <lottie-animation
          :height="100"
          :path="require('@/assets/animated/spinner.json')"
          :width="100"
          loop
        ></lottie-animation>
      </div>
      <privacy-notice v-if="isPrivacyOpen" v-model="isPrivacyOpen"/>
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
        <privacy-survey
          v-else-if="isPrivacySurveyOpen"
          @next="completePrivacySurveyHandler"
          @privacy-hidden="canOpenPrivacyNotice = false"
          @privacy-visible="canOpenPrivacyNotice = true"
        />
      </div>
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
          style="bottom: 90px; right: 3rem"
          tile
          @click="
            playGameSound('big-button-press-1');
            isPrivacyOpen = true;
          "
        >
          <span class="mr-3">{{ $t('china.privacy-notice.open') }}</span>
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </div>

      <div class="d-flex justify-end">
        <v-btn
          v-if="canOpenPrivacySymbols"
          class="btn-open-privacy px-6 mr-4"
          color="primary"
          fixed
          large
          right
          style="bottom: 30px; right: 3rem"
          tile
          @click="
            playGameSound('big-button-press-1');
            isPrivacyPrincipleOpen = true;
          "
        >
          <span class="mr-3">{{ $t('china.privacy-principles') }}</span>
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </div>

      <v-dialog :value="isPrivacyPrincipleOpen" max-width="750" persistent>
        <v-card class="mx-auto pa-4 info-screen" flat light tile>
          <div class="d-flex justify-end">
            <v-icon @click="isPrivacyPrincipleOpen = false">mdi-close</v-icon>
          </div>
          <div class="text-center font-weight-bold mb-4">
            {{ $t(`found-object.found-all`) }}
          </div>
          <div
            v-for="(symbol, sKey, sIdx) in $t(`found-object.items`)"
            :key="sKey"
            :style="sIdx !== 4 && 'border-bottom: 1px solid lightgray'"
            class="ml-4 d-flex justify-space-between align-center py-2"
          >
            <div
              class="text-body-1 text-capitalize px-auto"
              style="width: 40px"
            >
              <img
                :src="
                  require(`@/assets/images/games/china/symbols/${sKey}.svg`)
                "
                style="padding-right: 0.5rem"
              />
            </div>
            <div class="text-body-1" style="width: 210px">{{ symbol }}</div>
            <div class="text-body-2" style="width: 440px">
              {{ $t(`found-object.items-explanations`)[sKey] }}
            </div>
          </div>
        </v-card>
      </v-dialog>
    </component>
    <score-board-inline
      :label="$t('usa.score-board-inline')"
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
  mixins: [ImpressStep],
  data: () => ({
    stepId: 'usa',
    isQuestionsOpen: false,
    isPhoneOpen: false,
    isPrivacySurveyOpen: false,
    isUsaQuestionsOpen: false,
    isMissingPieceOpen: false,
    isChatOpen: false,
    isPrivacyOpen: false,
    isPrivacyPrincipleOpen: false,
    canOpenPrivacyNotice: true,
    canOpenPrivacySymbols: false,
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
    this.$nuxt.$on(`video-${this.stepId}-x3-ended`, () => {
      this.$store.commit('SET_INSTRUCTIONS', {
        bottomModel: true,
        steps: ['speeches.usa.3'],
        nextMethod: async () => {
          await this.addLoading();
          this.isMissingPieceOpen = true;
          setTimeout(() => {
            this.replaceBg(this.stepId);
          }, 500);
        },
      });
    });
  },
  methods: {
    stepEnter() {
      // Always leave method `stepEnter` even if not used
    },
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
    },
    introEnded(immediate = false) {
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          this.isPrivacyOpen = true;
          this.$nuxt.$emit('play-main-audio');
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
      this.isPrivacySurveyOpen = false;
      this.canOpenPrivacyNotice = false;
      this.isMissingPieceOpen = true;
    },
    completeUsaQuestionsHandler() {
      this.canOpenPrivacyNotice = false;
      this.isUsaQuestionsOpen = false;
      this.canOpenPrivacySymbols = false;
      this.$store.commit('SET_INSTRUCTIONS', {
        bottomModel: true,
        steps: ['speeches.usa.2'],
        nextMethod: (nextEvent) => {
          nextEvent.target['data-video-start'] = `${this.stepId}-x3`;
          this.$store.commit('PLAY_VIDEO', `${this.stepId}-x3`);
          setTimeout(() => {
            nextEvent.target['data-video-start'] = null;
            this.replaceBg(`${this.stepId}-x2`);
          }, 500);
        },
      });
    },
    async completeMissingPieceHandler() {
      this.isMissingPieceOpen = false;
      this.isChatOpen = true;
      this.replaceBg(`${this.stepId}-x3`);
      await this.addLoading();
      await this.finishGame()
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
        await this.addLoading();
        this.isUsaQuestionsOpen = true;
        this.canOpenPrivacyNotice = true;
        this.canOpenPrivacySymbols = true;
      }
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
