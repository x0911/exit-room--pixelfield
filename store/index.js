export const state = () => ({
  bg: null,
  skipMapIntro: false,
  activeStep: null,
  orientation: '',
  instructions: {
    title: '',
    inlineTitle: '',
    model: false,
    bottomModel: false,
    rightModel: false,
    nextLink: null,
    nextMethod: () => {},
    cancelMethod: () => {},
    nextText: null,
    prevLink: null,
    prevText: null,
    cancelText: null,
    showNextArrow: true,
    step: 1,
    steps: [],
    upperImage: '',
    image: null,
    overlay: false,
    video: '',
    spans: false,
    lineSuffix: '',
    cancelable: false,
  },
  instructionsDefault: {
    title: '',
    inlineTitle: '',
    model: false,
    bottomModel: false,
    rightModel: false,
    nextLink: null,
    nextMethod: () => {},
    nextText: null,
    prevLink: null,
    prevText: null,
    showNextArrow: true,
    step: 1,
    steps: [],
    upperImage: '',
    image: null,
    overlay: false,
    video: '',
    spans: false,
    lineSuffix: '',
    cancelable: false,
  },
  scoreBoardDialog: {
    model: false,
    score: 0,
    game: null,
    next: () => {},
  },
  hint: [],
  audioStatus: null,
  globalBtns: true,
  appLoaded: false,
  videos: {
    'game-intro-0': {
      path: 'intro-trim-1.mp4',
      canPlay: false,
      ended: false,
    },
    'game-outro': {
      path: 'outro.mp4',
      canPlay: false,
      ended: false,
    },
    italy: {
      path: 'intro-trim-2.mp4',
      canPlay: false,
      ended: false,
    },
    'italy-x2': {
      path: '1st-task-v2.mp4',
      canPlay: false,
      ended: false,
    },
    egypt: {
      path: '2nd-room-v1.mp4',
      canPlay: false,
      ended: false,
    },
    'egypt-x2': {
      path: '2nd-room-v2-longer.mp4',
      canPlay: false,
      ended: false,
    },
    china: {
      path: '3rd-room-v1.mp4',
      canPlay: false,
      ended: false,
    },
    'china-x2': {
      path: '3rd-room-compine-v2_v3.mp4',
      canPlay: false,
      ended: false,
    },
    'china-x3': {
      path: '3rd-room-v4.mp4',
      canPlay: false,
      ended: false,
    },
    'china-x4': {
      path: '3rd-room-v5.mp4',
      canPlay: false,
      ended: false,
    },
    'china-x5': {
      path: '3rd-room-v6.mp4',
      canPlay: false,
      ended: false,
    },
    brazil: {
      path: '4th-room-v2.mp4',
      canPlay: false,
      ended: false,
    },
    'brazil-x2': {
      path: '4th-room-v4.mp4',
      canPlay: false,
      ended: false,
    },
    'brazil-x3': {
      path: '4th-room-v3.mp4',
      canPlay: false,
      ended: false,
    },
    usa: {
      path: '5th-room.mp4',
      canPlay: false,
      ended: false,
    },
    'usa-x2': {
      path: '5th-room-v2.mp4',
      canPlay: false,
      ended: false,
    },
    'usa-x3': {
      path: '5th-room-v3.mp4',
      canPlay: false,
      ended: false,
    },
    russia: {
      path: '6th-room.mp4',
      canPlay: false,
      ended: false,
    },
    // india: {
    //   path: '7th-task.mp4',
    //   canPlay: false,
    //   ended: false,
    // },
  },
  rooms: [
    'italy',
    'egypt',
    'china',
    'brazil',
    'usa',
    'russia',
    // 'india'
  ],
  roomsBgs: {
    italy: 'italy',
    egypt: 'egypt',
    china: 'china',
    brazil: 'brazil',
    usa: 'usa',
    russia: 'russia',
  },
  soundsOff: false,
  audioSoundsOff: false,
  gameIsDone: false,
  disclaimerModel: false,
  mapLoaded: false,
  videoIsSkippable: true,
  fullscreenLoader: false,
  initData: {
    italy: {},
    egypt: {},
    china: {},
    brazil: {},
    usa: {},
    russia: {},
  },
});

