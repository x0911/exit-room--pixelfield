<template>
  <v-card-title class="pt-5 px-5 mb-3 font-weight-regular">
    <v-avatar class="me-2 score-avatar" size="80" tile>
      <v-img
        :src="require(`@/assets/images/brick/${scoreInfo.type}_score.jpg`)"
        contain
      ></v-img>
    </v-avatar>
    <span class="ms-2 me-8 text-uppercase">
      {{ scoreInfo.title }}
    </span>
    <client-only>
      <div v-if="model" class="d-inline-block p-relative">
        <lottie-animation
          :height="45"
          :width="45"
          :loop="false"
          :auto-play="scoreInfo.stars > 0"
          path="star_fix_v1"
          class="center-top-absolute"
          :style="`left: 0px`"
        ></lottie-animation>
        <lottie-animation
          :height="45"
          :width="45"
          :loop="false"
          :auto-play="scoreInfo.stars > 1"
          path="star_fix_v1"
          class="center-top-absolute"
          :style="`left: 30px`"
        ></lottie-animation>
        <lottie-animation
          :height="45"
          :width="45"
          :loop="false"
          :auto-play="scoreInfo.stars > 2"
          path="star_fix_v1"
          class="center-top-absolute"
          :style="`left: 60px`"
        ></lottie-animation>
      </div>
    </client-only>
  </v-card-title>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      default: 0,
    },
    model: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {
    scoreInfo() {
      const score = this.score;
      const stars = score > 80 ? 3 : score > 50 ? 2 : score > 1 ? 1 : 0;
      const scores = {
        3: {
          title: `${this.$t('excellent')}!`,
          type: 'perfect',
        },
        2: {
          title: `${this.$t('well-done')}!`,
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
  },
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.score-avatar {
  filter: hue-rotate(90deg);
}
</style>
