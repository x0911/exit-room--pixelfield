<template>
  <div>
    <v-card class="transparent mx-auto" flat light tile>
      <div class="mb-4">
        <v-card class="info-screen border-3" flat light tile>

          <template>
            <div class="my-1 mt-4 pl-4">
              <v-btn
                class="text-underline  text-body-1 font-weight-bold f-odibee-sans px-0"
                small
                style="color: #444c61 !important"
                text
                @click="
                      playGameSound('big-button-press-1');
                      isPrivacyOpen = true;
                    "
              >
                <v-icon class="me-1 " small>mdi-launch</v-icon>
                {{ $tr(`brazil.questions.2.link`) }}
              </v-btn>
            </div>
          </template>

          <template v-for="(q, i) in questions">
            <v-card-text :key="i" class="py-4">
              <div
                :class="{ 'error--text': q.hasError }"
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
                      :class="{
                        'primary white--text': q.value === ai,
                        'error--text': q.hasError,
                      }"
                      :value="ai"
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
import PrivacyNotice from '~/components/impress/game/shared/privacy-notice.vue';

export default {
  name: 'BrazilSurvey',
  components: {PrivacyNotice},
  data() {
    return {
      isPrivacyOpen: false,
      questions: [
        {
          question: '',
          value: null,
          type: 'checkbox',
          hasError: false,
          correctValue: 1,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          hasError: false,
        },
        {
          question: '',
          value: null,
          type: 'checkbox',
          isLink: true,
          hasError: false,
          correctValue: 1
        },
      ],
    };
  },
  computed: {
    isNotValid() {
      return this.questions.some(({ hasError }) => hasError)
    },
  },
  methods: {
    finishSurveyHandler() {
      this.playGameSound('big-button-press-1');

      [0, 2].forEach(qIndex => {
        this.questions[qIndex].hasError = this.questions[qIndex].value !== this.questions[qIndex].correctValue;
      })

      if (this.isNotValid) return;
      this.$emit('next');
    },
  },
};
</script>
