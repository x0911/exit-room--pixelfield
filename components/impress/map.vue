<template>
  <div>
    <img
      :src="travelBook"
      style="opacity: 0; pointer-events: none; z-index: -1"
    />
    <v-bottom-sheet
      v-model="mapModel"
      class="elevation-0"
      content-class="elevation-0"
      fullscreen
      no-click-animation
      persistent
      width="auto"
    >
      <div
        key="travel-book"
        :class="{ 'disable-clicking': disableClicking }"
        class="game"
      >
        <div class="game_rooms">
          <img
            :src="travelBook"
            class="game_rooms_map"
            @load="travelBookLoaded = true"
          />
          <!-- <div
            class="game-title f-tech basic-blinker"
            :class="{
              loaded: travelBookLoaded,
              'game-title__stretch': $i18n.locale === 'fr',
            }"
          >
            {{ $t('select-the-level') }}
          </div> -->
          <v-card
            v-for="(room, i) in rooms"
            :key="i"
            :class="{
              [`room${i + 1}`]: true,
              active: isNextRoom(i),
              loaded: travelBookLoaded,
              'has-result': room.progress > 0,
              'game_room-done': room.done,
            }"
            :data-video-start="canOpenAssignment(i) ? room.country : null"
            class="game_room"
            flat
            @click="openAssignment(i)"
          >
            <template v-if="i === rooms.length - 1 && false">
              <client-only>
                <div
                  :class="{
                    'pt-4': showFinalTaskTrap && i === rooms.length - 1,
                  }"
                  class="f-tech d-flex flex-column align-center justify-center"
                >
                  <div class="d-flex align-center justify-center">
                    <img
                      v-if="!showFinalTaskTrap"
                      :src="require('@/assets/images/lock-trim.png')"
                      class="lock"
                    />
                    <div
                      :class="{
                        g__final_highlight:
                          showFinalTaskTrap && i === rooms.length - 1,
                      }"
                      class="mb-5 title text-uppercase"
                    >
                      {{ $t('final-task') }}
                    </div>
                  </div>
                </div>
              </client-only>
            </template>
            <template v-else>
              <client-only>
                <div>
                  <!-- <img
                    class="picture"
                    :src="
                      require(`@/assets/images/${
                        room.done ? 'wall-fixed' : 'wall-hole'
                      }.png`)
                    "
                  /> -->
                  <div class="room-icon">
                    <div class="bounce-1"></div>
                    <div class="bounce-2"></div>
                  </div>
                </div>
                <div class="f-tech">
                  <div class="country">
                    {{ room.title }}
                  </div>
                </div>
              </client-only>
            </template>
          </v-card>
        </div>
      </div>
    </v-bottom-sheet>
    <v-dialog
      v-model="viewAttachment"
      max-width="85%"
      no-click-animation
      scrollable
    >
      <v-card class="info-screen border-2" outlined tile>
        <v-btn
          absolute
          color="rgba(0, 0, 0, 0.65)"
          fab
          small
          style="z-index: 1; top: 30px; right: 30px"
          @click="viewAttachment = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-text class="pa-0 ma-0">
          <v-img class="grey lighten-3" height="100" width="100%"></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>
    <app-disclaimer v-model="disclaimer"></app-disclaimer>
    <final-task-trap v-if="showFinalTaskTrap"></final-task-trap>
  </div>
</template>

<script>
import TravelBook from '@/assets/images/travel-book.png';
import SoundPlayer from '@/mixins/sound-player.js';
// import FullscreenVideo from '~/components/fullscreen-video.vue';
import ImpressStep from '@/mixins/impress-step.js';
import AppDisclaimer from '@/components/ui/AppDisclaimer.vue';
import FinalTaskTrap from '@/components/final-task-trap.vue';

