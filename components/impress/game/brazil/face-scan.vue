<template>
  <div class="d-flex flex-column align-center justify-center">
    <video
      v-show="!isPhotoTaken"
      ref="camera"
      width="400px"
      height="400px"
      autoplay
    ></video>
    <canvas
      v-show="isPhotoTaken"
      ref="canvas"
      width="400px"
      height="400px"
    ></canvas>
    <div class="d-flex align-center">
      <template v-if="!isPhotoTaken">
        <v-btn large color="primary" class="pa-6" @click="takePhoto">
          <span class="pr-4">{{ $t('take_photo') }}</span>
          <v-icon large>mdi-camera</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn large class="pa-6 mr-12" @click="cancelPhoto">
          <span class="pr-4">{{ $t('cancel') }}</span>
          <v-icon>mdi-camera-retake</v-icon>
        </v-btn>
        <v-btn large color="primary" class="pa-6" @click="validatePhotoHandler">
          <span class="pr-4">{{ $t('validate') }}</span>
          <v-icon>mdi-check-circle</v-icon>
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import SoundPlayer from '~/mixins/sound-player';

export default {
  name: 'FaceScan',
  mixins: [SoundPlayer],
  data() {
    return {
      isPhotoTaken: false,
      isLoading: false,
    };
  },
  mounted() {
    this.isLoading = true;
    const constraints = (window.constraints = {
      audio: false,
      video: true,
    });

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.isLoading = false;
      this.$refs.camera.srcObject = stream;
    });
  },
  methods: {
    takePhoto() {
      this.playGameSound('big-button-press-1');
      this.isPhotoTaken = !this.isPhotoTaken;
      const context = this.$refs.canvas.getContext('2d');
      context.drawImage(this.$refs.camera, 0, 50, 400, 300);
    },
    validatePhotoHandler() {
      this.playGameSound('big-button-press-1');
      this.$emit('next');
    },
    cancelPhoto() {
      this.playGameSound('big-button-press-1');
      this.isPhotoTaken = false;
    },
  },
};
</script>

<style scoped>
@import '~assets/scss/components/face-scan.scss';
</style>
