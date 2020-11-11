/* eslint-disable no-unused-vars */
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="路口方位" prop="location">
            <el-input v-model="form.location" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="路口方位编码(英文)" prop="id">
            <el-input v-model="form.id" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="摄像机1 RTSP名称" prop="big_cam_name">
            <el-input v-model="form.big_cam_name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="test_btn"
            :loading="test_cam_loading"
            @click="showDialog(form.big_cam_name)"
          >测试摄像机1</el-button>
          <el-button
            type="primary"
            plain
            class="test_btn"
            :loading="test_cam_loading"
            @click="showSetRedLightModal(form.big_cam_name)"
          >画线设置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="摄像机2 RTSP名称" prop="middle_cam_name">
            <el-input v-model="form.middle_cam_name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="test_btn"
            :loading="test_cam_loading"
            @click="showDialog(form.middle_cam_name)"
          >测试摄像机2</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="摄像机3 RTSP名称" prop="small_cam_name">
            <el-input v-model="form.small_cam_name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            plain
            class="test_btn"
            :loading="test_cam_loading"
            @click="showDialog(form.small_cam_name)"
          >测试摄像机3</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="交通灯颜色" prop="signal_color">
            <el-select v-model="signal_color" multiple placeholder="请选择">
              <el-option
                v-for="item in signal_color_array"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="onSubmit"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="测试照片"
      :visible.sync="dialogVisible"
      width="1040px"
      @closed="handleClose"
    >
      <div class="dialogimgBox">
        <img width="1000" :src="imgSrc" class="dialogimg">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="red-light-dialog"
      title="设置红灯"
      :visible.sync="redLightVisible"
      :close-on-click-modal="false"
      width="1020px"
    >
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
import { apiDomain } from '@/utils/config'
import SetRedLight from '@/components/SetRedLight'

