<template>
  <v-dialog
    v-model="model"
    max-width="570"
    scrollable
    persistent
    :hide-overlay="!useOverlay"
    :retain-focus="false"
  >
    <v-card class="info-screen" light tile flat>
      <v-card-title v-if="title && title.length > 0">
        {{ title }}
      </v-card-title>
      <v-card-text
        class="pb-4"
        :class="{ 'pt-4': !title || title.length === 0 }"
      >
        <v-row>
          <v-col v-if="image" cols="4" align-self="center">
            <v-avatar tile size="150">
              <v-img
                contain
                :src="require(`@/assets/images/${image}`)"
                @error="image = null"
              ></v-img>
            </v-avatar>
          </v-col>
          <v-col :cols="image ? '8' : '12'" align-self="center">
            <div>
              <v-card-title
                v-if="inlineTitle && inlineTitle.length > 0"
                class="px-0"
              >
                {{ inlineTitle }}
              </v-card-title>
              <v-scroll-y-transition group hide-on-leave>
                <template v-for="(s, i) in steps">
                  <div v-if="step === i + 1" :key="`step-${i}`">
                    <div v-if="$t(`${s}`) && typeof $t(`${s}`) === 'object'">
                      <template v-for="(line, li) in Object.values($t(`${s}`))">
                        <div
                          :key="`line-${li}`"
                          :class="{ 'mt-3': li !== 0 }"
                          :inner-html.prop="line"
                        ></div>
                      </template>
                    </div>
                    <div v-else :inner-html.prop="$t(`${s}`)"></div>
                  </div>
                </template>
              </v-scroll-y-transition>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4 pb-4 justify-center">
        <v-btn
          v-if="cancelable"
          outlined
          color="primary"
          large
          class="px-8"
          tile
          @click="cancel()"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          v-if="steps && steps.length > 1"
          :disabled="step === 1"
          outlined
          color="primary"
          large
          class="px-8"
          tile
          @click="prev()"
        >
          {{ prevText }}
        </v-btn>
        <v-btn
          color="primary"
          large
          class="px-8"
          tile
          :min-width="steps && steps.length > 1 ? 'auto' : '150'"
          depressed
          :data-video-start="step >= steps.length ? `${videoSlug}` : 'null'"
          @click="next"
        >
          {{ nextText }}
          <v-icon v-if="showNextArrow" class="ms-3"
            >mdi-keyboard-backspace mdi-rotate-180</v-icon
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    fullPath() {
      return this.$route.fullPath;
    },
    model: {
      get() {
        return this.$store.getters.instructions.model;
      },
      set(v) {
        this.$store.commit('SET_INSTRUCTIONS_MODEL', v);
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
    nextText() {
      return this.$store.getters.instructions.nextText || this.$t('next');
    },
    nextMethod() {
      return this.$store.getters.instructions.nextMethod;
    },
    cancelText() {
      return this.$store.getters.instructions.cancelText || this.$t('cancel');
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
    useOverlay() {
      return this.$store.getters.instructions.overlay;
    },
    inlineTitle() {
      return this.$store.getters.instructions.inlineTitle;
    },
    videoSlug() {
      return this.$store.getters.instructions.video;
    },
    cancelable() {
      return this.$store.getters.instructions.cancelable;
    },
    cancelMethod() {
      return this.$store.getters.instructions.cancelMethod;
    },
    showNextArrow() {
      return this.$store.getters.instructions.showNextArrow;
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
      this.playGameSound('big-button-press-1');
      if (this.prevLink) {
        this.$nuxt.$router.push(this.localePath(this.prevLink));
      } else if (this.step > 1) {
        this.step--;
      }
    },
    next(event) {
      this.playGameSound('big-button-press-1');
      if (this.step < this.steps.length) {
        this.step++;
      } else {
        this.$set(this, 'model', false);
        if (this.nextLink) {
          this.$nuxt.$router.push(this.localePath(this.nextLink));
        }
        if (this.nextMethod && typeof this.nextMethod === 'function') {
          this.nextMethod(event);
        }
      }
    },
    cancel() {
      this.playGameSound('big-button-press-1');
      this.$set(this, 'model', false);
      if (this.cancelMethod && typeof this.cancelMethod === 'function') {
        this.cancelMethod();
      }
    },
  },
};
</script>
