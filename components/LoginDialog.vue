<template>
  <v-img
    v-if="!value"
    class="login-bg"
    :src="require('@/assets/images/bg/splash-bg.jpg')"
  >
    <v-dialog
      :value="true"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      max-width="420"
    >
      <v-card
        tile
        flat
        light
        class="info-screen border-3"
        width="90%"
        max-width="420"
      >
        <v-card-text class="pt-6 px-6 pb-1">
          <div class="font-weight-medium mb-4">
            {{ $t('screens.login.label') }}
          </div>
          <v-text-field
            v-model="password"
            type="password"
            filled
            :label="$t('screens.login.input-label')"
            rounded
            class="rounded-sm"
            persistent-hint
            :error-messages="
              wrongPassword ? $t('screens.login.incorrect-password') : null
            "
            @keypress.enter="login"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pb-4 px-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            large
            class="px-6 font-weight-light"
            tile
            depressed
            @click="login"
          >
            {{ $t('next') }}
            <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-img>
</template>

<script>
export default {
  name: 'LoginDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      password: '',
      staticPassword: 'privacycruise',
      wrongPassword: false,
    };
  },
  created() {
    const loggedIn =
      localStorage.getItem('data-privacy-game-logged-in') || 'false';
    return this.$emit('input', loggedIn === 'true');
  },
  methods: {
    login() {
      const formattedPassword = this.password
        .toLowerCase()
        .replace(/-/g, '')
        .replace(/_/g, '')
        .replace(/ /g, '');
      if (formattedPassword === this.staticPassword) {
        localStorage.setItem('data-privacy-game-logged-in', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        this.wrongPassword = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/login.scss';
</style>
