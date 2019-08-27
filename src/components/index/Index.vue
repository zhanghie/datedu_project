<template>
  <div class="index">
    <div v-show="!isShowimg">
      <form id="form" enctype="multipart/form-data" style="display : none">
        <input type="file" ref="upload" @change="uploadPictures" />
      </form>
      <div class="cardimg">
        <el-row>
          <!-- 上传按钮图 -->
          <el-col :span="5" class="img">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="uploadimg" class="imageone" @click="upload"/>
            </el-card>
          </el-col>
          <!-- 缩略图 -->
          <el-col     
            :span="5"
            v-for="(item, index) in imgArray"
            :key="index"
            :offset="index > 0 ? 0 : 0"
            class="img"
          >
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item" class="imageone" @click="carousel(index)" />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 画布子组件 -->
    <carousel
      v-bind:imgArray="imgArray"
      v-bind:index="index"
      v-on:fun="hiddencarousel"
      v-if="isShowimg"
      ref="carouselchild"
    ></carousel>
  </div>
</template>

<script>
import carousel from "./_carousel.vue"; // 轮播图组件
export default {
  name: "Index",

  data() {
    return {
      uploadimg: require("../../assets/img/img.png"),
      imgArray: [],
      isShowimg: false, //显示轮播图还是缩略
      index: "",
      lineArray : "",
    };
  },
  components: {
    carousel
  },
  mounted() {
    this.$http({
      url: "http://localhost:8080/index",
      params: {
        username: this.$route.query.username
      }
    }).then(
      res => {
        if (res.data.code == 1) {
          for (let i = 0; i < res.data.date.length; i++) {
            var url = res.data.date[i].url;
            var imagesName = res.data.date[i].imagesname;
            var urlAll = "http://localhost" + url + imagesName;
            // 将所有图片的路径存入数组 imgArray 中
            this.imgArray.push(urlAll);
          }
        }
      },
      error => {
        window.console.log("fail");
        window.console.log(error);
      }
    );
  },
  methods: {
    carousel: function(index) {
      //渲染子组件轮播图
      this.index = index; //图片序号
      this.isShowimg = !this.isShowimg;
    },
    hiddencarousel: function() {
      this.isShowimg = !this.isShowimg; //隐藏轮播，显示缩略图
      // this.$refs.carouselchild.hiddenlineArray();
    },
    upload:function(){
      this.$refs['upload'].click(); //触发了ref为upload的点击事件
    },
    uploadPictures: function(e) {
      //上传图片接口
      e.preventDefault();
      let formData = new FormData(); //创建上传的对象
      formData.append("username", this.$route.query.username); //上传的用户名
      let fileimg = e.target.files[0]; //获取事件源的图片信息
      formData.append("file", fileimg); //上传的文件
      this.$http.post("http://localhost:8080/upload", formData).then(
        res => {
          alert("图片上传成功");
          let urlAll =
            "http://localhost" + res.data.filepath + res.data.filename;
          this.imgArray.push(urlAll);
        },
        error => {
          window.console.log("fail");
          window.console.log(error);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.cardimg {
  margin: auto;
  width: 80%;
  .img {
    margin: 0.2rem;
    height: 2.6rem;
    .imageone {
      width: 100%;
      height: 2.3rem;
    }
  }
}
</style>>   