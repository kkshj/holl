<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>轮播图信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">返回</el-button>
      </el-col>
    </el-row>

    <el-form ref="shufflings" :model="shufflings" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">

      <el-form-item label="轮播图缩略图" prop="imgUrl">
        <img v-if="type === 'check'" :src="shufflings.imgUrl" style="width: 40px;height: 40px;display: block;"/>
        <el-upload v-else
                   :action="headUrl + '/internethospital/api/images?type=IMAGESHUFFLING&object-id=' + imageId"
                   :limit="1"
                   :on-success="uploadSuccess"
                   :file-list="fileList2"
                   list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="所属医院" prop="organizationText">
        <span v-if="type === 'check'">{{shufflings.organizationId}}</span>
        <el-select v-else v-model="shufflings.organizationId"
                   filterable remote
                   placeholder="轮播图所属医院"
                   :remote-method="remoteHospitalMethod">
          <el-option v-for="item in hospitalOptions"
                     :key="item.id"
                     :label="item.text"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转类型" prop="jumpType">
        <span v-if="type === 'check'">{{shufflings.jumpType}}</span>
        <el-select v-else v-model="shufflings.jumpType" placeholder="请选择跳转类型">
          <el-option label="内部" value="INTERNAL"></el-option>
          <el-option label="外部" value="EXTERNA"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="平台类型" prop="platformType">
        <span v-if="type === 'check'">{{shufflings.platformType}}</span>
        <el-select v-else v-model="shufflings.platformType" placeholder="请选择平台类型">
          <el-option label="WEB" value="WEB"></el-option>
          <el-option label="WECHAT" value="WECHAT"></el-option>
          <el-option label="IOS" value="IOS"></el-option>
          <el-option label="ANDROID" value="ANDROID"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转链接" prop="skipLinks">
        <span v-if="type === 'check'">{{shufflings.skipLinks}}</span>
        <el-input v-else v-model="shufflings.skipLinks">
          <template v-if="shufflings.jumpType === 'EXTERNA'" slot="prepend">https://</template>
          <template v-if="shufflings.jumpType === 'INTERNALx'" slot="prepend">/pages/</template>
        </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "image-shufflings-detail",
    data () {
      return {
        code:'',
        type: '',
        header: '',
        headUrl: `${conf.url}`,

        shufflings: {
          id: "",
          imgUrl: "",
          platformType: "",
          organizationId: "",
          jumpType: "",
          skipLinks: ""
        },
        hospitalOptions: [],
        data:[],
        fileList:[],
        fileList2:[],
        rules: {
          imgUrl: [
            { required: true, message: '请选择轮播图片', trigger: 'blur'}
          ],
          jumpType: [
            { required: true, message: '请选择跳转类型', trigger: 'blur'}
          ],
          platformType: [
            { required: true, message: '请选择平台类型', trigger: 'blur'}
          ]
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
      this.$refs['shufflings'].resetFields();
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }else {
        this.shufflings = {
          "imgUrl": '',
          "jumpType": '',
          "organizationId": '',
          "platformType": '',
          "skipLinks": '',
        }
      }
      this.imageId = 'departmentHeader' + Math.random() + Math.random();
    },

    mounted() {
    },

    methods: {
      getInfo (id) {
        const url = `${conf.url}/internethospital/api/image-shufflings/${id}`;
        ax.get(url).then(res => {
          console.log(res);
          this.shufflings = res.data;
          if(res.data.imgUrl){
            let fileList = {
              'name':res.data.text,
              'url':res.data.imgUrl,
            };
            this.imgUrl = res.data.imgUrl
            this.fileList2.push(fileList)
            console.log('fileList:',this.fileList)
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
        const url = `${conf.url}/internethospital/api/image-shufflings`;
        this.$refs['shufflings'].validate(data => {
          console.log("111");
          if (!(this.imgUrl
            &&this.shufflings.jumpType
            &&this.shufflings.platformType)) {
            if(!this.imgUrl){
              this.$message({
                message: '请添加医院LOGO',
                type: 'warning'
              });
              return false;
            }
          } else {
            const data = {
              // "imgUrl": this.filePath || this.shufflings.imgUrl,
              "imgUrl": this.imgUrl,
              "jumpType": this.shufflings.jumpType,
              "organizationId": this.shufflings.organizationId,
              "platformType": this.shufflings.platformType,
              "skipLinks": this.shufflings.skipLinks,
            };
            ax.post(url, data,this.header).then(res => {
              console.log(res);
              this.$message({
                message: '添加轮播图成功',
                type: 'success'
              });
              this.cancel();
            }).catch(err => {
              this.$message({
                message: err.response.data.message,
                type: 'warning'
              });
              this.$message({
                message: '创建失败，请稍后再试',
                type: 'warning'
              });
              console.log(err);
              this.cancel();
            })
          }
        });
      },

      update () {
        console.log('更新轮播图update-Id::::', this.$route.query.id);
        const url = `${conf.url}/internethospital/api/image-shufflings/${this.$route.query.id}`;
        if (!(this.imgUrl
          &&this.shufflings.jumpType
          &&this.shufflings.platformType)) {
          if(!this.imgUrl){
            this.$message({
              message: '请添加医院LOGO',
              type: 'success'
            });
            return false;
          }
        } else {
          const data = {
            "imgUrl": this.imgUrl || this.shufflings.imgUrl,
            // "imgUrl": this.imgUrl,
            "jumpType": this.shufflings.jumpType,
            "organizationId": this.shufflings.organizationId,
            "platformType": this.shufflings.platformType,
            "skipLinks": this.shufflings.skipLinks,
          };
          ax.put(url, data, this.header).then(res => {
            console.log('0000000', url, data)
            this.$message({
              message: '更改轮播图参数成功',
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

      // 所属医院查询
      remoteHospitalMethod (query) {
        if (query) {
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=1000&text=${query}&type=HOSPITAL`;
          ax.get(url,this.header).then(res =>{
            this.hospitalOptions = res.data.content;
          })
        }
      },

      uploadSuccess (response, file, fileList) {
        if(file.size/1024 <= 1024){
          this.imgUrl = response.path
          console.log(response);
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
