<template>
    <div>
      <el-row class="header">
        <el-col :span="18"><h4>用户定价过程管理</h4></el-col>
        <el-col :span="6">
          <el-button type="primary" plain icon="el-icon-plus" @click="Downloadcode('', '')">下载医生二维码</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加用户定价过程</el-button>
        </el-col>
      </el-row>

      <el-table :data="doctorList" style="width: 100%">
        <el-table-column align="left" type="index"></el-table-column>
        <el-table-column align="left" label="id" prop="id"></el-table-column>
        <el-table-column align="left" label="code" prop="code"></el-table-column>
        <el-table-column align="left" label="名称" prop="text"></el-table-column>
        <el-table-column align="left" label="详细介绍" prop="longText"></el-table-column>

        <el-table-column align="left" label="操作" width="380">
          <template slot-scope="scope">
            <el-button size="mini"  type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
            <el-button size="mini"  type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
            <el-button size="mini"  type="danger" plain @click="deleteRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next"
        :current-page="currentPage"
        :total="listCount"
        @current-change="changePage">
      </el-pagination>

    </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
    export default {
      name: "user-price-procedures-manager",
      data () {
        return {

          dialogVisible: false,

          condition: {
            orderCode: '',
            customerPhone: '',
            address: '',
            status: ''
          },
          listCount: 0,
          doctorList: [],
          addOne: false,
          delivery: {},

          currentPage: 1,
          p: {
            contactPhone: ''
          },

        }
      },

      mounted () {
        this.getInfo(1);
      },

      methods: {
        getInfo(page){
          const url = `${conf.url}/internethospital/api/user-price-procedures?page-index=${page}&page-size=10`;
          ax.get(url, this.header).then(res => {
            console.log("-------",res);
            this.doctorList = res.data.content;
            this.listCount = res.data.totalElements;
          }).catch(err => {
            console.log(err);
            this.$message({
              message: '',
              type: 'danger'
            });
          })
        },

        handleClose(done) {
          this.$confirm('确认取消？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
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
          console.log('请求医生Manager详情getInfo:',id);
          this.$router.push({
            path: '/user-price-procedures-manager/detail',
            query: {
              type: type,
              id: id
            }
          });
        },
        downloadDoctor(){


        },
        Downloadcode (){
          const url = `${conf.url}/internethospital/api/doctors/action/download-micro-app-qrcode?page-index=1&page-size=10`;
          ax.post(url, this.header).then(res => {
            console.log('sssssssssss:',res);
            // this.hospitalListInfo = res.data.content;
            // this.listCount = res.data.totalElements;
          }).catch(err => {
            console.log(err);
            this.$message({
              message: '',
              type: 'danger'
            });
          })
        },

        deleteRow (row) {
          const url = `${conf.url}/internethospital/api/doctors/${row.doctorId}`;
          ax.delete(url, this.header).then(res => {
            console.log(res);
            this.getInfo()
          }).catch(err => {
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        },

        changePage (p) {
          this.getInfo(p);
          this.currentPage = p;
        },



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
