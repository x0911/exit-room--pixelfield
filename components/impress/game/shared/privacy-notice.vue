<template>
  <v-dialog
    :retain-focus="false"
    :value="value"
    class="elevation-0"
    content-class="elevation-0 overflow-auto max-h-100"
    overlay-opacity="0"
    persistent
  >
    <v-card
      class="privacy-notice mx-auto overflow-auto"
      light
      max-height="85vh"
      max-width="800"
    >
      <v-img
        :src="
          require('~/assets/images/games/china/items/privacy_notice_front.png')
        "
      >
        <v-card-title
          class="d-block text-center mt-16 pt-12 white--text font-weight-bold"
        >
          <span class="white--text font-weight-bold text-h4">
            {{ $t('china.privacy-notice.title') }}
          </span>
        </v-card-title>
        <v-row>
          <v-col class="my-0 mx-auto" cols="12">
            <div
              class="white--text text-body-2 font-weight-medium mt-4 pt-10 pb-2 px-10 text-center"
            >
              {{ $t('china.privacy-notice.description') }}
            </div>
            <div class="white--text text-body-2 font-weight-medium text-center">
              {{ $t('china.privacy-notice.table.title') }}
            </div>
          </v-col>
          <v-col class="mx-auto my-0" cols="12">
            <v-simple-table class="transparent">
              <thead>
              <tr>
                <th
                  class="pl-16 pr-0 font-weight-bold text-size-7"
                  style="min-width: 315px"
                >
                  <div>{{ $t('china.privacy-notice.table.headers[0]') }}</div>
                </th>
                <th class="pl-10 font-weight-bold text-size-7">
                  {{ $t('china.privacy-notice.table.headers[1]') }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item, index) in options"
                :key="index"
                class="table-line"
              >
                <td
                  class="font-weight-bold d-flex gap-2 align-center pt-6 pl-16 ml-6 text-size-8"
                >
                  <v-checkbox
                    v-if="isForm"
                    v-model="item.value"
                    :error="hasErrors"
                    :value="item.value"
                    color="white"
                  />
                  <div :style="hasErrors && 'color: #FF5252 !important;'">
                    {{ item.category }}
                  </div>
                </td>
                <td
                  :style="hasErrors && 'color: #FF5252 !important;'"
                  class="text-size-7 white--text px-10 py-0 text-left"
                >
                  {{ item.description }}
                </td>
              </tr>
              </tbody>
            </v-simple-table>
            <div id="cardBottom"/>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <div class="privacy-notice-actions d-flex justify-center gap-8">
      <v-btn
        v-if="!isForm"
        :disabled="canScroll ? !isScrollFinished : false"
        class="mt-4 px-4"
        large
        @click="$emit('input', false)"
      >
        {{ $t('china.privacy-notice.close') }}
        <v-icon class="ml-2">mdi-close</v-icon>
      </v-btn>
      <v-btn
        v-else
        class="px-6 mt-4"
        color="primary"
        large
        tile
        @click="validateHandler"
      >
        {{ $t('next') }}
        <v-icon class="ml-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
      </v-btn>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'PrivacyNotice',
  props: {
    value: {
      type: Boolean,
      default: null,
    },
    scrollToBottom: {
      type: Boolean,
      default: false,
    },
    isForm: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isScrollFinished: false,
      options: this.$t('china.privacy-notice.table.content').map((item) => ({
        ...item,
        value: false,
      })),
      correctOptions: this.$t('china.privacy-notice.table.correctOptions'),
      hasErrors: false,
    };
  },
  computed: {
    canScroll() {
      return this.value && this.scrollToBottom;
    },
    isValidated() {
      return this.options.every(({value}, index) =>
        this.correctOptions.includes(index) ? value : !value
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
    canScroll: {
      immediate: true,
      handler(value) {
        if (value) {
          setTimeout(() => {
            const cardBottomRef = document.getElementById('cardBottom');
            cardBottomRef.scrollIntoView({behavior: 'smooth'});
            this.isScrollFinished = true;
          }, 1000);
        }
      },
    },
  },
  methods: {
    validateHandler(event) {
      if (!this.isValidated) {
        this.hasErrors = true;
      } else {
        this.$emit('next', event);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/privacy-notice.scss';
</style>
