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
          <el-button v-if="scope.row.small_objects.length" type="text" size="medium" @click="viewImage(scope.row, 'small')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="1040px"
    >
      <div id="dialog_img_box"><img id="dialog_img" :src="imgSrc" class="dialogimg" @load="imgLoad"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      isLookBigImg: false, // 是否查看大场景
      currentObjects: [], // 当前查看大图的违法行为列表
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
    imgLoad(e) {
      if (this.isLookBigImg) {
        this.currentObjects.forEach((item) => {
          const { naturalWidth, clientWidth } = e.path[0]
          const proportion = (naturalWidth / clientWidth).toFixed(2)
          const boxWidth = item.bottom - item.top
          const boxheight = item.right - item.left
          const div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.left = (item.left / proportion).toFixed(2) + 'px'
          div.style.top = (item.top / proportion).toFixed(2) + 'px'
          div.style.width = (boxWidth / proportion).toFixed(2) + 'px'
          div.style.height = (boxheight / proportion).toFixed(2) + 'px'
          div.style.border = '2px solid #f00'
          document.querySelector('#dialog_img_box').appendChild(div)
        })
      }
    },
    viewImage(row, type) {
      if (type === 'big') {
        this.imgSrc = `${apiDomain}/static/${row.filename}`
        this.isLookBigImg = true
        this.currentObjects = row.objects
      } else {
        this.imgSrc = `${apiDomain}/static/${row.smallvideo}`
        this.isLookBigImg = false
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
<style scoped lang="scss">
#dialog_img_box {
  position: relative;
  overflow: hidden;
}

.dialogimg {
  max-width: 1000px;
}
.pagination {
  margin-top: 20px;
}
</style>
