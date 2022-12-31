<template>
  <div class="button">{{ text }}</div>
</template>

<script>
export default {
  name: "Button",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/button";
</style>