<template>
  <div>
    <ul class="mvs">
      <ul class="mv-cat">
        <p>地区:</p>
        <li v-for="(item,index) in mvs[0]" :key="index">
          <span @click="getAreaMv(item)" :class="[item == area ? 'active' : '']">{{item}}</span>
        </li>
      </ul>
      <ul class="mv-cat">
        <p>类型:</p>
        <li v-for="(item,index) in mvs[1]" :key="index">
          <span @click="getTypeMv(item)" :class="[item == type ? 'active' : '']">{{item}}</span>
        </li>
      </ul>
      <ul class="mv-cat">
        <p>排序:</p>
        <li v-for="(item,index) in mvs[2]" :key="index">
          <span @click="getOrderMv(item)" :class="[item == order ? 'active' : '']">{{item}}</span>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mvs: {
        0: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
        1: ["全部", "官方版", "原生", "现场版", "网易出品"],
        2: ["上升最快", "最热", "最新"],
      },
      area: "全部",
      type: "全部",
      order: "上升最快",
    };
  },
  methods: {
    getAreaMv(area) {
      this.area = area;
      this.$emit("getMv", this.area, this.type, this.order);
    },
    getTypeMv(type) {
      this.type = type;
      this.$emit("getMv", this.area, this.type, this.order);
    },
    getOrderMv(order) {
      this.order = order;
      this.$emit("getMv", this.area, this.type, this.order);
    },
  },
};
</script>

<style lang="less" scoped>
.mvs {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.mv-cat {
  margin: 8rem 0;
  display: flex;
  height: 15rem;
  line-height: 15rem;
  font-size: @font-size-title-lg;
  p {
    margin-right: 10rem;
  }
  li {
    width: 60rem;
    text-align: center;
    position: relative;
  }
  span {
    cursor: pointer;
  }
  .active {
    color: #d33a31;
    padding: 3rem 5rem;
    border-radius: 10rem;
    background-color: #fdf6f5;
  }
}
</style>