<template>
  <div>
    <v-card light tile flat class="transparent mx-auto">
      <div class="mb-4">
        <v-card light tile flat class="info-screen border-3">
          <template v-for="(q, i) in questions">
            <v-card-text :key="i" class="py-6">
              <template v-if="q.isLink">
                <div class="mb-1">
                  <v-btn
                    small
                    text
                    class="text-underline f-odibee-sans px-0"
                    @click="privacyNotes.model = true"
                  >
                    <v-icon small class="me-1">mdi-launch</v-icon>
                    {{ $t('click-to-open-privacy-notice') }}
                  </v-btn>
                </div>
              </template>
              <div
                class="mb-2 text-body-1 font-weight-medium"
                :class="{ 'error--text': hasErrors }"
              >
                {{ $tr(`brazil.questions.${i + 1}.label`) }}
              </div>
              <template if="q.type === 'checkbox'">
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
    <v-dialog
      v-model="privacyNotes.model"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0 overflow-auto max-h-100"
      :retain-focus="false"
      scrollable
      max-width="800"
    >
      <v-card max-width="800" max-height="90vh" class="mx-auto">
        <v-img
          :src="
            require('~/assets/images/games/china/items/privacy_notice_front.png')
          "
        >
          <v-card-title
            class="d-block text-center mt-16 pt-12 text-h4 font-weight-bold"
          >
            <span class="ls-10">
              {{ $tr('privacy-notice.title') }}
            </span>
          </v-card-title>
          <v-sheet
            color="transparent"
            class="pt-0 mx-auto"
            tile
            max-width="600"
          >
            <v-card-subtitle
              class="mt-16 pt-4 pb-0 d-block text-center text-caption"
            >
              {{ $tr('privacy-notice.text-1') }}
            </v-card-subtitle>
            <v-card-subtitle class="d-block text-center text-caption">
              {{ $tr('privacy-notice.text-2') }}
            </v-card-subtitle>
          </v-sheet>
          <v-card-text class="px-16 pt-6">
            <v-data-table
              hide-default-footer
              :headers="privacyNoticeHeaders"
              :items="privacyNoticeItems"
              disable-sort
              disable-filtering
              disable-pagination
              class="transparent"
            ></v-data-table>
          </v-card-text>
        </v-img>
        <v-card-actions class="d-flex justify-end gap-6 pt-4">
          <v-btn
            dark
            color="primary"
            class="px-6"
            x-large
            depressed
            tile
            @click="privacyNotes.model = false"
          >
            <span class="me-3">
              {{ $t('hide') }}
            </span>
            <v-icon large>mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player.js';

export default {
  name: 'BrazilSurvey',
  mixins: [SoundPlayer],
  data() {
    return {
      privacyNotes: {
        model: false,
      },
      questions: [
        {
          question: '',
          value: null,
          correctValue: 1,
          type: 'checkbox',
        },
        {
          question: '',
          value: null,
          correctValue: 0,
          type: 'checkbox',
        },
        {
          question: '',
          value: null,
          correctValue: 1,
          type: 'checkbox',
          isLink: true,
        },
      ],
      hasErrors: false,
    };
  },
  computed: {
    isDisabled() {
      return this.questions.some((question) => question.value === null);
    },
    isWrong() {
      return this.questions.some(
        (question) =>
          question.value === null || question.value !== question.correctValue
      );
    },
    privacyNoticeHeaders() {
      return [
        {
          text: this.$t('privacy-notice.headers.name'),
          value: 'name',
        },
        {
          text: this.$t('privacy-notice.headers.desc'),
          value: 'desc',
        },
      ];
    },
    privacyNoticeItems() {
      const items = [];
      for (let i = 0; i < 4; i++) {
        items.push({
          name: this.$t(`privacy-notice.items.${i + 1}.name`),
          desc: this.$t(`privacy-notice.items.${i + 1}.desc`),
        });
      }
      return items;
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
