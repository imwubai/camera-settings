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
          <el-button
            type="primary"
            plain
            class="test_btn"
            :loading="test_cam_loading"
            @click="showSetRedLightModal(form.middle_cam_name)"
          >画线设置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="图片上下比例" prop="propotion">
            <el-input-number
              v-model="form.propotion"
              controls-position="right"
              :min="1"
              :max="100"
              :step="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="抓拍间隔" prop="detect_interval">
            <el-input-number
              v-model="form.detect_interval"
              controls-position="right"
              :min="1"
              :max="100"
              :step="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摩托识别置信度" prop="moto_thres">
            <el-input-number
              v-model="form.moto_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自行车识别置信度" prop="bike_thres">
            <el-input-number
              v-model="form.bike_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="人脸识别置信度" prop="person_thres">
            <el-input-number
              v-model="form.person_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="脸部识别置信度" prop="face_thres">
            <el-input-number
              v-model="form.face_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="头盔识别置信度" prop="helmet_thres">
            <el-input-number
              v-model="form.helmet_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="伞具识别置信度" prop="umbrella_thres">
            <el-input-number
              v-model="form.umbrella_thres"
              controls-position="right"
              :min="0"
              :max="1"
              :step="0.1"
            />
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
      width="1000px"
      @closed="handleClose"
    >
      <img :src="imgSrc" class="dialogimg">
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
import SetRedLight from '@/components/SetRedLight2'

export default {
  components: {
    SetRedLight
  },
  data() {
    const validateInput = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (value != 0 && !value) {
        callback(new Error('请输入必填项'))
      } else {
        callback()
      }
    }
    return {
      formRules: {
        middle_cam_name: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        bike_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        detect_interval: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        face_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        helmet_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        location: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        moto_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        person_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        propotion: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        umbrella_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ]
      },
      saveLoading: false,
      dialogVisible: false,
      imgSrc: '', // 测试相机返回的图片地址
      test_cam_loading: false,
      imgUrl: '', // 测试相机返回的图片地址 用来画线
      redLightVisible: false, // 设置红灯弹窗visible
      redLightResult: {}, // 画线返回的结果
      form: {
        middle_cam_name: '',
        bike_thres: '',
        detect_interval: 2,
        face_thres: '',
        helmet_thres: '',
        location: '',
        moto_thres: '',
        person_thres: '',
        propotion: 50,
        umbrella_thres: ''
      }
    }
  },
  mounted: function() {
    this.getDefaultData()
  },
  methods: {
    showSetRedLightModal(cam_name) {
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
        result: { left, right }
      } = ref
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
      // if (Object.keys(stop).length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '未画停车线'
      //   })
      //   return
      // }
      // if (Object.keys(red).length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '未画红灯位置'
      //   })
      //   return
      // }
      this.redLightVisible = false
      this.redLightResult = ref.result
      // console.log('左边线坐标：', left)
      // console.log('右边线坐标：', right)
      // console.log('停车线坐标：', stop)
      // console.log('红灯坐标：', red)
    },
    getDefaultData() {
      axios
        .post('/get_middle_cam')
        .then(res => {
          Object.assign(this.form, res.data)
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
      this.test_cam_loading = true
      axios
        .post('/test_pic', {
          cam_name
        })
        .then(res => {
          console.log(res)
          this.test_cam_loading = false
          const imgSrc = `${apiDomain}/${res.data.filepath}`
          Object.assign(this, {
            dialogVisible: true,
            imgSrc
          })
          // Object.assign(this.form, res.data)
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
          const reqData = {
            ...this.form
          }
          // 重新画线了
          if (Object.keys(this.redLightResult).length > 0) {
            const { left, right } = this.redLightResult
            // 计算方法：已知图中两点（x1, y1)(x2, y2) , left_slope = (x2 - x1) / (y2 - y1)
            // left_x = x1 - left_slope * y1
            const left_slope = Number(
              (
                (left.end[0] - left.start[0]) /
                (left.end[1] - left.start[1])
              ).toFixed(2)
            )
            const right_slope = Number(
              (
                (right.end[0] - right.start[0]) /
                (right.end[1] - right.start[1])
              ).toFixed(2)
            )
            Object.assign(reqData, {
              // signal_top: Number(red.leftTop[1].toFixed(0)), // 红绿灯左上角Y坐标
              // signal_bottom: Number(red.rightBottom[1].toFixed(0)), // 红绿灯右下角Y坐标
              // red_line: Number(stop.start[1].toFixed(0)), // 停车线起点Y坐标
              left_x: Number(
                (left.start[0] - left_slope * left.start[1]).toFixed(0)
              ),
              left_slope,
              right_x: Number(
                (right.start[0] - right_slope * right.start[1]).toFixed(0)
              ),
              right_slope
            })
          }

          axios
            .post('/set_middle_cam', reqData)
            .then(res => {
              this.saveLoading = false
              this.$message({
                message: '设置成功',
                type: 'success'
              })
            })
            .catch(() => {
              this.saveLoading = false
              this.$message({
                message: '摄像机设置异常',
                type: 'error'
              })
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
.dialogimg {
  max-width: 960px;
}
.test_btn {
  margin-left: 20px;
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
