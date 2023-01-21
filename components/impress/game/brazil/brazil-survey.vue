<template>
  <div>
    <v-card light tile flat class="transparent mx-auto">
      <div class="mb-4">
        <v-card light tile flat class="info-screen border-3">
          <template v-for="(q, i) in questions">
            <v-card-text :key="i" class="py-4">
              <div
                class="mb-2 text-body-1 font-weight-medium"
                :class="{ 'error--text': hasErrors }"
              >
                {{ $tr(`brazil.questions.${i + 1}.label`) }}
              </div>
              <template v-if="q.type === 'checkbox'">
                <v-btn-toggle v-model="q.value">
                  <template
                    v-for="(answer, ai) in $tr(
                      `brazil.questions.${i + 1}.options`,
                      'array'
                    )"
                  >
                    <v-btn
                      :key="ai"
                      :value="ai"
                      :class="{ 'primary white--text': q.value === ai }"
                    >
                      {{ answer }}
                    </v-btn>
                  </template>
                </v-btn-toggle>
              </template>
              <template v-if="q.isLink">
                <div class="my-1">
                  <v-btn
                    small
                    text
                    class="text-underline f-odibee-sans px-0"
                    @click="isPrivacyOpen = true"
                  >
                    <v-icon small class="me-1">mdi-launch</v-icon>
                    {{ $tr(`brazil.questions.${i + 1}.link`) }}
                  </v-btn>
                </div>
              </template>
            </v-card-text>
          </template>
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
          :disabled="isDisabled"
          @click="finishSurveyHandler"
        >
          <span class="me-3">{{ $t('next') }}</span>
          <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </div>
    </v-card>
    <privacy-notice v-if="isPrivacyOpen" v-model="isPrivacyOpen" />
  </div>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player.js';
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice.vue';

export default {
  name: 'BrazilSurvey',
  components: { PrivacyNotice },
  mixins: [SoundPlayer],
  data() {
    return {
      isPrivacyOpen: false,
      questions: [
        {
          question: '',
          value: null,
          type: 'checkbox',
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          isLink: true,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          correctValue: 1,
        },
      ],
      hasErrors: false,
    };
  },
  computed: {
    isDisabled() {
      const notAllAnswered = this.questions.some(({ value }) => value === null);
      const lastQuestion = [...this.questions].pop();
      return notAllAnswered || lastQuestion.value !== lastQuestion.correctValue;
    },
  },
  methods: {
    finishSurveyHandler() {
      this.hasErrors = false;
      this.playGameSound('big-button-press-1');
      if (this.isWrong) {
        this.hasErrors = true;
        return;
      }
      this.$emit('next');
    },
  },
};
</script>
