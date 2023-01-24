<template>
  <v-container>
    <v-dialog
      :value="videos.intro.ended"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="900"
    >
      <!-- puzzle-game v-if="step === 1" @next="puzzleNextHandler" /-->
      <v-card v-if="step === 1" class="transparent" tile flat>
        <v-card-text class="px-0 py-2 info-screen v-card darken border-3">
          <v-card class="transparent" tile flat min-height="200">
            <v-card-text>
              <div class="msgs">
                <v-slide-y-reverse-transition group hide-on-leave>
                  <template v-for="(msg, i) in msgs">
                    <div
                      :key="i"
                      class="msgs__msg d-flex align-center gap-2"
                      :class="`msgs__msg-${msg.dir} ${
                        msg.dir === 'ltr' ? 'justify-start' : 'justify-end'
                      }`"
                    >
                      <v-avatar
                        v-if="msg.dir === 'ltr'"
                        size="40"
                        class="align-self-start"
                      >
                        <v-img
                          v-if="getSender(i) !== getSender(i - 1)"
                          :src="getSpeakerImage(msg)"
                          alt="Speaker Image"
                        ></v-img>
                      </v-avatar>
                      <div
                        class="msgs__msg-inner d-flex flex-column justify-center align-center px-3 py-2 rounded-lg"
                        :class="{
                          error: msg.dir === 'ltr' && msg.isFranklin,
                          'maria-color': msg.dir === 'ltr' && msg.isMaria,
                          success: msg.dir === 'rtl',
                        }"
                      >
                        <template v-if="msg.show">
                          <div :inner-html.prop="msg.text"></div>
                        </template>
                        <template v-else>
                          <dot-flashing></dot-flashing>
                        </template>
                      </div>
                      <v-avatar
                        v-if="msg.dir === 'rtl'"
                        size="40"
                        class="align-self-start"
                      >
                        <v-img
                          v-if="getSender(i) !== getSender(i - 1)"
                          :src="getSpeakerImage(msg)"
                          alt="Speaker Image"
                        ></v-img>
                      </v-avatar>
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
                        :style="
                          getWrongAnswerStyles(
                            suggestion,
                            'border: 1px solid #FF5252 !important;'
                          )
                        "
                        @click="chooseSuggestion(suggestion)"
                      >
                        <v-card-text
                          :style="
                            getWrongAnswerStyles(
                              suggestion,
                              'color: #FF5252 !important;'
                            )
                          "
                        >
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
              {{ $t('map') }}
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
      @restart="restart"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';
import SoundPlayer from '~/mixins/sound-player.js';
import ImpressStep from '~/mixins/impress-step.js';
import DotFlashing from '~/components/dot-flashing.vue';
// import PuzzleGame from '~/components/impress/game/russia/puzzle-game';

export default {
  components: {
    // PuzzleGame,
    ScoreBoardInline,
    DotFlashing,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'russia',
    loading: false,
    hasErrors: false,
    step: 0,
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
    msgs: [],
    correctMsgs: [],
    suggestions: [],
    chatEnded: false,
    msgDelay: 3000,
  }),
  computed: {
    getSpeakerImage() {
      return (msg = {}) => {
        const getImage = (file = '') => {
          return require(`@/assets/images/games/russia/${file}`);
        };
        if (msg.isPlayer) {
          return getImage('player.png');
        }
        if (msg.isMaria) {
          return getImage('maria.jpg');
        }
        if (msg.isFranklin) {
          return getImage('franklin.jpg');
        }
        return '';
      };
    },
    getSender() {
      return (i = 0) => {
        if (i < 0) {
          return '';
        }
        const msg = this.msgs[i];
        if (msg.isPlayer) {
          return 'player';
        }
        if (msg.isMaria) {
          return 'maria';
        }
        if (msg.isFranklin) {
          return 'franklin';
        }
        return '';
      };
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
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'step', 1);
      this.$set(this, 'msgs', []);
      this.$set(this, 'suggestions', []);
      this.$set(this, 'chatEnded', false);
    },
    puzzleNextHandler() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.russia.title'),
        steps: ['screens.russia.a1'],
        nextMethod: () => {
          this.step++;
          this.initChat();
        },
      });
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
      this.hasErrors = msg.closeGame;
      if (this.hasErrors) return;
      this.pushMsg(msg);
      this.suggestions = [];
      this.initChat();
    },
    isWrongAnswer({ closeGame }) {
      return this.hasErrors && closeGame;
    },
    getWrongAnswerStyles(suggestion, styles) {
      return this.isWrongAnswer(suggestion) ? styles : '';
    },
    wait() {
      const msgDelay = this.msgDelay;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, msgDelay);
      });
    },
    async initChat() {
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
        this.pushMsg(msgs[5]);
        await this.wait();
        this.pushMsg(msgs[6]);
        await this.wait();
        this.pushMsg(msgs[7]);
        await this.wait();
        this.pushMsg(msgs[8]);
        await this.wait();
        this.pushMsg(msgs[9]);
        await this.wait();
        this.pushMsg(msgs[10]);
        await this.wait();
        this.pushMsg(msgs[11]);
        await this.wait();
        this.pushMsg(msgs[12]);
        await this.wait();
        this.pushMsg(msgs[13]);
        await this.wait();
        this.pushMsg(msgs[14]);
        await this.wait();
        this.pushMsg(msgs[15]);
        await this.wait();
        this.pushMsg(msgs[16]);
        await this.wait();
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
        steps: ['speeches.russia.2'],
        nextMethod: () => {
          this.step++;
          this.initChat();
        },
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
    async finish() {
      const score = this.getScore();
      // if (this.userScammed) {
      //   score = 0;
      // }
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
      this.stepLeave();
      localStorage.setItem('room_russia', '100');
      window.impressAPI.goto('map');
    },
    getScore() {
      return 100;
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
