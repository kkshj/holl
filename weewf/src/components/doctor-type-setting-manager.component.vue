<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>排班管理</h4></el-col>
      <el-col :span="6">
        <!--<el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单</el-button>-->
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="8">
        <el-select
          v-model="condition.hospitalId"
          filterable
          remote
          placeholder="请输入医院"
          :remote-method="remoteHospitalMethod">
          <el-option
            v-for="item in hospitalOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="condition.departmentId"
          filterable
          remote
          placeholder="所属科室"
          :remote-method="remoteDepartmentMethod">
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
      <el-col :span="6">
        <el-input placeholder="请输入医生姓名" clearable v-model="condition.doctorId"></el-input>
        <!--<el-select
          v-model="condition.doctorId"
          filterable
          remote
          placeholder="医生姓名（请输入关键字）"
          :remote-method="remoteDoctorMethod" clearable>
          <el-option
            v-for="item in doctorOptions"
            :key="item.doctorId"
            :label="item.doctorName"
            :value="item.doctorName">
            <span style="float: left">{{ item.doctorName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>-->
      </el-col>
      <!--<el-col :span="8">
        <div class="block">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="condition.startAndEndTime"
            type="daterange"
            unlink-panels
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-col>-->
      <el-col :span="4">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.departmentId && !condition.hospitalId && !condition.doctorId" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <!--<el-row class="search">
      <el-col :span="14"><span>&nbsp;</span></el-col>
      <el-col :span="6"><span>&nbsp;</span></el-col>
      <el-col :span="4">
        <el-button  plain>开启按钮</el-button>
        <el-button  plain>关闭按钮</el-button>
      </el-col>
    </el-row>-->
    <el-table ref="multipleTable" :data="doctorList" v-loading = "loading"  @selection-change="handleSelectionChange" style="width: 100%">
      <!--<el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <el-table-column align="left" label="医生头像" prop="doctorAvatar">
        <template slot-scope="scope">
          <img :src="scope.row.doctorAvatar" style="width: 40px; display: block;"/>
        </template>
      </el-table-column>
      <el-table-column align="left" label="医生姓名" prop="doctorName"></el-table-column>
      <el-table-column align="left" label="所属医院名" prop="organizationText"></el-table-column>
      <el-table-column align="left" label="所属科室" prop="departmentText"></el-table-column>
      <el-table-column align="left" label="排班状态">
        <template slot-scope="scope">
          <span>{{scope.row.scheduling===true ?  '已开启' : scope.row.scheduling===false?  '已关闭' : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <!--<el-button size="mini"  type="warning" plain @click="downloadDoctorCode(scope.row.code)">二维码下载</el-button>-->
          <el-button size="mini"  type="success" plain @click="goToDetail('check', scope.row.doctorId)">查看</el-button>
          <!--<el-button size="mini"  type="primary" plain @click="goToDetail('update', scope.row.doctorId)">修改</el-button>-->
          <el-button size="mini" :disabled="scope.row.scheduling===false" type="danger" plain @click="deleteAll(scope.row.doctorId)">清空排班</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :total="total"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "scheduling-manager",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        condition: {
          hospitalId: '',
          departmentId: '',
          doctorId: ''
        },
        doctorList: [],
        addOne: false,
        delivery: {},
        hospitalOptions: [],
        departmentOptions:[],
        /*doctorOptions:[],*/
        /*时间选择器*/
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        /*复选框*/
        multipleSelection: []
      }
    },
    activated () {
      this.loading = true;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);
    },
    methods: {
      getInfo(page){
        let url = `${conf.url}/internethospital/api/doctors?page-index=${page}&page-size=10&sort-method=CONSULTATION_QUANTITY`;
        if(this.condition.hospitalId){
          url = `${url}&organization-id=${this.condition.hospitalId}`
        }
        if(this.condition.departmentId){
          url = `${url}&department-id=${this.condition.departmentId}`;
        }
        if(this.condition.doctorId){
          url = `${url}&name=${this.condition.doctorId}`;
        }
        ax.get(url, this.header).then(res => {
          res.data.positionalTitleId = res.data.positionalTitleId || res.data.standPositionalTitleId
          this.doctorList = res.data.content;
          this.total = res.data.totalElements;
          this.loading = false
        }).catch(err => {
          console.log(err);
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
      /*清空所有排班*/
      deleteAll(id){
        this.$confirm(`此操作将清空所有排班信息，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /*到后台执行删除操作*/
          const url = `${conf.url}/internethospital/api/scheduling/doctor/${id}`;
          ax.delete(url,this.header).then(res => {
            this.$message({
              message:'排班信息已清空',
              type: 'success'
            })
            this.getInfo(1)
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }).catch(err =>{
          this.$message('操作取消')
        })
      },
      resetCondition () {
        this.condition = {
          hospitalId: '',
          departmentId: '',
          doctorId: ''
        }
      },
      remoteHospitalMethod (query) {
        if (query) {
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=1000&text=${query}&type=HOSPITAL`;
          ax.get(url,this.header).then(res =>{
            this.hospitalOptions = res.data.content;
          })
        }
      },
      remoteDepartmentMethod(query){/*模糊查询科室*/
        if (query) {
          let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=1000&text=${query}&type=HOSPITAL_DEPARTMENT`;
          if (this.condition.hospitalId) {
            url = `${url}&organization-id=${this.condition.hospitalId}`;
          }
          ax.get(url,this.header).then(res =>{
            this.departmentOptions = res.data.content;
          })
        }
      },
      goToDetail (type, id) {
        this.$router.push({
          path: '/doctor-type-setting-manager/detail',
          query: {
            type:type,
            id: id
          }
        });
      },
      /*remoteDoctorMethod(query){/!*医生姓名模糊查询*!/
        if(query){
          let url = `${conf.url}/internethospital/api/doctors?page-index=1&page-size=1000&name=${query}`;
          if(this.condition.hospitalId){
            url = `${url}&organization-id=${this.condition.hospitalId}`;
          }
          if(this.condition.departmentId){
            url = `${url}&department-id=${this.condition.departmentId}`
          }
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
      },*/
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
