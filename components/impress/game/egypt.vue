<template>
  <v-container class="game-egypt">
    <v-dialog
      :retain-focus="false"
      :value="videos.intro.ended"
      class="elevation-0"
      content-class="elevation-0 overflow-auto max-h-100"
      light
      overlay-opacity="0"
      persistent
    >
      <v-card class="mx-auto" max-height="85vh" max-width="600">
        <template v-if="model === 0">
          <v-img
            :src="require('@/assets/images/games/egypt/lunch_menu_empty.jpg')"
            class="image-bg"
            height="85vh"
          >
            <v-card-title
              class="d-block text-center mt-16 pb-6 primary-lighten--text text-h4 font-weight-bold"
            >
              <span class="ls-10">
                {{ $tr('lunch-menu.title') }}
              </span>
            </v-card-title>
            <v-card-text class="px-16">
              <template v-for="(item, i) in $tr('lunch-menu.items', 'array')">
                <v-card :key="i" class="transparent mt-4" flat tile>
                  <v-layout style="position: relative" class="pb-8" column>
                    <div>
                      <v-layout class="gap-2" justify-space-between>
                        <div
                          class="d-flex align-end text-h5 primary-lighten--text font-weight-medium f-khand"
                        >
                          <span>
                            {{ item.label }}
                          </span>
                        </div>
                        <div
                          class="d-flex align-end text-right text-body-1 primary-lighten--text font-weight-regular lh-1-2"
                        >
                          {{ item.text }}
                        </div>
                      </v-layout>
                    </div>
                    <v-layout class="mt-2 mb-1" justify-center>
                      <v-avatar height="auto" tile width="100%">
                        <v-img
                          :src="
                            require('@/assets/images/games/egypt/lunch_menu_divider.jpg')
                          "
                          contain
                        ></v-img>
                      </v-avatar>
                    </v-layout>
                    <div
                      class="text-body-1 ps-9 f-hand black--text font-weight-bold handwritten"
                    >
                      {{ item.handwritten }}
                    </div>
                  </v-layout>
                </v-card>
              </template>
            </v-card-text>
          </v-img>
        </template>
        <template v-else-if="model === 1 || model === 2">
          <v-card-text class="pt-6">
            <template v-for="(q, i) in questions">
              <div v-if="model === i + 1" :key="i">
                <div class="mb-2 text-body-1 font-weight-medium">
                  {{ $tr(`egypt.questions.${i + 1}.label`) }}
                </div>
                <div>
                  <v-radio-group v-model="q.value" light :error="hasErrors">
                    <template
                      v-for="(option, oi) in $tr(
                        `egypt.questions.${i + 1}.options`,
                        'array'
                      )"
                    >
                      <v-radio
                        :key="`o-${oi}`"
                        :label="option"
                        :value="oi"
                        light
                      ></v-radio>
                    </template>
                  </v-radio-group>
                </div>
              </div>
            </template>
          </v-card-text>
        </template>
      </v-card>
      <div class="d-flex mt-4 align-center justify-center">
        <v-btn v-if="model === 1" class="px-6 mr-8" large @click="backHandler">
          <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>
          {{ model === 2 ? $t('previous') : $t('back_to_menu') }}
        </v-btn>
        <v-btn
          v-if="model <= 2"
          class="px-6"
          color="primary"
          large
          @click="nextStep"
        >
          {{ $t('next') }}
          <v-icon class="ml-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </div>
    </v-dialog>
    <score-board-inline
      :model="result.model"
      :passed="result.passed"
      :perc="result.perc"
      @restart="restart"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '@/components/ScoreBoardInline.vue';
import ImpressStep from '@/mixins/impress-step.js';

export default {
  components: {
    ScoreBoardInline,
  },
  mixins: [ImpressStep],
  data: () => ({
    stepId: 'egypt',
    model: 0,
    hasErrors: false,
    questions: [
      {
        question: '',
        value: null,
        correctValue: 2,
      },
      {
        question: '',
        value: null,
        correctValue: 3,
      },
    ],
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
    isFormValid() {
      if (!this.model) return true;
      const q = this.questions[this.model - 1];
      return q && q.value === q.correctValue;
    },
  },
  watch: {
    questions: {
      deep: true,
      handler() {
        this.hasErrors = false;
      },
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.videoEnded);
    this.$nuxt.$on(`video-${this.stepId}-x2-ended`, this.showScoreBoard);
  },
  methods: {
    nextStep(event) {
      this.playGameSound('big-button-press-1');
      event.target['data-video-start'] = null;

      /** first step to just skip the menu **/
      if (!this.model) {
        this.resetValue();
        this.hasErrors = false;
        this.model++;
        return;
      }

      /** questions error **/
      if (this.model <= 2 && !this.isFormValid) {
        this.hasErrors = true;
        return;
      }

      if (this.model === 1) {
        this.model++;
        return;
      }

      if (this.model === 2) {
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          steps: ['speeches.egypt.5'],
          nextText: this.$t('next'),
          nextMethod: (nextEvent) => {
            this.model++;
            this.nextStep(nextEvent);
          },
        });
        return;
      }

      /** go to the next step **/
      if (this.model === 3) {
        this.$set(this.videos.intro, 'ended', false);
        event.target['data-video-start'] = `${this.stepId}-x2`;
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x2`);
        setTimeout(() => {
          this.replaceBg('egypt-v2');
        }, 1000);
      }
    },
    backHandler() {
      this.playGameSound('big-button-press-1');
      this.resetValue();
      this.model--;
    },
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'model', 0);
    },
    resetValue() {
      this.questions.forEach((q) => {
        q.value = null;
      });
    },
    restart() {
      this.stepLeave();
      setTimeout(() => {
        this.resetValue();
        this.videoEnded();
      }, 100);
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.egypt.title'),
        steps: ['screens.egypt.a1'],
      });
    },
    videoEnded() {
      this.$store.commit('STOP_VIDEOS');
      this.$set(this.videos.intro, 'ended', true);
    },
    async showScoreBoard() {
      const score = 100;
      try {
        const info = this.getActiveTaskInfo();
        // const questions = [...this.questions].map((q, i) => {
        //   return {
        //     question_id: i + 1,
        //     question_text: this.$t(`egypt.questions.${i + 1}.label`),
        //     answer_id: q.value,
        //     answer_text: this.$tr(`egypt.questions.${i + 1}.options`)[q.value],
        //     is_correct: q.value === q.correctValue,
        //   };
        // });
        await this.$store.dispatch('createTask', {
          task_result: score,
          questions: [],
          task_id: info.taskId,
          task_name: info.taskName,
        });
      } catch (err) {
        console.log(err);
      }
      this.$set(this.result, 'perc', score);
      this.$set(this.result, 'passed', true);
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score,
        game: 'egypt',
      });
      this.stepLeave();
      this.showResultDialog();
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/game-egypt.scss';
</style>
