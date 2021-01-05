<template>
  <div class="cam-wrap">
    <el-button type="primary" @click="dialogFormBig()">红灯</el-button>

    <el-button class="test_btn" type="primary" @click="dialogFormMiddle()"
      >头盔</el-button
    >
    <el-button class="test_btn" type="primary" @click="dialogFormSmall()"
      >车牌</el-button
    >
    <!--表格-->
    <el-table :data="tableData" height="480" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="cam_type" label="类型" width="180">
      </el-table-column>
      <el-table-column prop="location" label="路口方位" width="180">
      </el-table-column>
      <el-table-column prop="id" label="路口方位编码(英文)"> </el-table-column>
      <el-table-column prop="cam_name" label="摄像机RTSP名称">
      </el-table-column>
      <el-table-column prop="is_actual_stop" label="摄像机状态">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="clickDetails(tableData[scope.$index])"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--弹框-->
    <el-dialog title="摄像机" :visible.sync="dialogFormVisible" width="1000px">
      <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="路口方位" prop="location">
              <el-input v-model="form.location" maxlength="50" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="路口方位编码(英文)" prop="id">
              <el-input v-model="form.id" maxlength="50" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="big_sxj">
          <el-col :span="12">
            <el-form-item label="大摄像机 RTSP名称" prop="cam_name">
              <el-input v-model="form.big_cam_name" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-button
              type="primary"
              plain
              class="test_btn"
              :loading="test_cam_loading"
              @click="showDialog(form.big_cam_name)"
              >测试摄像机</el-button
            >
            <el-button
              v-if="colorVisible"
              type="primary"
              plain
              class="test_btn"
              :loading="test_cam_loading"
              @click="showSetRedLightModal(form.big_cam_name)"
              >画线设置</el-button
            >
          </el-col>
        </el-row>

        <el-row v-if="middle_sxj">
          <el-col :span="12">
            <el-form-item label="中摄像机 RTSP名称" prop="cam_name">
              <el-input v-model="form.middle_cam_name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              plain
              class="test_btn"
              :loading="test_cam_loading"
              @click="showDialog(form.middle_cam_name)"
              >测试摄像机</el-button
            >
          </el-col>
        </el-row>

        <el-row v-if="small_sxj">
          <el-col :span="12">
            <el-form-item label="小摄像机 RTSP名称" prop="cam_name">
              <el-input v-model="form.small_cam_name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              plain
              class="test_btn"
              :loading="test_cam_loading"
              @click="showDialog(form.small_cam_name)"
              >测试摄像机</el-button
            >
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="交通灯颜色"
              prop="signal_color"
              v-if="colorVisible"
            >
              <el-select v-model="signal_color" multiple placeholder="请选择">
                <el-option
                  v-for="item in signal_color_array"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <!-- <el-button
          type="primary"
          :loading="saveLoading"
          @click="onSubmit"
        >保存</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <!--测试图片弹框-->
    <el-dialog
      title="测试照片"
      :visible.sync="dialogVisible"
      width="1040px"
      @closed="handleClose"
    >
      <div class="dialogimgBox">
        <img width="1000" :src="imgSrc" class="dialogimg" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!--画线弹框-->
    <el-dialog
      class="red-light-dialog"
      title="设置红灯"
      :visible.sync="redLightVisible"
      :close-on-click-modal="false"
      width="1020px"
    >
      <SetRedLight ref="setRedLightRef" :img-url="imgUrl" :img-data="imgData" />
      <span slot="footer">
        <el-button @click="redLightVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSetRedLight">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { axios } from "@/utils/request";
