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
        prop="isred"
        label="违法行为"
        width="180"
      />
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
import axios from 'axios'

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
  created() {
    // this.fetchData()
  },
  methods: {
    autoRefreshChange(checked) {
      console.log(checked)
      clearInterval(intervalTimer)
      if (checked) {
        intervalTimer = setInterval(() => {
          this.fetchData()
        }, 3000)
      }
    },
    viewImage(row, type) {
      if (type === 'big') {
        this.imgSrc = `http://192.168.1.68:8080/static/${row.filename}`
      } else {
        this.imgSrc = `http://192.168.1.68:8080/static/${row.smallvideo}`
      }
      this.dialogVisible = true
    },
    fetchData() {
      this.listLoading = false
      axios.post('http://192.168.1.68:8080/list_pic').then((res) => {
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
