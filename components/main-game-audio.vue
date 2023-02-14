<template>
  <audio
    v-if="pathToPlay"
    ref="audio"
    autoplay
    loop
    preload="metadata"
    :controls="false"
    class="d-none"
    @ended="playNextAudio()"
  >
    <source
      :src="`https://storage.googleapis.com/firewall-static-files/audio/${pathToPlay}`"
      type="audio/mp3"
    />
  </audio>
</template>

<script>
export default {
  data: () => ({
    volume: 1,
    pathToPlay: '',
    audios: [
      'main-track-1.mp3',
      'main-track-4.mp3',
      'main-track-5.mp3',
    ],
  }),
  computed: {
    globalBtns() {
      return this.$store.getters.globalBtns;
    },
    fullPath() {
      return this.$route.fullPath;
    },
    path() {
      return this.$route.path;
    },
    audioStatus() {
      return this.$store.getters.audioStatus;
    },
    soundsOff() {
      return this.$store.getters.soundsOff;
    },
    audioSoundsOff() {
      return this.$store.getters.audioSoundsOff;
    },
    activeStep() {
      return this.$store.getters.activeStep;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
    skipIntro() {
      return this.$store.getters.skipMapIntro || false;
    },
  },
  watch: {
    globalBtns(v) {
      if (v) {
        this.play();
      } else {
        this.pause();
      }
    },
    activeStep(v) {
      this.handleActiveStepChange(v);
    },
    audioStatus(v) {
      if (this.$refs.audio) {
        if (v === 'off') {
          this.$refs.audio.volume = 0;
          this.$refs.audio.muted = true;
        } else if (
          v === 'on' &&
          (this.soundsOff === false || this.audioSoundsOff === false)
        ) {
          this.$refs.audio.volume = this.volume;
          this.$refs.audio.muted = false;
        }
      }
    },
    soundsOff(v) {
      if (this.$refs.audio) {
        if (v === true) {
          this.$refs.audio.volume = 0;
          this.$refs.audio.muted = true;
        } else if (v === false && this.audioStatus !== 'off') {
          this.$refs.audio.volume = this.volume;
          this.$refs.audio.muted = false;
        }
      }
    },
    audioSoundsOff(v) {
      if (this.$refs.audio) {
        if (v === true) {
          this.$refs.audio.volume = 0;
          this.$refs.audio.muted = true;
        } else if (v === false && this.audioStatus !== 'off') {
          this.$refs.audio.volume = this.volume;
          this.$refs.audio.muted = false;
        }
      }
    },
    fullPath() {
      this.play();
    },
    path(v) {
      if (
        this.audioStatus !== 'off' &&
        (this.soundsOff === false || this.audioSoundsOff === false)
      ) {
        if (['map', 'splash'].includes(this.activeStep)) {
          this.$refs.audio.volume = this.volume;
        } else {
          this.$refs.audio.volume = this.volume * 0.75;
        }
      }
    },
    skipIntro(v) {
      if (v === true && (!this.$refs.audio || this.$refs.audio?.paused)) {
        this.handleActiveStepChange(this.activeStep);
      }
    },
  },
  mounted() {
    this.shuffleAudios();
    this.play();
    window.document.documentElement.addEventListener('click', this.play);
    setTimeout(() => {
      this.handleActiveStepChange(this.activeStep);
    }, 100);
    this.$nuxt.$on('play-main-audio', this.handleActiveStepChange);
    this.$nuxt.$on('pause-main-audio', this.pause);
  },
  methods: {
    shuffleAudios() {
      const array = this.audios;
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }
      const first = array[0];
      this.$set(this, 'pathToPlay', first);
    },
    playNextAudio() {
      const index = this.audios.indexOf(this.pathToPlay);
      if (index + 1 < this.audios.length) {
        this.$set(this, 'pathToPlay', this.audios[index + 1]);
      } else {
        this.$set(this, 'pathToPlay', this.audios[0]);
      }
      this.play();
    },
    handleActiveStepChange(v) {
      if (this.rooms.includes(v)) {
        this.restartAudio(`quiz/${v}.mp3`);
      } else {
        this.shuffleAudios();
        this.restartAudio(this.pathToPlay);
      }
    },
    wait(ms = 10) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, ms);
      });
    },
    async restartAudio(v) {
      this.pause();
      await this.wait(50);
      this.$set(this, 'pathToPlay', null);
      await this.wait(50);
      this.$set(this, 'pathToPlay', v);
      await this.wait(50);
      this.play();
    },
    pause() {
      if (this.$refs.audio) {
        this.$refs.audio.pause();
      }
    },
    play() {
      if (this.$refs.audio) {
        if (
          this.audioSoundsOff === true ||
          this.soundsOff === true ||
          this.audioStatus === 'off'
        ) {
          this.$refs.audio.volume = 0;
          this.$refs.audio.muted = true;
        } else {
          this.$refs.audio.volume = this.volume;
          this.$refs.audio.muted = false;
        }
      }
      if (this.$refs.audio?.paused) {
        this.$refs.audio
          .play()
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
      // Check if play() worked
      if (!this.$refs.audio?.paused) {
        window.document.documentElement.removeEventListener('click', this.play);
      }
    },
  },
};
</script>
