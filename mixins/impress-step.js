export default {
  data: () => ({}),
  mounted() {
    const stepId = this.stepId;
    if (stepId) {
      if (this.stepEnter) {
        this.$nuxt.$on(`impress-step-enter-${stepId}`, () => {
          this.setInitData();
          this.stepEnter();
        });
      }
      if (this.stepLeave) {
        this.$nuxt.$on(`impress-step-leave-${stepId}`, () => {
          this.stepLeave();
          this.replaceBg(stepId);
          setTimeout(() => {
            this.getInitData();
          }, 500);
        });
      }
    }
  },
  beforeDestroy() {
    const stepId = this.stepId;
    if (stepId) {
      this.$nuxt.$off(`impress-step-enter-${stepId}`);
      this.$nuxt.$off(`impress-step-leave-${stepId}`);
    }
  },
  methods: {
    setInitData() {
      const data = this._data;
      const initData = this.$store.getters.initData;
      const stepData = initData[data.stepId];
      if (data.stepId && stepData && !stepData.stepId) {
        const stringified = JSON.stringify({ ...data });
        const parsed = JSON.parse(stringified);
        this.$store.commit('SET_INIT_DATA', parsed);
      }
    },
    getInitData() {
      const stepId = this.stepId;
      const initData = this.$store.getters.initData;
      const stepData = initData[stepId];
      if (stepId && stepData && stepData.stepId) {
        const stringified = JSON.stringify({ ...stepData });
        const parsed = JSON.parse(stringified);
        Object.keys(parsed).forEach((key) => {
          const v = parsed[key];
          this.$set(this, key, v);
        });
      }
    },
    mandatoryQuizCheck() {
      const perc = localStorage.getItem(`room_italy`) || '0';
      const intPerc = parseInt(perc);
      if (intPerc >= 50) {
        return true;
      } else {
        return false;
      }
    },
    getActiveTaskInfo() {
      const rooms = this.$store.getters.rooms || [];
      const taskId = rooms.indexOf(this.$store.getters.activeStep) + 1;
      const taskName = this.$t(`task-name.${taskId}`);
      return {
        taskId,
        taskName,
      };
    },
    replaceBg(name = '') {
      const stepId = this.stepId;
      this.$store.commit('SET_ROOM_BG', {
        stepId,
        name,
      });
    },
  },
};
