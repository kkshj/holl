<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>活动信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="activity" :model="activity" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="活动编码" prop="code">
        <span v-if="type==='check'||type === 'update'">{{activity.code}}</span>
        <el-input v-else v-model="activity.code"></el-input>
      </el-form-item>
      <el-form-item label="活动名称" prop="text">
        <span v-if="type==='check'">{{activity.text}}</span>
        <el-input v-else v-model="activity.text"></el-input>
      </el-form-item>
      <el-form-item label="活动描述" prop="longText">
        <span v-if="type==='check'">{{activity.longText}}</span>
        <mavon-editor v-else v-model="activity.longText"/>
      </el-form-item>
      <el-form-item label="起止时间" prop="startTime">
        <span v-if="type==='check'||type === 'update'">{{activity.startTime}} 至 {{activity.endTime}}</span>

        <div v-else class="block">
          <el-date-picker
            v-model="activity.startAndEndTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item  label="所属医院" prop="organizationId">
        <span v-if="type==='check'||type === 'update'">{{activity.organizationName}}</span>
        <el-select
          v-else
          v-model="activity.organizationId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteOrganizationMethod" clearable>
          <el-option
            v-for="item in organizationOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label="所属科室" prop="departmentId">
        <span v-if="type==='check'||type === 'update'">{{activity.departmentName}}</span>
        <el-select
          v-else
          v-model="activity.departmentId"
          filterable
          remote
          placeholder="请输入关键词"
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
      </el-form-item>

      <!--<el-form-item  label="医生姓名" prop="doctorId">
        <span v-if="type==='check'">{{activity.doctorName}}</span>
        <el-select
          v-else
          v-model="activity.doctorId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteDoctorMethod" clearable>
          <el-option
            v-for="item in doctorOptions"
            :key="item.doctorId"
            :label="item.doctorName"
            :value="item.doctorId">
            <span style="float: left">{{ item.doctorName }}</span>
            <span style="float: left; color: #8492a6; font-size: 10px">&nbsp;&nbsp;{{ item.organizationText }}</span>
            <span style="float: right; color: #3b97d7; font-size: 8px">({{ item.departmentText }})</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label="护士姓名" prop="nurseId">
        <span v-if="type==='check'">{{activity.nurseName}}</span>
        <el-select
          v-else
          v-model="activity.nurseId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteNurseMethod" clearable>
          <el-option
            v-for="item in nurseOptions"
            :key="item.nurseId"
            :label="item.nurseName"
            :value="item.nurseId">
            <span style="float: left">{{ item.nurseName }}</span>
            <span style="float: left; color: #8492a6; font-size: 10px">&nbsp;&nbsp;{{ item.organizationText }}</span>
            <span style="float: right; color: #3b97d7; font-size: 8px">({{ item.departmentText }})</span>
          </el-option>
        </el-select>
      </el-form-item>-->

    </el-form>
  </div>
</template>

