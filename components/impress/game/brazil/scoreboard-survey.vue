<template>
  <v-card flat class="transparent pa-8">
    <div
      v-for="(question, qIndex) in questions"
      :key="qIndex"
      :class="{ 'mb-6': qIndex !== questions.length - 1 }"
    >
      <div
        :class="{ 'error--text': question.hasError }"
        class="pb-2 text-body-1"
      >
        {{ question.label }}
      </div>
      <v-radio-group
        v-for="(option, oIdx) in question.options"
        :key="oIdx"
        v-model="question.value"
        :error="question.hasError"
        class=""
        hide-details
      >
        <v-radio
          :label="option"
          :value="option"
          class="ma-0 text-body-1"
          color="primary"
          hide-details
        />
      </v-radio-group>
    </div>
    <div class="d-flex justify-center">
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
</template>

<script>
export default {
  name: 'ScoreboardSurvey',
  data() {
    return {
      questions: this.$t(`brazil.scoreboard-questions`).map((question) => ({
        ...question,
        value: null,
        correctAnswer: 'No',
        hasError: false,
      })),
    };
  },
  computed: {
    isValid() {
      return this.questions.every(
        ({ value, correctAnswer }) => value && value === correctAnswer
      );
    },
  },
  methods: {
    validateHandler() {
      this.playGameSound('big-button-press-1');
      this.questions.forEach((question) => {
        question.hasError = question.value !== question.correctAnswer;
      });
      if (!this.isValid) return;
      this.$emit('finish');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-input--selection-controls {
  margin: 0;
}

::v-deep .v-input {
  &:nth-child(n) {
    margin-bottom: 0.5rem;
  }
}
</style>
