<template>
  <v-app :class="{ 'is-vertical': isVertical }" data-app>
    <login-dialog v-model="isLoggedIn"/>
    <template v-if="isLoggedIn">
      <cookie-modal v-model="cookieModel"/>
      <v-main>
        <v-sheet
          class="transparent"
          elevation="0"
          height="100%"
          max-height="100%"
          max-width="100%"
          min-height="100%"
          min-width="100%"
          tile
          width="100%"
        >
          <v-layout
            align-center
            align-content-center
            fill-height
            justify-center
          >
            <!-- To show transition-step-video -->
            <!-- data-transition-duration="0" -->
            <div
              id="impress"
              :data-height="$vuetify.breakpoint.height"
              :data-width="$vuetify.breakpoint.width"
              data-max-scale="1"
              data-min-scale="1"
              data-perspective="1000"
              data-transition-duration="1000"
            >
              <template v-for="(step, i) in steps">
                <div
                  :id="step.id"
                  :key="i"
                  :class="{
                    'custom-active': activeStep === step.id || step.active,
                    'custom-next':
                      activeStep !== 'splash' &&
                      (navigation.next === step.id ||
                        (rooms.includes(step.active) && step.id === 'map')),
                    'custom-prev':
                      activeStep !== 'splash' && navigation.prev === step.id,
                  }"
                  :data-x="step.x"
                  :data-y="step.y"
                  :data-z="step.z"
                  class="step"
                  data-transition-duration="1000"
                >
                  <div
                    :key="`step-bg-${i}`"
                    :class="{
                      [`${activeStep}`]: true,
                      'is-vertical': isVertical,
                      'opacity-0': !globalBtns,
                    }"
                    :style="`background-image: url('${require('@/assets/images/bg/' +
                      (step.id === 'map'
                        ? mapBg
                        : roomsBgs[step.id]
                        ? roomsBgs[step.id]
                        : step.id) +
                      '-bg.jpg')}') !important`"
                    class="app-bg"
                  ></div>
                  <template v-for="(vid, vi) in step.videos">
                    <fullscreen-video
                      :key="`step-video-${i}-${vi}`"
                      :ref="`video-${vid}`"
                      :can-play="videos[vid].canPlay"
                      :class="{ 'opacity-0': !videos[vid].canPlay }"
                      :path="videos[vid].path"
                      :video-id="vid"
                      @ended="videoEnded(vid, i)"
                    ></fullscreen-video>
                  </template>
                  <component :is="step.component"/>
                </div>
              </template>
            </div>
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
      <game-sounds></game-sounds>
    </template>
  </v-app>
</template>

<script>
import Intro from '@/components/impress/intro.vue';
import Splash from '@/components/impress/splash.vue';
import Map from '@/components/impress/map.vue';
import Gameitaly from '~/components/impress/game/italy.vue';
import GameRussia from '@/components/impress/game/russia.vue';
import GameChina from '~/components/impress/game/china.vue';
import GameIndia from '@/components/impress/game/india.vue';
import GameEgypt from '@/components/impress/game/egypt.vue';
import GameBrazil from '~/components/impress/game/brazil/brazil.vue';
import GameUsa from '~/components/impress/game/usa/usa.vue';

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
import GameSounds from '@/components/game-sounds.vue';
import LoginDialog from '~/components/LoginDialog';
import CookieModal from '~/components/ui/cookie-modal';

