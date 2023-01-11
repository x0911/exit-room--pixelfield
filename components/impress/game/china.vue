<template>
  <div>
    <v-container>
      <v-dialog
        :value="videos.intro.ended"
        overlay-opacity="0"
        persistent
        class="elevation-0"
        content-class="elevation-0"
        :retain-focus="false"
        scrollable
        max-width="800"
      >
        <v-card v-show="step === 1" class="transparent" tile flat>
          <div>
            <v-img
              contain
              :src="require('@/assets/images/games/china/note.png')"
            >
              <v-layout justify-center fill-height>
                <div
                  class="f-hand text-h4 font-weight-medium pt-12 px-16 black--text"
                >
                  <template
                    v-for="(line, i) in $tr('china.bedroom-note', 'array')"
                  >
                    <div :key="i" :inner-html.prop="line" class="lh-3-6"></div>
                  </template>
                </div>
              </v-layout>
            </v-img>
          </div>
          <v-card-actions class="mt-4 px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="px-4"
              tile
              large
              depressed
              :data-video-start="`${stepId}-x2`"
              @click="nextStep"
            >
              {{ $t('next') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180</v-icon
              >
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-show="step === 2" class="transparent" tile flat>
          <div>
            <v-img
              contain
              :src="require('@/assets/images/games/china/letter.jpg')"
            >
              <v-layout justify-center fill-height>
                <div
                  class="f-hand-2 text-h4 font-weight-medium pt-12 px-16 black--text"
                >
                  <template
                    v-for="(line, i) in $tr('china.bedroom-letter', 'array')"
                  >
                    <div :key="i" :inner-html.prop="line"></div>
                  </template>
                </div>
              </v-layout>
            </v-img>
          </div>
          <v-card-actions class="mt-4 px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="px-4"
              tile
              large
              depressed
              :data-video-start="`${stepId}-x3`"
              @click="nextStep"
            >
              {{ $t('next') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180</v-icon
              >
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <score-board-inline
        :model="result.model"
        :perc="result.perc"
        :passed="result.passed"
        @restart="restart()"
      >
        <template #answers>
          <template v-for="(q, i) in questions">
            <div :key="i" :class="{ 'mt-2': i > 0 }">
              <div
                class="font-weight-medium mb-1"
                :inner-html.prop="
                  $t(`china.assignment.questions.${q.question}.text`)
                "
              ></div>
              <template v-if="q.multiple">
                <template v-for="(qv, qvi) in q.correctValue">
                  <div
                    :key="`qvi-${qvi}`"
                    :inner-html.prop="
                      $t(`china.assignment.questions.${q.question}.options`)[qv]
                    "
                  ></div>
                </template>
              </template>
              <template v-else>
                <div
                  :inner-html.prop="
                    $t(`china.assignment.questions.${q.question}.options`)[
                      q.correctValue
                    ]
                  "
                ></div>
              </template>
            </div>
          </template>
          <v-divider class="my-2"></v-divider>
          <template v-for="(seType, i) in seTypes">
            <div :key="`se-type-${i}`" :class="{ 'mt-2': i > 0 }">
              <div
                class="font-weight-medium mb-1"
                :inner-html.prop="$t(`china.se-types.${seType}`)"
              ></div>
              <div
                :inner-html.prop="$t(`china.se-types-answers.${seType}`)"
              ></div>
            </div>
          </template>
        </template>
      </score-board-inline>
    </v-container>
    <div class="items-container">
      <!--  -->
    </div>
  </div>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
export default {
  components: {
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'china',
    step: 1,
    showEmail: false,
    videos: {
      intro: {
        ended: false,
      },
    },
    questions: [
      {
        type: 'radio',
        question: 'q1',
        value: null,
        correctValue: 0,
      },
      {
        type: 'radio',
        multiple: true,
        question: 'q2',
        value: [],
        correctValue: [2, 3],
      },
    ],
    questionModel: 0,
    seTypeSelectModel: 0,
    seTypeAnswerPicker: null,
    seTypes: [
      'phishing',
      'vishing',
      'smishing',
      'ransomware',
      'malware',
      'baiting',
      'scareware',
      'identity_theft',
      'tailgaiting',
    ],
    seTypesAnswers: {
      phishing: null,
      vishing: null,
      smishing: null,
      ransomware: null,
      malware: null,
      baiting: null,
      scareware: null,
      identity_theft: null,
      tailgaiting: null,
    },
    result: {
      model: false,
      perc: 0,
      passed: false,
    },
    rotatableItems: [
      'alarm',
      'boat',
      'book',
      'candle',
      'charger',
      'cup',
      'key',
      'pillow',
    ],
  }),
  computed: {
    nextDisabled() {
      const index = this.questionModel;
      const question = this.questions[index];
      if (
        (!question?.value && question?.value !== 0) ||
        (Array.isArray(question?.value) && question?.value.length === 0)
      ) {
        return true;
      }
      return false;
    },
    prevDisabled() {
      const index = this.questionModel;
      if (index <= 0) {
        return true;
      }
      return false;
    },
    seTypeColor() {
      return (key, i) => {
        const val = this.seTypesAnswers[key];
        if (val === null) {
          return '#070e2c';
        }
        if (val === key) {
          return '#0b6800';
        }
        return '#680000';
      };
    },
    takenAnswers() {
      return Object.values(this.seTypesAnswers).filter((val) => val !== null);
    },
    randomSeTypes() {
      const array = [...this.seTypes];
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      return array;
      // Exclude takenAnswers
      // return array.filter((val) => !this.takenAnswers.includes(val));
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
    this.$nuxt.$on(`video-${this.stepId}-x2-ended`, () => {
      this.introEnded(true);
    });
  },
  methods: {
    stepEnter() {
      //
    },
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'step', 1);
      this.$set(this, 'showEmail', false);
      this.$set(this, 'questionModel', 0);
      this.resetValue();
    },
    resetValue() {
      const questions = this.questions;
      questions.forEach((q, i) => {
        const newV = q.multiple ? [] : null;
        this.$set(this.questions[i], 'value', newV);
      });
      const seTypesAnswers = this.seTypesAnswers;
      Object.keys(seTypesAnswers).forEach((key) => {
        this.$set(this.seTypesAnswers, key, null);
      });
    },
    restart() {
      this.stepLeave();
      setTimeout(() => {
        this.stepEnter();
        this.introEnded();
      }, 100);
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.china.title'),
        steps: ['screens.china.a1'],
      });
    },
    introEnded(immediate = false) {
      this.$set(this, 'questionModel', 0);
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          // setTimeout(() => {
          //   this.openIntro();
          // }, 200);
        },
        immediate ? 0 : 1000
      );
    },
    showSeTypeAnswers(seType) {
      this.$set(this, 'seTypeAnswerPicker', seType);
      this.$set(this, 'seTypeSelectModel', 1);
    },
    pickSeTypeAnswer(seType) {
      const key = this.seTypeAnswerPicker;
      // Check if object values including `seType`
      const index = Object.values(this.seTypesAnswers).indexOf(seType);
      if (index !== -1) {
        // get key of that index
        const oldKey = Object.keys(this.seTypesAnswers)[index];
        this.$set(this.seTypesAnswers, oldKey, null);
      }
      this.$set(this.seTypesAnswers, key, seType);
      this.$set(this, 'seTypeSelectModel', 0);
    },
    questionNext() {
      if (!this.nextDisabled) {
        const index = this.questionModel;
        const questions = this.questions;
        if (index >= questions.length - 1) {
          this.$set(this, 'step', 4);
          setTimeout(() => {
            this.$store.commit('SET_INSTRUCTIONS', {
              model: true,
              title: this.$t('screens.china.title2'),
              steps: ['screens.china.a2'],
              nextMethod: this.openPart2,
            });
          }, 100);
          return;
        }
        this.questionModel++;
      }
    },
    questionPrev() {
      if (this.questionModel > 0) {
        this.questionModel--;
      } else {
        this.$set(this, 'step', 1);
      }
    },
    async finish() {
      const score = this.getScore();
      try {
        const info = this.getActiveTaskInfo();
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
      this.$set(this.result, 'passed', score === 100);
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score,
        game: 'china',
      });
      this.stepLeave();
      this.showResultDialog();
    },
    getScore() {
      const questions = this.questions;
      const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
          return false;
        }
        for (let i = 0; i < arr1.length; i++) {
          if (!arr2.includes(arr1[i])) {
            return false;
          }
        }
        return true;
      };
      let max = questions.length;
      let correct = questions.filter(
        (q) =>
          (q.multiple && arraysEqual(q.correctValue, q.value)) ||
          (!q.multiple && q.value === q.correctValue)
      ).length;
      // Also, Get score of match game
      const additionalLength = this.seTypes.length;
      max += additionalLength;
      // get number of `value=key` in object `seTypesAnswers`
      const keys = Object.keys(this.seTypesAnswers);
      keys.forEach((key) => {
        if (this.seTypesAnswers[key] === key) {
          correct++;
        }
      });
      const score = Math.ceil((correct / max) * 100);
      return score;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    viewEmail() {
      this.playGameSound('big-button-press-2');
      this.$set(this, 'step', 2);
      this.$set(this, 'showEmail', true);
    },
    replyToEmail() {
      this.playGameSound('big-button-press-2');
      this.$set(this, 'step', 3);
      this.$set(this, 'showEmail', false);
    },
    nextStep() {
      this.step++;
      if (this.step === 2) {
        this.$set(this.videos.intro, 'ended', false);
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x2`);
        setTimeout(() => {
          this.replaceBg('china-v2');
        }, 1000);
      }
      if (this.step === 3) {
        this.$set(this.videos.intro, 'ended', false);
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x3`);
        setTimeout(() => {
          this.replaceBg('china-v3');
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/game-china.scss';
</style>
