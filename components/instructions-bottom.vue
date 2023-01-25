<template>
  <v-bottom-sheet
    v-model="model"
    max-width="900"
    scrollable
    persistent
    :hide-overlay="!useOverlay"
    content-class="elevation-0 overflow-auto max-h-100"
    class="elevation-0"
  >
    <div class="instructions-bottom pb-12 px-8">
      <v-row v-if="upperImage">
        <v-col>
          <v-layout align-center justify-center>
            <v-card color="transparent" tile flat>
              <v-avatar :size="$vuetify.breakpoint.height / 2.1">
                <v-img :src="upperImage"></v-img>
              </v-avatar>
            </v-card>
          </v-layout>
        </v-col>
      </v-row>
      <v-row>
        <v-slide-x-transition>
          <v-col
            v-if="steps.length > 0 && step > 1"
            cols="auto"
            align-self="center"
          >
            <div>
              <v-btn
                outlined
                x-large
                class="font-weight-light"
                tile
                depressed
                @click="prev()"
              >
                <v-icon>mdi-keyboard-backspace</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-slide-x-transition>
        <v-col align-self="center">
          <v-card
            class="info-screen darken px-2 border-3 pb-4 d-flex align-center"
            min-height="130"
            light
            tile
            flat
          >
            <v-card-text class="pt-6 pb-2 text-justify h-full">
              <v-layout align-start justify-start class="gap-4">
                <v-flex v-if="image" shrink>
                  <v-avatar size="50">
                    <v-img
                      :src="require(`@/assets/images/${image}`)"
                      @error="image = null"
                    ></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex>
                  <div>
                    <div v-if="title" class="yellow--text mb-2">
                      {{ title }}
                    </div>
                    <div>
                      <v-scroll-y-transition group hide-on-leave>
                        <template v-for="(s, i) in steps">
                          <div v-if="step === i + 1" :key="`step-${i}`">
                            <div
                              v-if="
                                $t(`${s}`) && typeof $t(`${s}`) === 'object'
                              "
                            >
                              <template
                                v-for="(line, li) in Object.values($t(`${s}`))"
                              >
                                <div :key="`line-${li}`">
                                  <div v-if="spans">
                                    <template
                                      v-for="(span, si) in line.split(' ')"
                                    >
                                      <v-icon
                                        v-if="
                                          `${span[0]}${
                                            span[span.length - 1]
                                          }` === '##'
                                        "
                                        :key="`icon-${si}`"
                                      >
                                        {{ span }}
                                      </v-icon>
                                      <span v-else :key="`span-${si}`">
                                        {{ span }}
                                      </span>
                                    </template>
                                  </div>
                                  <template v-else>
                                    <v-list-item
                                      v-if="lineSuffix"
                                      dark
                                      class="ma-0 pa-0 wrap"
                                    >
                                      <v-list-item-icon class="my-3 me-2">
                                        <v-icon>{{ lineSuffix }}</v-icon>
                                      </v-list-item-icon>
                                      <v-list-item-content class="px-0 py-1">
                                        <v-list-item-title>
                                          <div :inner-html.prop="line"></div>
                                        </v-list-item-title>
                                      </v-list-item-content>
                                    </v-list-item>
                                    <div
                                      v-else
                                      :class="{ 'mt-1': li !== 0 }"
                                      :inner-html.prop="line"
                                    ></div>
                                  </template>
                                </div>
                              </template>
                            </div>
                            <div v-else>
                              <div v-if="spans">
                                <template
                                  v-for="(span, si) in $t(`${s}`).split(' ')"
                                >
                                  <v-icon
                                    v-if="
                                      `${span[0]}${span[span.length - 1]}` ===
                                      '##'
                                    "
                                    :key="`icon-${si}`"
                                  >
                                    {{
                                      span.replace(/#/g, '').replace(/@/g, ' ')
                                    }}
                                  </v-icon>
                                  <span v-else :key="`span-${si}`">
                                    {{ span }}
                                  </span>
                                </template>
                              </div>
                              <div v-else :inner-html.prop="$t(`${s}`)"></div>
                            </div>
                          </div>
                        </template>
                      </v-scroll-y-transition>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="auto" align-self="center">
          <div>
            <v-btn
              color="primary"
              x-large
              class="px-6 font-weight-light"
              tile
              depressed
              :data-video-start="
                step > steps.length || steps.length === 1
                  ? `${videoSlug}`
                  : 'null'
              "
              @click="next"
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
  </v-bottom-sheet>
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
        return this.$store.getters.instructions.bottomModel;
      },
      set(v) {
        this.$store.commit('SET_INSTRUCTIONS_BOTTOM_MODEL', v);
      },
    },
    steps() {
      return this.$store.getters.instructions.steps;
    },
    upperImage() {
      return this.$store.getters.instructions.upperImage;
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
    useOverlay() {
      return this.$store.getters.instructions.overlay;
    },
    prevLink() {
      return this.$store.getters.instructions.prevLink;
    },
    spans() {
      return this.$store.getters.instructions.spans;
    },
    lineSuffix() {
      return this.$store.getters.instructions.lineSuffix;
    },
    videoSlug() {
      return this.$store.getters.instructions.video;
    },
    title() {
      return this.$store.getters.instructions.title;
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
      if (this.step > 1) {
        this.step--;
      } else {
        this.$set(this, 'model', false);
        if (this.prevLink) {
          this.$nuxt.$router.push(this.localePath(this.prevLink));
        }
      }
    },
    next(event) {
      this.playGameSound('big-button-press-1');
      if (this.step < this.steps.length) {
        this.step++;
      } else {
        this.step++;
        this.$set(this, 'model', false);
        if (this.nextLink) {
          this.$nuxt.$router.push(this.localePath(this.nextLink));
        }
        if (this.nextMethod && typeof this.nextMethod === 'function') {
          this.nextMethod(event);
        }
        if (this.videoSlug) {
          this.$store.commit('PLAY_VIDEO', this.videoSlug);
        }
      }
    },
  },
};
</script>
