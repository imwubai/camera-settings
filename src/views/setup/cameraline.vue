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
            <el-button type="primary" plain class="test_btn" @click="showSetRedLightModal">设置红灯</el-button>
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
    <el-dialog class="red-light-dialog" title="设置红灯" :visible.sync="redLightVisible" :destroy-on-close="true" :close-on-click-modal="false" width="1020px">
      <SetRedLight ref="setRedLightRef" :img-url="imgUrl" />
      <span slot="footer">
        <el-button @click="redLightVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetRedLight">保 存</el-button>
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
import SetRedLight from '@/components/SetRedLight'

export default {
  components: {
    SetRedLight
  },
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
      },
      imgUrl: '',
      redLightVisible: false // 设置红灯弹窗visible
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
    showSetRedLightModal() {
      // 展示设置红灯弹窗
      this.imgUrl = 'https://w.wallhaven.cc/full/96/wallhaven-967zyk.jpg'
      this.redLightVisible = true
    },
    saveSetRedLight() { // 保存设置的红灯
      const ref = this.$refs.setRedLightRef
      const { result: { left, right, stop, red }} = ref
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
      if (Object.keys(stop).length === 0) {
        this.$message({
          type: 'warning',
          message: '未画停车线'
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
      console.log('左边线坐标：', left)
      console.log('右边线坐标：', right)
      console.log('停车线坐标：', stop)
      console.log('红灯坐标：', red)
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

<style lang="scss">
.red-light-dialog{
  .el-dialog{
    margin-top: 6vh !important;
    .el-dialog__headerbtn{
      top: 15px;
      right: 10px;
    }
    .el-dialog__header{
      padding:  10px;
    }
    .el-dialog__body{
      padding:  0 10px;
    }
    .el-dialog__footer{
      padding:  10px;
    }
  }
}
</style>