export default {
  components: {
    LoginDialog,
    CookieModal,

    Intro,
    Splash,
    Map,
    Gameitaly,
    GameRussia,
    GameChina,
    GameIndia,
    GameEgypt,
    GameBrazil,
    GameUsa,

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
  layout: 'impress',
  data: () => ({
    isLoggedIn: true,
    cookieModel: null,
    navigation: {
      active: null,
      next: null,
      prev: null,
    },
    mapBg: 'game-intro-1',
  }),
  computed: {
    steps() {
      const w = this.$vuetify.breakpoint.width;
      const h = this.$vuetify.breakpoint.height;
      const arr = [
        {
          component: 'Splash',
          id: 'splash',
          videos: ['game-intro-0'],
          x: '0',
          y: '0',
          z: '0',
          active: false,
        },
        {
          component: 'Map',
          id: 'map',
          x: '0',
          y: '0',
          z: '-1500',
          active: false,
          duration: '1000',
        },
        {
          component: 'Gameitaly',
          id: 'italy',
          videos: ['italy'],
          x: `-${w}`,
          y: '0',
          z: '-1500',
          active: false,
        },
        {
          component: 'GameEgypt',
          id: 'egypt',
          videos: ['egypt', 'egypt-x2'],
          x: '0',
          y: '0',
          z: '-500',
          active: false,
        },
        {
          component: 'GameChina',
          id: 'china',
          videos: ['china', 'china-x2', 'china-x3', 'china-x4', 'china-x5'],
          x: `-${w}`,
          y: `${h}`,
          z: '-1500',
          active: false,
        },
        {
          component: 'GameBrazil',
          id: 'brazil',
          videos: ['brazil'],
          x: '0',
          y: `${h}`,
          z: '-1500',
          active: false,
        },
        {
          component: 'GameUsa',
          id: 'usa',
          videos: ['usa', 'usa-x2', 'usa-x3', 'usa-x4'],
          x: '0',
          y: `-${h}`,
          z: '-1500',
          active: false,
        },
        {
          component: 'GameRussia',
          id: 'russia',
          videos: ['russia'],
          x: `${w}`,
          y: `-${h}`,
          z: '-1500',
          active: false,
        },
        // {
        //   component: 'GameIndia',
        //   id: 'india',
        //   videos: ['india', 'game-outro'],
        //   x: `0`,
        //   y: `0`,
        //   z: '500',
        //   active: false,
        // },
      ];
      return arr;
    },
    videos() {
      return this.$store.getters.videos;
    },
    bg() {
      return this.$store.getters.bg;
    },
    isVertical() {
      return true;
    },
    globalBtns() {
      return this.$store.getters.globalBtns;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
    activeStep() {
      return this.$store.getters.activeStep;
    },
    roomsBgs() {
      return this.$store.getters.roomsBgs;
    },
  },
  watch: {
    activeStep(v) {
      this.fixMapBg(v);
    },
  },
  mounted() {
    const $this = this;
    const impressRootElement = document.getElementById('impress');
    $this.$nuxt.$on('impress-restart', this.restart);
    if (impressRootElement) {
      require('@/assets/js/custom-impress.min.js');
      window.impressAPI = window.impress();
      window.impressAPI.init();
      window.impressAPI.goto('splash');
      impressRootElement.addEventListener(
        'impress:stepenter',
        function (event) {
          const stepId = event?.target?.id;
          const isSplashStep = stepId === 'splash';
          $this.activateStep(stepId);
          if ((isSplashStep && $this.cookieModel === false) || !isSplashStep) {
            $this.$nuxt.$emit(`impress-step-enter-${stepId}`);
          }
          $this.setImpressNavigation();
        }
      );
      impressRootElement.addEventListener(
        'impress:stepleave',
        function (event) {
          const stepId = event?.target?.id;
          const nextStepId = event?.detail?.next?.id;
          $this.inactivateStep(stepId);
          $this.$nuxt.$emit(`impress-step-leave-${stepId}`);
          $this.$nuxt.$emit(`impress-step-entering-${nextStepId}`);
        }
      );
    }
  },
  methods: {
    fixMapBg(v) {
      if (v === 'splash') {
        setTimeout(() => {
          this.$set(this, 'mapBg', 'intro');
        }, 500);
      } else {
        setTimeout(() => {
          this.$set(this, 'mapBg', 'map');
        }, 1000);
      }
    },
    setImpressNavigation() {
      const rooms = this.rooms;
      const length = rooms.length;
      for (let i = 0; i < length; i++) {
        const room = rooms[i];
        const perc = localStorage.getItem(`room_${room}`) || '0';
        const intPerc = parseInt(perc);
        if (intPerc >= 50) {
          // this.$set(this.navigation, 'prev', room);
          const nextRoom = rooms[i + 1];
          if (nextRoom) {
            this.$set(this.navigation, 'next', nextRoom);
          }
        }
      }
    },
    activateStep(id) {
      const index = this.steps.findIndex((step) => step.id === id);
      this.$set(this.steps[index], 'active', true);
      this.$store.commit('SET_ACTIVE_STEP', id);
    },
    inactivateStep(id) {
      const index = this.steps.findIndex((step) => step.id === id);
      this.$set(this.steps[index], 'active', false);
    },
    restart() {
      if (window.impressAPI) {
        window.impressAPI.tear();
        window.impressAPI.init();
      }
    },
    videoEnded(id, index) {
      this.$nuxt.$emit(`video-${id}-ended`);
      this.$store.commit('STOP_VIDEOS');
    },
  },
};
</script>

<style lang="scss">
#impress {
  z-index: 99;
  top: 0 !important;
  left: 0 !important;
  width: 100%;
  height: 100%;

  > div:first-child {
    width: 100%;
    height: 100%;
  }
}

.step {
  opacity: 0;
  transition: opacity 1s;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.future,
.past {
  opacity: 0;
}

.step.active,
.step.present,
.step.custom-active,
.step.custom-prev,
.step.custom-next {
  opacity: 1 !important;
}

.present .rotating {
  transform: rotate(-10deg);
  transition-delay: 0.25s;
}

.impress-on-overview .step {
  opacity: 1;
  cursor: pointer;
}

.app-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 1s ease-in-out;
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
}
</style>
