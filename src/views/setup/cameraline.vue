<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="请选择设备">
            <el-select v-model="form.cam_name_value" placeholder="请选择" @change="cam_change">
              <el-option
                v-for="item in cam_name"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="大场景摄像机">
            <el-button type="primary" plain class="test_btn" @click="showSetRedLightModal">设置红灯</el-button>
          </el-form-item>
          <el-form-item label="交通灯颜色">
            <el-select v-model="form.signal_color_value" placeholder="请选择">
              <el-option
                v-for="item in signal_color"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="摄像机方向">
            <el-select v-model="form.direction_value" placeholder="请选择">
              <el-option
                v-for="item in direction"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog class="red-light-dialog" title="设置红灯" :visible.sync="redLightVisible" :close-on-click-modal="false" width="1020px">
      <SetRedLight ref="setRedLightRef" :img-url="imgUrl" />
      <span slot="footer">
        <el-button @click="redLightVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSetRedLight">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
// import { apiDomain } from '@/utils/config'

import SetRedLight from '@/components/SetRedLight'

// const signal_color_obj = {
//   0: '红灯',
//   1: '黄灯',
//   2: '绿灯'
// }
// const direction_obj = {
//   0: '对脸',
//   1: '背脸'
// }

export default {
  components: {
    SetRedLight
  },
  data() {
    return {
      cam_name: [
        {
          value: '1',
          label: '摄像机1'
        },
        {
          value: '2',
          label: '摄像机2'
        }
      ],
      signal_color: [
        {
          value: '0',
          label: '红灯'
        },
        {
          value: '1',
          label: '黄灯'
        },
        {
          value: '2',
          label: '绿灯'
        }
      ],
      direction: [
        {
          value: '0',
          label: '对脸'
        },
        {
          value: '1',
          label: '对背'
        }
      ],
      form: {
        cam_name_value: '1',
        signal_color_value: '0',
        direction_value: '0'
      },
      imgUrl: '',
      redLightVisible: false, // 设置红灯弹窗visible
      redLightResult: {} // 画线返回的结果
    }
  },
  mounted: function() {
    // 默认读取大相机信息
    this.get_big_cam()
  },
  methods: {
    get_big_cam() {
      // 获取大相机默认设置
      axios.post('/get_big_cam').then((res) => {
        const { direction, signal_color } = res.data
        this.form.signal_color_value = String(signal_color)
        this.form.direction_value = String(direction)
      })
    },
    get_middle_cam() {
      // 获取中相机默认设置
      axios.post('/get_middle_cam').then((res) => {
        const { direction, signal_color } = res.data
        this.form.signal_color_value = String(signal_color)
        this.form.direction_value = String(direction)
      })
    },
    cam_change(value) {
      if (value === '1') {
        this.get_big_cam()
      } else {
        this.get_middle_cam()
      }
    },
    showSetRedLightModal() {
      // 展示设置红灯弹窗
      this.imgUrl = 'https://w.wallhaven.cc/full/96/wallhaven-967zyk.jpg'
      this.redLightVisible = true
    },
    saveSetRedLight() { // 保存设置的红灯
      const ref = this.$refs.setRedLightRef
      const { result: { left, right, stop, red }} = ref
      if (Object.keys(left).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画左边线'
        })
        return
      }
      if (Object.keys(right).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画右边线'
        })
        return
      }
      if (Object.keys(stop).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画停车线'
        })
        return
      }
      if (Object.keys(red).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画红灯位置'
        })
        return
      }
      this.redLightVisible = false
      this.redLightResult = ref.result
      console.log('左边线坐标：', left)
      console.log('右边线坐标：', right)
      console.log('停车线坐标：', stop)
      console.log('红灯坐标：', red)
    },
    onSubmit() {
      console.log(this.form.cam_name_value)
      console.log(this.form.direction_value)
      console.log(this.form.signal_color_value)
      // console.log(this.redLightResult.stop)
      const { left, right, stop, red } = this.redLightResult
      // 计算方法：已知图中两点（x1, y1)(x2, y2) , left_slope = (x2 - x1) / (y2 - y1)
      // left_x = x1 - left_slope * y1
      const left_slope = Number(((left.end[0] - left.start[0]) / (left.end[1] - left.start[1])).toFixed(2))
      const right_slope = Number(((right.end[0] - right.start[0]) / (right.end[1] - right.start[1])).toFixed(2))
      const reqData = {
        direction: Number(this.form.direction_value),
        signal_color: Number(this.form.signal_color_value),
        signal_top: Number(red.leftTop[1].toFixed(0)), // 红绿灯左上角Y坐标
        signal_bottom: Number(red.rightBottom[1].toFixed(0)), // 红绿灯右下角Y坐标
        red_line: Number(stop.start[1].toFixed(0)), // 停车线起点Y坐标
        left_x: Number((left.start[0] - left_slope * left.start[1]).toFixed(0)),
        left_slope,
        right_x: Number((right.start[0] - right_slope * right.start[1]).toFixed(0)),
        right_slope
      }
      axios.post('/set_big_cam', reqData).then((res) => {
        console.log(res)
      })
      // this.redLightResult
      // this.$message({
      //   message: '恭喜你，这是一条成功消息',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style lang="scss">
.red-light-dialog{
  .el-dialog{
    margin-top: 6vh !important;
    .el-dialog__headerbtn{
      top: 15px;
      right: 10px;
    }
    .el-dialog__header{
      padding:  10px;
    }
    .el-dialog__body{
      padding:  0 10px;
    }
    .el-dialog__footer{
      padding:  10px;
    }
  }
}
</style>
