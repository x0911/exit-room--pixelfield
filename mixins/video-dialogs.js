export default {
  computed: {
    videoDialogs() {
      // If dialog needs confirmation, add `isConfirmable:true`
      // If not, add `duration:<number>`
      const splash = [
        {
          speaker: this.$t('franklin'),
          from: 3.9,
          textArray: this.$tr('speeches.splash.1', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          from: 4.1,
          textArray: this.$tr('speeches.splash.2', 'array'),
          isConfirmable: true,
        },
        {
          from: 17,
          text: this.$t('welcome-instructions'),
          isConfirmable: true,
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
          textArray: this.$tr('speeches.china.1', 'array'),
          isConfirmable: true,
        },
      ];
      const bedroomX5 = [
        {
          speaker: this.$t('franklin'),
          from: 1.5,
          textArray: this.$tr('speeches.china.2', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('player'),
          from: 2.5,
          textArray: this.$tr('speeches.china.3', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          from: 3.2,
          textArray: this.$tr('speeches.china.4', 'array'),
          isConfirmable: true,
        },
      ];
      const usaX2 = [
        {
          speaker: this.$t('franklin'),
          from: 1,
          text: this.$tr('speeches.usa.1'),
          isConfirmable: true,
        },
      ];
      const usaX3 = [
        {
          speaker: this.$t('franklin'),
          from: 1,
          text: this.$tr('speeches.usa.2'),
          isConfirmable: true,
        },
      ];
      const usaX4 = [
        {
          speaker: this.$t('player-is-thinking'),
          from: 1,
          text: this.$tr('speeches.usa.3'),
          isConfirmable: true,
        },
      ];

      return {
        'game-intro-0': splash,
        italy: reception,
        egypt: dinningRoom,
        'egypt-x2': dinningRoomX2,
        brazil: hallwayRoom,
        'china-x2': bedroomX2,
        'china-x5': bedroomX5,
        'usa-x2': usaX2,
        'usa-x3': usaX3,
        'usa-x4': usaX4,
      };
    },
  },
};
