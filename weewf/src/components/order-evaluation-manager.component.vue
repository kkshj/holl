<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>评价管理</h4></el-col>
      <el-col :span="6">
        <!--<el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单类型</el-button>-->
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="5">
        <el-select
          v-model="condition.hospitalId"
          filterable
          remote
          placeholder="医院名称（请输入关键字）"
          :remote-method="remoteOrganizationMethod" clearable>
          <el-option
            v-for="item in organizationOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="condition.departmentId"
          filterable
          remote
          placeholder="科室名称（请输入关键字）"
          :remote-method="remoteDepartmentMethod" clearable>
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
            <span style="float: left">{{ item.text }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>
      <!--<el-col :span="5">
        <el-select
          v-model="condition.doctorId"
          filterable
          remote
          placeholder="医生姓名（请输入关键字）"
          :remote-method="remoteDoctorMethod" clearable>
          <el-option
            v-for="item in doctorOptions"
            :key="item.doctorId"
            :label="item.doctorName"
            :value="item.doctorId">
            <span style="float: left">{{ item.doctorName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="condition.nurseId"
          filterable
          remote
          placeholder="护士姓名（请输入关键字）"
          :remote-method="remoteNurseMethod" clearable>
          <el-option
            v-for="item in nurseOptions"
            :key="item.nurseId"
            :label="item.nurseName"
            :value="item.nurseId">
            <span style="float: left">{{ item.nurseName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :span="4">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.hospitalId&&!condition.departmentId" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="orderEvaluation"  v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="organizationName" label="医院"></el-table-column>
      <el-table-column align="left" prop="departmentName" label="科室"></el-table-column>
      <el-table-column align="left" label="医生/护士">
        <template slot-scope="scope">
          <span>{{scope.row.doctorName || scope.row.nurseName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="createdDate" label="评价时间"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" prop="evaluation" label="评价内容"></el-table-column>
      <el-table-column align="left" prop="promptness" label="回复及时性"></el-table-column>
      <el-table-column align="left" prop="attitude" label="服务态度"></el-table-column>
      <el-table-column align="left" prop="username" label="联系电话"></el-table-column>
      <el-table-column align="left" prop="audited" label="是否审核通过">
        <template slot-scope="scope">
          <span>{{scope.row.audited === false ?  '否' : '是'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id, scope.row.audited)">查看</el-button>
          <!--<el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>-->
          <el-button size="mini" :disabled="scope.row.audited === false ? false : true" type="primary" plain @click="auditRow(scope.row)">审核</el-button>
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
        organizationOptions:[],
        departmentOptions:[],
        /*doctorOptions:[],
        nurseOptions:[],*/
        condition: {
          hospitalId: '',
          departmentId:'',
          doctorId:'',
          nurseId:''
        },
        orderEvaluation: [],
        addOne: false,
        delivery: {}
      }
    },
    activated () {
      this.loading = true;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.condition = {}
      this.getInfo(this.currentPage);//页面默认加载首页
    },
    methods: {
      getInfo(currentPage) {
        let url = `${conf.url}/internethospital/api/evaluations/?page-index=`+currentPage+`&page-size=10`;
        if(this.condition.hospitalId){
          url = `${url}&organization-id=${this.condition.hospitalId}`;
        }
        if(this.condition.departmentId){
          url = `${url}&department-id=${this.condition.departmentId}`
        }
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          for (let i in res.data.content) {
            res.data.content[i].createdDate = res.data.content[i].createdDate.replace('T', ' ');
          }
          this.orderEvaluation = res.data.content;
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
          hospitalId: '',
          departmentId:'',
          doctorId:'',
          nurseId:''
        }
      },
      goToDetail (type,id,audited) {
        //console.log(type)
        this.$router.push({
          path: '/order-evaluation-manager/detail',
          query: {
            type: type,
            id: id,
            audited:audited
          }
        });
      },
      auditRow (row) {
        this.$confirm(`点击确认，审批通过`,`提示`,{
          distinguishCancelAndClose: true,
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /*到后台执行审批操作*/
          const url = `${conf.url}/internethospital/api/evaluations/`+row.id;
          ax.post(url,this.header).then(res => {
            this.$message({
              /*删除成功返回成功信息*/
              message:'审核通过',
              type: 'success'
            })
            this.getInfo(this.currentPage)
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }).catch(err =>{
          this.$message({
            message:'审核取消',
            type: 'info'
          })
        })
      },
      remoteOrganizationMethod(str){//模糊查询医院名称
        if(str){
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=10&text=${str}`;
          ax.get(url, this.header).then(res => {
            this.organizationOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },
      remoteDepartmentMethod(query){/*模糊查询科室*/
        if (query) {
          let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT`;
          if (this.condition.hospitalId) {
            url = `${url}&organization-id=${this.condition.hospitalId}`;
          }
          ax.get(url,this.header).then(res =>{
            this.departmentOptions = res.data.content;
          })
        }
      },
      /*remoteDoctorMethod(query){/!*医生姓名模糊查询*!/
          if(this.condition.nurseId){
            this.$message({
              type: 'warning',
              message: '医生与护士只能选择一个'
            });
            this.nurseOptions = [];
            return false
          }else{
            if(query){
              let url = `${conf.url}/internethospital/api/doctors?page-index=1&page-size=10&name=${query}`;
              if(this.condition.hospitalId){
                url = `${url}&organization-id=${this.condition.hospitalId}`;
              }
              if(this.condition.departmentId){
                url = `${url}&department-id=${this.condition.departmentId}`
              }
              console.log(url)
              ax.get(url, this.header).then(res => {
                this.doctorOptions = res.data.content;

              }).catch(err => {
                console.log(err);
                this.$message({
                  type: 'warning',
                  message: err.response.data.message
                });
              })
            }
          }
      },
      remoteNurseMethod(query){/!*护士模糊查询*!/
          if(this.condition.doctorId){
            this.$message({
              type: 'warning',
              message: '医生与护士只能选择一个'
            });
            this.doctorOptions = [];
            return false
          }else{
            if(query){
              let url = `${conf.url}/internethospital/api/nurses?page-index=1&page-size=10&name=${query}`;
              if(this.condition.hospitalId){
                url = `${url}&organization-id=${this.condition.hospitalId}`;
              }
              if(this.condition.departmentId){
                url = `${url}&department-id=${this.condition.departmentId}`
              }
              ax.get(url, this.header).then(res => {

                this.nurseOptions = res.data.content;

              }).catch(err => {
                console.log(err);
                this.$message({
                  type: 'warning',
                  message: err.response.data.message
                });
              })
            }
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