import { apiDomain } from "@/utils/config";
import SetRedLight from "@/components/SetRedLight"; // 引进画线组件
export default {
  components: {
    SetRedLight,
  },
  data() {
    const validateInput = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (value === 0) {
        callback();
      } else {
        if (value) {
          callback();
        } else {
          callback(new Error("请输入必填项"));
        }
      }
    };
    const validateId = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (/^[A-Za-z0-9_]{1,50}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入英文和数字"));
      }
    };

    const validateColor = (rule, value, callback) => {
      /* eslint-disable eqeqeq */
      if (this.signal_color.length > 0) {
        callback();
      } else {
        callback(new Error("请输入必填项"));
      }
    };

    return {
      big_sxj: true,
      middle_sxj: true,
      small_sxj: true,
      tableData: [
        {
          cam_type: "",
          location: "",
          id: "",
        },
      ],

      formLabelWidth: "160px",
      dialogFormVisible: false,

      formRules: {
        big_cam_name: [
          { required: true, trigger: "blur", validator: validateInput },
        ],
        middle_cam_name: [
          { required: true, trigger: "blur", validator: validateInput },
        ],
        detect_interval: [
          { required: true, trigger: "blur", validator: validateInput },
        ],
        location: [
          { required: true, trigger: "blur", validator: validateInput },
        ],
        id: [{ required: true, trigger: "blur", validator: validateId }],
        small_cam_name: [
          { required: true, trigger: "blur", validator: validateInput },
        ],
        signal_color: [
          { required: true, trigger: "blur", validator: validateColor },
        ],
      },
      colorVisible: true,
      saveLoading: false,
      dialogVisible: false,
      imgSrc: "", // 测试相机返回的图片地址
      test_cam_loading: false,
      signal_color_array: [
        {
          value: 1,
          label: "红色",
        },
        {
          value: 2,
          label: "橙色",
        },
        {
          value: 4,
          label: "黄色",
        },
        {
          value: 8,
          label: "绿色",
        },
        {
          value: 16,
          label: "青色",
        },
        {
          value: 32,
          label: "蓝色",
        },
        {
          value: 64,
          label: "紫色",
        },
        {
          value: 128,
          label: "黑色",
        },
      ],
      imgUrl: "", // 测试相机返回的图片地址 用来画线
      redLightVisible: false, // 设置红灯弹窗visible
      redLightResult: {}, // 画线返回的结果
      positionNumber: 0, // 四个路口方位 1 - 4
      signal_color: [], // 交通灯颜色
      form: {
        location: "",
        id: "",
        big_cam_name: "",
        cam_name: "",
        small_cam_name: "",
        middle_cam_name: "",
      },
      imgData: "", // 传给子组件的值
      itemData: null, // 画线数据的值
    };
  },
  created() {
    this.getData(); // 进入网页获取表格数据
  },
  methods: {
    getData() {
      axios
        .get("/list_cam")
        .then((res) => {
          this.tableData = res.data.map((i) => {
            if (i.is_actual_stop === false) {
              i.is_actual_stop = "启动";
            } else {
              i.is_actual_stop = "关闭";
            }

            if (i.cam_type === 0) {
              i.cam_type = "中摄像机";
            } else if (i.cam_type === 1) {
              i.cam_type = "大摄像机";
            } else {
              i.cam_type = "小摄像机";
            }
            return i;
          }); // 返回摄像机状态和摄像机类型
        })
        .catch((a) => {});
    }, // 从后端获取表格数据
    clickDetails(item) {
      // console.log(item);
      this.itemData = item;
      // console.log(this.itemData)
      this.dialogFormVisible = true;

      this.form.location = item.location;
      this.form.id = item.id; // 表格的数据展示在点击详情后弹出的对话框内 （方位和方位编码）

      if (item.cam_type === "大摄像机") {
        this.middle_sxj = false; // 中场景摄像机输入框
        this.small_sxj = false; // 小场景摄像机输入框
        this.big_sxj = true; // 大场景摄像机输入框
        this.colorVisible = true; // 颜色选择框

        this.form.big_cam_name = item.cam_name; // 传给后台的参数是can_name

        // console.log(Object.assign(item.signal_color));
        // 获取默认选中的红绿灯颜色
        const arr = [128, 64, 32, 16, 8, 4, 2, 1];
        function calcNumbers(num) {
          const numbers = [];
          for (const value of arr) {
            if ((num & value) == value) {
              numbers.push(value);
            }
          }
          return numbers;
        }
        this.signal_color = calcNumbers(item.signal_color); // 选择的红绿灯颜色解码
        // console.log(calcNumbers(item.signal_color))
      } else if (item.cam_type === "中摄像机") {
        this.big_sxj = false;
        this.small_sxj = false;
        this.middle_sxj = true;
        this.colorVisible = false;

        this.form.middle_cam_name = item.cam_name;
      } else {
        this.big_sxj = false;
        this.middle_sxj = false;
        this.small_sxj = true;
        this.colorVisible = false;
        this.form.small_cam_name = item.cam_name;
      }
    }, // 点击详情获取当前这一行的数据 展示在对话框内

    showSetRedLightModal(cam_name) {
      const testWidth = 1000;
      const testHeight = 565;

      const actualWidth = 2688;
      const actualHeight = 1520;

      // 画线设置
      console.log(this.itemData);

      this.test_cam_loading = true;

      axios
        .post("/test_pic", {
          cam_name,
        })
        .then((res) => {
          this.test_cam_loading = false;
          const imgSrc = `${apiDomain}/${res.data.filepath}`;
          this.imgUrl = imgSrc;
          this.redLightVisible = true;

          setTimeout(() => {
            var canvas6 = document.getElementById("red-img");
            var context6 = canvas6.getContext("2d");
            canvas6.width = document.getElementById("red-img").width;
            canvas6.height = document.getElementById("red-img").height;

            //  画停车线
            context6.beginPath();
            context6.moveTo(0, (this.itemData.overline / 1520) * 565);
            context6.lineTo(testWidth, (this.itemData.overline / 1520) * 565);
            context6.lineWidth = 3; //线条的宽度
            context6.strokeStyle = "red";
            context6.stroke();

            //  画红灯线
            context6.beginPath();
            context6.moveTo(0, (this.itemData.red_line / 1520) * 565);
            context6.lineTo(testWidth, (this.itemData.red_line / 1520) * 565);
            context6.lineWidth = 3; //线条的宽度
            context6.strokeStyle = "red";
            context6.stroke();

            //  画红灯框
            // var canvas7 = document.getElementById("red-img");
            // var context7 = canvas7.getContext("2d");
            // canvas7.width = document.getElementById("red-img").width;
            // canvas7.height = document.getElementById("red-img").height;
            context6.beginPath();
            // context7.fillStyle = "#fff";
            // context7.fillRect(this.itemData.signal_left/2688*565, 100, 100, 100);
            // context7.strokeStyle = "#fff";
            context6.fillStyle = "red";
            // context6.fillRect(10, 10, 100, 100);
            context6.strokeStyle = "red";
            context6.strokeRect((this.itemData.signal_left / 2688) * 1000,(this.itemData.signal_top / 1520) * 565, 6, 6);
               context6.stroke();
          }, 1000);
        })

        .catch((a) => {
          this.test_cam_loading = false;
          this.$message({
            message: "获取照片失败",
            type: "error",
          });
        });
    }, // 画线设置方法
    saveSetRedLight() {
      // 保存设置的交通灯颜色
      const ref = this.$refs.setRedLightRef;
      const {
        result: { stop, redStop, red },
      } = ref;

      if (Object.keys(stop).length === 0) {
        this.$message({
          type: "warning",
          message: "未画停车线",
        });
        return;
      }
      if (Object.keys(redStop).length === 0) {
        this.$message({
          type: "warning",
          message: "未画红灯线",
        });
        return;
      }
      if (Object.keys(red).length === 0) {
        this.$message({
          type: "warning",
          message: "未画红灯位置",
        });
        return;
      }
      this.redLightVisible = false;
      this.redLightResult = ref.result;
      // console.log('左边线坐标：', JSON.stringify(left))
      // console.log('右边线坐标：', JSON.stringify(right))
      // console.log('停车线坐标：', JSON.stringify(stop))
      // console.log('红灯线坐标：', JSON.stringify(redStop))
      // console.log('红灯坐标：', JSON.stringify(red))
    },
    getDefaultData() {
      // axios
      //   .post("/get_cam/" + this.positionNumber)
      //   .then((res) => {
      Object.assign(this.form, res.data);
      // 获取默认选中的红绿灯颜色
      const arr = [128, 64, 32, 16, 8, 4, 2, 1];
      function calcNumbers(num) {
        const numbers = [];
        for (const value of arr) {
          if ((num & value) == value) {
            numbers.push(value);
          }
        }
        return numbers;
      }
      this.signal_color = calcNumbers(res.data.signal_color);
      // this.form.big_cam_name = '/root/part2.avi'
      // })
      // .catch((a) => {
      //   this.$message({
      //     message: "获取摄像机设置服务异常",
      //     type: "error",
      //   });
      // });
    },
    showDialog(cam_name) {
      // 测试摄像机对话框
      if (!cam_name) {
        this.$message.error("请先输入相机名称");
        return;
      }
      this.test_cam_loading = true;
      axios
        .post("/test_pic", {
          cam_name,
        })
        .then((res) => {
          this.test_cam_loading = false;
          const imgSrc = `${apiDomain}/${res.data.filepath}`;
          Object.assign(this, {
            dialogVisible: true,
            imgSrc,
          });
          setTimeout(() => {
            for (let i = 1; i < 4; i++) {
              const div = document.createElement("div");
              div.className = "horizontal";
              div.style.top = res.data["horizontal" + i] + "%";
              document.querySelector(".dialogimgBox").appendChild(div);
            }
            for (let i = 1; i < 5; i++) {
              const div = document.createElement("div");
              div.className = "vertical";
              div.style.left = res.data["vertical" + i] + "%";
              document.querySelector(".dialogimgBox").appendChild(div);
            }
          }, 100);
        })
        .catch((a) => {
          this.test_cam_loading = false;
          this.$message({
            message: "获取照片失败",
            type: "error",
          });
        });
    }, // 测试摄像机方法
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          // 交通灯颜色值相加

          if (this.form.big_cam_name === "") {
            var reqData = {
              ...this.form,
            };
          } else {
            var colorSum = this.signal_color.reduce(function (
              prev,
              cur,
              index,
              arr
            ) {
              return prev + cur;
            });

            var reqData = {
              ...this.form,
              signal_color: colorSum,
            };
          }
          // 如果是大场景才会有交通灯颜色

          console.log(reqData);
          // 重新画线了
          if (Object.keys(this.redLightResult).length > 0) {
            const { stop, red, redStop } = this.redLightResult;
            // stop: 停车线
            // redStop: 红灯线
            // 计算方法：已知图中两点（x1, y1)(x2, y2) , left_slope = (x2 - x1) / (y2 - y1)
            // left_x = x1 - left_slope * y1
            // const left_slope = Number(
            //   (
            //     (left.end[0] - left.start[0]) /
            //     (left.end[1] - left.start[1])
            //   ).toFixed(2)
            // )
            // const right_slope = Number(
            //   (
            //     (right.end[0] - right.start[0]) /
            //     (right.end[1] - right.start[1])
            //   ).toFixed(2)
            // )
            Object.assign(reqData, {
              signal_left: Number(red.leftTop[0].toFixed(0)), // 红绿灯左上角X坐标
              signal_top: Number(red.leftTop[1].toFixed(0)), // 红绿灯左上角Y坐标
              signal_right: Number(red.rightBottom[0].toFixed(0)), // 红绿灯右下角X坐标
              signal_bottom: Number(red.rightBottom[1].toFixed(0)), // 红绿灯右下角Y坐标
              red_line: Number(redStop.start[1].toFixed(0)), // 红灯线起点Y坐标
              overline: Number(stop.start[1].toFixed(0)), // 停车线起点Y坐标
              // left_x: Number(
              //   (left.start[0] - left_slope * left.start[1]).toFixed(0)
              // ),
              // left_slope,
              // right_x: Number(
              //   (right.start[0] - right_slope * right.start[1]).toFixed(0)
              // ),
              // right_slope
            });
            // console.log(1);
          }
          //  console.log(reqData);
          axios
            .post("/add_cam", reqData)
            .then((res) => {
              this.saveLoading = false;
              this.$message({
                message: "设置成功",
                type: "success",
              });
              this.dialogFormVisible = false;

              // this.handleClose(); // 刷新页面方法
            })
            .catch((e) => {
              this.saveLoading = false;
              this.$message.error(e.response.data || "摄像机设置异常");
            });
        }
      });
    }, // 确定按钮方法
    handleClose() {
      location.reload();
    }, // 修复测试时摄像机图片 为浏览器缓存图片问题
    dialogFormBig() {
      this.middle_sxj = false;
      this.small_sxj = false;
      this.big_sxj = true;
      this.dialogFormVisible = true;
      this.colorVisible = true;
      this.form = {};
      this.signal_color = [];
    }, // 红灯按钮方法
    dialogFormMiddle() {
      this.middle_sxj = true;
      this.big_sxj = false;
      this.small_sxj = false;
      this.dialogFormVisible = true;
      this.colorVisible = false;
      this.form = {};
      this.signal_color = [];
    }, // 头盔按钮方法
    dialogFormSmall() {
      this.small_sxj = true;
      this.big_sxj = false;
      this.middle_sxj = false;
      this.dialogFormVisible = true;
      this.colorVisible = false;
      this.form = {};
      this.signal_color = [];
    }, // 车牌按钮方法
  },
};
</script>

<style lang="scss" scoped>
.cam-wrap {
  width: 100%;
  padding: 5%;
  .test_btn {
    margin-left: 15px;
  }
}
</style>