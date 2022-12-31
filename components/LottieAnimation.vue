<template>
  <div
    v-if="style"
    ref="lavContainer"
    :class="{
      lavContainer: true,
      light,
      dark,
    }"
    :style="style"
  />
</template>

<script>
import lottie from 'lottie-web';

export default {
  props: {
    path: {
      type: [Object, String],
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    light: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      required: false,
      default: 1,
    },
    width: {
      type: Number,
      required: false,
      default: -1,
    },
    height: {
      type: Number,
      required: false,
      default: -1,
    },
    loop: {
      type: Boolean,
      required: false,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      required: false,
      default: true,
    },
    loopDelayMin: {
      type: Number,
      required: false,
      default: 0,
    },
    loopDelayMax: {
      type: Number,
      required: false,
      default: 0,
    },
    waitSeconds: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    name: 'lottie-animation',
    rendererSettings: {
      scaleMode: 'centerCrop',
      clearCanvas: true,
      progressiveLoad: false,
      hideOnTransparent: true,
    },
    anim: null,
    style: null,
  }),
  watch: {
    path(newVal, oldVal) {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    wasteTime(waitSeconds = 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 100 + waitSeconds * 1000);
      });
    },
    async init() {
      this.style = {
        width: this.width !== -1 ? `${this.width}px` : '100%',
        height: this.height !== -1 ? `${this.height}px` : '100%',
        overflow: 'hidden',
        margin: '0 auto',
      };

      // eslint-disable-next-line no-unused-vars
      const justWastingTime = await this.wasteTime(this.waitSeconds);

      if (this.anim) {
        this.anim.destroy();
      }

      const path =
        typeof this.path === 'object'
          ? this.path
          : require(`@/assets/animated/${this.path}.json`);

      this.anim = lottie.loadAnimation({
        container: this.$refs.lavContainer,
        renderer: 'svg',
        loop: this.loop,
        autoplay: this.autoPlay,
        animationData: path,
        rendererSettings: this.rendererSettings,
      });

      this.$emit('AnimControl', this.anim);

      this.anim.setSpeed(this.speed);
      if (this.loopDelayMin > 0) {
        this.anim.loop = false;
        this.anim.autoplay = false;
        this.executeLoop();
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    executeLoop() {
      this.anim.play();
      setTimeout(() => {
        this.anim.stop();
        this.executeLoop();
      }, this.getRandomInt(this.loopDelayMin, this.loopDelayMax === 0 ? this.loopDelayMin : this.loopDelayMax));
    },
  },
};
</script>

<style lang="css">
.lavContainer.light svg path {
  stroke: #ffffff;
}
.lavContainer.dark svg path {
  stroke: #000000;
}
</style>
