<template>
  <v-container>
    <v-bottom-sheet
      :value="videos.intro.ended && model === 0"
      overlay-opacity="0"
      persistent
      class="elevation-0"
      content-class="elevation-0"
      :retain-focus="false"
      fullscreen
    >
      <div class="px-4 py-6">
        <v-row dense>
          <v-col cols="auto" align-self="center">
            <v-btn
              :disabled="comicModel === 0"
              dark
              x-large
              icon
              @click="
                comicModel--;
                playGameSound('button-press');
              "
            >
              <v-icon x-large>mdi-arrow-left-bold-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="max-room-h">
            <v-card
              v-if="comics[comicModel]"
              tile
              light
              flat
              class="pa-0 info-screen"
            >
              <div class="room-static text-center text-caption pt-1">
                <v-chip color="rgba(0,0,0,0.05)" small label>
                  <span v-if="comics[comicModel].triggerable.length === 0">
                    {{ $t('brazil.header.no-objects-to-mark') }}
                  </span>
                  <span v-else>
                    {{ comics[comicModel].triggeredSpots.length }} /
                    {{ comics[comicModel].triggerable.length }}
                    {{ $t('Objects') }}
                  </span>
                </v-chip>
              </div>
              <v-card-text class="pa-0 d-flex justify-center align-center">
                <div class="p-relative d-flex">
                  <img
                    :src="
                      require(`@/assets/images/games/brazil/${
                        comicModel + 1
                      }.jpg`)
                    "
                    :style="`height: ${imgHeight}; max-width: 100%; object-fit: contain;`"
                  />
                  <template
                    v-for="(point, i) in comics[comicModel].triggerable"
                  >
                    <div
                      :key="i"
                      v-ripple="{ class: 'orange--text' }"
                      class="p-absolute"
                      :style="`width: ${point.w}%; height: ${point.h}%; left: ${
                        point.x
                      }%; top: ${point.y}%; border: 4px solid ${
                        comics[comicModel].triggeredSpots.includes(point.id)
                          ? '#ff613d'
                          : 'transparent'
                      }; transform: ${point.t};`"
                      @click="addSpot(point.id)"
                    ></div>
                  </template>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="auto" align-self="center">
            <v-btn
              dark
              x-large
              icon
              @click="
                comicNext();
                playGameSound('big-button-press-1');
              "
            >
              <v-icon x-large>mdi-arrow-right-bold-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-bottom-sheet>
    <score-board-inline
      :model="result.model"
      :perc="result.perc"
      :passed="result.passed"
      @restart="restart()"
    >
    </score-board-inline>
  </v-container>
</template>

<script>
import ScoreBoardInline from '@/components/ScoreBoardInline.vue';
import SoundPlayer from '@/mixins/sound-player.js';
import ImpressStep from '@/mixins/impress-step.js';
export default {
  components: {
    ScoreBoardInline,
  },
  mixins: [ImpressStep, SoundPlayer],
  data: () => ({
    stepId: 'brazil',
    hints: [
      {
        text: 'h1',
        icon: 'mdi-file-document-multiple-outline',
      },
      {
        text: 'h2',
        icon: 'mdi-laptop',
      },
      {
        text: 'h3',
        icon: 'mdi-ear-hearing',
      },
      {
        text: 'h4',
        icon: 'mdi-lock-outline',
      },
      {
        text: 'h5',
        icon: 'mdi-vpn',
      },
      {
        text: 'h6',
        icon: 'mdi-credit-card-outline',
      },
    ],
    model: 0,
    videos: {
      intro: {
        ended: false,
      },
    },
    result: {
      model: false,
      perc: 0,
      passed: false,
    },
    comicModel: 0,
    comics: [
      {
        correctSpots: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8'],
        triggeredSpots: [],
        triggerable: [
          {
            id: 'x1',
            w: 9,
            h: 22,
            x: 50,
            y: 17,
          },
          {
            id: 'x2',
            w: 10,
            h: 19,
            x: 50,
            y: 47,
          },
          {
            id: 'x3',
            w: 8,
            h: 12,
            x: 58,
            y: 72,
          },
          {
            id: 'x4',
            w: 6,
            h: 9,
            x: 73,
            y: 46,
          },
          {
            id: 'x5',
            w: 5,
            h: 7,
            x: 70.5,
            y: 39,
            t: 'rotate(19deg)',
          },
          {
            id: 'x6',
            w: 5,
            h: 8,
            x: 87,
            y: 33,
          },
          {
            id: 'x7',
            w: 6,
            h: 11,
            x: 94,
            y: 50,
          },
        ],
      },
    ],
  }),
  computed: {
    imgHeight() {
      if (this.$vuetify.breakpoint.height <= 385) {
        return 'calc(90vh - 110px)';
      }
      return `calc(90vh - 31px)`;
    },
  },
  watch: {},
  mounted() {
    this.$nuxt.$on(`video-${this.stepId}-ended`, this.introEnded);
  },
  methods: {
    stepEnter() {
      //
    },
    stepLeave() {
      this.$set(this.videos.intro, 'ended', false);
      this.$set(this.result, 'model', false);
      this.$set(this, 'comicModel', 0);
      this.$set(this, 'model', 0);
      this.reset();
    },
    restart() {
      this.stepLeave();
      setTimeout(() => {
        this.stepEnter();
        this.introEnded();
      }, 100);
    },
    reset() {
      const comics = this.comics;
      comics.forEach((el) => {
        el.triggeredSpots = [];
      });
    },
    addSpot(id) {
      const index = this.comicModel;
      const spots = this.comics[index].triggeredSpots;
      const spotIndex = this.comics[index].triggeredSpots.indexOf(id);
      if (spotIndex > -1) {
        spots.splice(spotIndex, 1);
        this.playGameSound('button-press');
      } else {
        spots.push(id);
        this.playGameSound('big-button-press-2');
      }
    },
    openIntro() {
      this.$store.commit('SET_INSTRUCTIONS', {
        model: true,
        title: this.$t('screens.brazil.title'),
        steps: ['screens.brazil.a1'],
      });
    },
    introEnded(immediate = false) {
      this.$set(this.result, 'model', false);
      setTimeout(
        () => {
          this.$set(this.videos.intro, 'ended', true);
          setTimeout(() => {
            this.openIntro();
          }, 200);
        },
        immediate ? 0 : 1000
      );
    },
    async comicNext() {
      if (this.comicModel >= this.comics.length - 1) {
        // Show results
        this.$set(this, 'model', 1);
        let marks = 0;
        let length = 0;
        const comics = this.comics;
        comics.forEach((comic, i) => {
          if (comic.triggerable?.length > 0) {
            const userSpots = comic.triggeredSpots;
            const correctSpots = comic.correctSpots;
            length += correctSpots.length;
            correctSpots.forEach((spot) => {
              if (userSpots.includes(spot)) {
                marks++;
              }
            });
          }
        });

        const perc = (marks / length) * 100;
        try {
          const info = this.getActiveTaskInfo();
          await this.$store.dispatch('createTask', {
            task_result: perc,
            questions: [],
            task_id: info.taskId,
            task_name: info.taskName,
          });
        } catch (err) {
          console.log(err);
        }
        this.$set(this.result, 'perc', perc);
        this.$set(this.result, 'passed', perc === 100);
        this.$store.commit('SET_SCORE_BOARD_DIALOG', {
          model: false,
          score: perc,
          game: 'brazil',
        });
        this.showResultDialog();
      }
      this.comicModel++;
    },
    showResultDialog() {
      this.$set(this.result, 'model', true);
    },
  },
};
</script>
