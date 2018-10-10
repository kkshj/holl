<template>
  <div>
    <el-row class="header">

      <el-col :span="18"><h4>订单行项目类别管理</h4></el-col>
      <el-col :span="6">
        <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单行项目类别信息</el-button>
      </el-col>
    </el-row>

    <el-row class="search">
      <el-col :span="10">
        <!--<el-input placeholder="订单类型名称（请输入关键字）" clearable v-model="condition.orderCode"></el-input>-->
        <el-select
          v-model="condition.text"
          filterable
          remote
          placeholder="订单类型名称（请输入关键字）"
          :remote-method="remoteOrderItemTypeMethod">
          <el-option
            v-for="item in orderItemTypeOptions"
            :key="item.text"
            :label="item.text"
            :value="item.text">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-select
          v-model="condition.code"
          filterable
          remote
          placeholder="请输入编码"
          :remote-method="remoteCodeMethod">
          <el-option
            v-for="item in codeOptions"
            :key="item.code"
            :label="item.code"
            :value="item.code">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.text&&!condition.code" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>

    <el-table :data="orderItemTypeList" v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" label="订单行项目类别名称" prop="text"></el-table-column>
      <el-table-column align="left" label="编码" prop="code"></el-table-column>
      <!--<el-table-column align="left" label="文本描述" prop="text"></el-table-column>-->
      <!--<el-table-column align="left" label="完整性检查id" prop="completeCheckProfileId"></el-table-column>-->
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
    name: "orderItemType-manager",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        orderItemTypeList: [],
        addOne: false,
        condition: {
          text: '',
          code:''
        },
        orderItemTypeOptions:[],
        codeOptions:[]
      }
    },
    /*页面加载调用该方法*/
    activated () {
      this.loading = true;
      this.condition.text = null;
      this.condition.code = null;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);//页面默认加载首页
      this.condition = {}
    },
    methods: {
      /*getinfo实行分页加载数据*/
      getInfo(currentPage) {
        /*加载订单行类型数据*/
        let url = `${conf.url}/internethospital/api/order-item-types?page-index=${currentPage}&page-size=10`;
        if(this.condition.text){
          url = `${url}&name=${this.condition.text}`;
        }
        if(this.condition.code){
          url = `${url}&code=${this.condition.code}`;
        }
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          this.orderItemTypeList = res.data.content;
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
      resetCondition(){
        this.condition={
          text: '',
          code:''
        }
      },
      /*
      goToDetail：RU
      type：传入类型，id：获取到该条数据的id
      */
      goToDetail (type, id) {
        this.$router.push({
          path: '/order-item-type-manager/detail',
          query: {
            type: type,
            id: id
          }
        });
      },
      /*删除订单行类型数据*/
      deleteRow (row) {
        //console.log('删除订单行项目类型',row.id);
        this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /*到后台执行删除操作*/
          const url = `${conf.url}/internethospital/api/order-item-types/`+row.id;
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
      remoteOrderItemTypeMethod(str){
        if(str){
          const url = `${conf.url}/internethospital/api/order-item-types?page-index=1&page-size=10&name=${str}`;
          ax.get(url, this.header).then(res => {
            this.orderItemTypeOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },
      remoteCodeMethod(str){
        if(str){
          const url = `${conf.url}/internethospital/api/order-item-types?page-index=1&page-size=10&code=${str}`;
          ax.get(url, this.header).then(res => {
            this.codeOptions = res.data.content;
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
