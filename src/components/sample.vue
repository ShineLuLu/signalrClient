<template>
  <div class="main-display-panel">
    <shang-ji-xi-tong class="common-style"></shang-ji-xi-tong>
    <zhong-jian-xi-tong class="common-style"></zhong-jian-xi-tong>
    <xia-ji-xi-tong class="common-style"></xia-ji-xi-tong>
  </div>
</template>

<script>
import XiaJiXiTong from "./xiaJiXiTong/sample";
import ZhongJianXiTong from "./zhongJianXiTong/sample";
import ShangJiXiTong from "./shangJiXiTong/sample";
export default {
  components: {
    XiaJiXiTong,
    ZhongJianXiTong,
    ShangJiXiTong
  }
};
</script>

<style>
.main-display-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 100%;
  width: 100%;
}

.common-style {
  flex: 1;
  border-bottom: 1px solid black;
  /* overflow-y: auto; */
}
</style>