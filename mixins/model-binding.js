export default {
  props: {
    value: {
      type: [String, Boolean, Number, Object],
      default: null,
    },
  },
  computed: {
    vModel: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
