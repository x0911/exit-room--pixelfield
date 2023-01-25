<template>
  <v-dialog
    v-model="dialog.model"
    persistent
    scrollable
    max-width="500px"
    :retain-focus="false"
  >
    <v-card light min-height="330" class="info-screen">
      <v-layout align-center justify-center align-content-center column>
        <v-card-title class="justify-center" style="height: 133px">
          <div v-if="models.stars" class="d-flex">
            <client-only>
              <lottie-animation
                ref="star1"
                :height="100"
                :width="100"
                :loop="false"
                :auto-play="false"
                path="star_fix_v1"
              ></lottie-animation>
              <lottie-animation
                ref="star2"
                :height="100"
                :width="100"
                :loop="false"
                :auto-play="false"
                path="star_fix_v1"
              ></lottie-animation>
              <lottie-animation
                ref="star3"
                :height="100"
                :width="100"
                :loop="false"
                :auto-play="false"
                path="star_fix_v1"
              ></lottie-animation>
            </client-only>
          </div>
        </v-card-title>
        <v-card-title class="justify-center pt-2" style="height: 95px">
          <v-slide-y-reverse-transition>
            <div v-if="models.title" class="text-uppercase d-inline-block">
              {{ scoreInfo.title }}
            </div>
          </v-slide-y-reverse-transition>
        </v-card-title>
        <v-card-actions
          class="px-4 justify-center pb-4 pt-6"
          style="height: 85px"
        >
          <v-slide-y-reverse-transition>
            <v-btn
              v-if="models.actions"
              color="primary"
              large
              class="px-8"
              tile
              depressed
              @click="next"
            >
              {{ $t(scoreInfo.type === 'perfect' ? 'lets-go' : 'okay') }}
            </v-btn>
          </v-slide-y-reverse-transition>
        </v-card-actions>
      </v-layout>
    </v-card>
    <audio
      ref="winStarAudioEffect"
      :controls="false"
      class="d-none"
      preload="metadata"
      :loop="false"
      :autoplay="false"
    >
      <source
        :src="`https://storage.googleapis.com/firewall-static-files/audio/win-star.wav`"
        type="audio/wav"
      />
    </audio>
  </v-dialog>
</template>

<script>
export default {
  props: {},
  data: () => ({
    models: {
      stars: false,
      avatar: false,
      title: false,
      actions: false,
    },
  }),
  computed: {
    dialog() {
      return this.$store.getters.scoreBoardDialog;
    },
    scoreInfo() {
      const score = this.dialog.score;
      const stars = score > 80 ? 3 : score > 50 ? 2 : score > 1 ? 1 : 0;
      const scores = {
        3: {
          title: `${this.$t('excellent')}!`,
          type: 'perfect',
        },
        2: {
          title: `${this.$t('bad')}!`,
          type: 'okay',
        },
        1: {
          title: `${this.$t('too-bad')}!`,
          type: 'bad',
        },
      };
      const selectedScore = scores[stars] ? scores[stars] : scores[1];
      return {
        ...selectedScore,
        stars,
      };
    },
    model() {
      return this.dialog.model;
    },
    soundsOff() {
      return this.$store.getters.soundsOff;
    },
  },
  watch: {
    model(v) {
      this.init(v);
    },
    soundsOff(v) {
      if (this.$refs.winStarAudioEffect) {
        if (v === true) {
          this.$refs.winStarAudioEffect.volume = 0;
          this.$refs.winStarAudioEffect.muted = true;
        } else {
          this.$refs.winStarAudioEffect.volume = 1;
          this.$refs.winStarAudioEffect.muted = false;
        }
      }
    },
  },
  mounted() {
    this.init(this.model);
  },
  methods: {
    animateStar(index) {
      const star = this.$refs[`star${index}`].anim;
      const audio = this.$refs.winStarAudioEffect;
      if (this.soundsOff) {
        this.$refs.winStarAudioEffect.volume = 0;
        this.$refs.winStarAudioEffect.muted = true;
      } else {
        this.$refs.winStarAudioEffect.volume = 1;
        this.$refs.winStarAudioEffect.muted = false;
      }
      this.$refs.winStarAudioEffect.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 800);
      star.play();
    },
    init(v) {
      if (v === true) {
        this.$set(this.models, 'stars', true);
        setTimeout(() => {
          if (this.scoreInfo.stars > 0) {
            this.animateStar(1);
            setTimeout(() => {
              if (this.scoreInfo.stars > 1) {
                this.animateStar(2);
                setTimeout(() => {
                  if (this.scoreInfo.stars > 2) {
                    this.animateStar(3);
                  }
                }, 800);
              }
            }, 800);
          }
        }, 150);
        setTimeout(() => {
          this.$set(this.models, 'title', true);
          this.$set(this.models, 'avatar', true);
          setTimeout(() => {
            this.$set(this.models, 'actions', true);
          }, 500);
        }, 800 * this.scoreInfo.stars);
      } else {
        this.$set(this.models, 'stars', false);
        this.$set(this.models, 'actions', false);
        this.$set(this.models, 'title', false);
        this.$set(this.models, 'avatar', false);
      }
    },
    next() {
      this.playGameSound('big-button-press-1');
      if (typeof this.dialog.next === 'function') {
        this.dialog.next();
      }
      setTimeout(() => {
        this.$store.commit('SET_SCORE_BOARD_DIALOG', {
          model: false,
          score: 0,
          game: null,
          next: () => {},
        });
      }, 10);
    },
  },
};
</script>
