<template>
  <div>
    <v-bottom-sheet
      v-model="model"
      scrollable
      class="elevation-0"
      content-class="elevation-0 pb-12"
      inset
    >
      <template #activator="{ on }">
        <v-btn
          v-show="globalBtns && !instructionsModel && hints && hints.length > 0"
          fixed
          color="rgba(0,0,0,0.65)"
          fab
          width="48"
          height="48"
          bottom
          right
          style="bottom: 30px !important; z-index: 9999 !important"
          v-on="on"
          @click="playGameSound('button-press')"
        >
          <v-icon>mdi-help</v-icon>
        </v-btn>
      </template>
      <v-card light flat tile class="info-screen darken border-2 mx-auto">
        <v-card-text class="pt-4">
          <div class="font-weight-bold yellow--text mb-2">
            {{ $t('hint-title') }}
          </div>
          <div v-if="hints && hints.length > 0">
            <template v-for="(hint, i) in hints">
              <div :key="i" :inner-html.prop="hint"></div>
            </template>
          </div>
          <i v-else> -- {{ $t('no-hint-here') }} -- </i>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-btn
      v-if="globalBtns"
      class="normal-btn"
      fixed
      bottom
      x-small
      depressed
      color="transparent"
      left
      href="https://www.f-mark.cz/"
      target="_blank"
      style="z-index: 9999 !important; bottom: 5px !important"
      @click="playGameSound('button-press')"
    >
      Produced by: F-mark s.r.o.
    </v-btn>
    <v-btn
      v-if="!globalBtns && videoIsSkippable"
      color="primary"
      large
      absolute
      bottom
      right
      class="px-6 font-weight-light"
      tile
      depressed
      style="z-index: 9999 !important; bottom: 100px !important"
      @click="stopCurrentVideo"
    >
      {{ $t('skip') }}
      <v-icon class="ms-3">mdi-keyboard-backspace mdi-rotate-180</v-icon>
    </v-btn>
  </div>
</template>

<script>
import SoundPlayer from '@/mixins/sound-player.js';

export default {
  components: {},
  mixins: [SoundPlayer],
  data: () => ({
    model: false,
  }),
  computed: {
    fullPath() {
      return this.$route.fullPath;
    },
    hints() {
      const activeStep = this.activeStep;
      const hints = activeStep ? this.$t(`hints.${activeStep}`) : [];
      return hints || [];
    },
    globalBtns() {
      return this.$store.getters.globalBtns;
    },
    instructionsModel() {
      return (
        this.$store.getters.instructions.model ||
        this.$store.getters.instructions.bottomModel ||
        this.$store.getters.instructions.rightModel
      );
    },
    activeStep() {
      return this.$store.getters.activeStep;
    },
    videoIsSkippable() {
      return this.$store.getters.videoIsSkippable;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
  },
  watch: {
    fullPath() {
      this.reset();
    },
  },
  mounted() {
    // this.reset();
  },
  methods: {
    stopCurrentVideo() {
      this.$nuxt.$emit('stop-current-video');
    },
    reset() {
      this.$set(this, 'model', false);
    },
  },
};
</script>
