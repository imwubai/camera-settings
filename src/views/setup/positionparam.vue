<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
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
  </div>
</template>

<script>
import { axios } from '@/utils/request'
// import { apiDomain } from '@/utils/config'

export default {
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
    return {
      formRules: {
        bike_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        face_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        helmet_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        moto_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        person_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ],
        umbrella_thres: [
          { required: true, trigger: 'blur', validator: validateInput }
        ]
      },
      saveLoading: false,
      form: {
        bike_thres: '',
        face_thres: '',
        helmet_thres: '',
        moto_thres: '',
        person_thres: '',
        umbrella_thres: ''
      }
    }
  },
  mounted: function() {
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      axios
        .post('/get_thres')
        .then(res => {
          Object.assign(this.form, res.data)
        })
        .catch(a => {
          this.$message({
            message: '获取设置服务异常',
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
          axios
            .post('/set_thres', reqData)
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
                message: '设置异常',
                type: 'error'
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
