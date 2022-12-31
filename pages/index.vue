<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ redirect }) {
    await redirect('/privacy-cruise');
  },
};
</script>