<script>
  Date.prototype.format = function (fmt) { // 定义Date类型的format函数 【必须使用 ‘= function () {}’ 的形式】
    const o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderType-detail",
    data () {
      return {
        type: '',
        header: '',
        activity: {
          code: '',
          text:'',
          longText:'',
          startTime:'',
          endTime:'',
          organizationId:'',
          departmentId:'',
          doctorId:'',
          nurseId:''
        },
        organizationOptions:[], /*机构*/
        departmentOptions: [], /*科室*/
        /*doctorOptions:[],/!*医生*!/
        nurseOptions:[],/!*护士*!/*/
        rules: {
          code: [{ required: true, message: '请输入活动编码', trigger: 'blur'}],
          text: [{ required: true, message: '请输入活动名称', trigger: 'blur'}],
        }
      }
    },
    activated () {
      this.$refs['activity'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.code);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.activity={};
      }
    },
    methods: {
      getInfo (code) {
        const url = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&code=${code}`;
        //console.log(this.header)
        ax.get(url,this.header).then(res => {
          res.data.content[0].startAndEndTime = [new Date(res.data.content[0].startTime), new Date(res.data.content[0].endTime)];
          this.activity = res.data.content[0];
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },

      /*添加订单类型*/
      create () {
        this.$refs['activity'].validate((data) =>{
          if(!data){
            return false
          }else{
            if(!this.activity.startAndEndTime){
              this.$message({
                type: 'warning',
                message: '请选择活动时间起止时间'
              });
              return false
            }else{
              //console.log("添加订单类型信息")
              const url = `${conf.url}/internethospital/api/activities`;
              let data = {
                "code": this.activity.code,
                "departmentId": this.activity.departmentId,
                "doctorId": null,
                "startTime": this.activity.startAndEndTime[0].format("yyyy-MM-dd hh:mm:ss"),
                "endTime": this.activity.startAndEndTime[1].format("yyyy-MM-dd hh:mm:ss"),
                "longText": this.activity.longText,
                "nurseId": null,
                "organizationId": this.activity.organizationId,
                "text": this.activity.text
              }
              ax.post(url,data,this.header
              ).then(res=>{
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
                this.cancel()
              }).catch(err =>{
                console.log(err);
                this.$message({
                  type: 'warning',
                  message: err.response.data.message
                });
              })
            }
          }
        })
      },
      update () {
        this.$refs['activity'].validate((data) =>{
          if(!data){
            return false
          }else{
            if(!this.activity.startAndEndTime){
              this.$message({
                type: 'warning',
                message: '请选择活动时间起止时间'
              });
              return false
            }else{
              const url = `${conf.url}/internethospital/api/activities/${this.$route.query.id}`;
              let data = {
                "departmentId": this.activity.departmentId,
                "doctorId": null,
                "startTime": this.activity.startAndEndTime[0].format("yyyy-MM-dd hh:mm:ss"),
                "endTime": this.activity.startAndEndTime[1].format("yyyy-MM-dd hh:mm:ss"),
                "longText": this.activity.longText,
                "nurseId": null,
                "organizationId": this.activity.organizationId,
                "text": this.activity.text
              }
              ax.put(url,data,this.header
              ).then(res=>{
                this.$message({
                  type:'success',
                  message:'保存成功'
                })
                /*修改完成后，设置页面类型为check*/
                this.cancel()
              }).catch(err =>{
                console.log(err);
                this.$message({
                  type: 'warning',
                  message: err.response.data.message
                });
              })
            }
          }
        })

      },
      cancel () {
        this.$router.back(-1);
      },

      remoteOrganizationMethod(query){//机构查询
        if (query) {
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=1000&text=${query}&type=HOSPITAL`;
          ax.get(url,this.header).then(res =>{
            this.organizationOptions = res.data.content;
          })
        }
      },
      remoteDepartmentMethod (query){//科室查询
        if (query) {
          if (this.activity.organizationId) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&organization-id=${this.activity.organizationId}`;
            ax.get(url,this.header).then(res =>{
              this.departmentOptions = res.data.content;
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请先选择医院'
            })
          }
        }
      },
      /*remoteDoctorMethod(){//医生查询
        if(this.activity.organizationId){
          if(this.activity.departmentId){
            let url = `${conf.url}/internethospital/api/doctors?page-index=1&page-size=1000&organization-id=${this.activity.organizationId}&department-id=${this.activity.departmentId}`;
            ax.get(url,this.header).then(res =>{
              //console.log(res.data.content)
              this.doctorOptions = res.data.content;
            })
          }else{
            this.$message({
              type: 'warning',
              message: '请先选择部门'
            })
          }
        }else{
          this.$message({
            type: 'warning',
            message: '请先选择医院'
          })
        }
      },
      remoteNurseMethod(){//护士查询
        if(this.activity.organizationId){
          if(this.activity.departmentId){
            let url = `${conf.url}/internethospital/api/nurses?page-index=1&page-size=10000&organization-id=${this.activity.organizationId}&department-id=${this.activity.departmentId}`;
            ax.get(url,this.header).then(res =>{
              //console.log(res.data.content)
              this.nurseOptions = res.data.content;
            })

          }else{
            this.$message({
              type: 'warning',
              message: '请先选择部门'
            })
          }
        }else{
          this.$message({
            type: 'warning',
            message: '请先选择医院'
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

</style>
