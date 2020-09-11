<template>
  <div class="app-container">
    <div>
      <el-checkbox v-model="autoRefresh" label="启用自动刷新" border @change="autoRefreshChange" />
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      height="calc(100vh - 200px)"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="camera_id"
        label="摄像机编号"
        width="180"
      />
      <el-table-column
        prop="illegal"
        label="违法行为"
        width="180"
      >
        <template slot-scope="scope">
          <!-- <el-button type="text" size="medium" @click="viewImage(scope.row, 'big')">查看</el-button> -->
          <div>{{ renderIllegal(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="违法地点"
      />
      <el-table-column
        prop="time"
        label="采集时间"
        width="180"
      />
      <el-table-column
        prop="filename"
        label="大场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewImage(scope.row, 'big')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="smallvideo"
        label="小场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewImage(scope.row, 'small')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
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
// import axios from 'axios'
// import { apiDomain } from '@/utils/config'
// // 所有请求头加上token
// import { getToken } from '@/utils/auth'
// axios.defaults.headers.common['token'] = (getToken() || '')
// // 设置 baseURL
// axios.defaults.baseURL = apiDomain

import { axios } from '@/utils/request'
import { apiDomain } from '@/utils/config'

// 定时器
let intervalTimer

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      imgSrc: '',
      dialogVisible: false,
      listLoading: true,
      autoRefresh: true, // 自动刷新
      tableData: []
    }
  },
  mounted() {
    this.fetchData()
    clearInterval(intervalTimer)
    this.autoRefreshChange(true)
  },
  destroyed() {
    clearInterval(intervalTimer)
  },
  created() {
    // this.fetchData()
  },
  methods: {
    renderIllegal(rowData) {
      const objects = (rowData.objects || [])
      const illegalType = {
        redline: '闯红灯',
        overline: '越线',
        wrongway: '逆行',
        doubleman: '一车多人',
        nohelmet: '无头盔',
        umbrella: '安装伞具'
      }
      const arrarText = []
      objects.forEach((item) => {
        arrarText.push(illegalType[item.illegal])
      })
      return arrarText.join('、')
    },
    autoRefreshChange(checked) {
      clearInterval(intervalTimer)
      if (checked) {
        intervalTimer = setInterval(() => {
          this.fetchData()
        }, 3000)
      }
    },
    viewImage(row, type) {
      if (type === 'big') {
        this.imgSrc = `${apiDomain}/static/${row.filename}`
      } else {
        this.imgSrc = `${apiDomain}/static/${row.smallvideo}`
      }
      this.dialogVisible = true
    },
    fetchData() {
      this.listLoading = false
      axios.post('/list_pic').then((res) => {
        this.listLoading = false
        this.tableData = res.data
      }).catch((a) => {
        this.listLoading = false
        this.$message({
          message: '获取数据异常',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style scoped>
.dialogimg {
  max-width: 960px;
}
.pagination {
  margin-top: 20px;
}
</style>
