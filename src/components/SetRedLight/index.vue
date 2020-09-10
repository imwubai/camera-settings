<template>
  <div class="set-red-light">
    <div class="switch-buttons">
      <el-button size="small" :type="openDrawRed ? 'primary' : ''" @click="switchopenDrawRed">画红灯位置</el-button>
      <el-button size="small" :type="openDrawLeft ? 'primary' : ''" @click="switchopenDrawLeft">画左边线</el-button>
      <el-button
        size="small"
        :type="openDrawRight ? 'primary' : ''"
        @click="switchopenDrawRight"
      >画右边线</el-button>
      <el-button size="small" :type="openDrawStop ? 'primary' : ''" @click="switchopenDrawStop">画停车线</el-button>
      <el-button size="small" type="success" @click="save">设置成功</el-button>
      <el-button size="small" type="danger" @click="reset">清除</el-button>
    </div>
    <div class="box" :style="{width:`${width}px`,height: `${height}px`}">
      <div id="box-img">
        <canvas id="bg-img" :width="width" :height="height" :style="imgStyle" />
        <canvas id="left-img" :width="width" :height="height" :style="imgStyle" />
        <canvas id="right-img" :width="width" :height="height" :style="imgStyle" />
        <canvas id="stop-img" :width="width" :height="height" :style="imgStyle" />
        <canvas
          id="red-img"
          :width="width"
          :height="height"
          :style="imgStyle"
          @mousewheel.stop.prevent="handleMousewheel"
          @mousedown.stop.prevent="handleMousedown"
          @mouseup.stop.prevent="handleMouseup"
          @mousemove.stop.prevent="handleMousemove"
          @mouseleave.stop.prevent="handleMouseleave"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SetRedLight',
  props: {
    imgUrl: {
      // 图片地址
      type: String,
      default: ''
    }
  },
  data() {
    return {
      /** 画布实例 */
      bgCtx: null, // 背景
      leftCtx: null, // 左边线
      rightCtx: null, // 右边线
      stopCtx: null, // 停车线
      redCtx: null, // 红灯
      width: 1000, // 画布宽度
      height: 600, // 画布高度
      imgOriginWidth: 0, // 图片原始宽度
      imgOriginHeight: 0, // 图片原始高度
      top: 0, // 画布定位 top
      left: 0, // 画布定位 left
      zoomVal: 1, // 画布缩放比例
      enableMouseDown: false, // 鼠标按下状态
      /** 拖拽、画图起始点X */
      wheelStartX: 0,
      leftStartX: 0,
      rightStartX: 0,
      stopStartX: 0,
      redStartX: 0,
      /** 拖拽、画图起始点Y */
      wheelStartY: 0,
      leftStartY: 0,
      rightStartY: 0,
      stopStartY: 0,
      redStartY: 0,
      /** 拖拽、画图截止点X */
      wheelEndX: 0,
      leftEndX: 0,
      rightEndX: 0,
      stopEndX: 0,
      redEndX: 0,
      /** 拖拽、画图截止点Y */
      wheelEndY: 0,
      leftEndY: 0,
      rightEndY: 0,
      stopEndY: 0,
      redEndY: 0,
      wheelX: 0, // 缩放中心点X
      wheelY: 0, // 缩放中心点Y
      openDrawLeft: false, // 开启画左边线
      openDrawRight: false, // 开启画右边线
      openDrawStop: false, // 开启画停车线
      openDrawRed: false, // 开启画红灯
      leftLintPoint: {}, // 左边线坐标点
      rightLintPoint: {}, // 左边线坐标点
      stopLintPoint: {}, // 左边线坐标点
      redPoint: {} // 左边线坐标点
    }
  },
  computed: {
    imgStyle() {
      // 画布样式
      return {
        top: `${this.top}px`,
        left: `${this.left}px`,
        transform: `scale(${this.zoomVal})`,
        'transform-origin': `${this.wheelX}px ${this.wheelY}px`
      }
    }
  },
  mounted() {
    /** 初始化获取画布实例，画布比例 */
    this.bgCtx = document.getElementById('bg-img').getContext('2d')
    this.leftCtx = document.getElementById('left-img').getContext('2d')
    this.rightCtx = document.getElementById('right-img').getContext('2d')
    this.stopCtx = document.getElementById('stop-img').getContext('2d')
    this.redCtx = document.getElementById('red-img').getContext('2d')
    const img = new Image()
    img.src = this.imgUrl
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      this.height = (this.width / img.width) * img.height
      this.imgOriginWidth = img.width
      this.imgOriginHeight = img.height
      setTimeout(() => {
        this.bgCtx.drawImage(img, 0, 0, this.width, this.height)
      }, 1000)
    }
  },
  methods: {
    realX(currentX) {
      // X轴计算，防止浮点数影响
      const proportion = this.imgOriginWidth / this.width
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (proportion * 10 ** index * currentX) / 10 ** index
    },
    realY(currentY) {
      // Y轴计算，防止浮点数影响
      const proportion = this.imgOriginHeight / this.height
      const proportionStr = proportion.toString()
      let index = 1
      if (proportionStr.includes('.')) {
        index = proportionStr.split('.')[1].length + 1
      }
      return (proportion * 10 ** index * currentY) / 10 ** index
    },
    switchopenDrawLeft() {
      // 开关画左边线
      this.openDrawLeft = !this.openDrawLeft
      this.openDrawRight = false
      this.openDrawStop = false
      this.openDrawRed = false
    },
    switchopenDrawRight() {
      // 开关画右边线
      this.openDrawRight = !this.openDrawRight
      this.openDrawLeft = false
      this.openDrawStop = false
      this.openDrawRed = false
    },
    switchopenDrawStop() {
      // 开关画停车线
      this.openDrawStop = !this.openDrawStop
      this.openDrawRight = false
      this.openDrawLeft = false
      this.openDrawRed = false
    },
    switchopenDrawRed() {
      // 开关画红灯
      this.openDrawRed = !this.openDrawRed
      this.openDrawRight = false
      this.openDrawStop = false
      this.openDrawLeft = false
    },
    save() {
      let allSuccess = true
      let hasSuccess = false
      // 保存绘制结果
      if (this.leftStartX || this.leftStartY || this.leftEndX || this.leftEndY) {
        this.leftLintPoint = {
          start: `${this.realX(this.leftStartX)},${this.realY(this.leftStartY)}`,
          end: `${this.realX(this.leftEndX)},${this.realY(this.leftEndY)}`
        }
        hasSuccess = true
      } else {
        allSuccess = false
      }
      if (this.rightStartX || this.rightStartY || this.rightEndX || this.rightEndY) {
        this.rightLintPoint = {
          start: `${this.realX(this.rightStartX)},${this.realY(
            this.rightStartY
          )}`,
          end: `${this.realX(this.rightEndX)},${this.realY(this.rightEndY)}`
        }
        hasSuccess = true
      } else {
        allSuccess = false
      }
      if (this.stopStartX || this.stopStartY || this.stopEndX || this.stopEndY) {
        this.stopLintPoint = {
          start: `${this.realX(this.stopStartX)},${this.realY(this.stopStartY)}`,
          end: `${this.realX(this.stopEndX)},${this.realY(this.stopEndY)}`
        }
        hasSuccess = true
      } else {
        allSuccess = false
      }
      if (this.redStartX || this.redStartY || this.redEndX || this.redEndY) {
        if (
          this.realX(this.redEndX) > this.realX(this.redStartX) &&
        this.realY(this.redEndY) > this.realY(this.redStartY)
        ) {
        // 往右下角拖拉
          this.redPoint = {
            leftTop: `${this.realX(this.redStartX)},${this.realY(
              this.redStartY
            )}`,
            rightTop: `${this.realX(this.redEndX)},${this.realY(this.redStartY)}`,
            leftBottom: `${this.realX(this.redStartX)},${this.realY(
              this.redEndY
            )}`,
            rightBottom: `${this.realX(this.redEndX)},${this.realY(
              this.redEndY
            )}`
          }
        } else if (
          this.realX(this.redEndX) > this.realX(this.redStartX) &&
        this.realY(this.redEndY) < this.realY(this.redStartY)
        ) {
        // 往右上角拖拉
          this.redPoint = {
            leftTop: `${this.realX(this.redStartX)},${this.realY(this.redEndY)}`,
            rightTop: `${this.realX(this.redEndX)},${this.realY(this.redEndY)}`,
            leftBottom: `${this.realX(this.redStartX)},${this.realY(
              this.redStartY
            )}`,
            rightBottom: `${this.realX(this.redEndX)},${this.realY(
              this.redStartY
            )}`
          }
        } else if (
          this.realX(this.redEndX) < this.realX(this.redStartX) &&
        this.realY(this.redEndY) < this.realY(this.redStartY)
        ) {
        // 往左上角拖拉
          this.redPoint = {
            leftTop: `${this.realX(this.redEndX)},${this.realY(this.redEndY)}`,
            rightTop: `${this.realX(this.redStartX)},${this.realY(this.redEndY)}`,
            leftBottom: `${this.realX(this.redEndX)},${this.realY(
              this.redStartY
            )}`,
            rightBottom: `${this.realX(this.redStartX)},${this.realY(
              this.redEndY
            )}`
          }
        } else {
        // 往左下角拖拉
          this.redPoint = {
            leftTop: `${this.realX(this.redEndX)},${this.realY(this.redStartY)}`,
            rightTop: `${this.realX(this.redStartX)},${this.realY(
              this.redStartY
            )}`,
            leftBottom: `${this.realX(this.redEndX)},${this.realY(this.redEndY)}`,
            rightBottom: `${this.realX(this.redStartX)},${this.realY(
              this.redEndY
            )}`
          }
        }
        hasSuccess = true
      } else {
        allSuccess = false
      }
      if (hasSuccess) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
      }
      if (allSuccess) {
        this.zoomVal = 1
        this.top = 0
        this.left = 0
        this.wheelX = 0
        this.wheelY = 0
      }
    },
    reset() { // 清空画布
      this.leftCtx.clearRect(0, 0, this.width, this.height)
      this.rightCtx.clearRect(0, 0, this.width, this.height)
      this.stopCtx.clearRect(0, 0, this.width, this.height)
      this.redCtx.clearRect(0, 0, this.width, this.height)
      this.leftLintPoint = {}
      this.rightLintPoint = {}
      this.stopLintPoint = {}
      this.redPoint = {}
    },
    handleMousewheel(e) {
      // 缩放事件
      if (
        !this.openDrawLeft &&
        !this.openDrawRight &&
        !this.openDrawStop &&
        !this.openDrawRed
      ) {
        this.wheelX = e.offsetX
        this.wheelY = e.offsetY
        const changeZoomVal = e.wheelDelta / 2400
        const currentZoomVal = this.zoomVal + changeZoomVal
        this.zoomVal = currentZoomVal < 1 ? 1 : currentZoomVal
        if (this.zoomVal === 1) {
          this.left = 0
          this.top = 0
        } else if (changeZoomVal < 0) {
          const changeWidthVal = Math.abs(changeZoomVal) * this.width
          const changeHeightVal = Math.abs(changeZoomVal) * this.height
          if (this.left <= 0) {
            this.left += changeWidthVal
          } else {
            this.left -= changeWidthVal
          }
          if (this.top <= 0) {
            this.top += changeHeightVal
          } else {
            this.top -= changeHeightVal
          }
        }
      }
    },
    handleMousedown(e) {
      // 鼠标按下
      this.enableMouseDown = true
      if (this.openDrawLeft) {
        this.leftStartX = e.offsetX
        this.leftStartY = e.offsetY
      } else if (this.openDrawRight) {
        this.rightStartX = e.offsetX
        this.rightStartY = e.offsetY
      } else if (this.openDrawStop) {
        this.stopStartX = e.offsetX
        this.stopStartY = e.offsetY
      } else if (this.openDrawRed) {
        this.redStartX = e.offsetX
        this.redStartY = e.offsetY
      } else {
        this.wheelStartX = e.offsetX
        this.wheelStartY = e.offsetY
      }
    },
    handleMouseup(e) {
      // 鼠标放开
      this.enableMouseDown = false
      if (this.openDrawLeft) {
        this.leftEndX = e.offsetX
        this.leftEndY = e.offsetY
      } else if (this.openDrawRight) {
        this.rightEndX = e.offsetX
        this.rightEndY = e.offsetY
      } else if (this.openDrawStop) {
        this.stopEndX = e.offsetX
        this.stopEndY = e.offsetY
      } else if (this.openDrawRed) {
        this.redEndX = e.offsetX
        this.redEndY = e.offsetY
      } else {
        this.wheelEndX = e.offsetX
        this.wheelEndY = e.offsetY
      }
    },
    handleMouseleave() {
      // 鼠标离开画布
      this.enableMouseDown = false
    },
    handleMousemove(e) {
      // 鼠标移动
      if (this.enableMouseDown) {
        if (this.openDrawLeft || this.openDrawRight || this.openDrawStop) {
          // 画线
          let ctx = null
          if (this.openDrawLeft) {
            ctx = this.leftCtx
          } else if (this.openDrawRight) {
            ctx = this.rightCtx
          } else {
            ctx = this.stopCtx
          }
          ctx.clearRect(0, 0, this.width, this.height)
          ctx.strokeStyle = '#f00'
          ctx.lineWidth = 2
          ctx.beginPath()
          if (this.openDrawLeft) {
            ctx.moveTo(this.leftStartX, this.leftStartY)
          } else if (this.openDrawRight) {
            ctx.moveTo(this.rightStartX, this.rightStartY)
          } else {
            ctx.moveTo(this.stopStartX, this.stopStartY)
          }
          ctx.lineTo(e.offsetX, e.offsetY)
          ctx.closePath()
          ctx.stroke()
        } else if (this.openDrawRed) {
          // 画框
          this.redCtx.clearRect(0, 0, this.width, this.height)
          this.redCtx.strokeStyle = '#f00'
          this.redCtx.lineWidth = 2
          this.redCtx.beginPath()
          this.redCtx.moveTo(this.redStartX, this.redStartY)
          const redWidth = Math.abs(e.offsetX - this.redStartX)
          const redHeight = Math.abs(e.offsetY - this.redStartY)
          if (e.offsetX > this.redStartX && e.offsetY > this.redStartY) {
            // 往右下角拖拉
            this.redCtx.rect(
              this.redStartX,
              this.redStartY,
              redWidth,
              redHeight
            )
          } else if (e.offsetX > this.redStartX && e.offsetY < this.redStartY) {
            // 往右上角拖拉
            this.redCtx.rect(this.redStartX, e.offsetY, redWidth, redHeight)
          } else if (e.offsetX < this.redStartX && e.offsetY < this.redStartY) {
            // 往左上角拖拉
            this.redCtx.rect(e.offsetX, e.offsetY, redWidth, redHeight)
          } else {
            // 往左下角拖拉
            this.redCtx.rect(e.offsetX, this.redStartY, redWidth, redHeight)
          }
          this.redCtx.closePath()
          this.redCtx.stroke()
        } else if (this.zoomVal > 1) {
          // 拖拽
          const distX = e.offsetX - this.wheelStartX // 移动的位移量X
          const distY = e.offsetY - this.wheelStartY // 移动的位移量Y
          const currentLeft = this.left + distX // 移动后的定位left
          const currentTop = this.top + distY // 移动后的定位top
          // if (currentLeft >= this.wheelStartX) {
          //   this.left = this.wheelStartX * this.zoomVal
          // } else if (currentLeft <= -(this.width - this.wheelStartX)) {
          //   this.left = -(this.width - this.wheelStartX) * this.zoomVal
          // } else {
          this.left = currentLeft
          // }
          // if (currentTop >= this.wheelStartY) {
          //   this.top = this.wheelStartY * this.zoomVal
          // } else if (currentTop <= -(this.height - this.wheelStartY)) {
          //   this.top = -(this.height - this.wheelStartY) * this.zoomVal
          // } else {
          this.top = currentTop
          // }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.set-red-light {
  position: relative;
  .switch-buttons {
    position: absolute;
    top: -38px;
    left: 96px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .el-switch {
      margin: 0 12px 0 2px;
    }
  }
  .box {
    overflow: hidden;
    #box-img {
      position: relative;
      #bg-img {
        position: absolute;
      }
      #left-img {
        position: absolute;
      }
      #right-img {
        position: absolute;
      }
      #stop-img {
        position: absolute;
      }
      #red-img {
        position: absolute;
      }
    }
  }
}
</style>
