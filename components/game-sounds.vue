<template>
  <div>
    <template v-for="(sound, i) in sounds">
      <audio
        :key="i"
        :ref="sound.name"
        :autoplay="false"
        :loop="sound.loop || false"
        preload="metadata"
        :controls="false"
        class="d-none"
      >
        <source
          :src="`https://storage.googleapis.com/firewall-static-files/audio/${sound.name}.${sound.type}`"
          :type="`audio/${sound.type}`"
        />
      </audio>
    </template>
  </div>
</template>

<script>
export default {
  data: () => ({
    volume: 0.4,
    sounds: [
      {
        description: '',
        name: 'big-button-press-1',
        type: 'wav',
      },
      {
        description: '',
        name: 'big-button-press-2',
        type: 'wav',
      },
      {
        description: '',
        name: 'button-press',
        type: 'wav',
        volume: 1,
      },
      {
        description: '',
        name: 'clock-sound',
        type: 'mp3',
        loop: true,
        volume: 0.7,
      },
      {
        description: '',
        name: 'folder-sound',
        type: 'mp3',
        volume: 0.8,
      },
      {
        description: '',
        name: 'game-over',
        type: 'mp3',
        volume: 0.8,
      },
      {
        description: '',
        name: 'main-track',
        type: 'mp3',
      },
      {
        description: '',
        name: 'main-track-2',
        type: 'mp3',
      },
      {
        description: '',
        name: 'main-track-3',
        type: 'mp3',
      },
      {
        description: '',
        name: 'map',
        type: 'mp3',
      },
      {
        description: '',
        name: 'task-fail',
        type: 'mp3',
      },
      {
        description: '',
        name: 'task-success',
        type: 'wav',
      },
      {
        description: '',
        name: 'times-up',
        type: 'wav',
      },
      {
        description: '',
        name: 'unlock-sound-track',
        type: 'mp3',
      },
      {
        description: '',
        name: 'win-star',
        type: 'wav',
      },
      {
        description: '',
        name: 'camera-shot',
        type: 'mp3',
      },
    ],
  }),
  computed: {
    soundsOff() {
      return this.$store.getters.soundsOff;
    },
  },
  watch: {
    soundsOff(v) {
      this.sounds.forEach((sound) => {
        const audioRef = this.$refs[sound.name];
        if (audioRef && audioRef[0]) {
          const audio = audioRef[0];
          if (v === true) {
            audio.volume = 0;
            audio.muted = true;
          } else {
            const audioObj = this.sounds.find((s) => s.name === sound.name);
            const objVolume = audioObj && audioObj.volume ? audioObj.volume : 0;
            audio.volume = objVolume || this.volume;
            audio.muted = false;
          }
        }
      });
    },
  },
  mounted() {
    this.$nuxt.$on('play-game-sound', (name) => {
      if (this.$refs && this.$refs[name] && this.$refs[name][0]) {
        const audio = this.$refs[name][0];
        const audioObj = this.sounds.find((s) => s.name === name);
        const objVolume = audioObj && audioObj.volume ? audioObj.volume : 0;
        if (this.soundsOff) {
          audio.volume = 0;
          audio.muted = true;
        } else {
          audio.volume = objVolume || this.volume;
          audio.muted = false;
        }
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }
    });
    this.$nuxt.$on('stop-game-sound', (name) => {
      if (this.$refs && this.$refs[name] && this.$refs[name][0]) {
        const audio = this.$refs[name][0];
        audio.pause();
        audio.currentTime = 0;
      }
    });
  },
  methods: {},
};
</script>
