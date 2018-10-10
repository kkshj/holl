<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>护士信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="nurse" :model="nurse" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item v-if="type==='add'" label="账号" prop="username">
        <!--<span v-if="type==='check'">{{nurse.username}}</span>-->
        <el-input v-model="nurse.username" maxlength="11"  placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="护士姓名" prop="nurseName">
        <span v-if="type==='check'">{{nurse.nurseName}}</span>
        <el-input v-else v-model="nurse.nurseName" placeholder="请输入护士姓名"></el-input>
      </el-form-item>
      <el-form-item label="护士头像" prop="nurseAvatar">
        <img  v-if="type === 'check'" :src="nurse.nurseAvatar" style="width: 60px;height: 80px;display: block;"/>
        <el-upload v-else
                   :action="IMAGEURL + '/internethospital/api/images?type=NURSEPORTRAIT&object-id= ' + imageId"
                   :limit="1"
                   :auto-upload="true"
                   :file-list="fileList2"
                   list-type="picture"
                   :on-success="uploadSuccess">
          <el-button  size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">图片文件不超过1MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="职称" prop="positionalTitleId">
        <span v-if="type === 'check'">{{nurse.positionalTitleText}}</span>
        <el-select
          :disabled="positionalTitleIdDisabled"
          v-else
          v-model="nurse.positionalTitleId"
          filterable
          remote
          placeholder="护士职称"
          :remote-method="positionalTitleMethod">
          <el-option
            v-for="item in positionalTitleOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属医院" prop="organizationText">
        <span v-if="type === 'check'">{{nurse.organizationText}}</span>
        <el-select
          v-else
          :disabled="organizationTextDisabled"
          v-model="nurse.organizationId"
          filterable
          remote
          placeholder="护士所属医院"
          :remote-method="remoteHospitalMethod">
          <el-option
            v-for="item in hospitalOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="type == 'check' ? '所属科室' : '所属科室（一级）'" prop="departmentId">
        <span v-if="type==='check'">{{nurse.departmentText}}</span>
        <el-select
          v-else
          :disabled="departmentTextDisabled"
          v-model="nurse.departmentId"
          filterable
          remote
          placeholder="护士所属科室（一级）"
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
      <el-form-item v-if="type === 'add'||type === 'update'" label="所属科室（二级）" prop="secondDepartmentId">
        <el-select
          :disabled="secondDepartmentIdDisabled"
          v-model="nurse.secondDepartmentId"
          filterable
          remote
          placeholder="护士所属科室（二级）"
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
      <el-form-item label="护士简介" prop="text">
        <span v-if="type==='check'">{{nurse.text}}</span>
        <el-input v-else v-model="nurse.text" placeholder="请输入护士简介"></el-input>
      </el-form-item>
      <el-form-item label="详细介绍" prop="longtext">
        <span v-if="type==='check'">{{nurse.longtext}}</span>
        <mavon-editor v-else v-model="nurse.longtext"/>
      </el-form-item>
    </el-form>
    <el-form v-if="type==='add'"  :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="140px" class="demo-dynamic">
      <el-form-item
        v-for="(detail, index) in dynamicValidateForm.details"
        :label="'护士服务产品' + (index+1)"
        :key="detail.key"
        :prop="'details.' + index"
        :rules="{
      required: true, message: '详情不能为空', trigger: 'blur'
    }"
      >
        <el-form :inline="true" :model="detail" :rules="detailRule" class="demo-form-inline">
          <!--<el-select
            v-model="detail.code"
            filterable
            remote
            placeholder="请输入服务描述"
            :remote-method="remoteProductTextMethod">
            <el-option
              v-for="item in productTextOptions"
              :key="item.text"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>-->
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
      </el-form-item>
      <el-form-item>
        <el-button @click="addDetail">新增详情</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "nurse-detail",
    data () {
      return {
        type: '',
        header: '',
        nurse: {
          username: '',
          longtext: '',
          nurseAvatar: '',
          nurseName: '',
          standPositionalTitleId: '',
          text: '',
          organizationId: '',
          organizationText: '',
          positionalTitleText: '',
          positionalTitleId: '',
          departmentText: '',
          departmentId: '',
          secondDepartmentId: '',
        },
        imageId:'',
        hospitalOptions: [],
        departmentOptions: [],
        secondDepartmentOptions: [],
        positionalTitleOptions: [],
        standPositionalTitleOptions:[],//标准职称描述
        codeOptions:[{
          value: 'CONSULT_FREE',
          label: '义诊'
        }, {
          value: 'CONSULT',
          label: '网络咨询'
        }],
        rules: {
          username: [{required: true, message: '请输入长度为11位账号', trigger: 'blur'}],
          nurseName: [{required: true, message: '请输入护士姓名', trigger: 'blur'}],
          departmentId: [{required: true, message: '请输入科室名称', trigger: 'blur'}]
        },
        /*批量添加*/
        dynamicValidateForm: {
          details: [{
            text:'',//服务描述
            code:'',//服务产品code
            price:'',//服务价格
            priceDisabled:false
          }]
        },
        productTextOptions:[],//产品描述
        fileList:[],
        fileList2:[],
        IMAGEURL:`${conf.url}`,
        positionalTitleIdDisabled:false,
        organizationTextDisabled:false,
        departmentTextDisabled:false,
        secondDepartmentIdDisabled:false,
        detailRule:{
          price: [
            {required: true, message: '请输入服务价格'}
          ]
        }
      }
    },
    activated () {
      /*进来编辑界面。默认设置为false*/
      this.positionalTitleIdDisabled = false;
      this.organizationTextDisabled = false;
      this.departmentTextDisabled = false;
      this.secondDepartmentIdDisabled = false;
      this.$refs['nurse'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      this.fileList = [];
      this.fileList2 = []
      //console.log(this.$route.query);
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把nurselsit赋值为空*/
        this.nurse={};
        this.dynamicValidateForm= {
          details: [{
            code:'',//服务产品code
            price:''//服务价格
          }]
        }
      }
    },
    methods: {
      getInfo (id) {
        if(this.type ==='update'){
          this.positionalTitleIdDisabled = true;
          this.organizationTextDisabled = true;
          this.departmentTextDisabled = true;
          this.secondDepartmentIdDisabled = true;
        }
        //console.log('请求护士详情', id);
        /*查看护士详细信息*/
        const url = `${conf.url}/internethospital/api/nurses/${id}`;
        ax.get(url,this.header).then(res => {
          //console.log(res);
          const url = `${conf.url}/internethospital/api/departments/${res.data.departmentId}`;
          ax.get(url).then(resp => {
            res.data.departmentText = resp.data.text;
            if (resp.data.parentId) {
              res.data.secondDepartmentId = resp.data.id;
              const url = `${conf.url}/internethospital/api/departments/${resp.data.parentId}`;
              ax.get(url).then(response => {
                res.data.departmentId = response.data.id;
                this.nurse = res.data;
                let fileList = {
                  'name':res.data.nurseName,
                  'url':res.data.nurseAvatar,
                };
                this.fileList2.push(fileList)
              })
            } else {
              this.nurse = res.data;
              let fileList = {
                'name':res.data.nurseName,
                'url':res.data.nurseAvatar,
              };
              this.fileList2.push(fileList)
            }
            //console.log(resp.parentId);
          })
        }).catch(err => {
          console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
        })
      },
      /*下载图片*/
      uploadSuccess (response, file, fileList) {
        if(file.size/1024 <= 1024){
          this.nurse.nurseAvatar = response.path
        }else{
          this.fileList = [];
          this.fileList2 = [];
          this.$message({
            type: 'warning',
            message: '上传图片大小不能大于1MB，请重新上传'
          })
        }
      },
      positionalTitleMethod (query) {
        const url = `${conf.url}/internethospital/api/positional_titles?page-index=1&page-size=100`;
        ax.get(url,this.header).then(res =>{
          this.positionalTitleOptions = res.data.content;
        })
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
          if (this.nurse.organizationId) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT&show-all=true&organization-id=${this.nurse.organizationId}`;
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
      remoteSecondDepartmentMethod (query) {
        if (query) {
          if (this.nurse.departmentId) {
            let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&parent-id=${this.nurse.departmentId}`;
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
      /*添加护士*/
      create () {
        this.$refs['nurse'].validate(data => {
          if (!data) {
            return false
          } else {
            //console.log("添加护士信息")
            const url = `${conf.url}/internethospital/api/nurses`;
            let data = {
              "departmentId": this.nurse.secondDepartmentId || this.nurse.departmentId,
              "longText": this.nurse.longtext,
              "nurseAvatar": this.nurse.nurseAvatar,
              "positionalTitleId": this.nurse.positionalTitleId,
              "realName": this.nurse.nurseName,
              "standPositionalTitleId": this.nurse.standPositionalTitleId,
              "text": this.nurse.text,
              "username": this.nurse.username,
              "nurseServiceProducts":this.dynamicValidateForm.details
            }
            //console.log(data)
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
        })

      },
      update () {
        this.$refs['nurse'].validate((data) =>{
          if(!data){
            return false
          }else{
            //console.log('修改护士信息');
            const url = `${conf.url}/internethospital/api/nurses/${this.$route.query.id}`;
            let data = {
              "departmentId": this.nurse.secondDepartmentId || this.nurse.departmentId,
              "longText": this.nurse.longtext,
              "nurseAvatar": this.nurse.nurseAvatar,
              "positionalTitleId": this.nurse.positionalTitleId,
              "realName": this.nurse.nurseName,
              "standPositionalTitleId": this.nurse.standPositionalTitleId,
              "text": this.nurse.text
            }
            /*请求后台修改*/
            ax.put(url,data,this.header
            ).then(res=>{
            }).then(res=>{
              this.$message({
                type:'success',
                message:'保存成功'
              })
              /*修改完成后，设置页面类型为check*/
              this.cancel();
            }).catch(err =>{
              console.log(err);
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
            })
          }
        })
      },
      cancel () {
        this.$router.back(-1);
        this.fileList = [];
        this.fileList2 = []
      },
      /*机构查询*/
      remoteOrganizationMethod(str){
        //console.log("机构关键字查询",str);
        const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=10000&text=${str}`;
        ax.get(url,this.header).then(res =>{
          this.organizationOptions = res.data.content;
        })
      },
      /*所属科室关键字查询*/
      remoteDepartmentMethod(str) {
        //console.log("所属科室关键字查询",str);
        const url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=10000&show-all=true&organization-id=${this.nurse.organizationId}&text=${str}`;
        ax.get(url,this.header).then(res =>{
          //console.log(res.data.content)
          this.departmentOptions = res.data.content;
        })
      },
      /*模糊查询职称*/
      remotepositionalTitleMethod(str){
        //console.log("职称关键字模糊查询",str);
        const url = `${conf.url}/internethospital/api/positional_titles?hospitalId=${this.nurse.organizationId}`;
        ax.get(url,this.header).then(res =>{
          this.positionalTitleOptions = res.data;
        })
      },
      remotestandPositionalTitleMethod(str){
        //console.log("标准职称关键字查询",str)
      },
      removeDetail(item) {
        var index = this.dynamicValidateForm.details.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.details.splice(index, 1)
        }
      },
      addDetail() {
        this.dynamicValidateForm.details.push({

          code:'',//服务产品code
          price:''//服务价格
        });
      },
      chooseCode(value, i){
        if(value === 'CONSULT_FREE'){
          this.dynamicValidateForm.details[i].priceDisabled = true;
        }else{
          this.dynamicValidateForm.details[i].priceDisabled = false;
        }
      },
      /*remoteProductTextMethod(str){//护士服务产品查询
        if(str){
          const url = `${conf.url}/internethospital/api/products?page-index=1&page-size=100&type=CONSULT&name=${str}`;
          ax.get(url,this.header).then(res => {
            this.productTextOptions = res.data.content;
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

  .el-form{
    width: 70%;
    margin: 0 auto;
  }
  .el-select{
    width: 100%;
  }
  .el-form-item{
    text-align: left;
  }
</style>
