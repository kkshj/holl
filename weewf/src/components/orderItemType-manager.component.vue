<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>订单类型管理</h4></el-col>
      <el-col :span="6">
        <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单类型</el-button>
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="7">
        <!--<el-input placeholder="订单类型名称（请输入关键字）" clearable v-model="condition.orderCode"></el-input>-->
        <el-select
          v-model="condition.text"
          filterable
          remote
          placeholder="订单类型名称（请输入关键字）"
          :remote-method="remoteOrderTypeNameMethod">
          <el-option
            v-for="item in orderTypeNameOptions"
            :key="item.text"
            :label="item.text"
            :value="item.text">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.text" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="orderTypelist"  v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="code" label="订单类型编码"></el-table-column>
      <el-table-column align="left" prop="text" label="订单类型简介"></el-table-column>
      <el-table-column align="left" prop="scene" label="销售、合同、服务"></el-table-column>
      <el-table-column align="left" prop="orderCreateRule" label="订单创建规则"></el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--layout代表组件布局，子组件名用逗号分隔
        属性： total代表总条目数
        事件： current-change用于监听页数改变，而内容也发生改变-->
    <div class="block">
      <br>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="getInfo">
      </el-pagination>

    </div>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "doctor-manager",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        orderTypeNameOptions:[],
        condition: {
          orderCode: ''
        },
        orderTypelist: [],
        addOne: false,
        delivery: {}
      }
    },
    activated () {
      this.loading = true;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);//页面默认加载首页
    },
    methods: {
      getInfo(currentPage) {
        let url = `${conf.url}/internethospital/api/order-types?page-index=`+currentPage+`&page-size=10`;
        if(this.condition.text){
          url = `${url}&name=${this.condition.text}`;
        }
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          this.orderTypelist = res.data.content;
          this.total = res.data.totalElements;/*设置总条数*/
          this.loading = false;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      resetCondition () {
        this.condition = {
          orderCode: ''
        }
      },
      goToDetail (type,id) {
        console.log(id)
        this.$router.push({
          path: '/orderType/detail',
          query: {
            type: type,
            id: id
          }
        });
      },
      deleteRow (row) {
        console.log('删除订单类型',row.id);
        this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /*到后台执行删除操作*/
          const url = `${conf.url}/internethospital/api/order-types/`+row.id;
          ax.delete(url,this.header).then(res => {
            this.$message({
              /*删除成功返回成功信息*/
              message:'删除成功',
              type: 'success'
            })
            this.currentPage = 1;
            this.getInfo(this.currentPage)
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }).catch(err =>{
          this.$message.error('取消删除')
        })
      },
      remoteOrderTypeNameMethod(str){//模糊查询订单名称
        if(str){
          const url = `${conf.url}/internethospital/api/order-types?page-index=1&page-size=10&name=${str}`;
          ax.get(url, this.header).then(res => {
            this.orderTypeNameOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }

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
