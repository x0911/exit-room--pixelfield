<template>
  <v-container>
    <v-dialog
      :value="videos.intro.ended && model === 1"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="700"
    >
      <div>
        <v-card :disabled="loading" light tile flat class="transparent mx-auto">
          <div class="mb-4">
            <v-card light tile flat class="info-screen border-3">
              <v-stepper v-model="questionModel" elevation="0">
                <v-stepper-header class="elevation-0">
                  <template v-for="(q, i) in questions">
                    <v-stepper-step
                      v-if="i < questions.length - 1"
                      :complete-icon="`mdi-numeric-${i + 1}`"
                      :edit-icon="`mdi-numeric-${i + 1}`"
                      :key="i"
                      :step="i + 1"
                      :editable="questionModel > i + 1 || !!q.value"
                      :complete="questionModel === i + 1"
                      class="no-gap"
                      @click="
                        questionModel > i + 1 || !!q.value
                          ? playGameSound('button-press')
                          : () => {}
                      "
                    ></v-stepper-step>
                    <v-divider
                      v-if="i < questions.length - 2"
                      :key="`separator-${i}`"
                    ></v-divider>
                  </template>
                </v-stepper-header>
                <v-divider></v-divider>
                <div class="my-2">
                  <v-img
                    contain
                    alt="Question image"
                    height="350"
                    :src="
                      require(`@/assets/images/games/russia/${questionModel}.jpg`)
                    "
                  ></v-img>
                </div>
                <v-stepper-items>
                  <template v-for="(q, i) in questions">
                    <v-stepper-content
                      :key="i"
                      :step="i + 1"
                      class="wrapper-overflow-visible"
                    >
                      <div class="mb-1">
                        <label
                          :for="`question-${i}`"
                          class="d-block text-center"
                          :inner-html.prop="$t(`russia.questions.${i + 1}.q`)"
                        ></label>
                      </div>
                      <div
                        class="d-flex flex-wrap justify-center pt-8 pb-5 gap-3"
                      >
                        <v-btn
                          value="right"
                          large
                          color="primary"
                          depressed
                          @click="setValue(q, 'right')"
                        >
                          <v-icon
                            class="me-3"
                            :color="q.value === 'right' ? 'blue' : ''"
                          >
                            mdi-checkbox-blank-circle{{
                              q.value === 'right' ? '' : '-outline'
                            }}
                          </v-icon>
                          {{ $t('russia.question-options.right') }}
                        </v-btn>
                        <v-btn
                          value="wrong"
                          large
                          color="error"
                          depressed
                          @click="setValue(q, 'wrong')"
                        >
                          <v-icon
                            class="me-3"
                            :color="q.value === 'wrong' ? 'error' : ''"
                          >
                            mdi-checkbox-blank-circle{{
                              q.value === 'wrong' ? '' : '-outline'
                            }}
                          </v-icon>
                          {{ $t('russia.question-options.wrong') }}
                        </v-btn>
                      </div>
                      <div>
                        <v-list-item class="wrap">
                          <v-list-item-avatar class="align-self-start">
                            <v-icon>mdi-comment-alert-outline</v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              class="text-caption font-weight-bold"
                            >
                              {{ $t('warning') }}
                            </v-list-item-title>
                            <v-list-item-subtitle
                              class="text-caption font-weight-medium lh-lg"
                            >
                              {{ $t(`russia.questions.${i + 1}.warning`) }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </v-stepper-content>
                  </template>
                </v-stepper-items>
              </v-stepper>
            </v-card>
          </div>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog
      :value="videos.intro.ended && model === 2"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="700"
    >
      <v-card class="transparent" tile flat>
        <v-card-text class="px-0 py-2 info-screen v-card darken border-3">
          <v-card class="transparent" tile flat min-height="200">
            <v-card-text>
              <div class="msgs">
                <v-slide-y-reverse-transition group hide-on-leave>
                  <template v-for="(msg, i) in msgs">
                    <div
                      :key="i"
                      class="msgs__msg d-flex align-center"
                      :class="`msgs__msg-${msg.dir} ${
                        msg.dir === 'ltr' ? 'justify-start' : 'justify-end'
                      }`"
                    >
                      <div
                        class="msgs__msg-inner d-flex flex-column justify-center align-center px-3 py-2 rounded-lg"
                        :class="{
                          error: msg.dir === 'ltr',
                          success: msg.dir === 'rtl',
                        }"
                      >
                        <template v-if="msg.show">
                          {{ msg.text }}
                        </template>
                        <template v-else>
                          <dot-flashing></dot-flashing>
                        </template>
                      </div>
                    </div>
                    <div
                      :key="`seen-${i}`"
                      v-if="msg.seen"
                      class="text-caption d-flex gap-1"
                      :class="`${
                        msg.dir === 'ltr'
                          ? 'justify-start align-self-start'
                          : 'justify-end align-self-end'
                      }`"
                    >
                      <v-icon size="16">mdi-check-all</v-icon>
                      {{ $t('seen') }}
                    </div>
                  </template>
                </v-slide-y-reverse-transition>
              </div>
              <div v-if="suggestions.length" class="suggestions mt-5">
                <div class="text-center yellow--text font-weight-medium mb-3">
                  {{ $t('pick-response-to-continue') }}
                </div>
                <v-row>
                  <template v-for="(suggestion, i) in suggestions">
                    <v-col :key="i" cols="6">
                      <v-card
                        flat
                        dark
                        height="100%"
                        class="d-flex align-center"
                        @click="chooseSuggestion(suggestion)"
                      >
                        <v-card-text>
                          {{ suggestion.text }}
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </template>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-slide-y-transition hide-on-leave>
          <v-card-actions v-if="chatEnded" class="mt-4 px-4 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="px-4"
              tile
              large
              depressed
              @click="finish()"
            >
              {{ $t('continue') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180</v-icon
              >
            </v-btn>
          </v-card-actions>
        </v-slide-y-transition>
      </v-card>
    </v-dialog>
    <score-board-inline
      :model="result.model"
      :perc="result.perc"
      :passed="result.passed"
      @restart="restart()"
    >
      <template #answers>
        <v-list>
          <template v-for="(q, i) in questions">
            <v-list-item :key="i" v-if="!q.dummy" class="px-0">
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(`russia.questions.${i + 1}.title`) }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  small
                  :color="q.correctValue === 'wrong' ? 'error' : 'primary'"
                >
                  {{ $t(`russia.question-options.${q.correctValue}`) }}
                </v-chip>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
        <v-divider class="mb-3"></v-divider>
        <div>
          <div class="font-weight-bold mb-4">
            {{ $t('correct-chat-flow') }}
          </div>
          <div class="msgs d-flex flex-column gap-3">
            <template v-for="(msg, i) in correctMsgs">
              <div
                :key="i"
                class="msgs__msg d-flex align-center"
                :class="`msgs__msg-${msg.dir} ${
                  msg.dir === 'ltr' ? 'justify-start' : 'justify-end'
                }`"
              >
                <div
                  class="msgs__msg-inner d-flex flex-column justify-center align-center px-3 py-2 rounded-lg white--text"
                  :class="{
                    error: msg.dir === 'ltr',
                    success: msg.dir === 'rtl',
                  }"
                >
                  <template v-if="msg.show">
                    {{ msg.text }}
                  </template>
                  <template v-else>
                    <dot-flashing></dot-flashing>
                  </template>
                </div>
              </div>
              <div
                :key="`seen-${i}`"
                v-if="msg.seen"
                class="text-caption d-flex gap-1"
                :class="`${
                  msg.dir === 'ltr'
                    ? 'justify-start align-self-start'
                    : 'justify-end align-self-end'
                }`"
              >
                <v-icon size="16">mdi-check-all</v-icon>
                {{ $t('seen') }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '@/components/ScoreBoardInline.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
import DotFlashing from '@/components/dot-flashing.vue';
export default {
  components: {
    ScoreBoardInline,
    DotFlashing,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'russia',
    loading: false,
    model: 1,
    videos: {
      intro: {
        ended: false,
      },
    },
    questions: [
      {
        question: '',
        value: null,
        correctValue: 'wrong',
      },
      {
        question: '',
        value: null,
        correctValue: 'wrong',
      },
      {
        question: '',
        value: null,
        correctValue: 'right',
      },
      {
        // dummy_question
        // dont_delete_it
        question: '',
        value: null,
        correctValue: 'wrong',
        dummy: true,
      },
    ],
    questionModel: 1,
    result: {
      model: false,
      perc: 0,
      passed: false,
    },
    msgs: [],
    correctMsgs: [],
    suggestions: [],
    chatEnded: false,
    userScammed: false,
    msgDelay: 3000,
  }),
  computed: {
    nextDisabled() {
      const index = this.questionModel - 1;
      const question = this.questions[index];
      return !question?.value;
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.videoEnded);
  },
  methods: {
    stepEnter() {
      this.setCorrectMsgs();
    },
    stepLeave() {
      this.resetValues();
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'model', 1);
      this.$set(this, 'questionModel', 1);
      this.$set(this, 'msgs', []);
      this.$set(this, 'suggestions', []);
      this.$set(this, 'chatEnded', false);
      this.$set(this, 'userScammed', false);
    },
    pushMsg(msg) {
      const obj = { ...msg, show: false, seen: false };
      const msgDelay = this.msgDelay;
      this.msgs.push(obj);
      setTimeout(() => {
        obj.show = true;
      }, msgDelay);
    },
    offerSuggestions(msgs = []) {
      this.$set(this, 'suggestions', msgs);
    },
    chooseSuggestion(msg) {
      this.pushMsg(msg);
      this.suggestions = [];
      this.initChat(msg.accepted);
    },
    wait() {
      const msgDelay = this.msgDelay;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, msgDelay);
      });
    },
    async initChat(accepted = false) {
      const msgs = this.$t('russia.task-2.msgs');
      const innerMsgs = this.msgs;
      if (innerMsgs.length === 0) {
        this.pushMsg(msgs[0]);
        await this.wait();
        this.pushMsg(msgs[1]);
        await this.wait();
        this.pushMsg(msgs[2]);
        await this.wait();
        this.offerSuggestions([msgs[3], msgs[4]]);
      }
      if (innerMsgs.length === 4) {
        await this.wait();
        const i = accepted ? 6 : 5;
        this.pushMsg(msgs[i]);
        await this.wait();
        this.offerSuggestions([msgs[7], msgs[8]]);
      }
      if (innerMsgs.length === 6) {
        await this.wait();
        if (accepted) {
          this.$set(this, 'userScammed', true);
          this.pushMsg(msgs[9]);
          await this.wait();
        } else {
          const lastMsg = innerMsgs[innerMsgs.length - 1];
          lastMsg.seen = true;
        }
        this.$set(this, 'chatEnded', true);
      }
    },
    setCorrectMsgs() {
      const msgs = this.$t('russia.task-2.msgs');
      this.$set(this, 'correctMsgs', []);
      const pushMsg = (msg, i) => {
        this.correctMsgs.push({
          ...msg,
          show: true,
          seen: i === 7,
        });
      };
      const indexes = [0, 1, 2, 3, 5, 7];
      indexes.forEach((i) => {
        pushMsg(msgs[i], i);
      });
    },
    resetValues() {
      this.questions.forEach((q) => {
        q.value = null;
      });
    },
    toggleOption(active, toggle) {
      if (active) {
        this.playGameSound('button-press');
      } else {
        this.playGameSound('big-button-press-1');
      }
      toggle();
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
        title: this.$t('screens.russia.title'),
        steps: ['screens.russia.a1'],
      });
    },
    goBackToMap() {
      window.impressAPI.goto('map');
    },
    videoEnded() {
      this.$store.commit('STOP_VIDEOS');
      this.$set(this.videos.intro, 'ended', true);
      setTimeout(() => {
        this.openIntro();
      }, 200);
    },
    questionNext() {
      if (!this.nextDisabled) {
        if (this.questionModel === this.questions.length - 1) {
          this.nextTask();
        } else {
          this.questionModel++;
        }
      }
    },
    nextTask() {
      this.playGameSound('big-button-press-1');
      this.$set(this, 'model', 0);
      this.$store.commit('SET_INSTRUCTIONS', {
        bottomModel: true,
        title: this.$t('russia.task-2.title'),
        steps: ['screens.russia.b1'],
        nextMethod: this.showChat,
      });
    },
    showChat() {
      this.$set(this, 'model', 2);
      this.initChat();
    },
    async finish() {
      let score = this.getScore();
      if (this.userScammed) {
        score = 0;
      }
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
        score: this.result.perc,
        game: 'russia',
      });
      this.stepLeave();
      this.showResultDialog();
    },
    questionPrev() {
      if (this.questionModel > 1) {
        this.questionModel--;
      }
    },
    getScore() {
      const questions = [...this.questions].splice(
        0,
        this.questions.length - 1
      );
      const max = questions.length;
      const correct = questions.filter(
        (q) => q.value === q.correctValue
      ).length;
      const score = Math.ceil((correct / max) * 100);
      return score;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    setValue(q, v) {
      if (v === 'wrong') {
        this.playGameSound('big-button-press-1');
      } else {
        this.playGameSound('button-press');
      }
      q.value = v;
      setTimeout(() => {
        this.questionNext();
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.lh-lg {
  line-height: 1.5;
}
.msgs {
  & > span {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__msg {
    &-inner {
      max-width: 75%;
      min-width: 80px;
      min-height: 30px;
    }
  }
}
</style>