export default {
  components: {
    AppDisclaimer,
    FinalTaskTrap,
    // FullscreenVideo,
  },
  mixins: [ImpressStep, SoundPlayer],
  data() {
    return {
      stepId: 'map',
      travelBookLoaded: false,
      viewAttachment: false,
      videos: {
        intro1: {
          ended: false,
        },
        intro2: {
          ended: false,
        },
      },
      mapLoaded: false,

      // Map
      travelBook: TravelBook,
      rooms: [
        {
          country: 'italy',
          title: this.$t('task-name.1'),
          progress: 0,
          done: false,
        },
        {
          country: 'egypt',
          title: this.$t('task-name.2'),
          progress: 0,
          done: false,
        },
        {
          country: 'china',
          title: this.$t('task-name.3'),
          progress: 0,
          done: false,
        },
        {
          country: 'brazil',
          title: this.$t('task-name.4'),
          progress: 0,
          done: false,
        },
        {
          country: 'usa',
          title: this.$t('task-name.5'),
          progress: 0,
          done: false,
        },
        {
          country: 'russia',
          title: this.$t('task-name.6'),
          progress: 0,
          done: false,
        },
        // {
        //   country: 'india',
        //   title: this.$t('task-name.7'),
        //   progress: 0,
        //   done: false,
        // },
      ],
      gameProgress: 0,
      disableClicking: false,
      showFinalTaskTrap: false,
    };
  },
  computed: {
    mapModel: {
      get() {
        return (
          this.videos.intro1.ended && this.videos.intro2.ended && this.mapLoaded
        );
      },
      set(v) {
        this.$set(this, 'mapLoaded', v);
      },
    },
    skipIntro() {
      return this.$store.getters.skipMapIntro || false;
    },
    disclaimer() {
      return this.$store.getters.disclaimerModel;
    },
    isNextRoom() {
      return (i) => {
        const rooms = this.rooms;
        const room = rooms[i];
        return !room.done && (i === 0 || (rooms[i - 1] && rooms[i - 1].done));
      };
    },
    canOpenAssignment() {
      return (i) => {
        return (
          i !== null && i !== undefined && (i !== 6 || this.showFinalTaskTrap)
        );
      };
    },
  },
  methods: {
    stepEnter() {
      // const nextRoom = this.getNextRoom();
      // this.toRoomGame(nextRoom);
      this.$set(this, 'disableClicking', false);
      this.checkSkipIntro();
    },
    stepLeave() {
      this.$store.commit('SET_INSTRUCTIONS_BOTTOM_MODEL', false);
      this.$store.commit('SET_INSTRUCTIONS_RIGHT_MODEL', false);
      this.$store.commit('SET_INSTRUCTIONS_MODEL', false);
      this.$store.commit('SET_AUDIO_STATUS', 'on');
      this.$set(this, 'mapModel', false);
    },
    getNextRoom() {
      const rooms = this.rooms;
      let id = rooms[0].country;
      rooms.forEach((r, i) => {
        const isNextRoom = this.isNextRoom(i);
        if (isNextRoom) {
          id = r.country;
        }
      });
      return id;
    },
    openLocationDesc(id) {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        steps: [`lp-location-desc.${id}`],
        nextText: this.$t('ok'),
      });
    },
    checkIfGameEnded() {
      const progress = this.rooms.reduce(
        (total, room) => total + parseInt(room.progress),
        0
      );
      const length = this.rooms.length;
      const maxValue = length * 100;
      const perc = (progress / maxValue) * 100;
      const playedGames = this.rooms.filter((r) => r.done).length;
      const isEnded = perc === 100 && playedGames === length;
      const disclaimerIsSeen =
        localStorage.getItem('novartis-dp-disclaimer-seen') || 'false';
      if (isEnded && disclaimerIsSeen !== 'true') {
        // Show Disclaimer
        this.$store.commit('SET_DISCLAIMER_MODEL', true);
      } else {
        this.$store.commit('SET_DISCLAIMER_MODEL', false);
      }
    },
    checkSkipIntro() {
      const skipIntro = this.skipIntro;
      this.showIntro2();
      if (skipIntro) {
        this.intro2Ended();
      } else {
        setTimeout(() => {
          this.$store.commit('SET_INSTRUCTIONS', {
            bottomModel: true,
            title: this.$t('franklin'),
            steps: ['wall-steps'],
            nextText: this.$t('start'),
            image: 'avatars/franklin.jpg',
          })
        }, 1200);
      }
    },
    showIntro2(playSound = false) {
      if (playSound) {
        this.playGameSound('big-button-press-2');
      }
      this.$set(this.videos.intro1, 'ended', true);
      this.intro2Ended();
    },
    intro2Ended() {
      this.$store.commit('STOP_VIDEOS');
      this.getGameProgress();
      this.$set(this.videos.intro2, 'ended', true);
      setTimeout(() => {
        this.$set(this, 'mapModel', true);
        setTimeout(() => {
          if (!this.skipIntro) {
            this.$store.commit('SET_SKIP_MAP_INTRO', true);
          }
          setTimeout(() => {
            this.checkIfGameEnded();
          }, 100);
        }, 1000);
      }, 500);
    },
    // Map
    getGameProgress() {
      const rooms = this.rooms;
      const length = rooms.length;
      const max = (length - 1) * 100;
      let total = 0;
      for (let i = 0; i < length; i++) {
        const room = rooms[i];
        const perc = localStorage.getItem(`room_${room.country}`) || '0';
        const intPerc = parseInt(perc);
        room.progress = intPerc;
        room.done = intPerc === 100;
        total += intPerc;
      }
      const perc = (total / max) * 100;
      this.$set(this, 'gameProgress', perc.toFixed());
    },
    openAssignment(i) {
      this.playGameSound('big-button-press-1');
      if (this.canOpenAssignment(i)) {
        const room = this.rooms[i];
        this.$set(this, 'disableClicking', true);
        this.toRoomGame(room.country);
        this.$store.commit('PLAY_VIDEO', room.country);
      } else if (i === 6) {
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          steps: ['screens.screen-8'],
          nextText: this.$t('ok'),
        });
      }
    },
    toRoomGame(slug) {
      window.impressAPI.goto(slug);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/pages/game';
</style>
