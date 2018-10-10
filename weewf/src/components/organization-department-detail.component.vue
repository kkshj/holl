<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>医院科室信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <el-form ref="departments" :model="department" label-width="150px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="科室名称" prop="text">
        <span v-if="type === 'check'">{{department.text}}</span>
        <el-input v-else v-model="department.text"></el-input>
      </el-form-item>

      <el-form-item label="科室编码" prop="code">
        <span v-if="type === 'check' || type === 'update'">{{department.code}}</span>
        <el-input v-if="type === 'add'" v-model="department.code"></el-input>
      </el-form-item>

      <el-form-item label="科室logo" prop="logoUrl">
        <img v-if="type === 'check'" :src="department.logoUrl" style="width: 40px;height: 40px;display: block;"/>
        <el-upload v-else
                   :action="`${headUrl}/internethospital/api/images?type=DEPARTMENTIMG&object-id=${imageId}`"
                   :limit="1"
                   :on-success="uploadSuccess"
                   :file-list="fileList"
                   list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="父级科室" prop="parentText">
        <span v-if="type === 'check' || type === 'update'">{{department.parentText}}</span>
        <el-select
          v-else
          :v-loading="selectLoading"
          v-model="department.parentId"
          filterable remote reserve-keyword placeholder="请输入关键词"
          :remote-method="remoteMethod">
          <el-option
            v-for="item in parentDepartments"
            :key="item.id"
            :label="item.text+'   （'+item.organizationText+'）'"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="参考科室（一级）" prop="referenceId">
        <span v-if="type === 'check' || type === 'update'">{{department.referenceText}}</span>
        <el-select
          v-else
          :v-loading="selectLoading"
          v-model="department.referenceId"
          filterable remote reserve-keyword clearable placeholder="请输入关键词"
          :remote-method="referenceMethod">
          <el-option
            v-for="item in referenceDepartment"
            :key="item.id" :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="department.parentId" label="参考科室（二级）" prop="secondReferenceId">
        <span v-if="type === 'check' || type === 'update'">{{department.secondReferenceText}}</span>
        <el-select
          v-else
          :v-loading="selectLoading"
          v-model="department.secondReferenceId"
          filterable remote reserve-keyword clearable placeholder="请输入关键词"
          :remote-method="secondReferenceMethod">
          <el-option
            v-for="item in secondReferenceDepartment"
            :key="item.id" :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属医院" prop="organizationId">
        <span v-if="type === 'check' || type === 'update'">{{department.organizationText}}</span>
        <el-select v-else
                   v-model="department.organizationId"
                   filterable remote reserve-keyword placeholder="请输入关键词"
                   :remote-method="organizationMethod">
          <el-option
            v-for="item in organizations"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="科室类型">
        <span v-if="type === 'check' || type === 'update'">{{department.type === 'HOSPITAL_DEPARTMENT' ? '医院科室' : '其他'}}</span>
        <el-select v-else v-model="department.type" placeholder="请选择科室类型">
          <el-option
            key="HOSPITAL_DEPARTMENT"
            label="医院科室"
            value="HOSPITAL_DEPARTMENT">
          </el-option>
          <!--<el-option label="其它" value=""></el-option>-->
        </el-select>
      </el-form-item>

      <el-form-item label="详细介绍" prop="longText">
        <p v-if="type === 'check'">{{department.longText}}</p>
        <mavon-editor v-else v-model="department.longText"/>
      </el-form-item>


    </el-form>
  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "organization-department-detail",
    data () {
      return {
        departments:'',
        code:'',
        type: '',
        header: '',
        organizationDepartment:'',
        parent:[],
        fileList:[],
        headUrl: `${conf.url}`,
        department: {
          id: "",
          code: "",
          name: "",
          text: "",
          type:'HOSPITAL_DEPARTMENT',
          logo: "",
          parentText: '',
          parentId: "",
          referenceId: "",
          referenceText: '',
          secondReferenceId: "",
          secondReferenceText: "",
          standDepartment: false,
          organizationId: "",
          organizationText: "",
          sort: 0,
        },
        organizations:[],
        referenceDepartment:[],
        secondReferenceDepartment:[],
        parentDepartments: [],
        rules: {
          code: [
            { required: true, message: '请输入科室编码', trigger: 'blur'}
          ],
          text: [
            { required: true, message: '请输入科室名称', trigger: 'blur'}
          ],
          referenceId: [
            {required: true, message: '请选择一级参考科室', trigger: 'blur'}
          ],
          organizationId: [
            {required: true, message: '请选择医院', trigger: 'blur'}
          ],
          secondReferenceId: [
            {required: true, message: '请选择二级参考科室', trigger: 'blur'}
          ],
        },
        selectLoading: false,
        hospitalName: [],
        logoUrl: '',
        isDataManager: false,
        currentPage: 1,
        userInfo: {},
        imageUrl: '',
        fileList2: [],
        imageId: '',
        filePath: '',
        input: ''
      }

    },
    activated () {
      this.$refs['departments'].resetFields();
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }else {
        this.department = {
          id: "",
          code: "",
          name: "",
          text: "",
          type:'HOSPITAL_DEPARTMENT',
          logo: "",
          parentText: '',
          parentId: "",
          referenceId: "",
          referenceText: '',
          secondReferenceId: "",
          secondReferenceText: "",
          standDepartment: false,
          organizationId: "",
          organizationText: "",
          sort: 0,
        }
        this.logoUrl = ''
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();
    },

    methods: {
      getInfo (id) {
        const url = `${conf.url}/internethospital/api/departments/${id}`;
        console.log('url',url);
        ax.get(url).then(res => {
          console.log('请求科室res:::::::',res);
            if (res.data.referenceId) {
              let url = `${conf.url}/internethospital/api/departments/${res.data.referenceId}`;
              ax.get(url).then(resc => {
                console.log('请求参考科室resp::::::::',resc);
                res.data.referenceText = resc.data.text;
                res.data.referenceId = resc.data.id;
                console.log('参考科室赋值后::::::::',res.data);

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
                } else {
                  this.department = res.data;
                  if(res.data.logoUrl){
                    let fileList = {'name':res.data.text,'url':res.data.logoUrl,};
                    this.logoUrl = res.data.logoUrl
                    this.fileList.push(fileList)
                  }
                };

              });
            }else {
              if(res.data.logoUrl){
                console.log('ffff');
                this.department = res.data;
                let fileList = {'name':res.data.text,'url':res.data.logoUrl,};
                this.logoUrl = res.data.logoUrl
                this.fileList.push(fileList)
              }
            };
        }).catch(err => {
          console.log(err);
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          });
        })
      },
      //父级科室查询
      remoteMethod(query) {
        if(query && query !== " "){
          this.selectLoading = true;
          const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=10000&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true&stand-department=false`;
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

      //所属机构查询
      organizationMethod(query) {
        if(query && query !== " "){
          this.selectLoading = true;
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=10000&text=${query}&type=HOSPITAL`;
          ax.get(url, this.header).then(res => {
            console.log(res)
            console.log('机构关键字查询query：'.query);
            this.organizations = res.data.content;
            this.selectLoading = false;
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
          })
        }
      },

      //参考科室查询
      referenceMethod(query) {
        if(query && query !== " "){
          this.selectLoading = true;
          const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true&stand-department=true`;
          ax.get(url, this.header).then(res => {
            this.referenceDepartment = res.data.content;
            this.selectLoading = false;
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
          })
        }
      },

      //二级参考科室查询
      secondReferenceMethod(query) {
        if(query && query !== " "){
          if(this.department.referenceId) {
            this.selectLoading = true;
            const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=10&parent-id=${this.department.referenceId}`;
            ax.get(url, this.header).then(res => {
              this.secondReferenceDepartment = res.data.content;
              this.selectLoading = false;
            }).catch(err => {
              this.$message({
                message: err.response.data.message,
                type: 'warning'
              });
            })
          }else {
            this.$message({
              message: '请先选择一级参考科室',
              type:'warning'
            })
          }
        }
      },


      create (){
        this.$refs['departments'].validate(data => {
          if (!(this.department.code
            && this.department.text
            && this.department.referenceId
            && this.department.organizationId)) {
            return false;
          } else {
            if (this.department.parentId && !this.department.secondReferenceId ) {
              return false;
            }
            const url = `${conf.url}/internethospital/api/departments`;
            const data = {
              "code": this.department.code,
              "logoUrl": this.logoUrl,
              "parentId": this.department.parentId === '' ? null : this.department.parentId,
              "organizationId": this.department.organizationId,
              "standDepartment": this.department.standDepartment,
              "referenceId": this.department.secondReferenceId || this.department.referenceId,
              "text": this.department.text,
              "longText": this.department.longText,
              "type": this.department.type
            };
            ax.post(url, data, this.header).then(res => {
              this.$message({
                message: '创建成功',
                type: 'success'
              });
              this.cancel();
            }).catch(err => {
              console.log(err);
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
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
              message: '修改医院科室成功',
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

      deleteRow (id) {
        const url = `${conf.url}/internethospital/api/departments/${id}`;
        ax.delete(url, this.header).then(res => {
          console.log(res);
          this.getInfo()
        }).catch(err => {
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          });
        })
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
