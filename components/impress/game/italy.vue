<template>
  <v-container>
    <v-dialog
      :value="videos.intro.ended && model === 0"
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
              <v-card-text class="py-6">
                <template v-for="(q, i) in questions">
                  <div :key="i" class="mb-5">
                    <div
                      v-if="q.hasTitle"
                      class="mb-4 text-h6 font-weight-bold"
                    >
                      {{ $tr(`italy.questions-indexes.${i + 1}`) }})
                      {{ $tr(`italy.questions-titles.${i + 1}`) }}
                    </div>
                    <div class="mb-2 text-body-1 font-weight-medium">
                      {{ $tr(`italy.questions.${i + 1}.label`) }}
                    </div>
                    <template v-if="!q.type || q.type === 'text'">
                      <v-text-field
                        v-model="q.value"
                        filled
                        rounded
                        class="rounded-sm"
                        hide-details
                      ></v-text-field>
                    </template>
                    <template v-else-if="!q.multiple && q.type === 'checkbox'">
                      <v-radio-group v-model="q.value" hide-details>
                        <template
                          v-for="(answer, ai) in $tr(
                            `italy.questions.${i + 1}.options`,
                            'array'
                          )"
                        >
                          <v-radio :key="ai" :value="ai" :label="answer">
                          </v-radio>
                        </template>
                      </v-radio-group>
                    </template>
                    <template v-else-if="q.multiple && q.type === 'checkbox'">
                      <template
                        v-for="(answer, ai) in $tr(
                          `italy.questions.${i + 1}.options`,
                          'array'
                        )"
                      >
                        <v-checkbox
                          :key="ai"
                          v-model="q.value"
                          hide-details
                          :value="ai"
                          multiple
                          :label="answer"
                        >
                        </v-checkbox>
                      </template>
                    </template>
                    <template v-else-if="q.type === 'dropdown'">
                      <v-select
                        v-model="q.value"
                        filled
                        rounded
                        class="rounded-sm"
                        hide-details
                        :items="q.options"
                        :item-text="q.itemText || null"
                        :item-value="q.itemValue || null"
                      ></v-select>
                    </template>
                  </div>
                </template>
              </v-card-text>
              <v-overlay v-model="loading" absolute dark>
                <v-progress-circular
                  color="white"
                  indeterminate
                  size="60"
                ></v-progress-circular>
              </v-overlay>
            </v-card>
          </div>
          <div class="d-flex justify-center pb-6 gap-6 pt-4">
            <v-btn
              dark
              color="primary"
              class="px-6 custom-disabled-state"
              x-large
              depressed
              tile
              :disabled="nextDisabled || loading"
              @click="
                finish();
                playGameSound('big-button-press-1');
              "
            >
              <span class="me-3">
                {{ $t('finish') }}
              </span>
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
      :step-id="stepId"
      :disable-try-again="true"
      @restart="restart"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '~/components/ScoreBoardInline.vue';

import ImpressStep from '@/mixins/impress-step.js';
import { countries } from '@/assets/js/countries';
export default {
  components: {
    ScoreBoardInline,
  },
  mixins: [ImpressStep],
  data() {
    return {
      stepId: 'italy',
      loading: false,
      model: 0,
      videos: {
        intro: {
          ended: false,
        },
      },
      questions: [
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
          hasTitle: true,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: [],
          type: 'checkbox',
          multiple: true,
          hasTitle: true,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
          hasTitle: true,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
          hasTitle: true,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          multiple: false,
          hasTitle: true,
        },
        {
          question: '',
          value: null,
          type: 'dropdown',
          multiple: false,
          hasTitle: true,
          options: countries,
          itemText: 'name',
          itemValue: 'code',
        },
      ],
      result: {
        model: false,
        perc: 0,
        passed: false,
      },
    };
  },
  computed: {
    nextDisabled() {
      let isDisabled = false;
      this.questions.forEach((q) => {
        if (!q.value && q.value !== 0) {
          isDisabled = true;
        }
      });
      return isDisabled;
    },
  },
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.videoEnded);
  },
  methods: {
    resetValues() {
      this.questions.forEach((q) => {
        q.value = null;
      });
    },
    stepEnter() {
      // Always leave method `stepEnter` even if not used
    },
    stepLeave() {
      this.resetValues();
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'model', 0);
    },
    restart() {
      this.stepLeave();
      setTimeout(() => {
        this.stepEnter();
      }, 100);
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.italy.title'),
        steps: ['screens.italy.a1'],
        nextMethod: () => this.$nuxt.$emit('play-main-audio')
      });
    },
    videoEnded() {
      this.$store.commit('STOP_VIDEOS');
      this.$set(this.videos.intro, 'ended', true);
      setTimeout(() => {
        this.openIntro();
      }, 200);
    },
    async finish() {
      if (!this.nextDisabled) {
        this.$nuxt.$emit('pause-main-audio');
        const score = this.getScore();
        try {
          const info = this.getActiveTaskInfo();
          const questions = [...this.questions].map((q, i) => {
            const qTitleIndex = this.$t(`italy.questions.${i + 1}.title`);
            const qTitle = this.$t(`italy.questions-titles.${qTitleIndex}`);
            const qTextInset = this.$t(`italy.questions.${i + 1}.label`);
            const qText = `${qTitle} ( ${qTextInset} )`;
            let answerText = q.value;
            if (q.type === 'dropdown') {
              answerText = q.options.find((o) => o[q.itemValue] === q.value)[
                q.itemText
              ];
            }
            if (q.type === 'checkbox') {
              if (q.multiple) {
                const arr = [];
                q.value.forEach((v) => {
                  arr.push(this.$tr(`italy.questions.${i + 1}.options`)[v]);
                });
                answerText = arr;
              } else {
                answerText = this.$tr(`italy.questions.${i + 1}.options`)[
                  q.value
                ];
              }
            }

            const answerId = q.type === 'text' ? null : q.value;
            const answers = [];
            if (Array.isArray(answerId)) {
              answerId.forEach((id, index) =>
                answers.push({ answer_id: id, answer_text: answerText[index] })
              );
            } else {
              answers.push({
                answer_id: answerId,
                answer_text: answerText,
              });
            }

            return {
              question_id: i + 1,
              question_text: qText,
              answers,
              is_correct: true,
            };
          });
          await this.$store.dispatch('createTask', {
            task_result: score,
            questions,
            task_id: info.taskId,
            task_name: info.taskName,
          });
          const country = questions[questions.length - 1].answers[0].answer_id;
          const locale =
            localStorage.getItem('data-protection-language') || 'en';
          const localStorageCountry =
            localStorage.getItem('data-protection-country') || 'unknown';
          if (country) {
            localStorage.setItem('data-protection-country', country);
          }
          await this.$store.dispatch('updateLang', {
            selected_lang: locale,
            country: country || localStorageCountry,
          });
        } catch (err) {
          console.log(err);
        }
        this.$set(this.result, 'perc', score);
        this.$set(this.result, 'passed', score === 100);
        this.$store.commit('SET_SCORE_BOARD_DIALOG', {
          model: false,
          score: this.result.perc,
          game: 'italy',
        });
        this.stepLeave();
        this.showResultDialog();
      }
    },
    getScore() {
      // Always 100 for this survey
      return 100;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
  },
};
</script>
