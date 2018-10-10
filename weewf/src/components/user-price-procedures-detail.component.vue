<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>用户定价过程{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type==='update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
      <el-form ref="doctor" :model="doctor" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">

        <el-form-item label="职称" prop="positionalTitleText">
          <span v-if="type === 'check'">{{doctor.code}}</span>
          <el-input v-else v-model="doctor.code"></el-input>
        </el-form-item>
        <el-form-item label="医生简介" prop="text">
          <span v-if="type === 'check'">{{doctor.text}}</span>
          <el-input v-else v-model="doctor.text"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="longtext">
          <span v-if="type === 'check'">{{doctor.longtext}}</span>
          <mavon-editor v-else v-model="doctor.longtext"/>
        </el-form-item>

      </el-form>
  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "user-price-procedures-detail",
    data () {
      return {
        type: '',
        header: '',
        departmentOptions:[],

        doctor: {
          code: '',
          text: '',
          longText: '',
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
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();
    },


    mounted() {
    },

    methods: {
      // getInfo(id){
      //   console.log('请求医生id详情getInfo:', id);
      //   const url = `${conf.url}/internethospital/api/doctors/${id}`;
      //   console.log(url);
      //   ax.get(url).then(res => {
      //     console.log(res);
      //     this.doctor = res.data;
      //     console.log('请求医生名字：',this.doctor.doctorName)
      //   }).catch(err => {
      //     console.log(err);
      //     this.$message({
      //       message: '',
      //       type: 'danger'
      //     });
      //   })
      // },
      create (){
        const url = `${conf.url}/internethospital/api/user-price-procedures`;
        this.$refs['hospital'].validate(data => {
          console.log("1");
          if (!(this.doctor.code
            &&this.doctor.longText
            &&this.doctor.text)) {
            return false;
          } else {
            const data = {
              "code": this.doctor.code,
              "longText": this.doctor.longText === '' ? null : this.doctor.longText,
              "text": this.doctor.text,
            };
            ax.post(url, data, this.header).then(res => {
              console.log(res);
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
              this.cancel();
            })
          }
        });
      },

      update () {
        console.log('请求医生详情updateId::::', this.$route.query.id);
        const url = `${conf.url}/internethospital/api/doctors/${this.$route.query.id}`;
        const data = {
          "departmentId": this.doctor.departmentId,
          "doctorAvatar": this.filePath,
          "realName": this.doctor.doctorName,
          "positionalTitleId":this.doctor.positionalTitleId,
          "standPositionalTitleId": this.doctor.standPositionalTitleId,
          "text": this.doctor.text,
          "longText": this.doctor.longText,
        };
        ax.put(url, data,this.header).then(res => {
          console.log(res);
          this.cancel();
        }).catch(err => {
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          });
        })
      },

      deleteRow (id) {
        const url = `${conf.url}/internethospital/api/doctors/${id}`;
        ax.delete(url, this.header).then(res => {
          console.log(res);
          this.getInfo()
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },

      uploadSuccess (response, file, fileList) {
        console.log(response);
        this.filePath = response.path
      },

      /*所属科室关键字查询*/
      remoteDepartmentMethod(str) {
        console.log("所属科室关键字查询",str);
        const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&show-all=true&organization-id=${this.doctor.organizationId}&text=${str}`;
        console.log(url);
        ax.get(url,this.header).then(res =>{
          console.log(res.data.content)
          this.departmentOptions = res.data.content;
        })
      },



      cancel () {
          this.$router.back(-1);
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
