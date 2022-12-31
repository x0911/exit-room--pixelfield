<template>
  <span class="font-weight-medium">
    <template v-for="(letter, i) in 'Il2l4na*'.split('')">
      <span :key="i" :class="`${colors[i]}--text`" v-text="letter"></span>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({}),
};
</script>
