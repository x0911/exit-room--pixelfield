<template>
  <v-container>
    <v-bottom-sheet
      :value="videos.intro.ended && model === 0"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      fullscreen
    >
      <div class="px-4 py-6">
        <v-row dense>
          <v-col cols="auto" align-self="center">
            <v-btn
              :disabled="comicModel === 0"
              dark
              x-large
              icon
              @click="
                comicPrev();
                playGameSound('button-press');
              "
            >
              <v-icon x-large>mdi-arrow-left-bold-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="max-room-h">
            <v-card
              v-if="comics[comicModel]"
              tile
              light
              flat
              class="pa-0 info-screen"
            >
              <div class="room-static text-center text-caption px-1">
                <v-chip color="rgba(0,0,0,0.05)" label>
                  <span v-if="comics[comicModel].triggerable.length === 0">
                    {{ $t('usa.header.no-objects-to-mark') }}
                  </span>
                  <span v-else>
                    {{ comics[comicModel].triggeredSpots.length }} /
                    {{ comics[comicModel].correctSpots.length }}
                    {{ $t('objects-found') }}
                  </span>
                </v-chip>
              </div>
              <v-card-text class="pa-0 d-flex justify-center align-center">
                <div class="p-relative d-flex">
                  <img
                    :src="
                      require(`@/assets/images/games/usa/${comicModel + 1}.jpg`)
                    "
                    :style="`height: ${imgMaxHeight}; max-width: 100%; object-fit: contain;`"
                  />
                  <template
                    v-for="(point, i) in comics[comicModel].triggerable"
                  >
                    <div
                      :key="i"
                      v-ripple="{ class: 'orange--text' }"
                      class="p-absolute img-spot d-flex justify-center align-center"
                      :class="{
                        'img-spot--triggered': comics[
                          comicModel
                        ].triggeredSpots.includes(point.id),
                      }"
                      :style="`border-radius: 50%; width: ${
                        point.w
                      }%; height: ${point.w}%; left: ${point.x}%; top: ${
                        point.y
                      }%; border: 4px solid ${
                        comics[comicModel].triggeredSpots.includes(point.id)
                          ? '#ff613d'
                          : 'transparent'
                      }; transform: ${point.t};`"
                      @click="addSpot(point.id)"
                    >
                      <span
                        v-if="
                          comics[comicModel].triggeredSpots.includes(point.id)
                        "
                        class="spot-inner"
                      >
                        {{ i + 1 }}
                      </span>
                    </div>
                  </template>
                </div>
              </v-card-text>
              <div class="room-static" ref="roomStatic">
                <div
                  class="text-center primary white--text text-body-1 font-weight-light d-flex justify-center align-center px-4 py-3"
                  style="
                    border-top: 1px solid var(--v-dark-blue-base) !important;
                  "
                >
                  {{ $t(`usa.comics-desc.c-${comicModel + 1}`) }}
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="auto" align-self="center">
            <v-btn
              dark
              x-large
              icon
              @click="
                comicNext();
                playGameSound('big-button-press-1');
              "
            >
              <v-icon x-large>mdi-arrow-right-bold-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-bottom-sheet>
    <v-dialog
      :value="videos.intro.ended && model === 1"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="600"
    >
      <div>
        <v-card light tile flat class="transparent mx-auto">
          <div class="mb-4">
            <v-card tile flat dark class="info-screen darken border-3">
              <v-stepper
                v-model="questionModel"
                elevation="0"
                class="transparent"
                tile
                dark
              >
                <v-stepper-items>
                  <template v-for="(q, i) in questions">
                    <v-stepper-content
                      :key="i"
                      :step="i"
                      class="wrapper-overflow-visible"
                    >
                      <div class="mb-1">
                        <label :for="`question-${i}`">
                          {{
                            $t(`usa.assignment.questions.${q.question}.text`)
                          }}
                        </label>
                      </div>
                      <template v-if="q.multiple">
                        <template
                          v-for="(option, ci) in $t(
                            `usa.assignment.questions.${q.question}.options`
                          )"
                        >
                          <v-checkbox
                            v-model="q.value"
                            :id="option"
                            :key="ci"
                            :value="ci"
                            :label="option"
                            class="mb-3"
                            color="white"
                            hide-details
                          ></v-checkbox>
                        </template>
                      </template>
                      <template v-else>
                        <v-radio-group v-model="q.value" :multiple="q.multiple">
                          <template
                            v-for="(option, ci) in $t(
                              `usa.assignment.questions.${q.question}.options`
                            )"
                          >
                            <v-radio
                              :id="option"
                              :key="ci"
                              :value="ci"
                              :label="option"
                              class="mb-3"
                              color="white"
                            ></v-radio>
                          </template>
                        </v-radio-group>
                      </template>
                    </v-stepper-content>
                  </template>
                </v-stepper-items>
              </v-stepper>
            </v-card>
          </div>
          <div class="d-flex pt-4 pb-6">
            <v-btn
              color="white"
              class="px-6"
              x-large
              depressed
              tile
              @click="
                questionPrev();
                playGameSound('big-button-press-2');
              "
            >
              <v-icon large>mdi-keyboard-backspace</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="px-6 custom-disabled-state"
              x-large
              depressed
              tile
              :disabled="nextDisabled"
              @click="
                questionNext();
                playGameSound('big-button-press-1');
              "
            >
              <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
            </v-btn>
          </div>
        </v-card>
      </div>
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
    stepId: 'usa',
    hints: [
      {
        text: 'h1',
        icon: 'mdi-file-document-multiple-outline',
      },
      {
        text: 'h2',
        icon: 'mdi-laptop',
      },
      {
        text: 'h3',
        icon: 'mdi-ear-hearing',
      },
      {
        text: 'h4',
        icon: 'mdi-lock-outline',
      },
      {
        text: 'h5',
        icon: 'mdi-vpn',
      },
      {
        text: 'h6',
        icon: 'mdi-credit-card-outline',
      },
    ],
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
    comicModel: 0,
    comics: [
      {
        correctSpots: [],
        triggeredSpots: [],
        triggerable: [],
      },
      {
        correctSpots: [],
        triggeredSpots: [],
        triggerable: [],
      },
      {
        correctSpots: [],
        triggeredSpots: [],
        triggerable: [],
      },
      {
        correctSpots: ['loud-voice', 'co-travelers-listening'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'loud-voice',
            w: 16,
            x: 31.2,
            y: 62,
            t: 'skew(10deg, -14deg)',
          },
          {
            id: 'fake-1',
            w: 12,
            x: 14.2,
            y: 58.5,
          },
          {
            id: 'co-travelers-listening',
            w: 20,
            x: 80,
            y: 45,
            t: 'skew(0deg, -14deg)',
          },
        ],
      },
      {
        correctSpots: ['paper-1', 'paper-2', 'paper-3', 'paper-4', 'brick-1'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'paper-1',
            w: 14,
            x: 32,
            y: 43,
            t: 'skew(-12deg, 6deg)',
          },
          {
            id: 'paper-2',
            w: 19,
            x: 46.5,
            y: 38,
            t: 'skew(22deg, 0deg) rotate(-18deg)',
          },
          {
            id: 'fake-1',
            w: 14,
            x: 18.3,
            y: 50,
            t: 'skew(0deg, 0deg) rotate(0deg)',
          },
          {
            id: 'paper-3',
            w: 18,
            x: 66,
            y: 32,
            t: 'rotate(-1deg)',
          },
          {
            id: 'fake-2',
            w: 14,
            x: 6.3,
            y: 43.5,
            t: 'skew(0deg, 0deg) rotate(0deg)',
          },
          {
            id: 'paper-4',
            w: 11,
            x: 77,
            y: 68,
            t: 'skew(52deg, -27deg) rotate(-5deg)',
          },
          {
            id: 'brick-1',
            w: 15,
            x: 81,
            y: 52,
            t: 'skew(0deg, 0deg) rotate(0deg)',
          },
        ],
      },
      {
        correctSpots: ['papers', 'papers-2'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'papers',
            w: 15,
            x: 15.5,
            y: 43,
            t: 'skew(0deg, 0deg)',
          },
          {
            id: 'papers-2',
            w: 13,
            x: 27,
            y: 46,
            t: 'skew(0deg, 0deg)',
          },
          {
            id: 'fake-1',
            w: 20,
            x: 68.5,
            y: 56,
            t: 'skew(0deg, 0deg)',
          },
        ],
      },
      {
        correctSpots: ['public-wifi'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'public-wifi',
            w: 27,
            x: 22.5,
            y: 49,
          },
          {
            id: 'fake-1',
            w: 29,
            x: 58.5,
            y: 6,
          },
        ],
      },
      {
        correctSpots: ['novartis-card'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'novartis-card',
            w: 16,
            x: 3.5,
            y: 43,
            t: 'skew(13deg, -39deg)',
          },
          {
            id: 'fake-1',
            w: 29,
            x: 58.5,
            y: 6,
          },
        ],
      },
      {
        correctSpots: ['brick-in-the-back'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'brick-in-the-back',
            w: 13,
            x: 29,
            y: 67,
            t: 'skew(0deg, 0deg)',
          },
        ],
      },
      {
        correctSpots: ['brick-in-the-back', 'unlocked-laptop-screen'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'brick-in-the-back',
            w: 15,
            x: 28,
            y: 68,
            t: 'skew(0deg, 0deg)',
          },
          {
            id: 'unlocked-laptop-screen',
            w: 10,
            x: 79.5,
            y: 42,
            t: 'skew(-23deg, 17deg)',
          },
        ],
      },
    ],
    questions: [
      {
        type: 'radio',
        question: 'q3',
        value: null,
        correctValue: 1,
      },
      {
        type: 'radio',
        question: 'q1',
        value: null,
        correctValue: 1,
      },
      {
        type: 'radio',
        question: 'q2',
        value: null,
        correctValue: 3,
      },
      {
        type: 'radio',
        question: 'q4',
        value: null,
        correctValue: 0,
      },
      {
        type: 'radio',
        multiple: true,
        question: 'q5',
        value: [],
        correctValue: [0, 2, 6],
      },
    ],
    questionModel: 0,
    imgMaxHeight: `calc(90vh - 81px)`,
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
  },
  watch: {
    comicModel() {
      this.setImgMaxHeight();
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
  },
  methods: {
    setImgMaxHeight() {
      setTimeout(() => {
        let bHeight = this.$refs.roomStatic?.clientHeight || 49;
        if (this.$vuetify.breakpoint.height <= 385) {
          bHeight += 80;
        }
        const height = `calc(90vh - 32px - ${bHeight}px)`;
        this.$set(this, 'imgMaxHeight', height);
      }, 100);
    },
    stepEnter() {
      //
    },
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'comicModel', 0);
      this.$set(this, 'model', 0);
      this.reset();
    },
    restart() {
      this.stepLeave();
      setTimeout(() => {
        this.stepEnter();
        this.introEnded();
      }, 100);
    },
    reset() {
      const comics = this.comics;
      comics.forEach((el) => {
        el.triggeredSpots = [];
      });
    },
    questionNext() {
      if (!this.nextDisabled) {
        const index = this.questionModel;
        const questions = this.questions;
        const case1 = index === 0;
        const case2 = index === 2;
        const comicModel = case1 ? 3 : case2 ? 4 : this.comicModel;
        if (case1 || case2) {
          this.$set(this, 'model', 0);
          this.$set(this, 'comicModel', comicModel);
        }
        if (index >= questions.length - 1) {
          this.finish();
          return;
        }
        this.questionModel++;
      }
    },
    questionPrev() {
      const index = this.questionModel;
      const case1 = index === 0;
      const case2 = index === 1;
      const case3 = index === 3;
      const comicModel = case1 ? 2 : case2 ? 3 : case3 ? 9 : this.comicModel;
      if (case1 || case2 || case3) {
        this.$set(this, 'model', 0);
        this.$set(this, 'comicModel', comicModel);
      }
      if (index > 0) {
        this.questionModel--;
      }
    },
    addSpot(id) {
      const index = this.comicModel;
      const spots = this.comics[index].triggeredSpots;
      const spotIndex = this.comics[index].triggeredSpots.indexOf(id);
      if (spotIndex > -1) {
        spots.splice(spotIndex, 1);
        this.playGameSound('button-press');
      } else {
        spots.push(id);
        this.playGameSound('big-button-press-2');
      }
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.usa.title'),
        steps: ['screens.usa.a1'],
      });
    },
    introEnded(immediate = false) {
      this.$set(this.result, 'model', false);
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          this.setImgMaxHeight();
          setTimeout(() => {
            this.openIntro();
          }, 200);
        },
        immediate ? 0 : 1000
      );
    },
    comicNext() {
      const case1 = this.comicModel >= this.comics.length - 1;
      const case2 = this.comicModel === 2;
      const case3 = this.comicModel === 3;
      const questionModel = case1
        ? 3
        : case2
        ? 0
        : case3
        ? 1
        : this.questionModel;
      if (case1 || case2 || case3) {
        this.$set(this, 'model', 1);
        this.$set(this, 'questionModel', questionModel);
      }
      this.comicModel++;
    },
    comicPrev() {
      const case1 = this.comicModel === 3;
      const case2 = this.comicModel === 4;
      const questionModel = case1 ? 0 : case2 ? 2 : this.questionModel;
      if (case1 || case2) {
        this.$set(this, 'model', 1);
        this.$set(this, 'questionModel', questionModel);
      }
      this.comicModel--;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    async finish() {
      // Show results
      this.$set(this, 'model', 2);
      let marks = 0;
      let length = 0;
      const comics = this.comics;
      comics.forEach((comic, i) => {
        if (comic.triggerable?.length > 0) {
          const userSpots = comic.triggeredSpots;
          const correctSpots = comic.correctSpots;
          length += correctSpots.length;
          correctSpots.forEach((spot) => {
            if (userSpots.includes(spot)) {
              marks++;
            }
          });
        }
      });

      const perc = (marks / length) * 100;
      const quizPerc = this.getQuizScore();
      const totalPerc = (perc + quizPerc) / 2;
      try {
        const info = this.getActiveTaskInfo();
        await this.$store.dispatch('createTask', {
          task_result: totalPerc,
          questions: [],
          task_id: info.taskId,
          task_name: info.taskName,
        });
      } catch (err) {
        console.log(err);
      }
      this.$set(this.result, 'perc', totalPerc);
      this.$set(this.result, 'passed', totalPerc === 100);
      this.$store.commit('SET_SCORE_BOARD_DIALOG', {
        model: false,
        score: totalPerc,
        game: 'usa',
      });
      this.showResultDialog();
    },
    getQuizScore() {
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
      const max = questions.length;
      const correct = questions.filter(
        (q) =>
          (q.multiple && arraysEqual(q.correctValue, q.value)) ||
          (!q.multiple && q.value === q.correctValue)
      ).length;
      const score = Math.ceil((correct / max) * 100);
      return score;
    },
  },
};
</script>
