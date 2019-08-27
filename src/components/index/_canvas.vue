<template>
  <div class="canvasimg">
    <div class="canvas_draw" ref="img">
      <!-- 将canvas摆在一个容器里面固定其显示大小 -->
      <canvas
        @mousedown="mouseDown($event)"
        @mousemove="mouseMove($event)"
        @mouseup="mouseUp($event)"
        class="myCanvas"
        width="900"
        height="550"
        ref="canvas"
      ></canvas>
    </div>
    <div class="tool">
      <div>
        <span>线条粗细</span>
      </div>
      <div>
        <input type="range" id="range" max="20" min="1" value="5" ref="linevalue" />
      </div>
      <div class="show"></div>
      <div>
        <span>线条颜色</span>
      </div>
      <div>
        <input type="color" id="color" ref="color" />
      </div>
      <div>
        <button class="brush" v-if="draw" @click="showdraw">写画笔</button>
      </div>
      <div>
        <button class="rubber" v-if="!draw" @click="showdraw">橡皮擦</button>
      </div>
      <div>
        <button class="clearCanvas" @click="clearCanvas">清除</button>
        <button @click="download">下载</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["number"], //接收父类传图片所在页
  data() {
    return {
      draw: true, //控制橡皮擦和画笔显示隐藏
      canvas: "", //画布
      ctx: "", //画布绘画
      moveNum: false, //线条颜色
      color: "", //线条颜色
      lineWidth: "", //线条粗细
      canvasLineArray: [],//全部笔迹
      canvasLineOne: [],
      canvasLine: {},
      point_x: [],
      point_y: [],
      page: ""
    };
  },
  created() {
    this.number = Number(this.number);
    this.$nextTick(() => {
      //dom渲染后调用
    this.canvasLineArray = this.$store.state.lineArray; //vuex存过的笔记
    this.showLine(this.number)  //页面初始化显示已有笔记
    });
  },
  mounted() {
    this.canvasdraw();
  },
  methods: {
    canvasdraw: function() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
    },
    showdraw: function() {
      //画笔橡皮擦切换
      this.draw = !this.draw;
    },
    mouseDown: function(e) {
      //鼠标在画布上按下
      e = e || event; //解决兼容问题
      let rect = this.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left; //找到鼠标的横坐标
      let y = e.clientY - rect.top; //鼠标的纵坐标
      this.ctx.beginPath(); //起笔
      this.lineWidth = this.$refs["linevalue"].value; //线条的粗细
      this.ctx.lineWidth = this.lineWidth;
      this.color = this.$refs["color"].value; //获取节点颜色
      this.ctx.strokeStyle = this.color; //将颜色的值赋给线条样式
      this.moveNum = true; //令moveNum等于true，
    },
    mouseMove: function(e) {
      //鼠标在画布上移动
      e = e || event; //兼容问题
      let rect = this.canvas.getBoundingClientRect();
      let x = e.clientX - rect.left; //找到鼠标的横坐标
      let y = e.clientY - rect.top; //鼠标的纵坐标
      if (this.draw) {
        if (this.moveNum) {
          //如果move为true即为有值的情况下也就是说必须鼠标按下过后才能执行操作
          this.ctx.lineTo(x, y); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
          this.ctx.stroke(); //采用线性的方式绘画
          this.point_x.push(x);
          this.point_y.push(y);
        }
      } else {
        if (this.moveNum) {
          //如果move为true即为有值的情况下也就是说必须鼠标按下过后才能执行操作
          this.point_x.push(x);
          this.point_y.push(y);
          this.generatePixel(x, y, this.lineWidth);
        }
      }
    },
    mouseUp: function() {
      //鼠标松开
      //鼠标弹起结束画和擦
      this.canvasLine = {};
      this.canvasLine.flag = this.draw;
      this.canvasLine.color = this.color;
      this.canvasLine.lineWidth = this.lineWidth;
      this.canvasLine.x = this.point_x;
      this.canvasLine.y = this.point_y;
      this.canvasLineOne.push(this.canvasLine);
      this.point_x = []; //重置x点坐标
      this.point_y = []; //重置y点坐标
      this.moveNum = false;
    },
    generatePixel: function(x, y, lineWidth) {
      //擦除功能
      let range = lineWidth;
      let num = range * 5;
      let r = num / 2;

      function clearArc(x, y, radius, ctx) {
        //圆心(x,y)，半径radius
        for (let i = 0; i <= radius; i++) {
          let calcWidth = radius - i;
          let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
          let posX = x - calcWidth;
          let posY = y - calcHeight;
          let widthX = 2 * calcWidth;
          let heightY = 2 * calcHeight;
          ctx.clearRect(posX, posY, widthX, heightY);
        }
      }
      clearArc(x, y, num / 2, this.ctx);
      //如果是在左右边缘，需要绘制两次
      if (x + r > this.canvas.width) {
        clearArc(x - this.canvas.width, y, num / 2);
      }
      if (x - r < 0) {
        clearArc(x + this.canvas.width, y, num / 2);
      }
    },
    emptycanvas: function() {
      //保存笔记，清空画布内容
      //判断画布是否绘制了
      if (this.canvasLineOne != "") {
        let canvaspage = [];
        //判断画布原来是否有笔迹
        if (this.canvasLineArray[this.number] != undefined) {
          canvaspage = this.canvasLineArray[this.number];
          this.canvasLineArray[this.number] = new Array();
          let newcanvaspage = canvaspage.concat(this.canvasLineOne); //原笔记和新笔记拼接
          this.canvasLineArray[this.number] = newcanvaspage;
          console.log(newcanvaspage);
        } else {
          //没有绘制过笔迹
          this.canvasLineArray[this.number] = this.canvasLineOne;
        }
      }
      //sessionStorage.setItem("lineArray",this.canvasLineArray);
      console.log(this.canvasLineArray);
      this.$store.commit({           //vuex 调用改变state值函数
        type : 'newlineArray', //函数名
        canvaslineArray : this.canvasLineArray,
      })
      this.canvasLineOne = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    showLine: function(page) {
      //显示笔记
      let linepage = [];
      this.page = page;
      linepage = this.canvasLineArray[page];
      if (linepage != undefined) {
        for (let k = 0; k < linepage.length; k++) {
          if (linepage[k].flag == true) {//判断是画笔还是橡皮擦/画笔
            this.ctx.beginPath(); //起笔
            this.ctx.lineWidth = linepage[k].lineWidth; //线条的粗细
            this.ctx.strokeStyle = linepage[k].color; //将颜色的值赋给线条样式
            var lineX = linepage[k].x;
            var lineY = linepage[k].y;
            for (let j = 0; j < lineX.length; j++) {
              this.ctx.lineTo(lineX[j], lineY[j]); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
              this.ctx.stroke(); //采用线性的方式绘画
            }
          } else {//橡皮擦
            let lineWidth = linepage[k].lineWidth;
            let lineX = linepage[k].x;
            let lineY = linepage[k].y;
            for (let j = 0; j < lineX.length; j++) {              
              this.generatePixel(lineX[j], lineY[j], lineWidth);//调用橡皮擦函数
            }
          }
        }
      }
    },
    clearCanvas: function() {
      //清除
      if (confirm("确实要删除吗？")) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //清除当前页的笔迹
        this.canvasLineArray[this.page] = [];
        //alert("已经删除！");
      } else {
        //alert("已经取消了删除操作");
      }
    },
    download: function() {
      //下载
      let imgbase = this.canvas.toDataURL("image/png");
      this.saveFile(imgbase, this.page + "img.jpg");
    },
    saveFile: function(data, filename) {
      //下载连接
      var save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = data;
      save_link.download = filename;
      var event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
    }
  }
};
</script>
<style lang="scss" scoped>
.canvas_draw {
  position: absolute;
  width: 8rem;
  height: 5rem;
  left: 50%;
  top: 1.7rem;
  transform: translateX(-50%);
  overflow: hidden;
}

.tool {
  position: absolute;
  bottom: 1rem;
  left: 4.7rem;
  height: 0.4rem;
  font-size: 0.2rem;
  line-height: 0.4rem;
  #show {
    height: 0.4rem;
    margin-top: 0.1rem;
  }
}

.tool div {
  float: left;
  margin: 0.03rem;
}

#range {
  float: left;
  width: 1rem;
}

.show {
  width: 1rem;
}

.tool button {
  margin-left: 0.6rem;
}
</style>>
    
