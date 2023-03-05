<template>
  <div>
    <v-card light tile flat class="transparent mx-auto">
      <div class="mb-4">
        <v-card class="info-screen border-3" light tile flat>
          <v-card-text class="py-6">
            <div
              v-for="(question, qIndex) in questions"
              :key="qIndex"
              :class="{ 'mb-6': qIndex !== questions.length - 1 }"
            >
              <div
                :inner-html.prop="question.label"
                :class="{ 'error--text': question.hasError }"
                class="pb-2 text-body-1 font-weight-medium"
              ></div>
              <v-radio-group
                v-for="(option, oIdx) in question.options"
                :key="oIdx"
                v-model="question.value"
                hide-details
              >
                <v-radio
                  :class="question.hasError ? 'error--text' : 'white--text'"
                  :label="option"
                  :value="option"
                  class="ma-0 text-body-1"
                  color="primary"
                  hide-details
                />
              </v-radio-group>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <div class="d-flex justify-center pb-6 gap-6 pt-4">
        <v-btn
          class="px-6 font-weight-light"
          color="primary"
          depressed
          large
          tile
          @click="validateHandler"
        >
          {{ $t('next') }}
          <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'UsaQuestions',
  data() {
    return {
      questions: this.$t(`usa.privacy-questions`).map((question) => ({
        ...question,
        value: null,
        hasError: false,
      })),
    };
  },
  computed: {
    answerNo() {
      return this.questions[0].options[1];
    },
    isValid() {
      return this.questions.every(({ value }) => {
        return value === this.answerNo;
      });
    },
  },
  methods: {
    updateQuestions() {
      this.questions.forEach((question) => {
        question.hasError = question.value !== this.answerNo;
      });
    },
    validateHandler(event) {
      this.playGameSound('big-button-press-1');
      this.updateQuestions();
      if (!this.isValid) return;
      this.$emit('next', event);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-input--selection-controls {
  margin: 0;
}

.error--text {
  ::v-deep label {
    color: var(--v-error-base) !important;
  }
}

::v-deep .v-input {
  &:nth-child(n) {
    margin-bottom: 0.5rem;
  }
}
</style>
