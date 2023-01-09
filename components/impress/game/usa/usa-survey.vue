<template>
  <v-card max-width="600" tile flat rounded light class="pa-6 mx-auto">
    <v-card-text class="pa-4">
      <div class="text-body-1 mb-4 font-weight-bold">
        {{
          step === 1
            ? $t('usa.questions.1.label')
            : $t('pick-response-to-continue')
        }}
      </div>
      <v-checkbox
        v-for="option in options"
        :key="option.id"
        v-model="option.value"
        :error="hasError"
        color="primary"
        class="ma-0 mb-2 caption"
        hide-details
        :label="option.text"
        :value="option.value"
      />
      <div class="d-flex justify-center mt-10">
        <v-btn
          v-if="step === 1"
          tile
          class="px-6 mr-4"
          large
          @click="$emit('cancel')"
        >
          <span>{{ $t('cancel') }}</span>
        </v-btn>
        <v-btn v-if="step === 2" tile class="px-6 mr-4" large @click="step--">
          <span>{{ $t('previous') }}</span>
        </v-btn>
        <v-btn
          color="primary"
          tile
          class="px-6 mr-4"
          large
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
    };
  },
  computed: {
    canProceedNext() {
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
            id: index + 1,
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
