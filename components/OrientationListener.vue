<template>
  <v-dialog
    v-model="localModel"
    max-width="400"
    scrollable
    persistent
    :retain-focus="false"
  >
    <v-card class="info-screen px-2 pb-5" light tile flat>
      <v-card-title class="pt-5 normal-size">
        {{ $t('orientation-hint.title') }}
      </v-card-title>
      <v-card-text
        class="pt-2 pb-8"
        :inner-html.prop="$t('orientation-hint.text')"
      >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    isPortrait: false,
    isMobile: false,

    localModel: false,
  }),
  computed: {
    model() {
      return this.isPortrait && this.isMobile && this.appLoaded;
    },
    width() {
      return this.$vuetify.breakpoint.width;
    },
    appLoaded() {
      return this.$store.getters.appLoaded;
    },
  },
  watch: {
    model(v) {
      setTimeout(() => {
        this.$set(this, 'localModel', v);
      }, 500);
    },
    width() {
      this.handleOrientationOnSize();
    },
  },
  mounted() {
    this.handleOrientationOnSize();
    // this.handleOrientation();
    // setTimeout(() => {
    //   window.addEventListener('orientationchange', (e) => {
    //     window.requestAnimationFrame(() => {
    //       setTimeout(() => {
    //         this.handleOrientation(e.target.screen.orientation.angle);
    //       }, 500);
    //     });
    //   });
    // }, 10);
  },
  methods: {
    checkIfMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    handleOrientation(angle = null) {
      const isMobile = this.checkIfMobile();
      this.$set(this, 'isMobile', isMobile);
      const width = this.$vuetify.breakpoint.width;
      const height = this.$vuetify.breakpoint.height;
      const orientation =
        [90, 270].includes(angle) || width > height
          ? 'landscape'
          : window.screen.orientation.type;
      if (orientation.includes('portrait')) {
        // portrait mode - Stop
        this.$set(this, 'isPortrait', true);
      } else if (orientation.includes('landscape')) {
        // landscape mode - Go ahead
        this.$set(this, 'isPortrait', false);
      }
      this.$store.commit('SET_ORIENTATION', orientation);
    },
    handleOrientationOnSize() {
      const isMobile = this.checkIfMobile();
      this.$set(this, 'isMobile', isMobile);
      const width = this.$vuetify.breakpoint.width;
      const height = this.$vuetify.breakpoint.height;
      const orientation =
        width > height ? 'landscape-primary' : 'portrait-primary';
      if (orientation.includes('portrait')) {
        // portrait mode - Stop
        this.$set(this, 'isPortrait', true);
      } else if (orientation.includes('landscape')) {
        // landscape mode - Go ahead
        this.$set(this, 'isPortrait', false);
      }
      this.$store.commit('SET_ORIENTATION', orientation);
    },
  },
};
</script>
