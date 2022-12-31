<template>
  <v-dialog
    v-model="model"
    max-width="900"
    scrollable
    persistent
    :hide-overlay="!useOverlay"
    content-class="elevation-0"
    class="elevation-0"
    :retain-focus="false"
  >
    <div class="py-5 px-6">
      <v-row>
        <v-col></v-col>
        <v-col cols="auto" class="pe-6">
          <v-card
            class="info-screen px-2 border-3 pb-5 d-flex align-center"
            light
            tile
            flat
            max-width="290"
          >
            <v-card-text class="pt-6 pb-2 text-justify h-full">
              <v-row>
                <v-col v-if="image" cols="4" align-self="center">
                  <v-avatar tile size="140">
                    <v-img
                      :src="require(`@/assets/images/${image}`)"
                      @error="image = null"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col :cols="image ? '8' : '12'" align-self="center">
                  <div>
                    <v-scroll-y-transition group hide-on-leave>
                      <template v-for="(s, i) in steps">
                        <div v-if="step === i + 1" :key="`step-${i}`">
                          <div
                            v-if="$t(`${s}`) && typeof $t(`${s}`) === 'object'"
                          >
                            <template
                              v-for="(line, li) in Object.values($t(`${s}`))"
                            >
                              <div
                                :key="`line-${li}`"
                                :class="{ 'mt-3': li !== 0 }"
                              >
                                {{ line }}
                              </div>
                            </template>
                          </div>
                          <div v-else>
                            {{ $t(`${s}`) }}
                          </div>
                        </div>
                      </template>
                    </v-scroll-y-transition>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="text-center mt-8">
            <v-btn
              color="primary"
              x-large
              class="px-6 font-weight-light"
              tile
              depressed
              :data-video-start="step >= steps.length ? `${videoSlug}` : 'null'"
              @click="next()"
            >
              {{ nextText }}
              <v-icon class="ms-3"
                >mdi-keyboard-backspace mdi-rotate-180</v-icon
              >
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-dialog>
</template>

<script>
import SoundPlayer from '@/mixins/sound-player.js';
export default {
  mixins: [SoundPlayer],
  data: () => ({}),
  computed: {
    fullPath() {
      return this.$route.fullPath;
    },
    model: {
      get() {
        return this.$store.getters.instructions.rightModel;
      },
      set(v) {
        this.$store.commit('SET_INSTRUCTIONS_RIGHT_MODEL', v);
      },
    },
    steps() {
      return this.$store.getters.instructions.steps;
    },
    step: {
      get() {
        return this.$store.getters.instructions.step;
      },
      set(v) {
        this.$store.commit('SET_INSTRUCTIONS_STEP', v);
      },
    },
    nextLink() {
      return this.$store.getters.instructions.nextLink;
    },
    nextMethod() {
      return this.$store.getters.instructions.nextMethod;
    },
    nextText() {
      return this.$store.getters.instructions.nextText || this.$t('next');
    },
    prevText() {
      return this.$store.getters.instructions.prevText || this.$t('previous');
    },
    prevLink() {
      return this.$store.getters.instructions.prevLink;
    },
    title() {
      return this.$store.getters.instructions.title;
    },
    videoSlug() {
      return this.$store.getters.instructions.video;
    },
    useOverlay() {
      return this.$store.getters.instructions.overlay;
    },
    image: {
      get() {
        return this.$store.getters.instructions.image;
      },
      set(v) {
        this.$store.commit('SET_INSTRUCTIONS_IMAGE', v);
      },
    },
  },
  watch: {
    fullPath() {
      this.$set(this, 'model', false);
    },
  },
  methods: {
    prev() {
      this.playGameSound('button-press');
      if (this.prevLink) {
        this.$nuxt.$router.push(this.localePath(this.prevLink));
      } else if (this.step > 1) {
        this.step--;
      }
    },
    next() {
      this.playGameSound('big-button-press-2');
      if (this.step < this.steps.length) {
        this.step++;
      } else {
        this.$set(this, 'model', false);
        if (this.nextLink) {
          this.$nuxt.$router.push(this.localePath(this.nextLink));
        }
        if (this.nextMethod && typeof this.nextMethod === 'function') {
          this.nextMethod();
        }
      }
    },
  },
};
</script>
