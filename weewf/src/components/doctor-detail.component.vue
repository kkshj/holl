<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>医生信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type==='update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
      <el-form ref="doctors" :model="doctor" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
        <el-form-item v-if="type === 'add'" label="医生账号" prop="account">
          <el-input v-model="doctor.account"></el-input>
        </el-form-item>
        <el-form-item label="医生姓名" prop="doctorName">
          <span v-if="type === 'check'">{{doctor.doctorName}}</span>
          <el-input v-else v-model="doctor.doctorName" placeholder="请输入医生姓名"></el-input>
        </el-form-item>

        <el-form-item label="医生头像" prop="doctorAvatar">
          <img v-if="type === 'check'" :src="doctor.doctorAvatar" style="width: 40px;height: 40px;display: block;"/>
          <el-upload v-else
                     :action="headUrl + '/internethospital/api/images?type=DOCTORPORTRAIT&object-id= ' + imageId"
                     :limit="1"
                     :on-change="handleChange"
                     :on-success="uploadSuccess"
                     :file-list="fileList2"
                     list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="职称" prop="positionalTitleId">
          <span v-if="type === 'check'">{{doctor.positionalTitleText || doctor.standPositionalTitleText}}</span>
          <el-select v-else
                     :disabled="type === 'update'"
                     v-model="doctor.positionalTitleId"
                     filterable remote
                     placeholder="医生职称"
                     :remote-method="positionalTitleMethod">
            <el-option v-for="item in positionalTitleOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属医院" prop="organizationText">
          <span v-if="type === 'check'">{{doctor.organizationText}}</span>
          <el-select v-else
                     :disabled="type === 'update'"
                     v-model="doctor.organizationId"
                     filterable remote
                     placeholder="医生所属医院"
                     :remote-method="remoteHospitalMethod">
            <el-option v-for="item in hospitalOptions"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="type !== 'check' ? '所属科室（一级）' : '所属科室'" prop="departmentId">
          <span v-if="type==='check'">{{doctor.departmentText}}</span>
          <el-select
            v-else
            :disabled="type === 'update'"
            v-model="doctor.departmentId"
            filterable
            remote
            placeholder="医生所属科室（一级）"
            :remote-method="remoteDepartmentMethod">
            <el-option
              v-for="item in departmentOptions"
              :key="item.id" :label="item.text"
              :value="item.id">
              <span style="float: left">{{ item.text }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type !== 'check' " label="所属科室（二级）" prop="secondDepartmentId">
          <el-select
            v-model="doctor.secondDepartmentId"
            :disabled="type === 'update'"
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
        </el-form-item>
        <el-form-item label="医生简介" prop="text">
          <span v-if="type === 'check'">{{doctor.text}}</span>
          <el-input v-else v-model="doctor.text"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="longtext">
          <p v-if="type === 'check'">{{doctor.longtext}}</p>
          <mavon-editor v-else v-model="doctor.longtext"/>
        </el-form-item>

      </el-form>

    <el-form v-if="type==='add'" :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="140px" class="demo-dynamic" style="width: 70%; margin: 20px auto;">
      <el-form-item
                    v-for="(detail, index) in dynamicValidateForm.details"
                    :label="'医生服务产品' + (index+1)"
                    :key="detail.key"
                    :prop="'details.' + index"
                    :rules="{required: true, message: '详情不能为空', trigger: 'blur'}">
        <el-form :inline="true" :model="detail" :rules="detailRule" class="demo-form-inline">
          <!--<el-select-->
            <!--v-model="detail.code"-->
            <!--filterable-->
            <!--remote-->
            <!--placeholder="请输入服务描述"-->
            <!--:remote-method="remoteProductTextMethod">-->
            <!--<el-option-->
              <!--v-for="item in productTextOptions"-->
              <!--:key="item.text"-->
              <!--:label="item.text"-->
              <!--:value="item.code">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-select @change="chooseCode(detail.code, index)" v-model="detail.code" clearable placeholder="请选择">
            <el-option
              v-for="item in codeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <br>
          <el-form-item label="服务价格" prop="price">
            <el-input :disabled="detail.priceDisabled" type="number" v-model="detail.price" placeholder="服务价格"></el-input>
          </el-form-item>
          <br>
        </el-form>

        <el-button @click.prevent="removeDetail(detail)">删除</el-button>
        <el-button @click="addDetail">新增详情</el-button>
      </el-form-item>

      <el-form-item>

      </el-form-item>

      </el-form>


  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "doctor-detail",
    data () {
      return {
        type: '',
        header: '',
        doctors:'',
        doctorAvatar:'',
        secondDepartmentId:'',
        productTextOptions:[],
        hospitalOptions: [],
        departmentOptions: [],
        secondDepartmentOptions: [],
        positionalTitleOptions: [],
        fileList:[],
        fileList2:[],
        headUrl: `${conf.url}`,

        dynamicValidateForm: {
          details: [{
            text:'',//服务描述
            code:'',//服务产品code
            price:'',//服务价格
            priceDisabled:false
          }]
        },



        doctor: {
          account: '',
          doctorName: '',
          doctorId: '',
          doctorAvatar:'',
          text: '',
          organizationId: '',
          organizationText:'',
          departmentId: '',
          departmentText: '',
          secondDepartmentId: '',
          longText: '',
          services: '',
          statistics: '',
          positionalTitleId: '',
          positionalTitleText: '',
          standPositionalTitleText:'',
          standPositionalTitleId:''
        },

        codeOptions:[{
          value: 'CONSULT_FREE',
          label: '义诊'
        }, {
          value: 'CONSULT',
          label: '网络咨询'
        }],


        detailRule: {
          // doctorName: [
          //   { required: true, message: '请输入医生姓名', trigger: 'blur'}
          // ]
        },

        rules: {
          doctorName: [
            { required: true, message: '请输入医生姓名', trigger: 'blur'}
          ]
        },
        imageId: '',



      }
    },

    activated () {
      this.$refs['doctors'].resetFields();
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      } else {
        this.doctor = {
          account: '',
          doctorName: '',
          doctorId: '',
          doctorAvatar:'',
          text: '',
          organizationId: '',
          organizationText:'',
          departmentId: '',
          departmentText: '',
          secondDepartmentId: '',
          longText: '',
          services: '',
          statistics: '',
          positionalTitleId: '',
          positionalTitleText: '',
          standPositionalTitleText:'',
          standPositionalTitleId:''
        }
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();
    },
    methods: {
      getInfo(doctorId){
        const url = `${conf.url}/internethospital/api/doctors/${doctorId}`;
        console.log(url);
        ax.get(url).then(res => {
          console.log(res);
          res.data.positionalTitleId = res.data.positionalTitleId || res.data.standPositionalTitleId
          const url = `${conf.url}/internethospital/api/departments/${res.data.departmentId}`;
          ax.get(url).then(resp => {
            res.data.departmentText = resp.data.text;
            if (resp.data.parentId) {
              res.data.secondDepartmentId = resp.data.id;
              const url = `${conf.url}/internethospital/api/departments/${resp.data.parentId}`;
              ax.get(url).then(response => {
                res.data.departmentId = response.data.id;
                if(!res.data.longtext){
                  console.log(1)
                  res.data.longtext = "";
                }
                this.doctor = res.data;
                if(res.data.doctorAvatar){
                  console.log('longText_________',this.doctor.longtext)
                  let fileList = {'name':res.data.doctorName, 'url':res.data.doctorAvatar,};
                  this.doctorAvatar = res.data.doctorAvatar;
                  this.fileList2.push(fileList)
                }
              })
            } else {
              if(!res.data.longtext){
                console.log(1)
                res.data.longtext = "";
              }
              this.doctor = res.data;
              if(res.data.doctorAvatar){
                console.log('longText_________',this.doctor.longtext)
                let fileList = {'name':res.data.text, 'url':res.data.doctorAvatar,};
                this.fileList2.push(fileList)
              }
            }
          })


        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },

      create (){
        const url = `${conf.url}/internethospital/api/doctors`;
        this.$refs['doctors'].validate(data => {
          console.log("1111111");
          if (!(this.doctor.account
            && this.doctor.doctorName
            && this.doctor.secondDepartmentId)) {
            return false;
          } else {
            const data = {
              "username": this.doctor.account,
              "realName": this.doctor.doctorName,
              "doctorId": this.doctor.doctorId,
              "doctorAvatar": this.doctorAvatar,
              "departmentId": this.doctor.secondDepartmentId,
              "positionalTitleId" : this.doctor.positionalTitleId,
              // "positionalTitleId": this.positionalTitleOptions.find(p => (p.id === this.doctor.positionalTitleId) && (!p.standard)) ? this.doctor.positionalTitleId : '',
              // "standPositionalTitleId": this.positionalTitleOptions.find(p => (p.id === this.doctor.positionalTitleId) && (p.standard)) ? this.doctor.positionalTitleId : '',
              "longtext": this.doctor.longtext === '' ? null : this.doctor.longtext,
              "text": this.doctor.text,
              "doctorServiceProducts":this.dynamicValidateForm.details,
              "sticky": true,
              "sort": 0,
            };
            ax.post(url, data, this.header).then(res => {
              console.log(res);
              this.$message({
                message: '添加医生成功',
                type: 'success'
              });
              this.cancel();
            }).catch(err => {
              this.$message({
                message: err.response.data.message,
                type: 'warning'
              });
              // this.$message({
              //   message: '创建失败，请稍后再试',
              //   type: 'warning'
              // });
              console.log(err);
              // this.cancel();
            })
          }
        });
      },

      update () {
        console.log('请求医生详情updateId::::', this.$route.query.id);
        const url = `${conf.url}/internethospital/api/doctors/${this.$route.query.id}`;
        if (!(this.doctor.doctorName
          && this.doctor.departmentId)) {
          return false;
        } else {
          const data = {
            "departmentId": this.doctor.secondDepartmentId || this.doctor.departmentId,
            "doctorAvatar": this.doctorAvatar || this.doctor.doctorAvatar,
            // "doctorAvatar": this.doctorAvatar,
            "longText": this.doctor.longtext,
            // "longtext": this.doctor.longtext === '' ? null : this.doctor.longtext,
            "positionalTitleId": this.doctor.positionalTitleId,
            "realName": this.doctor.doctorName,
            // "sort": 1,
            "standPositionalTitleId": this.doctor.standPositionalTitleId,
            "sticky": true,
            "text": this.doctor.text,
          };
          ax.put(url, data, this.header).then(res => {
            console.log(res);
            // this.getInfo(this.currentPage)
            this.$message({
              message: '修改医生成功',
              type: 'success'
            });
            this.cancel();
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
          })
        }
      },

      // 医生职称查询
      positionalTitleMethod (query) {
        const url = `${conf.url}/internethospital/api/positional_titles?page-index=1&page-size=100`;
        ax.get(url,this.header).then(res =>{
          this.positionalTitleOptions = res.data.content;
        })
      },
      // 所属医院查询
      remoteHospitalMethod (query) {
        if (query) {
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=1000&text=${query}&type=HOSPITAL`;
          ax.get(url,this.header).then(res =>{
            this.hospitalOptions = res.data.content;
          })
        }
      },
      // 一级科室查询
      remoteDepartmentMethod (query){
        if (query) {
          if (this.doctor.organizationId) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true&organization-id=${this.doctor.organizationId}`;
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
      // 二级科室查询
      remoteSecondDepartmentMethod (query) {
        if (query) {
          if (this.doctor.departmentId) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&parent-id=${this.doctor.departmentId}`;
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
      // 上传头像
      uploadSuccess (response, file, fileList) {
        if(file.size/1024 <= 1024){
          console.log(response);
          this.doctorAvatar = response.path
        }else {
          this.fileList = [];
          this.fileList2 = [];
          this.$message({
            type: 'warning',
            message: '上传图片大小不能大于1MB，请重新上传'
          })
        }
      },
      // 控制图片列表
      handleChange(file, fileList) {
        this.fileList2 = fileList.slice();
      },
      // 删除服务
      removeDetail(item) {
        var index = this.dynamicValidateForm.details.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.details.splice(index, 1)
        }
      },
      // 添加服务
      addDetail() {
        this.dynamicValidateForm.details.push({
          code:'',//服务产品code
          price:''//服务价格
        });
      },
      chooseCode(value, i){
        console.log(value)
        console.log(i)
        if(value === 'CONSULT_FREE'){
          this.dynamicValidateForm.details[i].priceDisabled = true;
        }else{
          this.dynamicValidateForm.details[i].priceDisabled = false;
        }
      },

      // 医生产品服务查询
      remoteProductTextMethod(str){//护士服务产品查询
        if(str){
          const url = `${conf.url}/internethospital/api/products?page-index=1&page-size=100&type=CONSULT&name=${str}`;
          ax.get(url,this.header).then(res => {
            this.productTextOptions = res.data.content;
          })
        }
      },

      cancel () {
        this.$router.back(-1);
        this.fileList = [];
        this.fileList2 = []
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

.el-form-item{
  text-align: left;
}
  .el-select{
    width: 100%;
  }

</style>
