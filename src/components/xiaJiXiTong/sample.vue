<template>
  <div class="main-content-panel">
    <div class="interactModule">
      <p>下级系统模拟</p>
      <el-input placeholder="请输入名称" v-model="name" clearable></el-input>
      <el-input placeholder="请输入密码" v-model="password" clearable show-password></el-input>
      <div class="login-in-out">
        <el-button class="login-btn" @click="loginIn" :disabled="!loginEnable">登录</el-button>
        <el-button class="login-btn" @click="loginOut" :disabled="loginEnable">退出</el-button>
      </div>
      <el-select v-model="seFlectedReport" placeholder="请选择">
        <el-option
          v-for="item in reports"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
      <el-button @click="sendMsgByWebApi">向管理系统发送信息</el-button>
      <div class="tipModule" v-html="message"></div>
    </div>
    <pre class="response-data-panel">{{JSON.stringify(responseData, null, 4)}}</pre>
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
      message: "",
      responseData: "",
      loginEnable: true,
      reports: [
        {
          value: "0",
          label: "作业阶段反馈"
        },
        {
          value: "1",
          label: "状态信息查询响应"
        },
        {
          value: "2",
          label: "生成数据量信息查询响应"
        },
        {
          value: "3",
          label: "资源查询响应"
        },
        {
          value: "4",
          label: "自检信息查询响应"
        }
      ],
      seFlectedReport: null
    };
  },
  methods: {
    initSignalrClient() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .build();

      this.connection.on("receiveMessage", recivedMsg => {
        this.message = `<p>${recivedMsg}</p>` + this.message;
      });
    },
    loginIn() {
      if (this.name && this.password) {
        let that = this;
        this.connection.start().then(() => {
          that.loginEnable = false;
          that.connection.invoke("ConfirmUser", that.name);
        });
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          type: "warning"
        });
      }
    },
    loginOut() {
      let that = this;
      this.connection.stop();
      that.loginEnable = true;
    },
    sendSignalRMessage() {
      this.connection.invoke("SendMessage", "来自客户端发送的消息");
    },
    sendMsgByWebApi() {
      if (this.seFlectedReport) {
        let that = this;
        Axios.get(`static/xiaJiXiTong/${that.seFlectedReport}` + ".json").then(
          response => {
            that.responseData = response.data;
          }
        );
      }
    }
  }
};
</script>

<style scoped>
.main-content-panel {
  display: flex;
  overflow-y: auto;
  height: 100%;
  background-color: gainsboro;
}

.interactModule,
.response-data-panel {
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}

.response-data-panel {
  text-align: left;
}

.el-button + .el-button {
  margin-left: 0px;
}

.login-in-out {
  display: flex;
}

.login-btn {
  flex: 1;
}
</style>