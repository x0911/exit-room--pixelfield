<template>
  <div class="video-container" :class="{ 'can-play': canPlay }">
    <video
      v-if="mountVideo"
      ref="video"
      :class="{
        video: true,
        'is-vertical': isVertical,
      }"
      playsinline
      :autoplay="false"
      preload="metadata"
      :controls="false"
      :contextmenu="false"
      @ended="ended()"
    >
      <source
        :src="`https://storage.googleapis.com/firewall-static-files/video/transition-step.mov`"
        type="video/mp4; codecs='hvc1'"
      />
      <source
        :src="`https://storage.googleapis.com/firewall-static-files/video/transition-step.webm`"
        type="video/webm"
      />
      {{ $t('browser-doesnt-support-video') }}
    </video>
  </div>
</template>

<script>
import IsVerticalMixin from '@/mixins/is-vertical.js';
export default {
  mixins: [IsVerticalMixin],
  data: () => ({
    canPlay: false,
    videoId: 'transition-step-video',
    mountVideo: false,
  }),
  computed: {
    activeStep() {
      return this.$store.getters.activeStep;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
  },
  watch: {},
  beforeDestroy() {
    this.$set(this, 'canPlay', false);
    this.$store.commit('SHOW_GLOBAL_BTNS');
  },
  async mounted() {
    await this.wait(1000);
    this.$set(this, 'mountVideo', true);
    this.$refs.video?.addEventListener('play', () => {
      this.$store.commit('HIDE_GLOBAL_BTNS');
    });
    window.document.documentElement.addEventListener('click', (e) => {
      // Please don't try `setTimeOut` here
      if (
        this.$refs.video &&
        (e.target['data-video-start'] === this.videoId ||
          e.target.closest(`[data-video-start="${this.videoId}"]`))
      ) {
        this.$set(this, 'canPlay', true);
        this.$refs.video.currentTime = 0;

        const playPromise = this.$refs.video.play();
        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              // Automatic playback started!
              // Show playing UI.
            })
            .catch((error) => {
              // Auto-play was prevented
              // Show paused UI.
              console.log('Paused video.');
              console.log(error);
            });
        }
      }
    });
  },
  methods: {
    wait(ms = 10) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },
    ended() {
      this.$refs.video?.pause();
      this.$store.commit('SHOW_GLOBAL_BTNS');
      this.$set(this, 'canPlay', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/video.scss';

.video-container {
  z-index: 999999;
  opacity: 0;
  transition: none !important;

  &.can-play {
    opacity: 1;
  }
}
</style>
