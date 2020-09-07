<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
          <el-form-item label="请选择分配模式">
            <el-radio-group v-model="form.radio" size="medium" @change="radioChange">
              <el-radio label="1" border>DHCP手动分配</el-radio>
              <el-radio label="2" border>DHCP自动分配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="IP地址" prop="ip">
            <el-input v-model="form.ip" maxlength="50" />
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="子网掩码" prop="ip1">
            <el-input v-model="form.ip1" maxlength="50" />
          </el-form-item>
          <el-form-item v-show="form.radio == '1'" label="默认网关" prop="ip2">
            <el-input v-model="form.ip2" maxlength="50" />
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
    const validateInput = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入必填项'))
      } else {
        callback()
      }
    }

    return {
      formRules: {
        ip: [{ required: true, trigger: 'blur', validator: validateInput }],
        password: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
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
