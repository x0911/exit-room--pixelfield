<template>
  <v-app data-app :class="{ 'is-vertical': isVertical }">
    <div
      class="app-bg"
      :class="{ 'is-vertical': isVertical, 'app-bg': true }"
      :style="`background-image: url('${require('@/assets/images/bg/' +
        bg)}') !important`"
    ></div>
    <v-main>
      <v-sheet
        class="transparent"
        tile
        elevation="0"
        min-height="100%"
        min-width="100%"
        height="100%"
        width="100%"
        max-height="100%"
        max-width="100%"
      >
        <v-layout align-center justify-center align-content-center fill-height>
          <v-flex align-self-center grow>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-sheet>
    </v-main>
    <instructions-dialog></instructions-dialog>
    <instructions-bottom-dialog></instructions-bottom-dialog>
    <instructions-right-dialog></instructions-right-dialog>
    <orientation-listener></orientation-listener>
    <fullscreen-listener></fullscreen-listener>
    <score-board-dialog></score-board-dialog>
    <main-game-hint></main-game-hint>
    <main-game-audio></main-game-audio>
    <!-- Fullscreen videos -->
    <template v-for="(video, key, i) in videos">
      <fullscreen-video
        v-show="video.canPlay"
        :key="`${key}_${i}`"
        :ref="`video-${key}`"
        :path="video.path"
        :video-id="key"
        :can-play="video.canPlay"
        @ended="videoEnded(key, i)"
      ></fullscreen-video>
    </template>
    <game-sounds></game-sounds>
  </v-app>
</template>

<script>
import IsVerticalMixin from '@/mixins/is-vertical.js';
import InstructionsDialog from '@/components/instructions.vue';
import MainGameAudio from '@/components/main-game-audio.vue';
import MainGameHint from '@/components/main-game-hint.vue';
import InstructionsBottomDialog from '@/components/instructions-bottom.vue';
import InstructionsRightDialog from '@/components/instructions-right.vue';
import OrientationListener from '@/components/OrientationListener.vue';
import FullscreenListener from '@/components/fullscreen-listener.vue';
import ScoreBoardDialog from '@/components/ScoreBoardDialog.vue';
import FullscreenVideo from '@/components/fullscreen-video.vue';
import GameSounds from '~/components/game-sounds.vue';
export default {
  components: {
    InstructionsDialog,
    MainGameAudio,
    MainGameHint,
    InstructionsBottomDialog,
    InstructionsRightDialog,
    OrientationListener,
    FullscreenListener,
    ScoreBoardDialog,
    FullscreenVideo,
    GameSounds,
  },
  mixins: [IsVerticalMixin],
  computed: {
    videos() {
      return this.$store.getters.videos;
    },
    bg() {
      return this.$store.getters.bg;
    },
    isVertical() {
      return true;
    },
  },
  mounted() {},
  methods: {
    videoEnded(id, index) {
      this.$nuxt.$emit(`video-${id}-ended`);
    },
  },
};
</script>

<style lang="css">
/* .app-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.app-bg,
.theme--dark.v-application,
.theme--light.v-application {
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: top !important;
  background-color: initial !important;
}
.app-bg,
.theme--dark.v-application.is-vertical,
.theme--light.v-application.is-vertical {
  background-position: left !important;
} */
</style>
