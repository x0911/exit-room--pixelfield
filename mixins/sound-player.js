export default {
  methods: {
    playGameSound(name) {
      if (name) {
        this.$nuxt.$emit('play-game-sound', name);
      }
    },
    stopGameSound(name) {
      if (name) {
        this.$nuxt.$emit('stop-game-sound', name);
      }
    },
  },
};
