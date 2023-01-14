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
          <v-col class="my-0 mx-auto" cols="10">
            <div
              class="white--text text-body-2 font-weight-medium mt-4 pt-8 pb-4 text-center"
            >
              {{ $t('china.privacy-notice.description') }}
            </div>
            <div class="white--text text-body-2 font-weight-medium text-center">
              {{ $t('china.privacy-notice.table.title') }}
            </div>
          </v-col>
          <v-col class="mx-auto my-0" cols="11">
            <v-simple-table class="transparent">
              <thead>
                <tr>
                  <th
                    class="pl-10 pr-0 font-weight-bold font-size-7"
                    style="min-width: 285px"
                  >
                    {{ $t('china.privacy-notice.table.headers[0]') }}
                  </th>
                  <th class="pl-4 font-weight-bold font-size-7">
                    {{ $t('china.privacy-notice.table.headers[1]') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in $t(
                    'china.privacy-notice.table.content'
                  )"
                  :key="index"
                  class="table-line"
                >
                  <td class="font-weight-bold pl-10 font-size-7">
                    {{ item.category }}
                  </td>
                  <td class="text-size-6 pr-10 text-left">
                    {{ item.description }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <div id="cardBottom" />
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <div class="privacy-notice-actions d-flex justify-center">
      <v-btn
        :disabled="canScroll ? !isScrollFinished : false"
        class="mt-4 px-4"
        large
        @click="$emit('input', false)"
      >
        {{ $t('china.privacy-notice.close') }}
        <v-icon class="ml-2">mdi-close</v-icon>
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
  },
  data() {
    return {
      isScrollFinished: false,
    };
  },
  computed: {
    canScroll() {
      return this.value && this.scrollToBottom;
    },
  },
  watch: {
    canScroll: {
      immediate: true,
      handler(value) {
        if (value) {
          setTimeout(() => {
            const cardBottomRef = document.getElementById('cardBottom');
            cardBottomRef.scrollIntoView({ behavior: 'smooth' });
            this.isScrollFinished = true;
          }, 1000);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/privacy-notice.scss';
</style>
