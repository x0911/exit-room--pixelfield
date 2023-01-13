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
            cols="10"
          >
            <v-col class="my-0 mx-auto" cols="3">
              <div
                class="font-weight-bold white--text pl-10 pt-10 body-1 d-flex justify-center"
              >
                {{ line.category }}
              </div>
            </v-col>
            <v-col cols="7">
              <div class="body-2 pl-6 pt-6 white--text pr-10 text-left">
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
  name: 'MissingPrivacyNotice',
  props: {
    value: {
      type: Boolean,
      default: null
    }
  }
};
</script>
