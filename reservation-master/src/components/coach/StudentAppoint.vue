<template>
  <el-card style="height: 100%">
    <!-- 1.面包屑 -->
    <MyBread url="coach" level1="学员预约情况"/>
    <!-- 按钮--筛选 -->
    <el-button
      type="primary"
      @click="showAllRecord()"
      style="margin-top: 20px"
    >显示所有预约记录
    </el-button>
    <el-button
      type="primary"
      @click="showTodayRecord()"
      style="margin-top: 20px"
    >显示今天预约记录
    </el-button>
    <el-button
      type="primary"
      @click="showTomorrowRecord()"
      style="margin-top: 20px"
    >显示明天预约记录
    </el-button>
    <!-- 2.表格 -->
    <el-table
      :data="FilterStudentAppointList"
      style="width: 100%; margin-top: 15px;"
      max-height="800"
    >
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column
        prop="identify"
        label="身份证号"
        width="230"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="select_date"
        label="预约日期"
        width="130"
        sortable
      ></el-table-column>
      <el-table-column
        prop="select_interval_time"
        label="预约时间段"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="submit_time"
        label="提交预约时间"
        width="240"
        sortable
      ></el-table-column>
      <el-table-column
        prop="confirm_time"
        label="确认预约时间"
        width="240"
      ></el-table-column>
      <el-table-column label="是否确认预约" width="170">
        <template slot-scope="scoped">
          <el-switch
            v-model="scoped.row.issure"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
            disabled
            class="switch"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            type="primary"
            size="mini"
            round
            @click="confirmAppoint(scoped.row)"
          >确认预约
          </el-button>
          <el-button
            type="danger"
            size="mini"
            round
            @click="deleteAppoint(scoped.row)"
          >删除预约
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import axios from '../../api/axios';

export default {
  name: 'StudentAppoint',
  data() {
    return {
      StudentAppointList: [], // 学员预约数据
      FilterStudentAppointList: [], // 过滤学员预约数据
      Counter: {}, // 预约计数
      number_limit: '',
    };
  },
  methods: {
    // 确认预约
    async confirmAppoint(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('确认预约');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      // 判断是否已经确认预约，若已确认弹出及警告
      if (!row.issure) {
        this.$confirm('是否确认预约', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        })
          .then(async () => {
            // 判断预约的时间是否过去 -- 今天之前的日期
            if (new Date(row.select_date).getTime() <= Date.now()) {
              this.$message.warning('该时间预约已经过去，不可确认');
              return false;
            }
            // 判断各时间段人数是否达到上限
            if (
              this.Counter[row.select_date][row.select_interval_time]
              >= this.number_limit
            ) {
              this.$message.warning('该时间段预约人数已达到上线');
              return false;
            }
            // 确认并修改数据库数据
            row.issure = 1;
            row.confirm_time = new Date().toLocaleString();
            const { state, message } = await axios.sendRequest({
              url: '/reverse/update',
              method: 'POST',
              data: {
                id: row.id,
                confirm_time: row.confirm_time,
                issure: row.issure,
              },
            });
            if (state !== 0) {
              this.$message.error(message);
            } else {
              row.issure = true;
              this.Counter[row.select_date][row.select_interval_time]++;
              this.$message.success(message);
            }
          })
          .catch(() => {
            this.$message.info('已取消确认');
          });
      } else {
        this.$message.warning('已确认预约，不可再次确认');
      }
    },
    // 删除预约
    async deleteAppoint(row) {
      const { state: status, message: msg } = await this.SecondaryAuthorityJudgment('删除预约');
      if (status !== 0) {
        this.$message.warning(msg);
        return;
      }
      this.$confirm('是否删除该预约', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
      })
        .then(async () => {
          const { state, message } = await axios.sendRequest({
            url: `/reverse/del/${row.id}`,
            method: 'POST',
          });
          if (state !== 0) {
            this.$message.error(message);
          } else {
            // 判断删除的数据是否已经确认预约，若已确认预约，该时间段人数减1
            if (row.issure) {
              this.Counter[row.select_date][row.select_interval_time]--;
            }
            this.$message.success(message);
            // 重新获取数据
            await this.getStudentAppoint();
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    // 完成计数功能
    handleCounting(array) {
      // 获取不同日期
      const DateCountSet = new Set();
      array.forEach((element) => {
        // 只保存今天及之后日期
        DateCountSet.add(element.select_date);
      });
      // 根据不同日期创建对象
      const IntervalCountSet = new Set();
      DateCountSet.forEach((element) => {
        this.Counter[element] = {};
        array.forEach((ele) => {
          if (ele.select_date === element) {
            IntervalCountSet.add(ele.select_interval_time);
            this.Counter[element][ele.select_interval_time] = 0;
          }
        });
      });
      // 完成不同日期不同时间段【确认预约人数】功能
      array.forEach((element) => {
        if (element.issure) {
          this.Counter[element.select_date][element.select_interval_time]++;
        }
      });
    },
    // 显示今天预约记录
    showTodayRecord() {
      this.FilterStudentAppointList = this.StudentAppointList.filter(
        (element) => {
          const date = new Date(element.select_date);
          return (
            Date.now() - 3600 * 1000 * 24 < date.getTime()
            && date.getTime() < Date.now()
          );
        },
      );
    },
    // 显示明天预约记录
    showTomorrowRecord() {
      this.FilterStudentAppointList = this.StudentAppointList.filter(
        (element) => {
          const date = new Date(element.select_date);
          return (
            Date.now() < date.getTime()
            && date.getTime() < Date.now() + 3600 * 1000 * 24
          );
        },
      );
    },
    // 显示所有记录
    showAllRecord() {
      this.FilterStudentAppointList = this.StudentAppointList;
    },
    // 获取学员预约数据
    async getStudentAppoint() {
      const { data: { data, number_limit } } = await axios.sendRequest({
        url: '/coach/list/reverse',
      });
      data.forEach((item) => {
        item.select_date = new Date(item.select_date).toLocaleDateString('fr-CA');
        item.submit_time = new Date(item.submit_time).toLocaleString();
        if (item.confirm_time) {
          item.confirm_time = new Date(item.confirm_time).toLocaleString();
        }
        item.issure = Boolean(item.issure);
      });
      this.FilterStudentAppointList = this.StudentAppointList = data;
      this.number_limit = number_limit;
      return data;
    },
  },
  async mounted() {
    const data = await this.getStudentAppoint();
    this.handleCounting(
      // 只对今天以及今天之后的日期进行计数
      data.filter((element) => (
        new Date(element.select_date).getTime()
        >= Date.now() - 3600 * 1000 * 24
      )),
    );
  },
};
</script>