export default {
  components: {
    SetRedLight
  },
  data() {
    const validateInput = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (value === 0) {
        callback()
      } else {
        if (value) {
          callback()
        } else {
          callback(new Error('请输入必填项'))
        }
      }
    }
    const validateId = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (/^[A-Za-z0-9]{1,50}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入英文和数字'))
      }
    }
    const validateColor = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (this.signal_color.length > 0) {
        callback()
      } else {
        callback(new Error('请输入必填项'))
      }
    }
    return {
      formRules: {
        big_cam_name: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        middle_cam_name: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        detect_interval: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        location: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        id: [
          { required: true, trigger: 'blur', validator: validateId }
        ],
        small_cam_name: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        signal_color: [
          { required: true, trigger: 'blur', validator: validateColor }
        ]
      },
      saveLoading: false,
      dialogVisible: false,
      imgSrc: '', // 测试相机返回的图片地址
      test_cam_loading: false,
      signal_color_array: [
        {
          value: 1,
          label: '红色'
        },
        {
          value: 2,
          label: '橙色'
        },
        {
          value: 4,
          label: '黄色'
        },
        {
          value: 8,
          label: '绿色'
        },
        {
          value: 16,
          label: '青色'
        },
        {
          value: 32,
          label: '蓝色'
        },
        {
          value: 64,
          label: '紫色'
        },
        {
          value: 128,
          label: '黑色'
        }
      ],
      imgUrl: '', // 测试相机返回的图片地址 用来画线
      redLightVisible: false, // 设置红灯弹窗visible
      redLightResult: {}, // 画线返回的结果
      positionNumber: 0, // 四个路口方位 1 - 4
      signal_color: [], // 交通灯颜色
      form: {
        location: '',
        id: '',
        big_cam_name: '',
        middle_cam_name: '',
        small_cam_name: ''
      }
    }
  },
  mounted: function() {
    const { path } = this.$route
    if (path.includes('camera1')) {
      this.positionNumber = 1
    }
    if (path.includes('camera2')) {
      this.positionNumber = 2
    }
    if (path.includes('camera3')) {
      this.positionNumber = 3
    }
    if (path.includes('camera4')) {
      this.positionNumber = 4
    }
    this.getDefaultData()
  },
  methods: {
    showSetRedLightModal(cam_name) {
      // this.redLightVisible = true
      this.test_cam_loading = true
      axios
        .post('/test_pic', {
          cam_name
        })
        .then(res => {
          this.test_cam_loading = false
          const imgSrc = `${apiDomain}/${res.data.filepath}`
          this.imgUrl = imgSrc
          this.redLightVisible = true
        })
        .catch(a => {
          this.test_cam_loading = false
          this.$message({
            message: '获取照片失败',
            type: 'error'
          })
        })
    },
    saveSetRedLight() {
      // 保存设置的红灯
      const ref = this.$refs.setRedLightRef
      const {
        result: { stop, redStop, red }
      } = ref
      // if (Object.keys(left).length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '未画左边线'
      //   })
      //   return
      // }
      // if (Object.keys(right).length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '未画右边线'
      //   })
      //   return
      // }
      if (Object.keys(stop).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画停车线'
        })
        return
      }
      if (Object.keys(redStop).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画红灯线'
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
      // console.log('左边线坐标：', JSON.stringify(left))
      // console.log('右边线坐标：', JSON.stringify(right))
      // console.log('停车线坐标：', JSON.stringify(stop))
      // console.log('红灯线坐标：', JSON.stringify(redStop))
      // console.log('红灯坐标：', JSON.stringify(red))
    },
    getDefaultData() {
      axios
        .post('/get_cam/' + this.positionNumber)
        .then(res => {
          Object.assign(this.form, res.data)
          // 获取默认选中的红绿灯颜色
          const arr = [128, 64, 32, 16, 8, 4, 2, 1]
          function calcNumbers(num) {
            const numbers = []
            for (const value of arr) {
              if ((num & value) == value) {
                numbers.push(value)
              }
            }
            return numbers
          }
          this.signal_color = calcNumbers(res.data.signal_color)
          // this.form.big_cam_name = '/root/part2.avi'
        })
        .catch(a => {
          this.$message({
            message: '获取摄像机设置服务异常',
            type: 'error'
          })
        })
    },
    showDialog(cam_name) {
      if (!cam_name) {
        this.$message.error('请先输入相机名称')
        return
      }
      this.test_cam_loading = true
      axios
        .post('/test_pic', {
          cam_name
        })
        .then(res => {
          this.test_cam_loading = false
          const imgSrc = `${apiDomain}/${res.data.filepath}`
          Object.assign(this, {
            dialogVisible: true,
            imgSrc
          })
          setTimeout(() => {
            for (let i = 1; i < 4; i++) {
              const div = document.createElement('div')
              div.className = 'horizontal'
              div.style.top = res.data['horizontal' + i] + '%'
              document.querySelector('.dialogimgBox').appendChild(div)
            }
            for (let i = 1; i < 5; i++) {
              const div = document.createElement('div')
              div.className = 'vertical'
              div.style.left = res.data['vertical' + i] + '%'
              document.querySelector('.dialogimgBox').appendChild(div)
            }
          }, 100)
        })
        .catch(a => {
          this.test_cam_loading = false
          this.$message({
            message: '获取照片失败',
            type: 'error'
          })
        })
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveLoading = true
          // 交通灯颜色值相加
          const colorSum = this.signal_color.reduce(function(prev, cur, index, arr) {
            return prev + cur
          })
          const reqData = {
            ...this.form,
            signal_color: colorSum
          }
          // 重新画线了
          if (Object.keys(this.redLightResult).length > 0) {
            const { stop, red, redStop } = this.redLightResult
            // stop: 停车线
            // redStop: 红灯线
            // 计算方法：已知图中两点（x1, y1)(x2, y2) , left_slope = (x2 - x1) / (y2 - y1)
            // left_x = x1 - left_slope * y1
            // const left_slope = Number(
            //   (
            //     (left.end[0] - left.start[0]) /
            //     (left.end[1] - left.start[1])
            //   ).toFixed(2)
            // )
            // const right_slope = Number(
            //   (
            //     (right.end[0] - right.start[0]) /
            //     (right.end[1] - right.start[1])
            //   ).toFixed(2)
            // )
            Object.assign(reqData, {
              signal_left: Number(red.leftTop[0].toFixed(0)), // 红绿灯左上角X坐标
              signal_top: Number(red.leftTop[1].toFixed(0)), // 红绿灯左上角Y坐标
              signal_right: Number(red.rightBottom[0].toFixed(0)), // 红绿灯右下角X坐标
              signal_bottom: Number(red.rightBottom[1].toFixed(0)), // 红绿灯右下角Y坐标
              red_line: Number(redStop.start[1].toFixed(0)), // 红灯线起点Y坐标
              overline: Number(stop.start[1].toFixed(0)) // 停车线起点Y坐标
              // left_x: Number(
              //   (left.start[0] - left_slope * left.start[1]).toFixed(0)
              // ),
              // left_slope,
              // right_x: Number(
              //   (right.start[0] - right_slope * right.start[1]).toFixed(0)
              // ),
              // right_slope
            })
          }

          axios
            .post('/set_cam/' + this.positionNumber, reqData)
            .then(res => {
              this.saveLoading = false
              this.$message({
                message: '设置成功',
                type: 'success'
              })
            })
            .catch((e) => {
              this.saveLoading = false
              this.$message.error(e.response.data || '摄像机设置异常')
            })
        }
      })
    },
    handleClose() {
      location.reload()
    } // 修复测试时摄像机图片 为浏览器缓存图片问题
  }
}
</script>

<style lang="scss">
.dialogimgBox {
  position: relative;
  width: 1000px;
  overflow: hidden;
}
.horizontal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #f00;
}
.vertical {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background-color: #f00;
}
.dialogimg {
  max-width: 1000px;
}
.test_btn {
  margin-left: 20px;
}
.el-select {
  width: 100%;
}
.red-light-dialog {
  .el-dialog {
    margin-top: 6vh !important;
    .el-dialog__headerbtn {
      top: 15px;
      right: 10px;
    }
    .el-dialog__header {
      padding: 10px;
    }
    .el-dialog__body {
      padding: 0 10px;
    }
    .el-dialog__footer {
      padding: 10px;
    }
  }
}
</style>
