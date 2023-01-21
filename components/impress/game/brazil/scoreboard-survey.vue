<template>
  <v-card light class="info-screen pa-8">
    <div
      :class="{ 'mb-6': qIndex !== questions.length - 1 }"
      v-for="(question, qIndex) in questions"
      :key="qIndex"
    >
      <div class="pb-2 text-body-1">{{ question.label }}</div>
      <v-radio-group
        v-for="(option, oIdx) in question.options"
        :key="oIdx"
        class=""
        v-model="question.value"
        :error="hasErrors"
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
        color="primary"
        large
        class="px-6 font-weight-light"
        tile
        depressed
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
      })),
      hasErrors: false,
    };
  },
  computed: {
    isInvalid() {
      return this.questions.some(({ value }) => value === null);
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
  methods: {
    validateHandler() {
      if (this.isInvalid) {
        this.hasErrors = true;
      } else {
        this.$emit('finish');
      }
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
