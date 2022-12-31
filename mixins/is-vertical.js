export default {
  computed: {
    isVertical() {
      // 1920/1080 = 1.77777778
      const aWidth = 1920;
      const aHeight = 1080;
      const bWidth = this.$vuetify.breakpoint.width;
      const bHeight = this.$vuetify.breakpoint.height;

      if (bWidth / bHeight > aWidth / aHeight) {
        return false;
      } else {
        return true;
      }
    },
  },
};
