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
          style:
            'position: fixed; top: calc(50% - 120px); width: 720px; max-width: 75vw',
        },
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 4.2,
          textArray: this.$tr('speeches.splash.2', 'array'),
          isConfirmable: true,
          style:
            'position: fixed; top: max(calc(50% - 65px), 20px); width: 720px; max-width: 75vw',
        },
      ];
      const reception = [
        {
          speaker: this.$t('receptionist'),
          avatar: 'receptionist.png',
          from: 11,
          textArray: this.$tr('speeches.italy.1', 'array'),
          isConfirmable: true,
        },
      ];
      const dinningRoom = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 5,
          textArray: this.$tr('speeches.egypt.1', 'array'),
          isConfirmable: true,
        },
      ];
      const dinningRoomX2 = [
        {
          speaker: this.$t('carla-thought'),
          avatar: 'carla.jpg',
          from: 2,
          textArray: this.$tr('speeches.egypt.2', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('yuri-thought'),
          avatar: 'yuri.jpg',
          from: 4,
          textArray: this.$tr('speeches.egypt.3', 'array'),
          isConfirmable: true,
        },
        {
          speaker: this.$t('dave-thought'),
          avatar: 'dave.jpg',
          from: 6,
          textArray: this.$tr('speeches.egypt.4', 'array'),
          isConfirmable: true,
          nextBtnText: this.$tr('call-franklin'),
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
      const bedroom = [
        {
          from: 2,
          hideSpeaker: true,
          textArray: this.$tr('speeches.usa.1'),
          isConfirmable: true,
        },
      ];
      const bedroomX2 = [
        {
          from: 1,
          hideSpeaker: true,
          textArray: this.$tr('speeches.china.1', 'array'),
          isConfirmable: true,
        },
      ];
      const bedroomX5 = [
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 3.5,
          textArray: this.$tr('speeches.china.2', 'array'),
          isConfirmable: true,
          questionText: this.$t('what-should-tell-franklin'),
          wrongResponse: this.$t('wrong-response-hint'),
          options: [
            {
              textArray: this.$tr('speeches.china.3', 'array'),
              isCorrect: true,
            },
            {
              textArray: this.$tr('speeches.china.5', 'array'),
              isCorrect: false,
            },
          ],
          validateOptionsOnNext: true,
        },
        {
          speaker: this.$t('franklin'),
          avatar: 'franklin.jpg',
          from: 6.5,
          textArray: this.$tr('speeches.china.4', 'array'),
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
        usa: bedroom,
      };
    },
  },
};
