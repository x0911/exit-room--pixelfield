<template>
  <v-card class="card transparent pt-16" flat light tile>
    <v-img
      :src="require('~/assets/images/games/brazil/cameras_background.png')"
      class="d-flex align-center justify-center"
    >
      <div class="card__infos d-flex justify-space-between">
        <div
          class="white--text text-center rounded-lg font-weight-bold pa-2 card__infos__item"
        >
          {{ $t('brazil.mini_game.high_score') }} {{ getHighestScore }}
        </div>
        <div class="d-flex">
          <div
            class="white--text text-center rounded-lg font-weight-bold pa-2 mr-4 card__infos__item"
          >
            {{ score }} {{ $t('brazil.mini_game.points') }}
          </div>
          <div
            class="white--text text-center rounded-lg font-weight-bold pa-2 card__infos__item"
          >
            {{ timeRemainingSecs }}
            {{ $t('brazil.mini_game.seconds') }}
          </div>
        </div>
      </div>
      <v-card-text class="pa-0 card__content">
        <div
          v-for="({ cameras }, lineIdx) in lines"
          :key="lineIdx"
          class="card__content__line"
        >
          <img
            v-for="(camera, camIdx) in cameras"
            :key="camIdx"
            :src="
              require(`~/assets/images/games/brazil/camera_${camera.status}.png`)
            "
            class="image mx-4"
            @click="hitCameraHandler(camera)"
          />
        </div>
      </v-card-text>
    </v-img>
  </v-card>
</template>

<script>
const CAMERA_STATUS = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  HIT: 'hit',
};

export default {
  name: 'MiniGame',
  props: {
    isMiniGame: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lines: [
        {
          cameras: [
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
          ],
        },
        {
          cameras: [
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
          ],
        },
        {
          cameras: [
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
            { status: CAMERA_STATUS.HIDDEN },
          ],
        },
      ],
      timeRemainingSecs: 30,
      restartCount: 0,
      score: 0,
      scores: [],
    };
  },
  computed: {
    canRestart() {
      return this.restartCount < 4;
    },
    getHighestScore() {
      return this.scores.length ? Math.max(...this.scores) : 0;
    },
  },
  watch: {
    timeRemainingSecs(value) {
      if (!value) {
        this.scores.push(this.score);
      }
    },
  },
  mounted() {
    this.$store.commit('SET_INSTRUCTIONS', {
      bottomModel: true,
      title: this.$t('brazil.mini_game.title'),
      steps: ['brazil.mini_game.description'],
      nextText: this.$t('start'),
      image: 'avatars/franklin.jpg',
      nextMethod: this.startGame,
    });
  },
  methods: {
    startGame() {
      const gameIntervalRef = setInterval(this.gameManager, 1000);
      const timeIntervalRef = setInterval(() => this.timeRemainingSecs--, 1000);

      setTimeout(() => {
        clearInterval(gameIntervalRef);
        clearInterval(timeIntervalRef);

        if (this.isMiniGame) {
          this.$store.commit('SET_INSTRUCTIONS', {
            model: true,
            title: this.$t('brazil.mini_game.title'),
            steps: [
              this.$t('brazil.mini_game.score', {
                score: this.getHighestScore,
              }),
            ],
            nextText: this.$t('finish'),
            nextMethod: this.finishGame,
            cancelable: this.canRestart,
            cancelText: this.$t('restart'),
            cancelMethod: this.restartGame,
          });
        }
      }, this.timeRemainingSecs * 1000);
    },
    gameManager() {
      const randomLine = Math.floor(Math.random() * 3);
      const randomCamera = Math.floor(Math.random() * 3);
      const randomHide = Math.random() * 1000;
      const randomHideSecs = randomHide >= 300 ? randomHide : 300;

      if (randomLine <= 2) {
        const { cameras } = this.lines[randomLine];
        const selectedCamera = cameras[randomCamera];
        selectedCamera.status = CAMERA_STATUS.VISIBLE;
        setTimeout(() => {
          selectedCamera.status = CAMERA_STATUS.HIDDEN;
        }, randomHideSecs);
      }
    },
    hitCameraHandler(camera) {
      if (camera.status !== CAMERA_STATUS.VISIBLE) return;
      camera.status = CAMERA_STATUS.HIT;
      this.score += 50;
      setTimeout(() => {
        camera.status = CAMERA_STATUS.HIDDEN;
      }, 200);
    },
    restartGame() {
      this.restartCount++;
      this.timeRemainingSecs = 30;
      this.score = 0;
      this.resetCameras();
      this.startGame();
    },
    resetCameras() {
      this.lines.forEach(({ cameras }) => {
        cameras.forEach((camera) => {
          camera.status = CAMERA_STATUS.HIDDEN;
        });
      });
    },
    finishGame() {
      this.scores.push(this.score);
      this.$emit('next', this.getHighestScore);
      this.resetCameras();
      this.score = 0;
      this.scores = [];
      this.$nuxt.$emit('pause-main-audio');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/mini-game.scss';
</style>
