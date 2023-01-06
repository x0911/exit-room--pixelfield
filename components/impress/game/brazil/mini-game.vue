<template>
  <v-card light tile flat class="card pt-16">
    <v-card-text class="pa-0 card__content">
      <div class="card__content__main">
        <div
          v-for="({ moles }, lineIdx) in lines"
          :key="lineIdx"
          class="card__content__main__line"
        >
          <img
            v-for="(mole, moleIdx) in moles"
            :key="moleIdx"
            class="image mx-16"
            :src="
              require(`~/assets/images/games/brazil/mole-${mole.status}.png`)
            "
            @click="hitMoleHandler(mole)"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const MOLE_STATUS = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  HIT: 'hit',
};

export default {
  name: 'MiniGame',
  data() {
    return {
      lines: [
        {
          moles: [{ status: MOLE_STATUS.HIDDEN }],
        },
        {
          moles: [
            { status: MOLE_STATUS.HIDDEN },
            { status: MOLE_STATUS.HIDDEN },
          ],
        },
        {
          moles: [
            { status: MOLE_STATUS.HIDDEN },
            { status: MOLE_STATUS.HIDDEN },
            { status: MOLE_STATUS.HIDDEN },
          ],
        },
      ],
      restartCount: 0,
      score: 0,
      scores: []
    };
  },
  computed: {
    canRestart() {
      return this.restartCount < 5
    },
  },
  mounted() {
    this.$store.commit('SET_INSTRUCTIONS', {
      model: true,
      title: this.$t('brazil.mini_game.title'),
      steps: ['brazil.mini_game.description'],
      nextText: this.$t('start'),
      nextMethod: this.startGame,
    });
  },
  methods: {
    startGame() {
      const intervalRef = setInterval(this.gameManager, 1000);

      setTimeout(() => {
        clearInterval(intervalRef);
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          title: this.$t('brazil.mini_game.title'),
          steps: [this.$t('brazil.mini_game.score', { score: this.score })],
          nextText: this.$t('finish'),
          nextMethod: this.finishGame,
          cancelable: this.canRestart,
          cancelText: this.$t('restart'),
          cancelMethod: this.restartGame
        });
      }, 30 * 1000);
    },
    gameManager() {
      const randomLine = Math.floor(Math.random() * 3);
      const randomMole = Math.floor(Math.random() * 3);
      const randomHide = Math.random() * 3000;
      const randomHideSecs = randomHide >= 1000 ? randomHide : 1000;

      if (randomLine <= 2) {
        const { moles } = this.lines[randomLine];
        const selectedMole =
          moles[randomMole] ||
          moles[randomLine] ||
          moles[randomMole - 1] ||
          moles[randomLine - 1] ||
          moles[0];
        selectedMole.status = MOLE_STATUS.VISIBLE;
        setTimeout(() => {
          selectedMole.status = MOLE_STATUS.HIDDEN;
        }, randomHideSecs);
      }
    },
    hitMoleHandler(mole) {
      if (mole.status !== MOLE_STATUS.VISIBLE) return;
      mole.status = MOLE_STATUS.HIT;
      this.score += 50;
      setTimeout(() => {
        mole.status = MOLE_STATUS.HIDDEN;
      }, 200);
    },
    restartGame() {
      this.restartCount++
      this.scores.push(this.score)
      this.score = 0
      this.resetMoles()
      this.startGame()
    },
    resetMoles() {
      this.lines.forEach(({ moles }) => {
        moles.forEach((mole) => {
          mole.status = MOLE_STATUS.HIDDEN;
        });
      });
    },
    finishGame() {
      const maxScore = Math.max(...this.scores)
      this.$emit('next', maxScore)
      this.resetMoles()
      this.score = 0
      this.scores = []
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/mini-game.scss';
</style>
