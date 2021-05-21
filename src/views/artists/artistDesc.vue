<template>
  <div class="artistDesc">
    <div class="briefDesc">
      <h1>{{name}}简介</h1>
      <p>{{artistDesc.briefDesc}}</p>
    </div>
    <div v-for="(item,index) in artistDesc.introduction" :key="index" class="introduction">
      <h1>{{item.ti}}</h1>
      <p v-for="(text,index) in item.txt" :key="index">{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artistDesc: {
      type: Object,
      default() {
        return {};
      },
    },
    name: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.artistDesc {
  display: flex;
  flex-direction: column;
  .briefDesc {
    h1 {
      font-size: 12rem;
      color: @color-title;
    }
    p {
      text-indent: 20rem;
      font-size: @font-size-title-sm;
      margin: 5rem 0;
      line-height: 18rem;
      letter-spacing: 1px;
      color: rgb(65, 65, 65);
    }
  }
  .introduction {
    display: flex;
    flex-direction: column;
    h1 {
      font-size: 12rem;
      color: @color-title;
    }
    p {
      text-indent: 20rem;
      font-size: @font-size-title-sm;
      margin: 3rem 0;
      line-height: 18rem;
      letter-spacing: 1px;
      color: rgb(65, 65, 65);
    }
  }
}
</style>