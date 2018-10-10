<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>完整性检查管理</h4></el-col>
      <el-col :span="6"><el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加完整性检查管理信息</el-button></el-col>
    </el-row>

    <el-row class="search">
      <el-col :span="7"><el-input placeholder="部门名称" clearable v-model="condition.orderCode"></el-input></el-col>
      <el-col :span="7"><el-input placeholder="所属机构名" clearable v-model="condition.customerPhone"></el-input></el-col>
      <el-col :span="7"><el-input placeholder="部门类型" clearable v-model="condition.status"></el-input></el-col>
      <el-col :span="3">
        <el-button type="success" plain>搜索</el-button>
        <el-button type="danger" plain :disabled="!condition.orderCode && !condition.customerPhone && !condition.address && !condition.status" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="completeCheckProfile" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" label="部门名称" prop="departmentName"></el-table-column>
      <el-table-column align="left" label="订单抬头，订单行项" prop="type"></el-table-column>
      <el-table-column align="left" label="简介" prop="text"></el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

    export default {
        name: "completeCheckProfile-manager",
        data () {
          return {
            condition: {
              orderCode: '',
              customerPhone: '',
              address: '',
              status: ''
            },
            completeCheckProfile: [
              {id: 'a1874019y0h9u867q7913tg1jh09yq192344', departmentName: '脑科', organizationName: '大唐第一人民医院', type: '医院',text: '大唐第一人民医院脑科，是大唐最好的脑科'}
            ],
            addOne: false,
            delivery: {}
          }
        },
        mounted () {
          this.getInfo();
        },
        methods: {
          getInfo() {
            // const url = `${conf.url}/doctor/create`;
            // ax.get(url, this.header).then(res => {
            //   console.log(res);
            //   this.doctorList = res.data.content;
            // }).catch(err => {
            //   console.log(err);
            //   this.$message({
            //     message: '',
            //     type: 'danger'
            //   });
            // })
          },
          resetCondition () {
            this.condition = {
              orderCode: '',
              customerPhone: '',
              address: '',
              status: ''
            }
          },

          goToDetail (type, id) {
            this.$router.push({
              path: '/completeCheckProfile-manager/detail',
              query: {
                type: type,
                id: id
              }
            });
          },

          deleteRow (row) {
            console.log(1)
          }

        }
    }
</script>


<style scoped>
  .el-row.header{
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #409EFF;
  }
  .el-row.header>.el-col:first-child{
    text-align: left;
  }
  .el-row.header>.el-col:last-child {
    text-align: right;
  }

  .el-row.search{
    height: 50px;
    line-height: 50px;
  }
  .el-row.search>.el-col{
    padding: 0 10px;
    text-align: left;
  }

  .el-form{
    width: 70%;
    margin: 0 auto;
  }
  .el-select{
    width: 100%;
  }
  .el-dialog .el-form-item{
    text-align: left;
  }


</style>
