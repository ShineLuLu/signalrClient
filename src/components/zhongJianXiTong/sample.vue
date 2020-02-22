<template>
  <div class="main-content-panel">
    <div class="main-module-panel">
      <p :style="'color:'+(loginEnabled?'#fff':'#0f0')">模拟中间系统</p>
      <el-input placeholder="请输入名称" v-model="name" clearable></el-input>
      <el-input placeholder="请输入密码" v-model="password" clearable show-password></el-input>
      <div class="login-in-out">
        <el-button class="login-btn" @click="loginIn" :disabled="!loginEnabled">登录</el-button>
        <el-button class="login-btn" @click="loginOut" :disabled="loginEnabled">退出</el-button>
      </div>
      <el-select v-model="seFlectedRequire" placeholder="请选择">
        <el-option
          v-for="item in requires"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button @click="sendMsgByWebApi">向下级系统发送信息</el-button>
    </div>
    <div class="main-response-panel">
      <pre>{{responseData}}</pre>
    </div>
  </div>
</template>

<script>
import * as signalR from "@aspnet/signalr";
import Axios from "axios";
export default {
  created() {
    this.connection = null;
    this.initSignalrClient();
  },
  data() {
    return {
      name: "",
      password: "",
      loginEnabled: true,
      responseData: "接收信息",
      requires: [
        {
          value: "1",
          label: "状态信息查询"
        },
        {
          value: "2",
          label: "生成数据量信息查询"
        },
        {
          value: "3",
          label: "资源查询"
        },
        {
          value: "4",
          label: "自检信息查询"
        }
      ],
      seFlectedRequire: null
    };
  },
  methods: {
    initSignalrClient() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .build();

      this.connection.on("receiveMessage", (recivedMsg, data) => {
        // this.message = `<p>${recivedMsg}</p>` + this.message;
        this.$message({
          message: recivedMsg
        });
        this.responseData =
          "接收时间：" +
          new Date().toLocaleString() +
          "\n" +
          JSON.stringify(data, null, 4);
      });

      this.connection.on("closeConnection", recivedMsg => {
        this.$message({
          message: recivedMsg
        });
        this.connection.stop();
      });
    },
    loginIn() {
      if (this.name && this.password) {
        let that = this;
        this.connection.start().then(() => {
          that.loginEnabled = false;
          that.connection.invoke("ConfirmLogin", that.name, "中间系统");
        });
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          type: "warning"
        });
      }
    },
    loginOut() {
      this.connection.invoke("ConfirmLogout", this.name, "中间系统");
      this.loginEnabled = true;
    },
    sendMsgByWebApi() {}
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

.login-in-out {
  display: flex;
  margin-bottom: 10px;
}

.login-btn {
  flex: 1;
}

.send-task-btn {
  margin-top: 10px;
}
</style>