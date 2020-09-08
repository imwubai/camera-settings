<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="摄像机1">
            <el-radio-group v-model="form.radio" size="medium" @change="radioChange">
              <el-radio label="1" border>启动</el-radio>
              <el-radio label="2" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="摄像机2">
            <el-radio-group v-model="form.radio" size="medium" @change="radioChange">
              <el-radio label="1" border>启动</el-radio>
              <el-radio label="2" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="摄像机3">
            <el-radio-group v-model="form.radio" size="medium" @change="radioChange">
              <el-radio label="1" border>启动</el-radio>
              <el-radio label="2" border>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import request from '@/utils/request'

// request({
//   url: '/vue-element-admin/user/login',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log(res)
// })

export default {
  data() {
    return {
      form: {
        radio: '1',
        ip: '',
        ip1: '',
        ip2: ''
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
  },
  methods: {
    radioChange(aa) {
      console.log(aa)
    },
    onSubmit() {
      console.log(this.form.radio)
      if (this.form.radio === '1') {
        this.$refs.form.validate(valid => {
          console.log(valid)
          // if (valid) {

          // }
        })
      } else {
        console.log('submit')
      }
      // this.$message({
      //   message: '恭喜你，这是一条成功消息',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  /* margin-bottom: 10px; */
}
</style>
