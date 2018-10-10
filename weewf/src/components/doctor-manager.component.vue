<template>
    <div>
      <el-row class="header">
        <el-col :span="18"><h4>医生管理</h4></el-col>
        <el-col :span="6">
          <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加医生信息</el-button>
        </el-col>
      </el-row>
      <el-row class="search">
        <el-col :span="8"><el-input placeholder="请输入医生姓名" clearable v-model="searchCondition.doctorName"></el-input></el-col>
        <el-col :span="8">
          <el-select
            v-model="searchCondition.hospitalId"
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
        <el-col :span="4">
          <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
          <el-button type="danger"  plain :disabled="!searchCondition.doctorName && !searchCondition.hospitalId" @click="resetCondition()">重置</el-button>
        </el-col>
      </el-row>
      <el-row class="search">
        <el-col :span="5">
          <el-select
             v-model="condition.hospitalId"
             filterable
             remote
             placeholder="医生所属医院"
             :remote-method="remoteHospitalMethod">
            <el-option
              v-for="item in hospitalOptions"
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
             placeholder="医生所属科室（一级）"
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
        <el-col :span="5">
          <el-select
             v-model="condition.secondDepartmentId"
             filterable
             remote
             placeholder="医生所属科室（二级）"
             :remote-method="remoteSecondDepartmentMethod">
            <el-option
              v-for="item in secondDepartmentOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id">
              <span style="float: left">{{ item.text }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <el-button type="success" plain :disabled="!condition.departmentId || !condition.hospitalId" icon="el-icon-download" @click="downloadDoctorsCode()" v-loading.fullscreen.lock="fullscreenLoading">下载医生二维码</el-button>
          <el-button type="danger" plain :disabled="!condition.departmentId && !condition.hospitalId" @click="resetCondition()">重置</el-button>
        </el-col>
      </el-row>

      <el-table :data="doctorList" v-loading = "loading" style="width: 100%">
        <el-table-column align="left" type="index"></el-table-column>
        <el-table-column align="left" label="医生头像" prop="doctorAvatar">
          <template slot-scope="scope">
            <img :src="scope.row.doctorAvatar" style="width: 40px; display: block;"/>
          </template>
        </el-table-column>
        <el-table-column align="left" label="医生姓名" prop="doctorName"></el-table-column>
        <el-table-column align="left" label="所属医院名" prop="organizationText"></el-table-column>
        <el-table-column align="left" label="职称" prop="positionalTitleText">
          <template slot-scope="scope">
            <span>{{scope.row.positionalTitleText || scope.row.standPositionalTitleText}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="科室名称" prop="departmentText"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="简介" prop="text"></el-table-column>

        <el-table-column align="left" label="操作" width="380">
          <template slot-scope="scope">
            <!--<el-button size="mini"  type="warning" plain @click="downloadDoctorCode(scope.row.code)">二维码下载</el-button>-->
            <el-button size="mini"  type="success" plain @click="goToDetail('check', scope.row.doctorId)">查看</el-button>
            <el-button size="mini"  type="primary" plain @click="goToDetail('update', scope.row.doctorId)">修改</el-button>
            <el-button size="mini"  type="danger" plain @click="deleteRow(scope.row.doctorId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
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
      name: "doctor-manager",
      data () {
        return {
          dialogVisible: false,
          loading: false,
          searchCondition: {
            doctorName: '',
            hospitalId: ''
          },
          condition: {
            hospitalId: '',
            departmentId: '',
            secondDepartmentId: ''
          },
          listCount: 0,
          doctorList: [],
          addOne: false,
          delivery: {},
          currentPage: 1,
          hospitalOptions: [],
          departmentOptions: [],
          secondDepartmentOptions: [],
          fullscreenLoading: false
        }
      },

      activated () {
        const token = localStorage.getItem('token');
        this.header = {headers: {'Authorization': 'Bearer '+token}};
        this.type = this.$route.query.type;
        console.log(this.$route.query);

        this.loading = true;
        this.getInfo(1);
        this.currentPage = 1;
      },

      methods: {
        getInfo(page){
          let url = `${conf.url}/internethospital/api/doctors?page-index=${page}&page-size=10&sort-method=CONSULTATION_QUANTITY`;
          if (this.searchCondition.doctorName) {
            url = `${url}&name=${this.searchCondition.doctorName}`;
          }
          if (this.searchCondition.hospitalId) {
            url = `${url}&organization-id=${this.searchCondition.hospitalId}`;
          }
          ax.get(url, this.header).then(res => {
            res.data.positionalTitleId = res.data.positionalTitleId || res.data.standPositionalTitleId
            this.doctorList = res.data.content;
            this.listCount = res.data.totalElements;
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
        resetCondition () {
          this.condition = {
            hospitalId: '',
            departmentId: '',
            secondDepartmentId: ''
          }
          this.searchCondition = {
            doctorName: '',
            hospitalId: ''
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
        remoteDepartmentMethod (query){
          if (query) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true`;
            if (this.condition.hospitalId) {
              url = `${url}&organization-id=${this.condition.hospitalId}`;
            }
            ax.get(url,this.header).then(res =>{
              this.departmentOptions = res.data.content;
            })
          }
        },
        remoteSecondDepartmentMethod (query) {
          if (query) {
            if (this.condition.departmentId) {
              let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&parent-id=${this.condition.departmentId}`;
              ax.get(url, this.header).then(res => {
                this.secondDepartmentOptions = res.data.content;
              })
            } else {
              this.$message({
                type: 'warning',
                message: '请先选择一级科室'
              })
            }
          }
        },
        downloadDoctorCode (code) {
          const url = `${conf.url}/internethospital/api/doctors/action/download-micro-app-qrcode?page-index=1&page-size=1&doctor-code=${code}`;
          let form = document.createElement('FORM');
          form.method = 'POST';
          form.action = url;
          document.body.appendChild(form);
          form.submit();
        },
        downloadDoctorsCode () {
          let url = `${conf.url}/internethospital/api/doctors/action/download-micro-app-qrcode?page-index=1&page-size=100&organization-id=${this.condition.hospitalId}`;
          if (this.condition.secondDepartmentId) {
            let department = this.secondDepartmentOptions.find(d => d.id === this.condition.secondDepartmentId);
            if (department.standDepartment) {
              url = `${url}&standard-department-id=${this.condition.secondDepartmentId}`;
            } else {
              url = `${url}&department-id=${this.condition.secondDepartmentId}`;
            }
          }
          if (this.condition.departmentId) {
            let department = this.departmentOptions.find(d => d.id === this.condition.departmentId);
            if (department.standDepartment) {
              url = `${url}&parent-standard-department-id=${this.condition.departmentId}`;
            } else {
              url = `${url}&parent-department-id=${this.condition.departmentId}`;
            }
          }
          let form = document.createElement('FORM');
          form.method = 'POST';
          form.action = url;
          form.onsubmit = e => {
            console.log(1)
            console.log(e)
          }
          document.body.appendChild(form);
          form.submit();
        },
        deleteRow (id) {
          this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
            confirmButtonText:`确定`,
            cancelButtonText:`取消`,
            type:`warning`
          }).then(() =>{
            const url = `${conf.url}/internethospital/api/doctors/${id}`;
            ax.delete(url, this.header).then(res => {
              console.log(res);
              this.getInfo(this.currentPage);
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }).catch(err => {
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
            })
          })
        },

        goToDetail (type, id) {
          this.$router.push({
            path: '/doctor-manager/detail',
            query: {
              type: type,
              id: id
            }
          });
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
    margin-bottom: 10px;
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
