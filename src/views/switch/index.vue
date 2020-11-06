<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">
      <div class="title">方位一</div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.value[0].big_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.value[0].middle_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">方位二</div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.value[1].big_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.value[1].middle_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">方位三</div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.value[2].big_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.value[2].middle_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">方位四</div>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.value[3].big_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.value[3].middle_cam_stat" size="medium" @change="radioChange">
              <el-radio label="running" border>启动</el-radio>
              <el-radio label="stoped" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
// import { apiDomain } from '@/utils/config'
// // 所有请求头加上token
// import { getToken } from '@/utils/auth'
// axios.defaults.headers.common['token'] = (getToken() || '')
// // 设置 baseURL
// axios.defaults.baseURL = apiDomain

import { axios } from '@/utils/request'

export default {
  data() {
    return {
      saveLoading: false,
      form: {
        value: [
          {
            big_cam_stat: '',
            middle_cam_stat: ''
          },
          {
            big_cam_stat: '',
            middle_cam_stat: ''
          },
          {
            big_cam_stat: '',
            middle_cam_stat: ''
          },
          {
            big_cam_stat: '',
            middle_cam_stat: ''
          }
        ]
      }
    }
  },
  mounted: function() {
    this.getDefaultData()
  },
  methods: {
    getDefaultData() {
      axios.post('/check_stat/1').then((res) => {
        this.form.value[0].big_cam_stat = res.data.big_cam_stat
        this.form.value[0].middle_cam_stat = res.data.middle_cam_stat
      }).catch((a) => {
        this.$message({
          message: '获取方位一数据异常',
          type: 'error'
        })
      })
      axios.post('/check_stat/2').then((res) => {
        this.form.value[1].big_cam_stat = res.data.big_cam_stat
        this.form.value[1].middle_cam_stat = res.data.middle_cam_stat
      }).catch((a) => {
        this.$message({
          message: '获取方位二数据异常',
          type: 'error'
        })
      })
      axios.post('/check_stat/3').then((res) => {
        this.form.value[2].big_cam_stat = res.data.big_cam_stat
        this.form.value[2].middle_cam_stat = res.data.middle_cam_stat
      }).catch((a) => {
        this.$message({
          message: '获取方位三数据异常',
          type: 'error'
        })
      })
      axios.post('/check_stat/4').then((res) => {
        this.form.value[3].big_cam_stat = res.data.big_cam_stat
        this.form.value[3].middle_cam_stat = res.data.middle_cam_stat
      }).catch((a) => {
        this.$message({
          message: '获取方位四数据异常',
          type: 'error'
        })
      })
    },
    radioChange(aa) {
      console.log(aa)
    },
    onSubmit() {
      this.saveLoading = true
      Promise.all([
        axios.post('/ctl_proc/1', {
          big_cam: (this.form.value[0].big_cam_stat === 'running' ? 1 : 0),
          middle_cam: (this.form.value[0].middle_cam_stat === 'running' ? 1 : 0)
        }),
        axios.post('/ctl_proc/2', {
          big_cam: (this.form.value[1].big_cam_stat === 'running' ? 1 : 0),
          middle_cam: (this.form.value[1].middle_cam_stat === 'running' ? 1 : 0)
        }),
        axios.post('/ctl_proc/3', {
          big_cam: (this.form.value[2].big_cam_stat === 'running' ? 1 : 0),
          middle_cam: (this.form.value[2].middle_cam_stat === 'running' ? 1 : 0)
        }),
        axios.post('/ctl_proc/4', {
          big_cam: (this.form.value[3].big_cam_stat === 'running' ? 1 : 0),
          middle_cam: (this.form.value[3].middle_cam_stat === 'running' ? 1 : 0)
        })
      ]).then(() => {
        this.saveLoading = false
        this.$message.success('设置成功')
      }).catch((e) => {
        this.saveLoading = false
        this.$message.error(e.response.data.returnMessage || '设置失败')
      })
    }
  }
}
</script>

<style scoped>
.title {
  width: 160px;
  line-height: 40px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  text-indent: 30px;
}
</style>
