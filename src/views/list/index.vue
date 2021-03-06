<template>
  <div class="app-container">
    <div>
      <el-checkbox
        v-model="autoRefresh"
        label="启用自动刷新"
        border
        @change="autoRefreshChange"
      />
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      height="calc(100vh - 200px)"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="code" label="车牌号" width="200" />
      <el-table-column prop="illegal" label="违法行为" width="200">
        <template slot-scope="scope">
          <div>{{ renderIllegal(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="违法地点" />
      <el-table-column prop="time" label="采集时间" width="180" />
      <el-table-column prop="filename" label="一般场景" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="viewImage(scope.row, 'big')"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="smallvideo" label="小场景" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="viewImage(scope.row, 'small')"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="1040px"
    >
      <div id="dialog_img_box" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
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
      dialogVisible: false,
      listLoading: true,
      autoRefresh: true, // 自动刷新
      tableData: [],
      colorMap: {
        person: '#4C10AE',
        motorbike: '#f00',
        bicycle: '#00B554',
        head: '#FFA100',
        helmet: '#3914AF',
        umbrella: '#F3FC00'
      }
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
  methods: {
    renderIllegal(rowData) {
      const objects = rowData.objects || []
      const illegalType = {
        redline: '闯红灯',
        overline: '越线',
        wrongway: '逆行',
        doubleman: '一车多人',
        nohelmet: '无头盔',
        umbrella: '安装伞具'
      }
      const arrarText = []
      objects.forEach(item => {
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
      
      console.log(row)
      if (type === 'big') {
        this.isLookBigImg = true
        const { colorMap } = this
        setTimeout(() => {
          (row.objects || []).forEach((item) => {
            if (item.file) {
              const divbox = document.createElement('div')
              divbox.style.position = 'relative'
              const img = document.createElement('img')
              img.src = `${apiDomain}/static/tmpfs/${item.file}`
              img.style.width = '1000px'
              img.onload = e => {
                const { naturalWidth, clientWidth } = e.path[0]
                const proportion = (naturalWidth / clientWidth).toFixed(2)
                if (item.unit) {
                  (item.unit || []).forEach(item => {
                    const boxWidth = item.right - item.left
                    const boxheight = item.bottom - item.top
                    const div = document.createElement('div')
                    // div.setAttribute('class', 'bigImgredBox')
                    div.style.position = 'absolute'
                    div.style.left = (item.left / proportion).toFixed(2) + 'px'
                    div.style.top = (item.top / proportion).toFixed(2) + 'px'
                    div.style.width = (boxWidth / proportion).toFixed(2) + 'px'
                    div.style.height = (boxheight / proportion).toFixed(2) + 'px'
                    div.style.border = `2px solid ${colorMap[item.name] || '#f00'}`
                    divbox.appendChild(div)
                  })
                }
                // 画 红灯线 停车线 红绿灯
                const { overline, red_line_confirm, redline, signal_left, signal_right, signal_top, signal_bottom } = row
                if (overline) {
                  const div = document.createElement('div')
                  div.style.position = 'absolute'
                  div.style.left = '0px'
                  div.style.top = (overline / proportion).toFixed(2) + 'px'
                  div.style.width = '100%'
                  div.style.height = '6px'
                  div.style.backgroundColor = '#003366'
                  divbox.appendChild(div)
                }
                if (red_line_confirm) {
                  const div = document.createElement('div')
                  div.style.position = 'absolute'
                  div.style.left = '0px'
                  div.style.top = (red_line_confirm / proportion).toFixed(2) + 'px'
                  div.style.width = '100%'
                  div.style.height = '6px'
                  div.style.backgroundColor = '#003366'
                  divbox.appendChild(div)
                }
                if (redline) {
                  const div = document.createElement('div')
                  div.style.position = 'absolute'
                  div.style.left = '0px'
                  div.style.top = (redline / proportion).toFixed(2) + 'px'
                  div.style.width = '100%'
                  div.style.height = '6px'
                  div.style.backgroundColor = '#003366'
                  divbox.appendChild(div)
                }
                if (signal_left) {
                  const boxWidth = signal_right - signal_left
                  const boxheight = signal_bottom - signal_top
                  const div = document.createElement('div')
                  div.style.position = 'absolute'
                  div.style.left = (signal_left / proportion).toFixed(2) + 'px'
                  div.style.top = (signal_top / proportion).toFixed(2) + 'px'
                  div.style.width = (boxWidth / proportion).toFixed(2) + 'px'
                  div.style.height = (boxheight / proportion).toFixed(2) + 'px'
                  div.style.border = `2px solid #003366`
                  divbox.appendChild(div)
                }
              }
              divbox.appendChild(img)
              document.querySelector('#dialog_img_box').appendChild(divbox)
            }
          })
        }, 100)
      } else {
        this.isLookBigImg = false
        setTimeout(() => {
          (row.objects || []).forEach((item) => {
            if (item.small_file) {
              const img = document.createElement('img')
              img.src = `${apiDomain}/static/tmpfs/${item.small_file}`
              img.style.width = '1000px'
              document.querySelector('#dialog_img_box').appendChild(img)
            }
          })
        }, 100)
      }
      this.dialogVisible = true
    },
    fetchData() {
      this.listLoading = false
      axios
        .post('/list_pic')
        .then(res => {
          this.listLoading = false
          this.tableData = res.data
        })
        .catch(a => {
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
// #dialog_img_box {}
</style>
