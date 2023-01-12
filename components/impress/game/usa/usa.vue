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
        :can-cancel="hasCompleteSurvey"
        @cancel="isQuestionsOpen = false"
        @next="
          isQuestionsOpen = false;
          isMissingPieceOpen = true;
        "
      />
      <missing-piece
        v-else-if="isMissingPieceOpen"
        @next="
          isMissingPieceOpen = false;
          isControlsOpen = false;
        "
      />
      <privacy-notice v-else-if="isPrivacyOpen" v-model="isPrivacyOpen" />
      <template v-else-if="isControlsOpen">
        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            tile
            class="px-6 mr-4"
            large
            fixed
            bottom
            style="bottom: 30px; right: 20rem"
            :disabled="isPrivacyOpen === null"
            @click="isQuestionsOpen = true"
          >
            <span class="mr-3">{{ $t('start') }}</span>
            <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            tile
            class="px-6"
            large
            fixed
            right
            bottom
            style="bottom: 30px; right: 2rem"
            @click="openPrivacyNoticeHandler"
          >
            <span class="mr-3">{{ $t('privacy_notice') }}</span>
            <v-icon role="button">mdi-launch</v-icon>
          </v-btn>
        </div>
      </template>
    </v-dialog>
    <score-board-inline
      :model="result.model"
      :perc="result.perc"
      :passed="result.passed"
      @restart="restart()"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';
import SoundPlayer from '~/mixins/sound-player.js';
import ImpressStep from '~/mixins/impress-step.js';
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice';
import UsaSurvey from '~/components/impress/game/usa/usa-survey';
import MissingPiece from '~/components/impress/game/usa/missing-piece';

export default {
  components: {
    UsaSurvey,
    PrivacyNotice,
    MissingPiece,
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'usa',
    isPrivacyOpen: null,
    isQuestionsOpen: false,
    isControlsOpen: true,
    isMissingPieceOpen: false,
    hasCompleteSurvey: false,
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
  watch: {
    isMissingPieceOpen(value) {
      if (!value) {
        this.hasCompleteSurvey = true;
      }
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
  },
  methods: {
    restart() {
      setTimeout(() => {
        this.stepEnter();
        this.introEnded();
      }, 100);
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
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    openPrivacyNoticeHandler() {
      this.playGameSound('big-button-press-1');
      this.isPrivacyOpen = true;
    },
  },
};
</script>
