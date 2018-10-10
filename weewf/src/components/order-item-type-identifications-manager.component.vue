<template>
  <div>
    <el-row class="header">

      <el-col :span="18"><h4>订单行项目确认管理</h4></el-col>
      <el-col :span="6">
        <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单行项目确认信息</el-button>
      </el-col>
    </el-row>

    <el-table :data="OrderItemTypeIdentificationList" v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" label="订单类型" prop="orderTypeId"></el-table-column>
      <el-table-column align="left" label="订单行项目类型" prop="orderItemTypeId"></el-table-column>

      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
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
        :current-page.sync = "currentPage"
        @current-change="getInfo">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderItemTypeIdentification-manager",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        OrderItemTypeIdentificationList: [],
        addOne: false,
      }
    },
    /*页面加载调用该方法*/
    activated () {
      this.loading = true;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);//页面默认加载首页
    },
    methods: {
      /*getinfo实行分页加载数据*/
      getInfo(currentPage) {
        /*加载订单行项目确认 数据*/
        const url = `${conf.url}/internethospital/api/order-item-type-identifications?page-index=${currentPage}&page-size=10`;
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          let content = res.data.content
          for(let i in content) {
            const url = `${conf.url}/internethospital/api/order-types/${content[i].orderTypeId}`;
            ax.get(url, this.header).then(resOT => {
              content[i].orderTypeId = resOT.data.text;
              const orderItemTypeUrl = `${conf.url}/internethospital/api/order-item-types/` + content[i].orderItemTypeId;
              ax.get(orderItemTypeUrl, this.header).then(resOIT => {
                content[i].orderItemTypeId = resOIT.data.text;
                this.OrderItemTypeIdentificationList = content;
              })
            })
          }
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
      /*
      goToDetail：RU
      type：传入类型，id：获取到该条数据的id
      */
      goToDetail (type, id) {
        this.$router.push({
          path: '/order-item-type-identifications-manager/detail',
          query: {
            type: type,
            id: id
          }
        });
      },
      /*订单行项目确认-删除*/
      deleteRow (row) {
        //console.log('删除订单行项目确认',row.id);
        this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /*到后台执行删除操作*/
          const url = `${conf.url}/internethospital/api/order-item-type-identifications/`+row.id;
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
