<template>
  <v-dialog
    :value="model && localModel"
    persistent
    max-width="620"
    scrollable
    :retain-focus="false"
  >
    <v-card class="info-screen border-2" light>
      <v-card-text class="px-4 pb-0 pt-4">
        <div
          class="primary grey--text text--lighten-2 font-weight-light px-5 py-5"
        >
          <slot name="subtitle">
            <template v-for="(line, i) in subtitle">
              <div :key="i" :inner-html.prop="line" class="mb-1"></div>
            </template>
          </slot>
          <template v-if="hasPanels">
            <v-expansion-panels hover accordion>
              <v-expansion-panel v-if="hasLearningOutcome" class="elevation-0">
                <v-expansion-panel-header class="font-weight-medium">
                  {{ $t('learning-outcome.title') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <template v-for="(line, i) in learningOutcome">
                    <div :key="i" :inner-html.prop="line" class="mb-1"></div>
                  </template>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel v-if="hasQuizAnswers" class="elevation-0">
                <v-expansion-panel-header class="font-weight-medium">
                  {{ $t('quiz-answers.title') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <slot name="answers"></slot>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
        </div>
      </v-card-text>
      <v-card-actions class="px-4 justify-center py-4">
        <v-btn
          v-if="!disableTryAgain"
          color="primary"
          large
          class="px-7"
          tile
          depressed
          @click="
            restart();
            playGameSound('big-button-press-2');
          "
        >
          <v-icon class="me-3">mdi-reload</v-icon>
          {{ $t('try-again') }}
        </v-btn>
        <v-btn
          color="primary"
          large
          class="px-7"
          tile
          depressed
          :data-video-start="passed ? videoId : null"
          @click="backToMap"
        >
          <template v-if="activeStep === 'india'">
            {{ $t('continue') }}
          </template>
          <template v-else>
            {{ $t('map') }}
          </template>
          <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SoundPlayer from '@/mixins/sound-player.js';
export default {
  mixins: [SoundPlayer],
  props: {
    model: {
      type: Boolean,
      default: false,
    },
    disableTryAgain: {
      type: Boolean,
      default: false,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    perc: {
      type: [Number, String],
      default: 0,
    },
    videoId: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    localModel: true,
  }),
  computed: {
    activeStep() {
      return this.$store.getters.activeStep;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
    learningOutcome() {
      const activeStep = this.activeStep;
      const rooms = this.rooms;
      if (rooms.includes(activeStep)) {
        return this.$t(`learning-outcome.${activeStep}`);
      } else {
        return [];
      }
    },
    hasLearningOutcome() {
      if (this.learningOutcome && this.learningOutcome.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    hasQuizAnswers() {
      if (this.$slots.answers) {
        return true;
      } else {
        return false;
      }
    },
    hasPanels() {
      if (this.hasQuizAnswers || this.hasLearningOutcome) {
        return true;
      } else {
        return false;
      }
    },
    subtitle() {
      const activeStep = this.activeStep;
      const rooms = this.rooms;
      if (rooms.includes(activeStep)) {
        return this.$tr(`score-result.${activeStep}`, 'array');
      } else {
        return [];
      }
    },
    hasSubtitle() {
      return this.subtitle?.length > 0;
    },
  },
  watch: {
    model(v) {
      if (v === true) {
        setTimeout(() => {
          this.playSound();
          this.checkFailCounter();
        }, 500);
      }
    },
    activeStep() {
      this.$set(this, 'localModel', true);
    },
  },
  mounted() {},
  methods: {
    checkFailCounter() {
      if (!this.passed) {
        const rooms = this.$store.getters.rooms || [];
        const taskId = rooms.indexOf(this.$store.getters.activeStep) + 1;
        this.$store.dispatch('addFailCounter', taskId);
      }
    },
    playSound() {
      const soundName = this.passed ? 'task-success' : 'task-fail';
      this.playGameSound(soundName);
    },
    backToMap() {
      this.playGameSound('big-button-press-1');
      this.$set(this, 'localModel', false);
      if (this.videoId && this.passed) {
        this.$nuxt.$on(`video-${this.videoId}-ended`, this.openMap);
        this.$store.commit('PLAY_VIDEO', this.videoId);
      } else {
        this.openMap();
      }
    },
    openMap() {
      window.impressAPI.goto('map');
    },
    restart() {
      this.$emit('restart');
    },
  },
};
</script>
