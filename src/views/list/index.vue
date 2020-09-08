<template>
  <div class="app-container">
    <div>
      <el-checkbox v-model="checked1" label="启用自动刷新" border />
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
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :page-size="10"
      :total="100"
    />
  </div>
</template>

<script>
// import { getList } from '@/api/table'

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
      list: null,
      listLoading: true,
      checked1: true,
      tableData: []
    }
  },
  created() {
    // this.fetchData()
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
    fetchData() {
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
