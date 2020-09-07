<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="当前服务器IP地址为">210.1.2.3</el-form-item>
          <el-form-item label="当前服务器端口为">80</el-form-item>
          <el-form-item label="请设置服务器IP地址">
            <el-input v-model="form.ntp" maxlength="50" />
          </el-form-item>
          <el-form-item label="请设置服务器端口">
            <el-input v-model="form.port" maxlength="50" />
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
        ntp: ''
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
  },
  methods: {
    onSubmit() {
      console.log(this.form.ntp)
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>
