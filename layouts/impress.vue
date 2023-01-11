<template>
  <div>
    <nuxt />
    <transition-step-video></transition-step-video>
    <v-dialog v-model="fullscreenLoader" persistent>
      <v-card color="transparent" tile flat>
        <v-card-text class="d-flex justify-center align-center py-8">
          <v-progress-circular
            color="white"
            indeterminate
            size="100"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TransitionStepVideo from '@/components/transition-step-video.vue';
export default {
  components: {
    TransitionStepVideo,
  },
  data: () => ({}),
  computed: {
    fullscreenLoader: {
      get() {
        return this.$store.getters.fullscreenLoader;
      },
      set(v) {
        this.$store.commit('SET_FULL_SCREEN_LOADER', v);
      },
    },
  },
  mounted() {
    this.$store.dispatch('getUserId');
  },
  methods: {},
};
</script>
