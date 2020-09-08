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
        prop="index"
        label="序号"
        width="80"
      />
      <el-table-column
        prop="name1"
        label="摄像机编号"
        width="180"
      />
      <el-table-column
        prop="address"
        label="违法行为"
        width="180"
      />
      <el-table-column
        prop="address"
        label="违法地点"
      />
      <el-table-column
        prop="address3"
        label="采集时间"
        width="180"
      />
      <el-table-column
        prop="address12"
        label="大场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewImage(scope.row, 'big')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="address1"
        label="小场景"
        width="150"
      >
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="viewImage(scope.row, 'small')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :page-size="10"
      :total="100"
      :current-page.sync="pageCurrent"
      @current-change="handleCurrentChange"
    />
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
import request from '@/utils/request'

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
      dialogVisible: false,
      pageCurrent: 1,
      list: null,
      listLoading: true,
      autoRefresh: true, // 自动刷新
      tableData: []
    }
  },
  mounted() {
    request({
      url: 'http://192.168.110.65:3080/api/clue/appLetsConfigDubboService/getAppLetsOrg',
      method: 'post',
      headers: {
        sign: 'A04D088972190B1C92B735EC5A6AEF96',
        source: 'duoyuan_wechat_zhuji'
      },
      data: {
        a: 1
      }
    }).then((res) => {
      console.log(res)
    }, (e) => {
      console.log(e)
    })
  },
  created() {
    // this.fetchData()
    // this.autoRefreshChange(true)
    setTimeout(() => {
      this.listLoading = false
      for (let i = 0; i < 100; i++) {
        this.tableData.push({
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        })
      }
    }, 100)
  },
  methods: {
    autoRefreshChange(checked) {
      let timer
      clearInterval(timer)
      if (checked) {
        timer = setInterval(() => {
          this.pageCurrent = 1
          this.fetchData()
        }, 3000)
      }
    },
    viewImage(row, type) {
      console.log(row)
      console.log(type)
      this.dialogVisible = true
    },
    handleCurrentChange(e) {
      console.log(e)
    },
    fetchData() {
      console.log(1)
      // this.listLoading = true
      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
    }
  }
}
</script>
<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
