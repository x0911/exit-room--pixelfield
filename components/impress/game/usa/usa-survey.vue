<template>
  <v-card class="pa-6 mx-auto" flat light max-width="600" rounded tile>
    <v-card-text class="pa-4">
      <div class="text-body-1 mb-4 font-weight-bold">
        {{ $t(`usa.questions.${step}.label`) }}
      </div>
      <v-radio-group v-model="selectedOption" :error="hasErrors" hide-details>
        <v-radio
          v-for="(option, index) in options"
          :key="option.id"
          :class="{ 'pb-4': index !== options.length - 1 }"
          :label="option.text"
          :value="option.id"
          class="ma-0 caption"
          color="primary"
        />
      </v-radio-group>
      <div class="d-flex justify-center mt-10">
        <v-btn
          class="px-6 mr-4"
          large
          tile
          @click="
            playGameSound('big-button-press-1');
            step === 1 ? $emit('cancel') : step--;
          "
        >
          <span>{{ step === 1 ? $t('cancel') : $t('previous') }}</span>
        </v-btn>
        <v-btn
          class="px-6 mr-4"
          color="primary"
          large
          tile
          @click="validateFormHandler"
        >
          <span>{{ $t('next') }}</span>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'UsaSurvey',
  data() {
    return {
      step: 1,
      hasErrors: false,
      selectedOption: null,
    };
  },
  computed: {
    options() {
      return this.$t(`usa.questions.${this.step}.options`).map(
        (option, index) => ({
          id: index,
          text: option,
          value: false,
        })
      );
    },
    canProceedNext() {
      return (
        this.selectedOption ===
        this.$t(`usa.questions.${this.step}.correctOptions`)[0]
      );
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.hasErrors = false;
      },
    },
    step() {
      this.selectedOption = null;
    },
    selectedOption() {
      this.hasErrors = false;
    },
  },
  methods: {
    validateFormHandler() {
      this.playGameSound('big-button-press-1');
      this.hasErrors = false;
      if (!this.canProceedNext) {
        this.hasErrors = true;
        return;
      }
      this.step === 1 ? this.step++ : this.$emit('next');
    },
  },
};
</script>
