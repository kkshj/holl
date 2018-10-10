<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>科室信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="department" :model="department" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="科室名称" prop="text">
        <span v-if="type === 'check'">{{department.text}}</span>
        <el-input v-else v-model="department.text"></el-input>
      </el-form-item>
      <el-form-item label="科室编码" prop="code">
        <span v-if="type === 'update' || type === 'check'">{{department.code}}</span>
        <el-input v-if="type === 'add'" v-model="department.code"></el-input>
      </el-form-item>
      <el-form-item label="科室logo" prop="logoUrl">
        <img v-if="type === 'check'" :src="department.logoUrl" style="width: 40px;height: 40px;display: block;"/>
        <el-upload v-else
                   :action="headUrl + '/internethospital/api/images?type=DEPARTMENTIMG&object-id= ' + imageId"
                   :limit="1"
                   :on-success="uploadSuccess"
                   :file-list="fileList2"
                   list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="父级科室" prop="parentText">
        <span v-if="type === 'check' || type === 'update'">{{department.parentText}}</span>
        <el-select v-else
                   v-model="department.parentId"
                   filterable remote reserve-keyword placeholder="请输入关键词"
                   :remote-method="remoteMethod">
          <el-option
            v-for="item in parentDepartments"
            :key="item.id" :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="详细介绍" prop="longText">
        <span v-if="type === 'check'">{{department.longText}}</span>
        <mavon-editor v-else v-model="department.longText"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "department-detail",
    data () {
      return {
        standDepartment: 'false',
        code:'',
        type: '',
        header: '',
        headUrl: `${conf.url}`,
        department: {
          id: "",
          code: "",
          name: "",
          text: "",
          type:'HOSPITAL_DEPARTMENT',
          logoUrl: "",
          parentId: "",
          standDepartment:'true',
          organizationId: "",
          organizationText: ""
        },
        departments: [],
        parentDepartments: [],
        data:[],
        fileList:[],
        fileList2:[],
        rules: {
          code: [
            { required: true, message: '请输入科室编码', trigger: 'blur'}
          ],
          text: [
            { required: true, message: '请输入科室名称', trigger: 'blur'}
          ],
        },
        selectLoading: false,
        hospitalName: [],
        logoUrl: '',
        isDataManager: false,
        currentPage: 1,
        userInfo: {},
        imageUrl: '',
        imageId: '',
        // filePath: '',

        input: ''

      }

    },
    activated () {
      this.$refs['department'].resetFields();
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }else {
        this.department = {
          "code": '',
          "logoUrl": '',
          "parentId": '',
          "standDepartment": '',
          "text": '',
          "longText": '',
          "type": ''
        }
        this.logoUrl = '';
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();
    },

    mounted() {
    },

    methods: {
      getInfo (id) {
        console.log('请求科室详情', id);
        const url = `${conf.url}/internethospital/api/departments/${id}`;
        ax.get(url).then(res => {
          if (res.data.parentId) {
            let url = `${conf.url}/internethospital/api/departments/${res.data.parentId}`;
            ax.get(url).then(resp => {
              console.log('请求父级科室resp::::::::',resp);
              res.data.parentText = resp.data.text;
              res.data.parentId = resp.data.id;
              this.department = res.data;
              if(res.data.logoUrl){
                console.log('department赋值之后',this.department);
                let fileList = {'name':res.data.text,'url':res.data.logoUrl,};
                this.logoUrl = res.data.logoUrl
                this.fileList.push(fileList)
              }
            });
          }else {
            console.log(res);
            this.department = res.data;
            if(res.data.logoUrl){
              let fileList = {
                'name':res.data.text,
                'url':res.data.logoUrl,
              };
              this.logoUrl = res.data.logoUrl
              this.fileList2.push(fileList)
            }
          }
        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },

      create (){
        const url = `${conf.url}/internethospital/api/departments`;
        this.$refs['department'].validate(data => {
          console.log("1");
          if (!(this.department.code
            && this.department.text)) {
            return false;
          } else {
            const data = {
              "text": this.department.text,
              "code": this.department.code,
              "logoUrl": this.logoUrl,
              "parentId": this.department.parentId === '' ? null : this.department.parentId,
              "standDepartment": true,
              "longText": this.department.longText === '' ? null : this.department.longText,
              "type": 'HOSPITAL_DEPARTMENT'
            };
            // const data = this.department
            ax.post(url, data, this.header).then(res => {
              console.log(res);
              this.$message({
                message: '科室创建成功',
                type: 'success'
              });
              this.cancel();
            }).catch(err => {
              console.log(err);
              this.$message({
                message: err.response.data.message,
                type: 'warning'
              })
            })
          }
        });
      },

      update () {
        console.log('请求科室详情233id::::', this.$route.query.id);
        const url = `${conf.url}/internethospital/api/departments/${this.$route.query.id}`;
        if (!(this.department.code
          && this.department.text)) {
          return false;
        } else {
          const data = {
            "logoUrl": this.logoUrl || this.department.logoUrl,
            // "logoUrl": this.logoUrl,
            "longText": this.department.longText,
            "text": this.department.text
          };
          ax.put(url, data, this.header).then(res => {
            this.$message({
              message: '修改医院成功',
              type: 'success'
            });
            this.cancel();
            // this.getInfo(this.currentPage)
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
            console.log(err);
            this.cancel();
          })
        }
      },

      //父级科室查询
      remoteMethod(query) {
        if(query && query !== " "){
          this.selectLoading = true;
          const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true&stand-department=true`;
          ax.get(url, this.header).then(res => {
            console.log(res)
            console.log('父级科室查询query：'.query);
            this.parentDepartments = res.data.content;
            this.selectLoading = false;
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
          })
        }
      },


      cancel () {
        this.$router.back(-1);
        this.fileList = [];
        this.fileList2 = []
      },

      uploadSuccess (response, file, fileList) {
        if(file.size/1024 <= 1024){
          console.log(response);
          this.logoUrl = response.path
        }else {
          this.fileList = [];
          this.fileList2 = [];
          this.$message({
            type: 'warning',
            message: '上传图片大小不能大于1MB，请重新上传'
          })
        }
      },




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




</style>
