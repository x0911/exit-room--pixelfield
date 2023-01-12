<template>
  <v-card class="pa-6 mx-auto" flat light max-width="600" rounded tile>
    <v-card-text class="pa-4">
      <div class="text-body-1 mb-4 font-weight-bold">
       {{ $t('usa.questions.1.label') }}
      </div>
      <v-radio-group v-model="correctOption" :error="hasError" hide-details>
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
      <div class="d-flex justify-center mt-10">
        <v-btn
          class="px-6 mr-4"
          large
          tile
          @click="$emit('cancel')"
        >
          <span>{{ $t('cancel') }}</span>
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
  data() {
    return {
      hasError: false,
      correctOption: null,
      options: (this.options = this.$t(`usa.questions.1.options`).map(
        (option, index) => ({
          id: index,
          text: option,
          value: false,
        })
      )),
    };
  },
  computed: {
    canProceedNext() {
      return (
        this.correctOption ===
        this.$t(`usa.questions.1.correctOptions`)[0]
      );
    },
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.hasError = false;
      },
    },
    correctOption() {
      this.hasError = false;
    },
  },
  methods: {
    validateFormHandler() {
      this.playGameSound(`big-button-press-2`);
      this.hasError = false;
      if (!this.canProceedNext) {
        this.hasError = true;
        return;
      }
      this.$emit('next');
    },
  },
};
</script>
