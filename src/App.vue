<template>
  <div id="app">
    <!-- <img class="img-panel" src="./assets/ship.jpg" /> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 20px; */
}

.img-panel {
  height: 200px;
  margin-bottom: 20px;
}
</style>
