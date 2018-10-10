<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>定价过程管理</h4></el-col>
      <el-col :span="6"><el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加定价过程</el-button></el-col>
    </el-row>

    <el-table :data="priceprocedurelist" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" label="定价id" prop="id"></el-table-column>
      <el-table-column align="left" label="编码" prop="code"></el-table-column>
      <el-table-column align="left" label="文本描述" prop="text"></el-table-column>
      <el-table-column align="left" label="详细介绍" prop="longText"></el-table-column>

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
    name: "price-procedures-manager",
    data () {
      return {
        priceprocedurelist: [],
        addOne: false,
        delivery: {},

        dialogVisible: false,
        doctorList: [],
        addOne: false,
        delivery: {},



      }



    },
    mounted () {
      this.getInfo();
    },
    // activated () {  // 当页面激活时调用
    //   const token = sessionStorage.getItem('token');
    //   this.header = {headers: {'Authorization': 'Bearer '+token}};
    //   this.getInfo();
    // },


    methods: {
      getInfo(){
        const url = `${conf.url}/internethospital/api/price-procedures?page-index=1&page-size=10`;
        ax.get(url, this.header).then(res => {
          this.priceprocedurelist = res.data.content;
          console.log('this.priceprocedurelist:',this.priceprocedurelist);
        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },

      create() {
        const url = `${conf.url}/internethospital/api/product`;
        const body = {
          "id": "string",
          "longText": "string",
          "manufacturer": "string",
          "name": "string",
          "orderItemTypeId": "string",
          "standard": "string",
          "text": "string"
        };
        ax.post(url, body, this.header).then(res => {
          console.log(res);
          this.getInfo(1)
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      update() {
        const url = `${conf.url}/internethospital/api/product/${id}`;
        const body = {
          "id": "string",
          "longText": "string",
          "manufacturer": "string",
          "name": "string",
          "orderItemTypeId": "string",
          "standard": "string",
          "text": "string"
        };
        ax.put(url, body, this.header).then(res => {
          console.log(res);
          this.getInfo(1)
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      deleteRow(id) {
        const url = `${conf.url}/internethospital/api/product?id=${id}`;
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
      check(id){
        const url = `${conf.url}/internethospital/api/product?id=${id}`;
        ax.get(url, this.header).then(res => {
          connsole.log(res)
          this.produclist = res;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      goToDetail (type, id) {
        this.$router.push({
          path: '/price-procedures-manager/detail',
          query: {
            type: type,
            id: id
          }
        });
      },
      cancel() {

      }
    },
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
