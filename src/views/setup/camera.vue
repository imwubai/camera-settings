<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="路口方位">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摄像机1 RTSP名称">
            <el-input v-model="form.port" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" @click="dialogVisible = true">测试摄像机1</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摄像机2 RTSP名称">
            <el-input v-model="form.port" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" @click="onSubmit">测试摄像机2</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摄像机3 RTSP名称">
            <el-input v-model="form.port" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" plain class="test_btn" @click="onSubmit">测试摄像机3</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="图片上下比例">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="抓拍间隔">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="左边距">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="右边距">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="摩托识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自行车识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="人脸识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="脸部识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="头盔识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="伞具识别置信度">
            <el-input v-model="form.ntp" maxlength="50" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
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
  /* margin-bottom: 10px; */
}
.test_btn {
  margin-left: 20px;
}
</style>
