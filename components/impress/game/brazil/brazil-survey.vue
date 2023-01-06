<template>
  <v-card light tile flat class="transparent mx-auto">
    <div class="mb-4">
      <v-card light tile flat class="info-screen border-3">
        <template v-for="(q, i) in questions">
          <v-card-text
            :key="i"
            class="py-6"
            :class="{ 'd-flex align-center': q.type === 'link' }"
          >
            <div class="mb-2 text-body-1 font-weight-medium">
              {{ $tr(`brazil.questions.${i + 1}.label`) }}
            </div>
            <template v-if="q.type === 'link'">
              <v-icon role="button" class="ml-4 mb-2">mdi-launch</v-icon>
            </template>
            <template v-else-if="q.type === 'checkbox'">
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
                  >
                    {{ answer }}
                  </v-btn>
                </template>
              </v-btn-toggle>
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
        <span class="me-3">{{ $t('finish') }}</span>
        <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player.js';

export default {
  name: 'BrazilSurvey',
  mixins: [SoundPlayer],
  data() {
    return {
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
          value: 'link',
          type: 'link',
        },
      ],
    };
  },
  computed: {
    isDisabled() {
      return this.questions.some(
        (question) => !question.value && question.value !== 0
      );
    },
  },
  methods: {
    finishSurveyHandler() {
      this.playGameSound('big-button-press-1');
      this.$emit('next');
    },
  },
};
</script>
