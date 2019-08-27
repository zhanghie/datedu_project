<template>
  <div class="carousel">
    <!-- {{index}} -->
    <img :src="imgArray[Number(number )]" class="carouselimg" />
    <img
      class="leftBtn ctrl_canvas"
      src="../../assets/img/icon_3.png"
      @click="leftBtn"
      alt="leftBtn"
    />
    <img
      class="rightBtn ctrl_canvas"
      src="../../assets/img/icon_4.png"
      @click="rightBtn"
      alt="rightBtn"
    />
    <img class="closeBtn" src="../../assets/img/close.png" alt="closeBtn" @click="closecarousel" />
    <canvasimg ref="canvaschild" v-bind:number="number"></canvasimg>
  </div>
</template>

<script>
import canvasimg from "./_canvas.vue"; // 画布组件
export default {
  props: ["imgArray", "index"],
  data() {
    return {
      number: this.index //记录当前图片页
    };
  },
  components: {
    canvasimg
  },
  created() {
    this.$nextTick(() => {//dom渲染后调用
    let index = Number(this.number);
    this.$refs.canvaschild.showLine(index);
    })
    
  },
  methods: {
    closecarousel: function() {
      //关闭，改变父组件的值
      this.$refs.canvaschild.emptycanvas();//触发子组件事件
      this.$emit("fun", true);
    },
    leftBtn: function() {
      //左切
      let index = Number(this.number);
      if (index == 0) {
        index = this.imgArray.length - 1;
      } else {
        index = Number(this.number) - 1;
      }
      this.number = index;
      this.$refs.canvaschild.emptycanvas();
      this.$refs.canvaschild.showLine(index);
    },
    rightBtn: function() {
      //右切
      let index = Number(this.number);
      if (index == this.imgArray.length - 1) {
        index = 0;
      } else {
        index = Number(this.number) + 1;
      }
      this.number = index;
      this.$refs.canvaschild.emptycanvas();
      this.$refs.canvaschild.showLine(index);
    }
  }
};
</script>
<style lang="scss" scoped>
.carouselimg {
  position: absolute;
  width: 8rem;
  height: 5rem;
  left: 50%;
  top: 1.7rem;
  transform: translateX(-50%);
}
.leftBtn {
  opacity: 0.6;
  position: absolute;
  top: 47%;
  left: 0;
}
.rightBtn {
  opacity: 0.6;
  position: absolute;
  top: 47%;
  right: 0;
  z-index: 999;
}
.closeBtn {
  opacity: 0.6;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
    
