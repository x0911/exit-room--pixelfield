export default {
  data: () => ({
    timings: {
      italy: 4700,
      egypt: 8000,
      china: 5700,
      brazil: 5700,
      usa: 5000,
      russia: 10500,
      india: 4700,
    },
  }),
  mounted() {
    const stepId = this.stepId;
    if (stepId) {
      if (this.stepEnter) {
        this.$nuxt.$on(`impress-step-enter-${stepId}`, () => {
          this.stepEnter();
          // Show text before task
          // const resumeVideo = () => {
          //   return this.$nuxt.$emit('RESUME_VIDEO');
          // };
          // const keys = Object.keys(this.timings);
          // if (keys.includes(stepId)) {
          //   setTimeout(() => {
          //     this.$nuxt.$emit('SHOW_MODEL_IF_PLAYING', {
          //       model: true,
          //       steps: [`before-task.${stepId}`],
          //       nextMethod: resumeVideo,
          //       ignoreIfShown: true,
          //     });
          //   }, this.timings[stepId]);
          // }
        });
      }
      if (this.stepLeave) {
        this.$nuxt.$on(`impress-step-leave-${stepId}`, () => {
          this.stepLeave();
          this.replaceBg(stepId);
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
