<template>
  <privacy-notice
    v-if="isPrivacyOpen"
    v-model="isPrivacyOpen"
    :scroll-to-bottom="true"
  />
  <v-card
    v-else-if="isQuestionsOpen"
    class="pa-6 mx-auto"
    flat
    light
    max-width="600"
    rounded
    tile
  >
    <v-card-text class="pa-4">
      <div class="text-body-1 mb-4 font-weight-bold">
        {{ $t(`usa.questions.4.label`) }}
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
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice';
import SoundPlayer from '~/mixins/sound-player';

export default {
  name: 'PrivacySurvey',
  components: {PrivacyNotice},
  mixins: [SoundPlayer],
  data() {
    return {
      isPrivacyOpen: true,
      isQuestionsOpen: true,
      hasErrors: false,
      selectedOption: null,
    };
  },
  computed: {
    options() {
      return this.$t(`usa.questions.4.options`).map((option, index) => ({
        id: index,
        text: option,
        value: false,
      }));
    },
    canProceedNext() {
      return (
        this.selectedOption === this.$t(`usa.questions.4.correctOptions`)[0]
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
    selectedOption() {
      this.hasErrors = false;
    },
    isPrivacyOpen(value) {
      if (!value) {
        this.$emit('privacy-visible')
      }
    }
  },
  methods: {
    validateFormHandler() {
      this.playGameSound(`big-button-press-2`);
      this.hasErrors = false;
      if (!this.canProceedNext) {
        this.hasErrors = true;
        return;
      }
      this.$emit('privacy-hidden')
      this.isQuestionsOpen = false;
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        steps: ['screens.usa.look-around'],
        nextText: this.$t('next'),
        nextMethod: this.playVideo,
      });
    },
    playVideo(event) {
      event.target['data-video-start'] = 'usa-x2';
      this.$store.commit('PLAY_VIDEO', 'usa-x2');

      this.$nuxt.$on(`video-usa-x2-ended`, () => {
        event.target['data-video-start'] = null;
        this.$emit('next');
      });
    },
  },
};
</script>

<style scoped></style>
