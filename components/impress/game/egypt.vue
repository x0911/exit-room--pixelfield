<template>
  <v-container class="game-egypt">
    <v-dialog
      :value="videos.intro.ended"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0 overflow-auto max-h-100"
      :retain-focus="false"
      light
    >
      <v-card max-width="600" max-height="90vh" class="mx-auto">
        <template v-if="model === 0">
          <v-img
            :src="require('@/assets/images/games/egypt/lunch_menu_empty.jpg')"
          >
            <v-card-title
              class="d-block text-center mt-16 pt-16 primary-lighten--text text-h2 font-weight-bold"
            >
              <span class="ls-10">
                {{ $tr('lunch-menu.title') }}
              </span>
            </v-card-title>
            <v-layout align-center justify-center>
              <v-avatar tile max-width="45%" width="100%" height="auto">
                <v-img
                  :src="
                    require('@/assets/images/games/egypt/lunch_menu_top.jpg')
                  "
                  contain
                ></v-img>
              </v-avatar>
            </v-layout>
            <v-card-text class="px-16 pt-16">
              <template v-for="(item, i) in $tr('lunch-menu.items', 'array')">
                <v-card
                  :key="i"
                  class="mb-16 transparent"
                  flat
                  tile
                  @click="model = 1"
                >
                  <v-layout column>
                    <div>
                      <v-layout justify-space-between class="gap-2">
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
                    <v-layout justify-center class="mt-2 mb-1">
                      <v-avatar tile width="100%" height="auto">
                        <v-img
                          :src="
                            require('@/assets/images/games/egypt/lunch_menu_divider.jpg')
                          "
                          contain
                        ></v-img>
                      </v-avatar>
                    </v-layout>
                    <div class="text-body-1 ps-9 f-hand black--text">
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
              <div
                :key="i"
                v-if="(model === 1 && i === 0) || (model === 2 && i === 1)"
              >
                <div class="mb-2 text-body-1 font-weight-medium">
                  {{ $tr(`egypt.questions.${i + 1}.label`) }}
                </div>
                <template
                  v-for="(answer, ai) in $tr(
                    `egypt.questions.${i + 1}.options`,
                    'array'
                  )"
                >
                  <div
                    :key="ai"
                    :data-video-start="model === 1 ? `${stepId}-x2` : null"
                    @click="nextStep"
                  >
                    <v-checkbox
                      v-model="q.value"
                      :value="ai"
                      color="primary"
                      hide-details
                      class="mb-1"
                      :label="answer"
                    >
                    </v-checkbox>
                  </div>
                </template>
              </div>
            </template>
          </v-card-text>
        </template>
      </v-card>
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
import ScoreBoardInline from '@/components/ScoreBoardInline.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
export default {
  components: {
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'egypt',
    model: 0,
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
  computed: {},
  watch: {},
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.videoEnded);
    this.$nuxt.$on(`video-${this.stepId}-x2-ended`, this.videoEnded);
  },
  methods: {
    nextStep() {
      this.model++;
      const v = this.model;
      if (v === 2) {
        this.$set(this.videos.intro, 'ended', false);
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x2`);
      }
      if (v === 3) {
        this.showScoreBoard();
      }
    },
    stepEnter() {
      this.resetValue();
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
        this.stepEnter();
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
      // setTimeout(() => {
      //   this.openIntro();
      // }, 200);
    },
    async showScoreBoard() {
      const score = this.getScore();
      try {
        const info = this.getActiveTaskInfo();
        const questions = [...this.questions].map((q, i) => {
          return {
            question_id: i + 1,
            question_text: this.$t(`egypt.questions.${i + 1}.label`),
            answer_id: q.value,
            answer_text: this.$tr(`italy.questions.${i + 1}.options`)[q.value],
            is_correct: q.value === q.correctValue,
          };
        });
        await this.$store.dispatch('createTask', {
          task_result: score,
          questions,
          task_id: info.taskId,
          task_name: info.taskName,
        });
      } catch (err) {
        console.log(err);
      }
      this.$set(this.result, 'perc', score);
      this.$set(this.result, 'passed', score === 100);
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score,
        game: 'egypt',
      });
      this.stepLeave();
      this.showResultDialog();
    },
    getScore() {
      const fullmark = this.questions.length;
      let marks = 0;
      this.questions.forEach((q) => {
        if (q.value === q.correctValue) {
          marks++;
        }
      });
      const perc = Math.ceil((marks / fullmark) * 100);
      return perc;
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
