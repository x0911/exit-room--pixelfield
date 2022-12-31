<template>
  <div>
    <v-dialog
      v-model="model"
      max-width="440"
      scrollable
      persistent
      :retain-focus="false"
      content-class="elevation-0"
    >
      <div>
        <v-card class="info-screen darken px-2 pb-2 mb-4" light tile flat>
          <v-card-title class="pt-5 normal-size no-word-break">
            {{ $t('fullscreen-hint.title') }}
          </v-card-title>
          <v-card-text
            class="pt-2 pb-8"
            :inner-html.prop="$t('fullscreen-hint.text')"
          >
          </v-card-text>
        </v-card>
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn
            large
            text
            class="normal-btn px-3"
            tile
            @click="hideLocalModel()"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn
            depressed
            large
            color="primary"
            tile
            class="px-7 py-6"
            @click="toggleFullscreen('button-press')"
          >
            {{ $t('enable') }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-dialog>
    <v-bottom-sheet
      v-model="backToMap"
      scrollable
      class="elevation-0"
      content-class="elevation-0"
    >
      <template #activator="{ on }">
        <v-btn
          v-show="
            !['map', 'splash'].includes(activeStep) &&
            globalBtns &&
            $route.fullPath !== '/'
          "
          fab
          color="rgba(0,0,0,0.65)"
          small
          fixed
          top
          style="left: 15px; z-index: 9999"
          v-on="on"
          @click="playGameSound('button-press')"
        >
          <v-icon> mdi-map-marker </v-icon>
        </v-btn>
      </template>
      <div class="px-4 pb-10">
        <v-card
          max-width="450"
          light
          class="mx-auto info-screen border-3"
          tile
          flat
        >
          <v-card-text class="">
            {{ $t('back-to-map.text') }}
          </v-card-text>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              tile
              text
              large
              class="px-3 normal-btn"
              @click="hideBackToMap('button-press')"
            >
              {{ $t('cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              tile
              depressed
              large
              class="px-5"
              @click="goBackToMap"
            >
              {{ $t('map') }}
              <v-icon class="ms-2"
                >mdi-keyboard-backspace mdi-rotate-180</v-icon
              >
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-bottom-sheet>
    <v-btn
      v-show="canHaveFullscreen && globalBtns"
      fab
      small
      fixed
      top
      color="rgba(0,0,0,0.65)"
      left
      :style="`z-index: 9999; ${
        ['map', 'splash'].includes(activeStep) || $route.fullPath === '/'
          ? 'left: 15px;'
          : 'left: 70px;'
      }`"
      @click="toggleFullscreen('button-press')"
    >
      <v-icon>
        {{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}
      </v-icon>
    </v-btn>
    <v-btn
      v-show="globalBtns"
      fab
      small
      fixed
      top
      color="rgba(0,0,0,0.65)"
      right
      :style="`z-index: 9999;`"
      @click="toggleSounds()"
    >
      <v-icon>
        {{ soundsOff ? 'mdi-volume-off' : 'mdi-volume-high' }}
      </v-icon>
    </v-btn>
    <v-btn
      v-show="
        mapLoaded &&
        gameIsDone &&
        globalBtns &&
        activeStep === 'map' &&
        $route.path === '/privacy-cruise'
      "
      fixed
      color="rgba(0,0,0,0.65)"
      fab
      width="48"
      height="48"
      bottom
      left
      style="bottom: 95px; z-index: 9999"
      @click="showDisclaimer"
    >
      <v-icon>mdi-trophy-outline</v-icon>
    </v-btn>
    <v-btn
      v-show="
        mapLoaded &&
        globalBtns &&
        activeStep === 'map' &&
        $route.path === '/privacy-cruise'
      "
      fixed
      color="rgba(0,0,0,0.65)"
      fab
      width="48"
      height="48"
      bottom
      left
      style="bottom: 35px; z-index: 9999"
      @click="openRestartGameDialog"
    >
      <v-icon>mdi-restart</v-icon>
    </v-btn>
  </div>
</template>

<script>
import SoundPlayer from '@/mixins/sound-player.js';
export default {
  mixins: [SoundPlayer],
  data: () => ({
    isFullscreen: false,
    isMobile: false,
    localModel: true,
    backToMap: false,
    canHaveFullscreen: false,
  }),
  computed: {
    gameIsDone() {
      return this.$store.getters.gameIsDone;
    },
    model() {
      return (
        !this.isFullscreen &&
        this.isMobile &&
        this.localModel &&
        this.canHaveFullscreen &&
        this.appLoaded
      );
    },
    globalBtns() {
      return this.$store.getters.globalBtns;
    },
    instructionsModel() {
      return this.$store.getters.instructions.model;
    },
    appLoaded() {
      return this.$store.getters.appLoaded;
    },
    activeStep() {
      return this.$store.getters.activeStep;
    },
    mapLoaded() {
      return this.$store.getters.mapLoaded;
    },
    soundsOff: {
      get() {
        return this.$store.getters.soundsOff;
      },
      set(v) {
        this.$store.commit('SET_SOUNDS_OFF', v);
      },
    },
  },
  watch: {},
  mounted() {
    this.handleFullscreenChange();
    setTimeout(() => {
      window.addEventListener('fullscreenchange', () => {
        window.requestAnimationFrame(() => {
          this.handleFullscreenChange();
        });
      });
    }, 10);
    setTimeout(() => {
      this.setCanHaveFullscreen();
    }, 1000);
  },
  methods: {
    openRestartGameDialog() {
      this.hideBackToMap('big-button-press-1');
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$tr('restart-game.title'),
        steps: [`restart-game.hint`],
        nextText: this.$t('restart-game.action'),
        cancelable: true,
        overlay: true,
        showNextArrow: false,
        nextMethod: this.restartGame,
      });
    },
    restartGame() {
      localStorage.clear();
      window.location.reload();
    },
    showDisclaimer() {
      this.hideBackToMap('big-button-press-1');
      this.$store.commit('SET_DISCLAIMER_MODEL', true);
    },
    goBackToMap() {
      this.hideBackToMap('big-button-press-1');
      window.impressAPI.goto('map');
    },
    toggleSounds() {
      const soundName = this.soundsOff ? 'big-button-press-1' : 'button-press';
      this.playGameSound(soundName);
      this.$set(this, 'soundsOff', !this.soundsOff);
    },
    setCanHaveFullscreen() {
      if (
        process.client &&
        document &&
        document.documentElement &&
        (document.documentElement.requestFullscreen ||
          document.documentElement.webkitRequestFullScreen ||
          document.documentElement.mozRequestFullScreen ||
          document.documentElement.msRequestFullscreen ||
          document.documentElement.webkitEnterFullscreen)
      ) {
        this.$set(this, 'canHaveFullscreen', true);
      } else {
        this.$set(this, 'canHaveFullscreen', false);
      }
    },
    hideLocalModel() {
      this.playGameSound('button-press');
      this.$set(this, 'localModel', false);
    },
    hideBackToMap(soundName) {
      if (soundName) {
        this.playGameSound(soundName);
      }
      this.$set(this, 'backToMap', false);
    },
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
    handleFullscreenChange() {
      const isMobile = this.checkIfMobile();
      this.$set(this, 'isMobile', isMobile);
      const isInFullscreen =
        document.fullscreenElement || document.webkitFullscreenElement;
      if (isInFullscreen) {
        this.$set(this, 'isFullscreen', true);
      } else {
        this.$set(this, 'isFullscreen', false);
      }
    },
    toggleFullscreen(soundName) {
      if (soundName) {
        this.playGameSound(soundName);
      }
      const isInFullscreen =
        document.fullscreenElement || document.webkitFullscreenElement;
      if (isInFullscreen) {
        if (document.exitFullscreen) {
          document
            .exitFullscreen()
            .then(() => {})
            .catch(() => {});
        }
        if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      } else {
        console.log('Requesting fullscreen');
        if (document.documentElement.requestFullscreen) {
          document.documentElement
            .requestFullscreen()
            .then(() => {})
            .catch(() => {});
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement
            .webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            .then(() => {})
            .catch(() => {});
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement
            .mozRequestFullScreen()
            .then(() => {})
            .catch(() => {});
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement
            .msRequestFullscreen()
            .then(() => {})
            .catch(() => {});
        } else if (document.documentElement.webkitEnterFullscreen) {
          document.documentElement
            .webkitEnterFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            .then(() => {})
            .catch(() => {});
        }
      }
    },
  },
};
</script>
