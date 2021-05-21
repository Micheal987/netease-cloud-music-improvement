<template>
  <div class="pagination">
    <el-pagination @current-change="getNewPage" layout="prev, pager, next" :total="totalNumber"></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    count: 0,
  },
  methods: {
    getNewPage(newPage) {
      this.$emit("getNewPage", newPage);
    },
  },
  computed: {
    totalNumber() {
      return Math.ceil(this.count / 2);
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  margin: 10rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /deep/ .el-pagination {
    color: @color-title;
  }
  /deep/.el-pager li.active {
    font-size: 10rem;
    color: #d33a31;
  }

  /deep/.el-pager li {
    font-size: 9rem;
  }

  /deep/.el-pager li:hover {
    color: #d33a31;
  }
  /deep/ .el-icon-arrow-right,
  /deep/.el-icon-arrow-left {
    font-size: 9rem !important;
    font-weight: bold !important;
    color: #000000 !important;
  }
}
</style>