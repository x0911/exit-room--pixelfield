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
      class="mx-auto overflow-auto"
      light
      max-height="85vh"
      max-width="800"
    >
      <v-img
        :src="
          require('~/assets/images/games/china/items/privacy-part-2_front.png')
        "
      >
        <v-row>
          <div
            v-for="(line, index) in $t(
              'china.missing-privacy-notice.table.content'
            )"
            :key="index"
            class="d-flex pt-5"
            cols="12"
          >
            <v-col class="my-0 mx-auto pl-4" cols="4">
              <div
                class="font-weight-bold d-flex align-center pt-10 pl-16 ml-6 text-size-8"
              >
                {{ line.category }}
              </div>
            </v-col>
            <v-col class="pl-4" cols="8">
              <div class="text-size-7 white--text px-16 py-6 text-left">
                {{ line.description }}
              </div>
            </v-col>
          </div>
        </v-row>
      </v-img>
    </v-card>
    <div class="d-flex justify-center">
      <v-btn
        class="mt-4 px-4"
        large
        @click="
          this.playGameSound('big-button-press-1');
          $emit('input', false);
        "
      >
        {{ $t('china.privacy-notice.close-and-call-franklin') }}
        <v-icon class="ml-2">mdi-close</v-icon>
      </v-btn>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'MissingPrivacyNotice',
  props: {
    value: {
      type: Boolean,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.text-size-7 {
  font-size: 0.7rem !important;
  color: white !important;
}

.text-size-8 {
  font-size: 0.85rem !important;
  color: white !important;
}
</style>
