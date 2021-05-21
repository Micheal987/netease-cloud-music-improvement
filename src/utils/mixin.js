// 分钟处理
export const minutesProcessing = {
  filters: {
    // 分钟处理
    minutesFormat(value) {
      const date = new Date(value);
      let m = ("0" + date.getMinutes()).slice(-2);
      let s = ("0" + date.getSeconds()).slice(-2);
      return `${m}:${s}`;
    },
    indexSort(i) {
      return ("0" + i).slice(-2);
    },
  },
}
// 点击超过一万处理
export const numberProcessing = {
  filters: {
    formatNumber(number) {
      number = Number(number) || 0;
      return number > 100000 ? `${Math.round(number / 10000)}万` : number;
    },
  },
}

// 年月日处理
export const dateProcessing = {
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      const YYYY = date.getFullYear();
      const MM = ("0" + (date.getMonth() + 1)).slice(-2);
      const DD = ("0" + date.getDate()).slice(-2);
      return `${YYYY}-${MM}-${DD}`;
    },
  }
}