export const mutations = {
  SET_INIT_DATA(state, payload) {
    Object.keys(state.initData).forEach((key) => {
      if (payload.stepId === key) {
        state.initData[key] = payload;
      }
    });
  },
  SET_ACTIVE_STEP(state, payload) {
    state.activeStep = payload;
  },
  SET_GAME_IS_DONE(state, payload) {
    state.gameIsDone = payload;
  },
  SET_DISCLAIMER_MODEL(state, payload) {
    state.disclaimerModel = payload;
  },
  SET_SOUNDS_OFF(state, payload) {
    state.soundsOff = payload;
  },
  SET_AUDIO_SOUNDS_OFF(state, payload) {
    state.audioSoundsOff = payload;
  },
  SET_APP_LOADED(state, payload) {
    state.appLoaded = payload;
  },
  PLAY_VIDEO(state, payload) {
    Object.keys(state.videos).forEach((key) => {
      if (payload === key) {
        state.videos[payload].canPlay = true;
      } else {
        state.videos[key].canPlay = false;
      }
    });
  },
  STOP_VIDEOS(state) {
    Object.keys(state.videos).forEach((key) => {
      state.videos[key].canPlay = false;
    });
  },
  SHOW_GLOBAL_BTNS(state) {
    state.globalBtns = true;
  },
  HIDE_GLOBAL_BTNS(state) {
    state.globalBtns = false;
  },
  SET_HINT(state, payload) {
    state.hint = payload;
  },
  SET_BG(state, payload) {
    state.bg = payload;
  },
  SET_ORIENTATION(state, payload) {
    state.orientation = payload;
  },
  SET_INSTRUCTIONS(state, payload) {
    const ignoreIfShown = payload.ignoreIfShown || false;
    const isShown = state.instructions.model === true;
    if (!ignoreIfShown || !isShown) {
      setTimeout(() => {
        this.commit('SET_INSTRUCTIONS_TIMEOUT', payload);
      }, 100);
    }
  },
  SET_INSTRUCTIONS_TIMEOUT(state, payload) {
    const def = { ...state.instructionsDefault };
    Object.keys(payload).forEach((key) => {
      def[key] = payload[key];
    });
    state.instructions = def;
  },
  SET_ROOM_BG(state, payload) {
    state.roomsBgs[payload.stepId] = payload.name || payload.stepId;
  },
  SET_INSTRUCTIONS_MODEL(state, payload) {
    state.instructions.model = payload;
  },
  SET_INSTRUCTIONS_BOTTOM_MODEL(state, payload) {
    state.instructions.bottomModel = payload;
  },
  SET_INSTRUCTIONS_RIGHT_MODEL(state, payload) {
    state.instructions.rightModel = payload;
  },
  SET_INSTRUCTIONS_STEP(state, payload) {
    state.instructions.step = payload;
  },
  SET_INSTRUCTIONS_IMAGE(state, payload) {
    state.instructions.image = payload;
  },
  SET_SCORE_BOARD_DIALOG(state, payload) {
    state.scoreBoardDialog = payload;
    if (payload.game) {
      const name = `room_${payload.game}`;
      localStorage.setItem(name, payload.score);
    }
  },
  SET_AUDIO_STATUS(state, payload) {
    state.audioStatus = payload;
  },
  SET_SKIP_MAP_INTRO(state, payload) {
    state.skipMapIntro = payload;
    state.mapLoaded = true;
  },
  SET_VIDEO_IS_SKIPPABLE(state, payload) {
    state.videoIsSkippable = payload;
  },
  SET_FULL_SCREEN_LOADER(state, payload) {
    state.fullscreenLoader = payload;
  },
};

export const actions = {
  async createTask(context, payload) {
    try {
      await context.commit('SET_FULL_SCREEN_LOADER', true);
      const userId = localStorage.getItem('privacy-cruise-db-user-id');
      payload.task_result = Number(payload.task_result?.toFixed());
      const response = await this.$axios.$post('/api/questions/create-task/', {
        user_uid: userId,
        ...payload,
      });
      await context.commit('SET_FULL_SCREEN_LOADER', false);
      return response;
    } catch (err) {
      await context.commit('SET_FULL_SCREEN_LOADER', false);
      console.log(err);
    }
    // return '';
  },
  async addFailCounter(context) {
    try {
      const userId = localStorage.getItem('privacy-cruise-db-user-id');
      const rooms = context.state.rooms || [];
      const taskId = rooms.indexOf(context.state.activeStep) + 1;
      const response = await this.$axios.$put(
        '/api/questions/increment-fail/',
        {
          task_id: taskId,
          user: userId,
        }
      );
      return response;
    } catch (err) {
      console.log(err);
    }
    // return '';
  },
  async updateLang(context, payload) {
    try {
      const userId = localStorage.getItem('privacy-cruise-db-user-id');
      const response = await this.$axios.$put(
        `/api/questions/update-lang/${userId}/`,
        payload
      );
      return response;
    } catch (err) {
      console.log(err);
    }
    // return '';
  },
  async getUserId(context, payload) {
    try {
      const userId = localStorage.getItem('privacy-cruise-db-user-id');
      if (userId) {
        return userId;
      }
      const response = await this.$axios.$get(`/api/questions/user-uid/`);
      const uid = response.user_uid;
      localStorage.setItem('privacy-cruise-db-user-id', uid);
      return response;
    } catch (err) {
      console.log(err);
    }
    // return '';
  },
  async getGameRoomStats(context, payload) {
    try {
      const response = await this.$axios.$get(
        `/api/questions/country-statistic/`
      );
      return response?.results || [];
    } catch (err) {
      console.log(err);
    }
    // return [];
  },
};

export const getters = {
  orientation: (state) => state.orientation,
  instructions: (state) => state.instructions,
  scoreBoardDialog: (state) => state.scoreBoardDialog,
  bg: (state) => state.bg || 'splash-bg.jpg',
  hint: (state) => state.hint,
  audioStatus: (state) => state.audioStatus,
  globalBtns: (state) => state.globalBtns,
  videos: (state) => state.videos,
  appLoaded: (state) => state.appLoaded,
  soundsOff: (state) => state.soundsOff,
  audioSoundsOff: (state) => state.audioSoundsOff,
  skipMapIntro: (state) => state.skipMapIntro,
  activeStep: (state) => state.activeStep,
  rooms: (state) => state.rooms,
  gameIsDone: (state) => state.gameIsDone,
  disclaimerModel: (state) => state.disclaimerModel,
  mapLoaded: (state) => state.mapLoaded,
  videoIsSkippable: (state) => state.videoIsSkippable,
  fullscreenLoader: (state) => state.fullscreenLoader,
  roomsBgs: (state) => state.roomsBgs,
  initData: (state) => state.initData,
};
