<template>
  <div class="mv">
    <mvtype @getMv="getMv" />
    <mvs :mvData="mvData" />
    <!-- 分页 -->
    <div class="pagination">
      <pagination @getNewPage="getCatMv" :count="count" />
    </div>
  </div>
</template>

<script>
import mvtype from "./mvtype";
import mvs from "../../components/mvs";
import { getMvs } from "../../network/mvs";
import pagination from "../../components/pagination";
export default {
  data() {
    return {
      mvData: [],
      count: 0,
      offset: 0,
      area: "全部",
      type: "全部",
      order: "上升最快",
    };
  },
  created() {
    this._getMvsData();
  },
  methods: {
    // 选择分类
    getMv(area, type, order) {
      this.area = area;
      this.type = type;
      this.order = order;
      this.offset = 0;
      this.count = 0;
      this._getMvsData();
    },
    // 获取mv数据
    async _getMvsData() {
      const { data, count } = await getMvs(
        this.area,
        this.type,
        this.order,
        this.offset
      );
      this.mvData = data;
      count ? (this.count = Math.ceil(count / 4)) : this.count;
    },
    // 改变页码
    getCatMv(newPage = 1) {
      this.offset = 40 * (newPage - 1);
      this._getMvsData();
    },
  },
  components: {
    mvtype,
    mvs,
    pagination,
  },
};
</script>

<style lang="less" scoped>
.mv {
  width: 80%;
  margin: 10rem auto;
}
.pagination {
  margin-top: 8rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>