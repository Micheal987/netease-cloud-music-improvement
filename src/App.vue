<template>
  <div id="app">
    <layout />
    <player />
    <miniplayer />
    <miniPlayList />
    <searchList />
  </div>
</template>
<script>
import layout from "@/layout";
import player from "../src/components/player";
import miniplayer from "../src/components/miniplayer";
import miniPlayList from "@/components/mini-play-list";
import searchList from "@/components/search-list";
export default {
  components: {
    layout,
    player,
    miniplayer,
    miniPlayList,
    searchList,
  },
};
</script>
<style>
@import "assets/icon/iconfont.css";
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
