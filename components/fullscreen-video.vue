<template>
  <div class="video-container">
    <video
      v-if="path"
      ref="video"
      :autoplay="false"
      :class="{
        video: true,
        'is-vertical': isVertical,
        'full-video': fullVideo,
        intro: $route.fullPath.includes('splash')
      }"
      :contextmenu="false"
      :controls="false"
      playsinline
      preload="metadata"
      @ended="ended()"
    >
      <source
        :src="`https://storage.googleapis.com/firewall-static-files/video/${path}`"
        type="video/mp4"
      />
      {{ $t('browser-doesnt-support-video') }}
    </video>
    <template v-for="(dialog, i) in dialogs">
      <v-bottom-sheet
        :key="`${dialog.id}-${i}`"
        v-model="dialog.model"
        class="elevation-0"
        content-class="elevation-0 overflow-auto max-h-100"
        hide-overlay
        max-width="720"
        persistent
        scrollable
      >
        <div :style="dialog.style" class="pb-4">
          <v-card
            :class="{
              'info-screen border darken border-3 ': !isPlayerThinking(dialog),
              'thought-bubble-container': isPlayerThinking(dialog),
            }"
            class="transparent px-2 pb-4 d-flex align-center"
          >
            <img
              v-if="isPlayerThinking(dialog)"
              :src="require('~/assets/images/thought_bubble.png')"
              class="thought-bubble-background"
            />
            <v-card-text
              :class="{
                'thought-bubble-content': isPlayerThinking(dialog),
              }"
              :style="dialog.hideSpeaker && 'padding-top: 1.5rem !important;'"
              class="pt-8 pb-4 text-justify h-full"
            >
              <v-layout align-start class="gap-4" justify-start>
                <v-flex v-if="dialog.avatar" shrink>
                  <v-avatar size="53">
                    <v-img
                      :src="require(`@/assets/images/avatars/${dialog.avatar}`)"
                    ></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex>
                  <div>
                    <template v-if="dialog.isConfirmable">
                      <template>
                        <div
                          v-if="dialog.speaker && !dialog.hideSpeaker"
                          class="font-weight-medium pb-2 yellow--text"
                        >
                          <span> {{ dialog.speaker }}: </span>
                        </div>
                        <template v-if="dialog.speech">
                          <div :inner-html.prop="dialog.text"></div>
                        </template>
                        <template v-else>
                          <div
                            :inner-html.prop="dialog.textArray || dialog.text"
                            class="d-flex flex-column gap-1"
                          ></div>
                        </template>
                      </template>
                      <template
                        v-if="
                          dialog.options &&
                          dialog.options.length > 0 &&
                          !refreshing
                        "
                      >
                        <div
                          class="text-center mt-2 yellow--text font-weight-medium mb-3"
                        >
                          {{
                            dialog.questionText ||
                            $t('pick-response-to-continue')
                          }}
                        </div>
                        <v-row>
                          <template v-for="(option, oi) in dialog.options">
                            <v-col :key="`option-${i}-${oi}`" cols="6">
                              <v-card
                                :class="{
                                  'green darken-3': option.isSelected,
                                }"
                                class="d-flex align-center"
                                dark
                                flat
                                height="100%"
                                @click="chooseOption(i, oi)"
                              >
                                <v-card-text>
                                  <div
                                    :class="{
                                      'white--text': option.isSelected,
                                    }"
                                    :inner-html.prop="
                                      option.textArray || dialog.text
                                    "
                                  ></div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </template>
                        </v-row>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="dialog.speaker">
                        <div class="font-weight-bold text-h6 f-khand">
                          <span class="ls-4"> {{ dialog.speaker }}: </span>
                        </div>
                      </template>
                      <vue-typed-js
                        :content-type="'html'"
                        :show-cursor="false"
                        :strings="[dialog.textArray]"
                        :type-speed="
                          (dialog.duration / dialog.text.length) * 750
                        "
                      >
                        <div class="typing"></div>
                      </vue-typed-js>
                    </template>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card-actions v-if="dialog.isConfirmable">
            <v-spacer></v-spacer>
            <v-btn
              class="px-6"
              color="primary"
              depressed
              large
              tile
              @click="nextHandler(dialog)"
            >
              {{ dialog.nextBtnText || $tr('next') }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-bottom-sheet>
    </template>
  </div>
</template>

<script>
import IsVerticalMixin from '@/mixins/is-vertical.js';
import VideoDialogs from '@/mixins/video-dialogs.js';

export default {
  mixins: [IsVerticalMixin, VideoDialogs],
  props: {
    path: {
      type: String,
      default: null,
    },
    videoId: {
      type: String,
      default: null,
    },
    fullVideo: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    canPlay: false,
    cameraSoundPlayed: false,
    dialogs: [],
    shownDialogs: [],
    audio: null,
    refreshing: false,
  }),
  computed: {
    activeStep() {
      return this.$store.getters.activeStep;
    },
    rooms() {
      return this.$store.getters.rooms;
    },
    videos() {
      return this.$store.getters.videos;
    },
    soundsOff() {
      return this.$store.getters.soundsOff;
    },
    ext() {
      const splitter = this.path?.split('.');
      const ext = splitter[splitter.length - 1];
      return ext || 'mp4';
    },
  },
  watch: {
    soundsOff(v) {
      if (this.$refs.video) {
        if (v === true) {
          this.$refs.video.volume = 0;
          this.$refs.video.muted = true;
        } else {
          this.$refs.video.volume = 1;
          this.$refs.video.muted = false;
        }
      }
    },
    activeStep() {
      this.$set(this, 'dialogs', []);
      this.$set(this, 'shownDialogs', []);
    },
  },
  beforeDestroy() {
    this.$set(this, 'canPlay', false);
    this.$store.commit('SHOW_GLOBAL_BTNS');
    this.$refs.video?.removeEventListener(
      'timeupdate',
      this.videoProgressChanged
    );
  },
  mounted() {
    this.$nuxt.$on('SHOW_MODEL_IF_PLAYING', (obj) => {
      if (this.$refs.video && this.canPlay && !this.$refs.video.paused) {
        this.$refs.video.pause();
        this.$store.commit('SET_INSTRUCTIONS', obj);
      }
    });
    this.$nuxt.$on('PAUSE_VIDEO', () => {
      if (this.$refs.video && this.canPlay) {
        this.$refs.video.pause();
      }
    });
    this.$nuxt.$on('RESUME_VIDEO', () => {
      if (this.$refs.video && this.canPlay) {
        this.$refs.video.play();
      }
    });
    this.$nuxt.$on('stop-current-video', () => {
      if (this.$refs.video && this.canPlay) {
        this.ended(true);
      }
    });
    this.$refs.video?.addEventListener('play', () => {
      this.$store.commit('HIDE_GLOBAL_BTNS');
    });
    this.$refs.video?.addEventListener('timeupdate', this.videoProgressChanged);
    window.document.documentElement.addEventListener('click', (e) => {
      // Please don't try `setTimeOut` here
      if (
        this.$refs.video &&
        (e.target['data-video-start'] === this.videoId ||
          e.target.closest(`[data-video-start="${this.videoId}"]`))
      ) {
        this.$set(this, 'canPlay', true);
        if (this.soundsOff) {
          this.$refs.video.volume = 0;
          this.$refs.video.muted = true;
        } else {
          this.$refs.video.volume = 1;
          this.$refs.video.muted = false;
        }
        this.$refs.video.currentTime = 0;

        const playPromise = this.$refs.video.play();
        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              // Automatic playback started!
              // Show playing UI.
            })
            .catch((error) => {
              // Auto-play was prevented
              // Show paused UI.
              console.log('Paused video.');
              console.log(error);
            });
        }
      }
    });
  },
  methods: {
    videoProgressChanged(ev) {
      const v = ev.target;
      const progress = v.currentTime;
      const videoDialogs = this.videoDialogs;
      const videoId = this.videoId;
      const dialogs = videoDialogs[videoId];
      const shownDialogs = this.shownDialogs;
      if (dialogs && dialogs.length > 0) {
        dialogs.forEach((dialog, i) => {
          const id = `d-${videoId}-${i}`;
          if (dialog.textArray && Array.isArray(dialog.textArray)) {
            dialog.text = dialog.text || dialog.textArray.join(' ');
            dialog.textArray = dialog.textArray
              .map((t) => `<div>${t}</div>`)
              .join('');
          }
          if (!shownDialogs.includes(id) && progress > dialog.from) {
            this.shownDialogs.push(id);
            if (dialog.isConfirmable) {
              v.pause();
            }
            this.showVideoDialog({
              id,
              ...dialog,
            });
          }
          if (
            !dialog.isConfirmable &&
            shownDialogs.includes(id) &&
            progress >= dialog.from + dialog.duration + 2
          ) {
            this.hideVideoDialog(id);
          }
        });
      }
    },
    showVideoDialog(obj) {
      this.dialogs.push({
        ...obj,
        model: true,
      });
      if (!obj.isConfirmable && obj.speech) {
        this.audio = new Audio(
          require(`@/assets/audios/speeches/${obj.speech}`)
        );
        this.audio.play();
      }
    },
    hideVideoDialog(id = '', replay = false) {
      this.$nuxt.$emit('confirm-current-video');
      const index = this.dialogs.findIndex((dialog) => dialog.id === id);
      if (index > -1) {
        this.dialogs[index].model = false;
      }
      if (
        replay &&
        this.$refs.video &&
        this.canPlay &&
        this.$refs.video.paused
      ) {
        this.$refs.video.play();
      }
    },
    hideAllVideoDialogs() {
      this.dialogs.forEach((dialog) => {
        dialog.model = false;
      });
    },
    isPlayerThinking({ speaker }) {
      return speaker === this.$t('player-is-thinking');
    },
    ended(playSound = false) {
      if (playSound) {
        this.playGameSound('big-button-press-1');
      }
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
      }
      this.hideAllVideoDialogs();
      this.$refs.video?.pause();
      this.$store.commit('SHOW_GLOBAL_BTNS');
      this.$emit('ended');
      this.$set(this, 'canPlay', false);
      this.$store.commit('SET_VIDEO_IS_SKIPPABLE', true);
    },
    chooseOption(dIndex, oIndex) {
      this.refreshing = true;
      const dialog = this.dialogs[dIndex];
      const optionsLength = dialog.options.length;
      for (let i = 0; i < optionsLength; i++) {
        this.dialogs[dIndex].options[i].isSelected = i === oIndex;
      }
      if (!dialog.validateOptionsOnNext) {
        this.validateOptions(dialog);
      }
      this.refreshing = false;
    },
    validateOptions(dialog) {
      const selectedOption = dialog.options.find(
        ({ isSelected }) => isSelected
      );
      if (!selectedOption) return;
      if (!selectedOption.isCorrect) {
        this.$store.commit('SET_INSTRUCTIONS', {
          model: true,
          title: this.$t('wrong-response'),
          steps: [dialog.wrongResponse || 'wrong-response-desc'],
          nextText: this.$t('ok'),
          nextMethod: (event) => (event.target['data-video-start'] = null),
        });
      } else {
        this.hideVideoDialog(dialog.id, true);
      }
    },
    nextHandler(dialog) {
      this.playGameSound('big-button-press-1');
      return dialog.validateOptionsOnNext
        ? this.validateOptions(dialog)
        : this.hideVideoDialog(dialog.id, true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/video.scss';
</style>
