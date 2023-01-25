<template>
  <div>
    <v-card class="info-screen pa-6 mx-auto" light width="400">
      <div class="d-flex flex-column align-center justify-center">
        <div :class="{ 'image-validating': isValidating }" class="image">
          <img :width="200" src="@/assets/images/avatars/player.png" />
        </div>
      </div>
    </v-card>
    <div class="mx-auto d-flex justify-end" style="width: 400px">
      <v-btn
        color="primary"
        large
        class="mt-8 px-4 font-weight-light"
        tile
        depressed
        @click="validateHandler"
      >
        {{ $t('validate') }}
        <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaceScan',
  props: {
    stepId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isValidating: false,
      isValidated: false,
    };
  },
  methods: {
    validateHandler() {
      this.playGameSound('big-button-press-1');
      this.isValidating = true;
      setTimeout(() => {
        this.isValidated = true;
        this.isValidating = false;
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          steps: [`brazil.validated-photo`],
          overlay: true,
          nextMethod: (event) => this.$emit('next', event),
        });
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/face-scan.scss';
</style>
