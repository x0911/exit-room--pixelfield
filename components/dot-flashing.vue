<template>
  <div class="dot-flashing"></div>
</template>
<script>
export default {
  data: () => ({}),
};
</script>
<style lang="scss" scoped>
$color: #fff;
$color-dark: rgb(104, 104, 104);
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: $color;
  color: $color;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: $color;
    color: $color;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 0s;
  }

  &::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: $color;
    color: $color;
    animation: dotFlashing 1s infinite alternate;
    animation-delay: 1s;
  }
}

@keyframes dotFlashing {
  0% {
    background-color: $color;
  }
  50%,
  100% {
    background-color: $color-dark;
  }
}
</style>
