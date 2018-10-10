<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>产品管理</h4></el-col>
      <el-col :span="6"><el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加产品信息</el-button></el-col>
    </el-row>
    <el-table :data=" productlist" stripe v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="orderItemTypeText" label="订单行项目类型"></el-table-column>
      <el-table-column align="left" prop="text" label="文本描述"></el-table-column>
      <el-table-column align="left" prop="manufacturer" label="生存厂家"></el-table-column>
      <el-table-column align="left" prop="standard" label="规格"></el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "doctor-manager",
    data() {
      return {
        header: '',
        loading: false,
        productlist:[],
      }
    },
    activated() {  // 当页面激活时调用
      const token = sessionStorage.getItem('token');
      console.log(token)
      this.header = {headers: {'Authorization': 'Bearer ' + token}};
      this.getInfo(1);
    },
    methods: {
      //初始化数据
      getInfo(page) {
        const url = `${conf.url}/internethospital/api/products?page-index=${page}&page-size=10`;
        ax.get(url, this.header).then(res => {
          this. productlist = res.data.content
          console.log(res)

        }).catch(err => {
          console.log(err);
         this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
   /*   create() {
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
      },*/
      deleteRow(id) {
        const url = `${conf.url}/internethospital/api/products/${id}`;
        ax.delete(url, this.header).then(res => {
          console.log(res);
          this.getInfo(1)
        }).catch(err => {
          console.log(err);
//         this.$message({
//            type: 'warning',
//            message: err.response.data.message
//          });
        })
      },
      goToDetail(type, id,) {
        this.$router.push({
          path: '/product-manager/detail',
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
