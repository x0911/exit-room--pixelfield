<template>
  <div class="d-flex flex-column align-center justify-center">
    <div class="video-container" :class="{ 'validate-image': isValidating }">
      <video ref="camera" width="400px" height="400px" autoplay></video>
      <img v-show="isPhotoTaken && !usedVideo" ref="imgsrc" />
    </div>
    <div class="d-flex align-center mt-4 gap-6">
      <template v-if="!isPhotoTaken">
        <v-btn
          v-if="!errorOpenCamera"
          large
          color="primary"
          class="pa-6"
          @click="takePhoto"
        >
          <span class="pr-4">{{ $t('take_photo') }}</span>
          <v-icon large>mdi-camera</v-icon>
        </v-btn>
        <v-btn large color="primary" class="pa-6" @click="uploadPhoto">
          <span class="pr-4">{{ $t('upload_photo') }}</span>
          <v-icon large>mdi-file-upload</v-icon>
        </v-btn>
        <input
          v-show="false"
          hidden="hidden"
          ref="file"
          type="file"
          accept="image/png, image/jpeg"
          @change="setPhoto"
        />
      </template>
      <template v-else-if="!isValidating">
        <v-btn large class="pa-6" @click="cancelPhoto">
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
      isValidating: false,
      usedVideo: false,
      errorOpenCamera: false,
    };
  },
  mounted() {
    this.isLoading = true;
    const constraints = (window.constraints = {
      audio: false,
      video: true,
    });

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.isLoading = false;
        window.stream = stream;
        this.$refs.camera.srcObject = window.stream;
      })
      .catch((err) => {
        this.isLoading = false;
        this.errorOpenCamera = true;
        console.log(err);
      });
  },
  methods: {
    takePhoto() {
      this.playGameSound('big-button-press-1');
      this.$refs.camera.pause();
      this.isPhotoTaken = !this.isPhotoTaken;
      this.usedVideo = true;
    },
    validatePhotoHandler() {
      this.playGameSound('big-button-press-1');
      this.isValidating = true;
      setTimeout(() => {
        window.stream?.getTracks().forEach(function (track) {
          track.stop();
        });
        this.isValidating = false;
        this.usedVideo = false;
        this.$refs.imgsrc.src = '';
        this.$emit('next');
      }, 3000);
    },
    cancelPhoto() {
      this.playGameSound('big-button-press-1');
      this.isPhotoTaken = false;
      this.isValidating = false;
      this.$refs.imgsrc.src = '';
      this.usedVideo = false;
      this.$refs.camera.play();
    },
    uploadPhoto() {
      if (this.$refs.file?.click) {
        this.$refs.file.click();
      }
    },
    setPhoto(e) {
      const files = e.target.files;
      const $this = this;
      if (FileReader && files && files.length && this.$refs.imgsrc) {
        const fr = new FileReader();
        fr.onload = function () {
          $this.$refs.imgsrc.src = fr.result;
          $this.isPhotoTaken = true;
        };
        fr.readAsDataURL(files[0]);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '~assets/scss/components/face-scan.scss';
</style>
