<template>
  <v-card class="info-screen pa-8" light>
    <div
      v-for="(question, qIndex) in questions"
      :key="qIndex"
      :class="{ 'mb-6': qIndex !== questions.length - 1 }"
    >
      <div class="pb-2 text-body-1 font-weight-medium">{{ question.label }}</div>
      <v-radio-group
        v-for="(option, oIdx) in question.options"
        :key="oIdx"
        v-model="question.value"
        :error="hasErrors"
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
  name: 'UsaQuestions',
  data() {
    return {
      questions: this.$t(`usa.privacy-questions`).map((question) => ({
        ...question,
        value: null,
      })),
      hasErrors: false,
    };
  },
  computed: {
    isValid() {
      return this.questions.every(({value}) => {
        return value === 'No'
      });
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
    validateHandler(event) {
      if (!this.isValid) {
        this.hasErrors = true;
      } else {
        this.$emit('next', event);
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
