export default {
  computed: {
    videoDialogs() {
      // If dialog needs confirmation, add `isConfirmable:true`
      // If not, add `duration:<number>`
      const splash = [
        {
          speaker: this.$t('franklin'),
          from: 4,
          duration: 7,
          textArray: this.$tr('speeches.splash.1', 'array'),
          speech: '1-silly.wav',
        },
        {
          from: 14,
          text: this.$t('welcome-instructions'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          from: 16,
          duration: 3,
          textArray: this.$tr('speeches.splash.2', 'array'),
          speech: '2-silly.wav',
        },
      ];
      const reception = [
        {
          speaker: this.$t('franklin'),
          from: 3,
          duration: 10,
          textArray: this.$tr('speeches.italy.1', 'array'),
          speech: '3-silly.wav',
        },
        {
          speaker: this.$t('franklin'),
          from: 15,
          duration: 11,
          textArray: this.$tr('speeches.italy.2', 'array'),
          speech: '4-silly.wav',
        },
      ];
      const dinningRoom = [
        {
          speaker: this.$t('franklin'),
          from: 3,
          duration: 2,
          textArray: this.$tr('speeches.egypt.1', 'array'),
          speech: '5-silly.wav',
        },
        {
          speaker: this.$t('franklin'),
          from: 8,
          duration: 9,
          textArray: this.$tr('speeches.egypt.2', 'array'),
          speech: '6-silly.wav',
        },
      ];
      const dinningRoomX2 = [
        {
          speaker: this.$t('carla-thought'),
          from: 1,
          duration: 3,
          textArray: this.$tr('speeches.egypt.3', 'array'),
          speech: 'carla-1.mp3',
        },
        {
          speaker: this.$t('carla-thought'),
          from: 6,
          duration: 7,
          textArray: this.$tr('speeches.egypt.4', 'array'),
          speech: 'carla-2.mp3',
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 16,
          duration: 6,
          textArray: this.$tr('speeches.egypt.5', 'array'),
          speech: 'yuri-1.mp3',
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 25,
          duration: 2,
          textArray: this.$tr('speeches.egypt.6', 'array'),
          speech: 'yuri-2.mp3',
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 30,
          duration: 6,
          textArray: this.$tr('speeches.egypt.7', 'array'),
          speech: 'yuri-3.mp3',
        },
        {
          speaker: this.$t('yael-thought'),
          from: 39,
          duration: 6,
          textArray: this.$tr('speeches.egypt.8', 'array'),
          speech: 'yael-1.mp3',
        },
        {
          speaker: this.$t('yael-thought'),
          from: 48,
          duration: 5,
          textArray: this.$tr('speeches.egypt.9', 'array'),
          speech: 'yael-2.mp3',
        },
      ];
      const hallwayRoom = [
        {
          speaker: this.$t('franklin'),
          from: 1,
          text: this.$tr('speeches.brazil.1'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          from: 4,
          text: this.$tr('speeches.brazil.2'),
          isConfirmable: true,
        },
      ];
      const bedroomX2 = [
        {
          speaker: this.$t('player-is-thinking'),
          from: 1,
          duration: 13,
          textArray: this.$tr('speeches.china.1', 'array'),
          speech: 'user-1.mp3',
        },
      ];
      return {
        'game-intro-0': splash,
        italy: reception,
        egypt: dinningRoom,
        'egypt-x2': dinningRoomX2,
        brazil: hallwayRoom,
        'china-x2': bedroomX2,
      };
    },
  },
};
