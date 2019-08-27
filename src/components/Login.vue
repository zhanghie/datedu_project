<template>
  <div class="login">
    <div class="login_left">
      <!--页面左边大图-->
      <img class="main-left" :src="imgleft" />
    </div>
    <div class="login_right">
      <!--页面右侧-->
      <img class="main-right" :src="imgRight" />
      <div class="login-text">
        <span class="welcome">欢迎登陆</span>
        <span class="uself">请使用您本人的账号密码登陆</span>
      </div>
      <div class="form-box">
        <input
          type="text"
          class="username"
          v-model="username"
          placeholder="datedu.cn"
          @click="showlist"
        />
        <div class="list">
          <ul class="input_list" v-if="isShowSelect">
            <li
              v-for="(item,index) in listArray"
              :key="index"
              @click="showusername(index)"
            >{{item.username}}</li>
          </ul>
        </div>
        <br />
        <input type="password" class="password" v-model="password" />
        <input style="display :none" />
        <br />
        <el-checkbox v-model="checked" class="rpassword" name="rpassword">记住密码</el-checkbox>

        <br />
        <a>
          <input type="submit" class="sbt" value="登录" @click="login" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
//import axios from 'axios'
export default {
  name: "login",

  data() {
    return {
      imgleft: require("../assets/img/img1.png"),
      imgRight: require("../assets/img/icon_1.png"),
      username: "",
      password: "",
      checked: true,
      listArray: [],
      isShowSelect: false
    };
  },
  methods: {
    showlist: function() {
      //显示本地用户数据
      var len = localStorage.length; // 获取长度
      var arr = new Array(); // 定义数据集
      var loglevel ;
      for (var i = 0; i < len; i++) {
        // 获取key 索引从0开始
        var getKey = localStorage.key(i);
        // 获取key对应的值
        var getVal = localStorage.getItem(getKey);
        // 放进数组
        arr[i] = {
            username: getKey,
            password: getVal,
          };
        if (getKey == "loglevel:webpack-dev-server") {
          loglevel = i;         
        }
      }
      arr.splice(loglevel,1);
      this.listArray = arr;
      console.log(this.listArray);
      this.isShowSelect = !this.isShowSelect;
    },
    showusername: function(index) {
      this.username = this.listArray[index].username;
      this.password = this.listArray[index].password;
      this.isShowSelect = false;
    },
    login: function() {
      if (this.checked) {
        if (
          this.username.replace(/(^\s*)|(\s*$)/g, "") != "" &&
          this.password.replace(/(^\s*)|(\s*$)/g, "") != ""
        ) {
          localStorage.setItem(this.username, this.password);
        }else{
          alert("请输入合法的用户名或密码")
        }
      } else {
        localStorage.removeItem(this.username); //没有点记住密码则删除本地用户名密码
      }
      this.$http({
        url: "http://localhost:8080/login",
        params: {
          username: this.username,
          password: this.password
        }
        // withCredentials:true
      }).then(res => {
        console.log("访问login接口后", res.data);
        if (res.data.code == 1) {
          //用户名密码正确之后跳转
          //路由跳转
          console.log("成功可以跳转了");
          //存到状态管理，或者直接跳转到user,或者传数据给user
          //  this.$router.push({name:'/Header',params:{}})//2种写法
          this.$router.push({
            path: "/index",
            query: { username: this.username }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  overflow: hidden;
}
.login_left {
  float: left;
  width: 50%;
  height: 8.65rem;
  .main-left {
    width: 100%;
    height: 100%;
  }
}

.login_right {
  float: left;
  width: 50%;
  overflow: hidden;
  .main-right {
    position: fixed;
    width: 0.58rem;
    height: 1.87rem;
    left: 15.5rem;
  }
  .login-text {
    position: relative;
    left: 2rem;
    top: 0.9rem;

    .welcome {
      color: #5794ff;
      font-size: 0.65rem;
    }
    .uself {
      height: 0.23rem;
      display: block;
      font-size: 0.26rem;
      color: #9289a6;
      line-height: 0.26rem;
    }
  }
  .form-box {
    position: relative;
    width: 9rem;
    height: 7rem;
    top: 1.3rem;
    margin-left: 2rem;
    .username,
    .password,
    .sbt {
      position: relative;

      width: 5.23rem;
      height: 0.72rem;
      border: 1px solid #5794ff;
      border-radius: 0.1rem;
      font-size: 0.23rem;
      font-weight: 400;
      color: #5794ff;
      line-height: 0.2px;
      text-indent: 31px;
    }
    input::-webkit-input-placeholder {
      color: #5794ff;
    }
    .sbt {
      bottom: 1rem;
      background: #5794ff;
      border-radius: 40px;
      color: aliceblue;
    }
    span {
      height: 0.2rem;
      font-size: 0.2rem;
      line-height: 0.2rem;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #9289a6;
    }
    .rpassword {
      position: relative;
      bottom: 0.6rem;
    }
    .list {
      width: 4.5rem;
      position: absolute;
      z-index: 999;
      top: 1.15rem;
      font-size: 0.25rem;
      background: rgba(250, 250, 250, 0.6);
      li {
        list-style: none;
        color: #9289a6;
      }
      li:hover {
        cursor: pointer;
        /*光标呈现为指示链接的指针（一只手）*/
        background: rgba(214, 216, 219, 0.8);
        color: #8d9ead;
      }
    }
  }
}
</style>