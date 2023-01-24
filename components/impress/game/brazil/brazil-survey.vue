<template>
  <div>
    <v-card class="transparent mx-auto" flat light tile>
      <div class="mb-4">
        <v-card class="info-screen border-3" flat light tile>
          <template v-for="(q, i) in questions">
            <v-card-text :key="i" class="py-4">
              <div
                :class="{ 'error--text': hasErrors }"
                class="mb-2 text-body-1 font-weight-medium"
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
                      :class="{ 'primary white--text': q.value === ai }"
                      :value="ai"
                    >
                      {{ answer }}
                    </v-btn>
                  </template>
                </v-btn-toggle>
              </template>
              <template v-if="q.isLink">
                <div class="my-1">
                  <v-btn
                    class="text-underline f-odibee-sans px-0"
                    small
                    text
                    @click="isPrivacyOpen = true"
                  >
                    <v-icon class="me-1" small>mdi-launch</v-icon>
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
          :disabled="isDisabled"
          class="px-6 custom-disabled-state"
          color="primary"
          dark
          depressed
          tile
          x-large
          @click="finishSurveyHandler"
        >
          <span class="me-3">{{ $t('next') }}</span>
          <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </div>
    </v-card>
    <privacy-notice v-if="isPrivacyOpen" v-model="isPrivacyOpen"/>
  </div>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player.js';
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice.vue';

export default {
  name: 'BrazilSurvey',
  components: {PrivacyNotice},
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
      const notAllAnswered = this.questions.some(({value}) => value === null);
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
