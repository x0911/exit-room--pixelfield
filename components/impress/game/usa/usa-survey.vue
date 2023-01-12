<template>
  <v-card class="pa-6 mx-auto" flat light max-width="600" rounded tile>
    <v-card-text class="pa-4">
      <div class="text-body-1 mb-4 font-weight-bold">
        {{ step === 1 ? $t('usa.questions.1.label') : $t('choose-headlines') }}
      </div>
      <v-radio-group
        v-if="step === 1"
        v-model="correctFirstAnswer"
        :error="hasError"
        hide-details
      >
        <v-radio
          v-for="(option, index) in options"
          :key="option.id"
          :label="option.text"
          :value="option.id"
          class="ma-0 caption"
          :class="{ 'pb-4': index !== options.length - 1 }"
          color="primary"
        />
      </v-radio-group>
      <template v-else>
        <v-checkbox
          v-for="option in options"
          :key="option.id"
          v-model="option.value"
          :error="hasError"
          :label="option.text"
          :value="option.value"
          class="ma-0 mb-2 caption"
          color="primary"
          hide-details
        />
      </template>
      <div class="d-flex justify-center mt-10">
        <v-btn
          v-if="step === 1"
          class="px-6 mr-4"
          large
          tile
          @click="$emit('cancel')"
        >
          <span>{{ $t('cancel') }}</span>
        </v-btn>
        <v-btn v-if="step === 2" class="px-6 mr-4" large tile @click="step--">
          <span>{{ $t('previous') }}</span>
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
import SoundPlayer from '~/mixins/sound-player';

export default {
  name: 'UsaSurvey',
  mixins: [SoundPlayer],
  props: {
    canCancel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      step: 1,
      options: [],
      hasError: false,
      correctFirstAnswer: null,
    };
  },
  computed: {
    canProceedNext() {
      if (this.step === 1) {
        return (
          this.correctFirstAnswer ===
          this.$t(`usa.questions.${this.step}.correctOptions`)[0]
        );
      }
      return this.options.every(({ value }, index) =>
        this.$t(`usa.questions.${this.step}.correctOptions`).includes(index)
          ? value
          : !value
      );
    },
  },
  watch: {
    step: {
      immediate: true,
      handler() {
        this.options = this.$t(`usa.questions.${this.step}.options`).map(
          (option, index) => ({
            id: index,
            text: option,
            value: false,
          })
        );
      },
    },
    options: {
      deep: true,
      handler() {
        this.hasError = false;
      },
    },
    correctFirstAnswer() {
      this.hasError = false;
    },
  },
  methods: {
    validateFormHandler() {
      this.playGameSound(`big-button-press-${this.step === 1 ? 2 : 1}`);
      this.hasError = false;
      if (!this.canProceedNext) {
        this.hasError = true;
        return;
      }
      this.step === 1 ? this.step++ : this.$emit('next');
    },
  },
};
</script>
