<template>
  <div>
    <v-container>
      <v-dialog
        :retain-focus="false"
        :value="
          videos.intro.ended && (step !== 3 || foundObject.name === 'note')
        "
        class="elevation-0"
        content-class="elevation-0 overflow-auto max-h-100"
        :max-width="step === 1 ? 850 : 610"
        overlay-opacity="0"
        persistent
        scrollable
      >
        <v-card v-show="step === 1" class="transparent" flat tile>
          <div>
            <v-img
              :src="require('@/assets/images/games/china/note.png')"
              contain
            >
              <v-layout fill-height justify-center pa-0>
                <div
                  class="f-hand text-h5 font-weight-medium pt-5 px-5 black--text"
                >
                  <template
                    v-for="(line, i) in $tr('china.bedroom-note', 'array')"
                  >
                    <div :key="i" :inner-html.prop="line" class="lh-3-1"></div>
                  </template>
                </div>
              </v-layout>
            </v-img>
          </div>
          <v-card-actions class="mt-4 px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              :data-video-start="`${stepId}-x2`"
              class="px-4"
              color="primary"
              depressed
              large
              tile
              @click="nextStep"
            >
              {{ $t('next') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-show="step === 2" class="transparent" flat tile>
          <div>
            <v-img
              height="450px"
              width="600px"
              :src="require('@/assets/images/games/china/letter.jpg')"
              contain
            >
              <v-layout fill-height justify-center>
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
              :data-video-start="`${stepId}-x3`"
              class="px-4"
              color="primary"
              depressed
              large
              tile
              @click="nextStep"
            >
              {{ $t('next') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <privacy-notice
          v-if="showPrivacyNotice"
          v-model="showPrivacyNotice"
          :is-form="isPrivacyForm"
          @input="(value) => (!value ? step++ : null)"
          @next="validatePrivacyHandler"
        />
        <v-card
          v-show="step === 5"
          class="transparent mx-auto"
          flat
          max-width="600"
          tile
        >
          <v-card
            class="mx-auto info-screen primary border-3"
            flat
            light
            max-height="90vh"
            tile
          >
            <v-card-text class="pt-8 white--text">
              <div class="text-body-1 white--text mb-2">
                {{ $t('privacy-notice.questions.title') }}
              </div>
              <template v-for="(q, i) in questions">
                <div :key="i">
                  <div
                    :class="{
                      'white--text': !hasError,
                      'error--text': hasError,
                    }"
                  >
                    {{ $t(`privacy-notice.questions.${q.question}.text`) }}
                  </div>
                  <v-radio-group v-model="q.value" :error="hasError">
                    <template
                      v-for="(option, i) in $tr(
                        `privacy-notice.questions.${q.question}.options`,
                        'array'
                      )"
                    >
                      <v-radio
                        :key="`o-${i}`"
                        :label="option"
                        :value="i"
                        class="white--text"
                        color="white"
                        dark
                      ></v-radio>
                    </template>
                  </v-radio-group>
                </div>
              </template>
            </v-card-text>
          </v-card>
          <v-card-actions class="d-flex gap-6 pt-4">
            <v-btn
              class="px-6 mr-8"
              large
              @click="
                showPrivacyNotice = true;
                step--;
              "
            >
              <v-icon class="mr-2">mdi-keyboard-backspace</v-icon>
              {{ $t('privacy_notice') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="px-6"
              color="primary"
              dark
              depressed
              tile
              x-large
              @click="showCorrectAnswerResults"
            >
              <span class="me-3">
                {{ $t('next') }}
              </span>
              <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card
          v-show="foundObject.name === 'note'"
          class="transparent"
          flat
          tile
        >
          <div>
            <v-img
              :src="require('@/assets/images/games/china/note.png')"
              contain
            >
              <v-layout fill-height justify-center>
                <div
                  class="f-hand text-h4 font-weight-medium pt-12 px-16 black--text"
                >
                  <template
                    v-for="(line, i) in $tr(
                      'note-from-prev-passenger',
                      'array'
                    )"
                  >
                    <div :key="i" :inner-html.prop="line" class="lh-3-7"></div>
                  </template>
                </div>
              </v-layout>
            </v-img>
          </div>
          <v-card-actions class="mt-4 px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              class="px-4"
              color="primary"
              depressed
              large
              tile
              @click="foundObject.name = ''"
            >
              {{ $t('next') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <score-board-inline
        :model="result.model"
        :passed="result.passed"
        :perc="result.perc"
        @restart="restart()"
      >
      </score-board-inline>
    </v-container>
    <div v-if="step === 3 && videos.intro.ended" class="items-container">
      <template v-for="(item, i) in rotatableItems">
        <div
          :key="i"
          :class="[`item-${item.name}`, `dir-${item.dir}`]"
          class="item"
          @click="rotateItem(i)"
        >
          <img
            :alt="`item-${item.name}-${item.dir}`"
            :draggable="false"
            :src="
              require(`@/assets/images/games/china/items/${item.name}_${item.dir}.png`)
            "
          />
        </div>
      </template>
    </div>
    <v-dialog
      v-if="foundObject.name !== 'note'"
      v-model="foundObject.model"
      :retain-focus="false"
      class="elevation-0"
      content-class="elevation-0"
      max-width="600"
      overlay-opacity="0"
      persistent
      scrollable
    >
      <div>
        <v-card class="transparent mx-auto" flat light tile>
          <div class="mb-4">
            <v-card class="info-screen py-3 border-3" flat light tile>
              <v-card-text>
                <v-layout align-center class="gap-2" column justify-center>
                  <div class="mb-4 text-center">
                    <v-avatar size="120" tile>
                      <v-img
                        v-if="foundObject.name"
                        :src="
                          require(`@/assets/images/games/china/symbols/${foundObject.name}.svg`)
                        "
                        contain
                      ></v-img>
                    </v-avatar>
                    <div class="f-tech text-body-1">
                      {{ $t(`found-object.items.${foundObject.name}`) }}
                    </div>
                    <div class="f-tech pt-2 text-body-2">
                      {{
                        $t(
                          `found-object.items-explanations.${foundObject.name}`
                        )
                      }}
                    </div>
                  </div>
                  <div class="w-full mb-5">
                    <v-divider></v-divider>
                  </div>
                  <template
                    v-if="foundObject.items.length === foundObject.count"
                  >
                    <!-- Found All Symbols -->
                    <div class="text-h5">
                      {{ $t('found-object.found-last') }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-h5">
                      {{ $t('found-object.title') }}
                    </div>
                    <div>
                      {{
                        $t('found-object.find-x-more', {
                          x: foundObject.count - foundObject.items.length,
                        })
                      }}
                    </div>
                  </template>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
        <v-card-actions class="mt-4 px-6 pb-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-4"
            color="primary"
            depressed
            large
            tile
            @click="hideFoundObjectModel"
          >
            {{ $t('next') }}
            <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>
    <v-dialog
      v-if="showAllSymbols"
      v-model="showAllSymbols"
      :retain-focus="false"
      class="elevation-0"
      content-class="elevation-0 d-block"
      max-width="850"
      overlay-opacity="0"
      persistent
      scrollable
    >
      <v-card
        style="flex: none; height: 100%"
        class="mx-auto pa-8 info-screen"
        flat
        light
        tile
      >
        <div class="text-center font-weight-bold mb-4">
          {{ $t(`found-object.found-all`) }}
        </div>
        <div
          class="d-flex justify-space-between align-center py-2"
          v-for="(symbol, sKey, sIdx) in $t(`found-object.items`)"
          :key="sKey"
          :style="sIdx !== 4 && 'border-bottom: 1px solid lightgray'"
        >
          <div style="width: 120px" class="text-body-1 text-capitalize">
            {{ sKey }}
          </div>
          <div style="width: 210px" class="text-body-1">{{ symbol }}</div>
          <div style="width: 440px" class="text-body-2">
            {{ $t(`found-object.items-explanations`)[sKey] }}
          </div>
        </div>
      </v-card>
      <v-card-actions class="mt-4 px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          class="px-4"
          color="primary"
          depressed
          large
          tile
          :data-video-start="`${stepId}-x4`"
          @click="
            showAllSymbols = false;
            nextStep();
          "
        >
          {{ $t('next') }}
          <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </div>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice.vue';

export default {
  components: {
    PrivacyNotice,
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'china',
    step: 1,
    videos: {
      intro: {
        ended: false,
      },
    },
    questions: [
      {
        question: 'q1',
        value: null,
        correctValue: 0,
      },
      {
        question: 'q2',
        value: null,
        correctValue: 1,
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
      {
        name: 'alarm',
        dir: 'front',
        correctDir: 'left',
        object: 'hourglass',
        isOpened: false,
      },
      {
        name: 'boat',
        dir: 'front',
        correctDir: 'back',
        object: 'bridge',
        isOpened: false,
      },
      {
        name: 'book',
        dir: 'front',
        correctDir: 'back',
        object: 'handshake',
        isOpened: false,
      },
      {
        name: 'candle',
        dir: 'front',
        correctDir: 'right',
        object: 'note',
        isOpened: false,
      },
      {
        name: 'charger',
        dir: 'front',
        correctDir: 'back',
        object: null,
        isOpened: false,
      },
      {
        name: 'cup',
        dir: 'front',
        correctDir: 'bot',
        object: 'eye',
        isOpened: false,
      },
      {
        name: 'key',
        dir: 'front',
        correctDir: 'left',
        object: 'lock',
        isOpened: false,
      },
      {
        name: 'pillow',
        dir: 'front',
        correctDir: 'back',
        object: null,
        isOpened: false,
      },
    ],
    dirs: ['front', 'back', 'left', 'right', 'top', 'bot'],
    foundObject: {
      model: false,
      name: '',
      items: [],
      count: 5,
    },
    showAllSymbols: false,
    hasError: false,
    showPrivacyNotice: false,
    isPrivacyForm: false,
  }),
  computed: {
    nextDisabled() {
      let disabled = false;
      this.questions.forEach((question) => {
        if (
          (!question?.value && question?.value !== 0) ||
          question.value !== question.correctValue
        ) {
          disabled = true;
        }
      });
      return disabled;
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
    this.$nuxt.$on(`video-${this.stepId}-x3-ended`, () => {
      this.introEnded(true);
    });
    this.$nuxt.$on(`video-${this.stepId}-x4-ended`, () => {
      this.introEnded(true);
      setTimeout(() => {
        this.showPrivacyNotice = true;
        this.isPrivacyForm = false;
      }, 1000);
    });
    this.$nuxt.$on(`video-${this.stepId}-x5-ended`, () => {
      this.finish();
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
      this.$set(this, 'questionModel', 0);
      this.$set(this, 'seTypeSelectModel', 0);
      this.$set(this, 'seTypeAnswerPicker', null);
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
      this.rotatableItems.forEach((_, i) => {
        this.$set(this.rotatableItems[i], 'dir', 'front');
      });
      this.$set(this.foundObject, 'items', []);
      this.$set(this.foundObject, 'model', false);
      this.$set(this.foundObject, 'name', '');
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
      return 100;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
    viewEmail() {
      this.playGameSound('big-button-press-2');
      this.$set(this, 'step', 2);
    },
    replyToEmail() {
      this.playGameSound('big-button-press-2');
      this.$set(this, 'step', 3);
    },
    showCorrectAnswerResults() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        steps: [`privacy-notice.questions.description`],
        showNextArrow: true,
        nextMethod: this.nextStep,
      });
    },
    nextStep(event) {
      this.hasError = false;
      if (this.step === 5) {
        if (this.nextDisabled) {
          this.hasError = true;
          return;
        }
        this.showPrivacyNotice = true;
        this.isPrivacyForm = true;
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          title: this.$t('screens.china.title2'),
          steps: ['screens.china.a2'],
        });
        return;
      }
      if (this.step < 5) {
        this.step++;
      }
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
      if (this.step === 4) {
        this.$set(this.videos.intro, 'ended', false);
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x4`);
        setTimeout(() => {
          this.replaceBg('china-v4');
        }, 1000);
      }
      if (this.step === 6) {
        this.$store.commit('SET_VIDEO_IS_SKIPPABLE', false);
        this.$set(this.videos.intro, 'ended', false);
        event.target['data-video-start'] = `${this.stepId}-x5`;
        this.$store.commit('PLAY_VIDEO', `${this.stepId}-x5`);
        setTimeout(() => {
          this.replaceBg('china-v5');
        }, 1000);
      }
    },
    validatePrivacyHandler() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        steps: [`privacy-notice.questions.congratulations`],
        showNextArrow: true,
        nextMethod: (nextEvent) => {
          this.showPrivacyNotice = false;
          this.step = 6;
          this.nextStep(nextEvent);
        },
      });
    },
    rotateItem(i = 0) {
      const foundObjects = this.foundObject.items;
      const item = this.rotatableItems[i];
      const dirs = this.dirs;
      let nextDirIndex = dirs.indexOf(item.dir) + 1;
      if (nextDirIndex === dirs.length) {
        nextDirIndex = 0;
      }
      const nextDir = dirs[nextDirIndex];
      item.dir = nextDir;
      if (
        item.dir === item.correctDir &&
        item.object &&
        !foundObjects.includes(item.object)
      ) {
        this.showObject(item.object);
      }
    },
    showObject(name = '') {
      this.$set(this.foundObject, 'name', name);
      if (name !== 'note') {
        this.foundObject.items.push(name);
        this.$set(this.foundObject, 'model', true);
      }
    },
    hideFoundObjectModel() {
      this.$set(this.foundObject, 'model', false);
      if (this.foundObject.items.length === this.foundObject.count) {
        this.showAllSymbols = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/pages/game-china.scss';
</style>
