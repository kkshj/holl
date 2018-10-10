<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>医院信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">返回</el-button>
      </el-col>
    </el-row>

    <el-form ref="organizations" :model="hospital" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="医院名称" prop="text">
        <span v-if="type === 'check'">{{hospital.text}}</span>
        <el-input v-else :disabled="type === 'update'" v-model="hospital.text"></el-input>
      </el-form-item>
      <el-form-item label="医院编码" prop="code">
        <span v-if="type === 'check'">{{hospital.code}}</span>
        <el-input v-else :disabled="type === 'update'" v-model="hospital.code"></el-input>
      </el-form-item>

      <el-form-item label="医院logo" prop="logoUrl">
        <img v-if="type === 'check'" :src="hospital.logoUrl" style="width: 40px;height: 40px;display: block;"/>
        <el-upload v-else
          :action="headUrl + '/internethospital/api/images?type=HOSPITALIMG&object-id= ' + imageId"
          :limit="1"
          :on-success="uploadSuccess"
          :file-list="fileList2"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>

      <!--<el-form-item label="机构标签" prop="label">-->
        <!--<span v-if="type === 'check'">{{hospital.label}}</span>-->
        <!--<el-input v-else v-model="hospital.label"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="医院地址" prop="address">
        <span v-if="type === 'check'">{{hospital.address}}</span>
        <el-input v-else v-model="hospital.address"></el-input>
      </el-form-item>
      <el-form-item label="纬度( °)" prop="latitude">
        <span v-if="type === 'check'">{{hospital.latitude}}</span>
        <el-input-number :min="-90" :max="90"  v-else v-model="hospital.latitude"></el-input-number>
      </el-form-item>
      <el-form-item label="经度( °)" prop="longitude">
        <span v-if="type === 'check'">{{hospital.longitude}}</span>
        <el-input-number :min="-180" :max="180" v-else v-model="hospital.longitude"></el-input-number>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <span v-if="type === 'check'">{{hospital.contactPhone}}</span>
        <el-input v-else type='number' v-model="hospital.contactPhone"></el-input>
      </el-form-item>

      <!--<el-form-item label="机构类型" prop="type">-->
        <!--<span v-if="type === 'check' || type === 'update'">{{hospital.type}}</span>-->
        <!--<el-select v-if="type === 'add'" v-model="hospital.type" placeholder="请选择部门类型">-->
          <!--<el-option label="HOSPITAL" value="HOSPITAL"></el-option>-->
          <!--<el-option label="PLATFORM" value="PLATFORM"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="详细介绍" prop="longText">
        <p v-if="type === 'check'">{{hospital.longText}}</p>
        <mavon-editor v-else v-model="hospital.longText"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "hospital-detail",
    data () {
      return {
        code:'',
        type: '',
        header: '',
        headUrl: `${conf.url}`,

        organizations:'',
        hospital: {
          address: "",
          code: "",
          contactPhone: "",
          label: "",
          latitude:'',
          logoUrl: "",
          longText: "",
          longitude:'',
          text: "",
          type: "HOSPITAL"
        },

        data:[],
        fileList:[],
        fileList2:[],
        rules: {
          address: [
            { required: true, message: '请输入机构地址', trigger: 'blur'}
          ],
          contactPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur'}
          ],
          text: [
            { required: true, message: '请输入医院名称', trigger: 'blur'}
          ],

        },
        selectLoading: false,
        hospitalName: [],
        signatureImage: '',
        isDataManager: false,
        currentPage: 1,
        userInfo: {},
        imageId: '',
      }

    },


    activated () {
      this.$refs['organizations'].resetFields();
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }else {
        this.hospital = {
          "address": '',
          "code": '',
          "contactPhone": '',
          "label": '',
          "latitude": '',
          "longitude": '',
          "logoUrl": '',
          "longText": '',
          "text": '',
          "type": ''
        }
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();

    },

    methods: {
      getInfo (id) {
        // console.log('请求机构详情getInfo:', id);
        const url = `${conf.url}/internethospital/api/organizations/${id}`;
        ax.get(url).then(res => {
          console.log(res);
          this.hospital = res.data;
          if(res.data.logoUrl){
            let fileList = {
              'name':res.data.text,
              'url':res.data.logoUrl,
            };
            this.logoUrl = res.data.logoUrl
            this.fileList2.push(fileList)
            // console.log('fileList:',this.fileList)
          }
        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },

      // remoteMethod(query) {
      //   if(query && query !== " "){
      //     this.selectLoading = true;
      //     const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&type=HOSPITAL_DEPARTMENT&text=${query}`;
      //     ax.get(url, this.header).then(res => {
      //       console.log(res)
      //       this.departments = res.data.content;
      //       this.selectLoading = false;
      //     }).catch(err => {
      //       this.$message({
      //         message: err.response.data.message,
      //         type: 'warning'
      //       });
      //     })
      //   }
      // },

      create (){
        const url = `${conf.url}/internethospital/api/organizations`;
        this.$refs['organizations'].validate(data => {
          console.log("111");
          if (!(this.logoUrl
            &&this.hospital.contactPhone
            &&this.hospital.address
            &&this.hospital.text)) {
            if(!this.logoUrl){
              this.$message({
                message: '请添加医院LOGO',
                type: 'success'
              });
            }
            return false;
          } else {
            const data = {
              "address": this.hospital.address,
              "code": this.hospital.code,
              "contactPhone": this.hospital.contactPhone,
              "label": this.hospital.label,
              "latitude": this.hospital.latitude,
              "longitude": this.hospital.longitude,
              "logoUrl": this.logoUrl,
              // "logoUrl": this.filePath || this.hospital.logoUrl,
              // "parentId": this.department.parentId === '' ? null : this.department.parentId,
              "longText": this.hospital.longText === '' ? null : this.hospital.longText,
              "text": this.hospital.text,
              "type": 'HOSPITAL'
            };
            ax.post(url, data,this.header).then(res => {
              console.log(res);
              this.$message({
                message: '创建医院成功',
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
        console.log('更新机构update-Id::::', this.$route.query.id);
        const url = `${conf.url}/internethospital/api/organizations/${this.$route.query.id}`;
        if (!(this.logoUrl
          &&this.hospital.contactPhone
          &&this.hospital.address
          &&this.hospital.text)) {
          if(!this.logoUrl){
            this.$message({
              message: '请添加医院LOGO',
              type: 'success'
            });
          }
          return false;
        } else {
          const data = {
            "address": this.hospital.address,
            "contactPhone": this.hospital.contactPhone,
            "latitude": this.hospital.latitude,
            "longitude": this.hospital.longitude,
            // "logoUrl": this.filePath === '' ? null : this.hospital.logoUrl,
            "logoUrl": this.logoUrl || this.hospital.logoUrl,
            // "logoUrl": this.logoUrl,
            "longText": this.hospital.longText,
            "text": this.hospital.text,
            "type": "HOSPITAL"
          };
          ax.put(url, data, this.header).then(res => {
            console.log('0000000', url, data)
            this.$message({
              message: '修改医院成功',
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

      cancel () {
          this.$router.back(-1);
          this.fileList = [];
          this.fileList2 = []
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
