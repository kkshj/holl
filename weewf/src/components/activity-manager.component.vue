<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>活动管理</h4></el-col>
      <el-col :span="6">
        <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">创建活动</el-button>
      </el-col>
    </el-row>
    <!--<el-row class="search">
      <el-col :span="7">
        &lt;!&ndash;<el-input placeholder="订单类型名称（请输入关键字）" clearable v-model="condition.orderCode"></el-input>&ndash;&gt;
        <el-select
          v-model="condition.code"
          filterable
          remote
          placeholder="请输入活动编码"
          :remote-method="remoteActivityCodeMethod">
          <el-option
            v-for="item in activityCodeOptions"
            :key="item.id"
            :label="item.code"
            :value="item.code">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="condition.status" placeholder="请选择活动状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.code&&!condition.status" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    -->
    <el-table :data="activityList"  v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="code" label="活动编码"></el-table-column>
      <el-table-column align="left" prop="text" label="活动名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" prop="longText" label="活动描述"></el-table-column>
      <!--<el-table-column align="left" prop="productText" label="产品文本"></el-table-column>-->
      <el-table-column align="left" prop="startTime" label="开始时间"></el-table-column>
      <el-table-column align="left" prop="endTime" label="结束时间"></el-table-column>
      <el-table-column align="left" prop="organizationName" label="所属医院"></el-table-column>
      <el-table-column align="left" prop="departmentName" label="所属科室"></el-table-column>
      <!--<el-table-column align="left" prop="doctorName" label="医生姓名"></el-table-column>
      <el-table-column align="left" prop="nurseName" label="护士姓名"></el-table-column>-->
      <el-table-column align="left" prop="status" label="活动状态"></el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.code)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.code, scope.row.id)">修改</el-button>
          <!--<el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>-->
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
        activityCodeOptions:[],
        condition: {
          code: '',
          status:''
        },
        activityList: [],
        addOne: false,
        statusOptions: [
          {value: 'CREATED', label: '已创建'},
          {value: 'START', label: '已开始'},
          {value: 'END', label: '已结束'}
        ]
      }
    },
    activated () {
      this.loading = true;
      this.condition.code = null;
      this.condition.status = null;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);//页面默认加载首页
      this.condition={}//切换菜单栏，搜索设置为空
    },
    methods: {
      getInfo(currentPage) {
        let url = `${conf.url}/internethospital/api/activities?page-index=`+currentPage+`&page-size=10`;
        /*if(this.condition.code){
          url = `${url}&code=${this.condition.code}`;
        }
        if(this.condition.status){
          url = `${url}&status=${this.condition.status}`;
        }*/
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          let content = res.data.content;
          for(let i in content){
            content[i].status ==='CREATED' ? content[i].status = '已创建': (content[i].status==='START'?content[i].status='已开始' :  content[i].status='已结束');
          }
          this.activityList = res.data.content;
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
      /*deleteRow (row) {
        console.log(this.header)
        this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /!*到后台执行删除操作*!/
          const url = `${conf.url}/internethospital/api/activities/`+row.id;
          ax.delete(url,this.header).then(res => {
            this.$message({
              /!*删除成功返回成功信息*!/
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
      },*/
      resetCondition () {
        this.condition = {
          code: '',
          status:''
        }
      },
      goToDetail (type,code,tt) {
        console.log(tt)
        this.$router.push({
          path: '/activity-manager/detail',
          query: {
            type: type,
            code: code,
            id:tt
          }
        });
      },
      /*remoteActivityCodeMethod(str){//活动编码查询
        if(str){
          const url = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&code=${str}`;
          ax.get(url, this.header).then(res => {
            this.activityCodeOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      }*/
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
