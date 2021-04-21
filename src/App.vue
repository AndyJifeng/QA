<template>
  <div id="nav">
  </div>
    <a-spin :spinning="this.$store.state.loadding" tip="加载中..." size="large">
           <router-view/>
    </a-spin>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
