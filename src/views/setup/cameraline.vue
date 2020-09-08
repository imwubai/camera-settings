<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="请选择设备">
            <el-select v-model="form.select" placeholder="请选择" @change="hahhaha">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="大场景摄像机">
            <el-button type="primary" plain class="test_btn" @click="onSubmit">设置红灯</el-button>
          </el-form-item>
          <el-form-item label="交通灯颜色">
            <el-select v-model="form.select" placeholder="请选择" @change="hahhaha">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="摄像机方向">
            <el-select v-model="form.select" placeholder="请选择" @change="hahhaha">
              <el-option
                v-for="item in options3"
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
      options1: [
        {
          value: '摄像机1',
          label: '摄像机1'
        },
        {
          value: '摄像机2',
          label: '摄像机2'
        }
      ],
      options2: [
        {
          value: '红灯',
          label: '红灯'
        },
        {
          value: '黄灯',
          label: '黄灯'
        },
        {
          value: '绿灯',
          label: '绿灯'
        }
      ],
      options3: [
        {
          value: '对脸',
          label: '对脸'
        },
        {
          value: '背脸',
          label: '背脸'
        }
      ],
      form: {
        ntp: '',
        select: '摄像机2'
      }
    }
  },
  mounted: function() {
    // console.log(this)
    // this.form.ntp = '12'
  },
  methods: {
    hahhaha(aa) {
      // console.log(aa)
    },
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
</style>
