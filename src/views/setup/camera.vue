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
          <el-form-item label="摄像机1 RTSP名称" prop="big_cam_name">
            <el-input v-model="form.big_cam_name" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" :loading="test_cam_loading" @click="showDialog(form.big_cam_name)">测试摄像机1</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摄像机2 RTSP名称" prop="middle_cam_name">
            <el-input v-model="form.middle_cam_name" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" :loading="test_cam_loading" @click="showDialog(form.middle_cam_name)">测试摄像机2</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摄像机3 RTSP名称" prop="small_cam_name">
            <el-input v-model="form.small_cam_name" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" :loading="test_cam_loading" @click="showDialog(form.small_cam_name)">测试摄像机3</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="图片上下比例" prop="propotion">
            <el-input-number v-model="form.propotion" controls-position="right" :min="0" :max="100" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="抓拍间隔" prop="detect_interval">
            <el-input-number v-model="form.detect_interval" controls-position="right" :min="0" :max="25" :step="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="左边距" prop="left_border">
            <el-input-number v-model="form.left_border" controls-position="right" :min="0" :max="1500" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="右边距" prop="right_border">
            <el-input-number v-model="form.right_border" controls-position="right" :min="0" :max="1500" :step="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摩托识别置信度" prop="moto_thres">
            <el-input-number v-model="form.moto_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自行车识别置信度" prop="bike_thres">
            <el-input-number v-model="form.bike_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="人脸识别置信度" prop="person_thres">
            <el-input-number v-model="form.person_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="脸部识别置信度" prop="face_thres">
            <el-input-number v-model="form.face_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="头盔识别置信度" prop="helmet_thres">
            <el-input-number v-model="form.helmet_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="伞具识别置信度" prop="umbrella_thres">
            <el-input-number v-model="form.umbrella_thres" controls-position="right" :min="0" :max="1500" :step="0.1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" :loading="saveLoading" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <img :src="imgSrc" class="dialogimg">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// import request from '@/utils/request'
export default {
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
        big_cam_name: [{ required: true, trigger: 'blur', validator: validateInput }],
        bike_thres: [{ required: true, trigger: 'blur', validator: validateInput }],
        detect_interval: [{ required: true, trigger: 'blur', validator: validateInput }],
        face_thres: [{ required: true, trigger: 'blur', validator: validateInput }],
        helmet_thres: [{ required: true, trigger: 'blur', validator: validateInput }],
        left_border: [{ required: true, trigger: 'blur', validator: validateInput }],
        location: [{ required: true, trigger: 'blur', validator: validateInput }],
        middle_cam_name: [{ required: true, trigger: 'blur', validator: validateInput }],
        moto_thres: [{ required: true, trigger: 'blur', validator: validateInput }],
        person_thres: [{ required: true, trigger: 'blur', validator: validateInput }],
        propotion: [{ required: true, trigger: 'blur', validator: validateInput }],
        right_border: [{ required: true, trigger: 'blur', validator: validateInput }],
        small_cam_name: [{ required: true, trigger: 'blur', validator: validateInput }],
        umbrella_thres: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
      saveLoading: false,
      dialogVisible: false,
      imgSrc: '',
      test_cam_loading: false,
      form: {
        big_cam_name: '',
        bike_thres: '',
        detect_interval: 2,
        face_thres: '',
        helmet_thres: '',
        left_border: '',
        location: '',
        middle_cam_name: '',
        moto_thres: '',
        person_thres: '',
        propotion: 50,
        right_border: '',
        small_cam_name: '',
        umbrella_thres: ''
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      axios.post('http://192.168.1.68:8080/get_cam_common').then((res) => {
        Object.assign(this.form, res.data)
      }).catch((a) => {
        this.$message({
          message: '获取摄像机设置服务异常',
          type: 'error'
        })
      })
    },
    showDialog(cam_name) {
      this.test_cam_loading = true
      axios.post('http://192.168.1.68:8080/test_pic', {
        cam_name
      }).then((res) => {
        this.test_cam_loading = false
        const imgSrc = `http://192.168.1.68:8080/${res.data.filepath}`
        // this.form
        Object.assign(this, {
          dialogVisible: true,
          imgSrc
        })
        // Object.assign(this.form, res.data)
      }).catch((a) => {
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
          axios.post('http://192.168.1.68:8080/set_cam_common', {
            ...this.form
          }).then((res) => {
            this.saveLoading = false
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          }).catch((a) => {
            this.saveLoading = false
            this.$message({
              message: '摄像机设置异常',
              type: 'error'
            })
          })
        }
      })
      // console.log(this.form.ntp)
      // this.$message({
      //   message: '恭喜你，这是一条成功消息',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style scoped>
.dialogimg {
  max-width: 960px;
}
.test_btn {
  margin-left: 20px;
}
</style>
