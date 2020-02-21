<template>
  <div class="main-content-panel">
    <div class="main-module-panel">
      <p>模拟上级系统</p>
      <div class="main-module-btns">
        <el-input placeholder="请输入名称" v-model="name" clearable></el-input>
        <el-input placeholder="请输入密码" v-model="password" clearable show-password></el-input>
        <div class="login-in-out">
          <el-button class="login-btn" @click="loginIn" :disabled="!loginEnabled">登录</el-button>
          <el-button class="login-btn" @click="loginOut" :disabled="loginEnabled">退出</el-button>
        </div>
        <el-button class="login-btn" @click="sendTask">下发任务</el-button>
      </div>
    </div>
    <div class="main-response-panel">
      <pre>{{JSON.stringify(responseData, null, 4)}}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      password: "",
      loginEnabled: true,
      responseData: ""
    };
  },
  methods: {
    loginIn() {},
    loginOut() {},
    sendTask() {}
  }
};
</script>

<style scoped>
.main-content-panel {
  display: flex;
  background-color: gainsboro;
}

.main-module-panel,
.main-response-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.main-response-panel {
  text-align: left;
}

.main-module-btns {
  overflow-y: auto;
  flex: auto;
}

.login-in-out {
  display: flex;
}

.login-btn {
  flex: 1;
}
</style>