<template>
  <v-dialog
    :value="value"
    content-class="elevation-0"
    max-width="600"
    persistent
    scrollable
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
              <div :key="i">
                <div
                  :inner-html.prop="line.title"
                  class="mb-1 text-decoration-underline"
                ></div>
                <div :inner-html.prop="line.description" class="mb-3"></div>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions class="mt-4 px-6">
        <v-spacer></v-spacer>
        <v-btn
          class="px-5"
          color="primary"
          depressed
          large
          tile
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
      }, 1000);
    },
    acceptCookies() {
      localStorage.setItem(`privacy-game-cookie-accepted`, 'true');
      this.$nuxt.$emit(`impress-step-enter-splash`);
      this.$emit('input', false);
    },
  },
};
</script>
