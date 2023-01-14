export default {
  computed: {
    videoDialogs() {
      // If dialog needs confirmation, add `isConfirmable:true`
      // If not, add `duration:<number>`
      const splash = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 3.9,
          textArray: this.$tr('speeches.splash.1', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 4.2,
          textArray: this.$tr('speeches.splash.2', 'array'),
          isConfirmable: true,
        },
      ];
      const reception = [
        {
          speaker: this.$t('receptionist'),
          avatar: 'receptionist.jpg',
          from: 11,
          textArray: this.$tr('speeches.italy.1', 'array'),
          isConfirmable: true,
        },
      ];
      const dinningRoom = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 3,
          textArray: this.$tr('speeches.egypt.1', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 5,
          textArray: this.$tr('speeches.egypt.2', 'array'),
          isConfirmable: true,
        },
      ];
      const dinningRoomX2 = [
        {
          speaker: this.$t('carla-thought'),
          from: 1,
          textArray: this.$tr('speeches.egypt.3', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('carla-thought'),
          from: 2,
          textArray: this.$tr('speeches.egypt.4', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 2,
          textArray: this.$tr('speeches.egypt.5', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 25,
          textArray: this.$tr('speeches.egypt.6', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yuri-thought'),
          from: 30,
          textArray: this.$tr('speeches.egypt.7', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yael-thought'),
          from: 39,
          textArray: this.$tr('speeches.egypt.8', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yael-thought'),
          from: 48,
          textArray: this.$tr('speeches.egypt.9', 'array'),
          isConfirmable: true,
        },
      ];
      const hallwayRoom = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 1,
          textArray: this.$tr('speeches.brazil.1'),
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
          avatar: 'franklin.jpg',
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
          avatar: 'franklin.jpg',
          from: 3.2,
          textArray: this.$tr('speeches.china.4', 'array'),
          isConfirmable: true,
        },
      ];
      const usaX2 = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 1,
          text: this.$tr('speeches.usa.1'),
          isConfirmable: true,
        },
      ];
      const usaX3 = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 1,
          text: this.$tr('speeches.usa.2'),
          isConfirmable: true,
        },
      ];
      const usaX4 = [
        {
          speaker: this.$t('player-is-thinking'),
          avatar: 'player.png',
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
