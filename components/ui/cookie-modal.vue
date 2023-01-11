<template>
  <v-dialog
    :value="value"
    persistent
    max-width="600"
    scrollable
    content-class="elevation-0"
  >
    <v-card class="transparent">
      <v-card-text class="pa-0 info-screen v-card darken border-3">
        <v-card class="transparent">
          <v-card-title>
            {{ $t('cookies.title') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-5">
            <template v-for="(line, i) in $t('cookies.text')">
              <div :key="i" class="mb-3" :inner-html.prop="line"></div>
            </template>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions class="mt-4 px-6">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          tile
          depressed
          large
          class="px-5"
          @click="acceptCookies"
        >
          {{ $t('accept') }}
          <v-icon class="ms-2">mdi-keyboard-backspace mdi-rotate-180</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    selfActivate: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.checkCookieAccepted();
  },
  methods: {
    checkCookieAccepted() {
      if (!this.selfActivate) return;
      setTimeout(() => {
        const accepted =
          localStorage.getItem(`privacy-game-cookie-accepted`) || 'false';
        if (accepted === 'true') {
          this.$emit('input', false);
        } else {
          this.$emit('input', true);
        }
      }, 2000);
    },
    acceptCookies() {
      localStorage.setItem(`privacy-game-cookie-accepted`, 'true');
      this.$emit('input', false);
    },
  },
};
</script>
