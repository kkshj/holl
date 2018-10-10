<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>状态参数配置信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="statusProfiles" :model="statusProfiles" label-width="160px" :rules="rules" style="width: 70%; margin: 20px auto;">

      <el-form-item  label="编码" prop="code">
        <span  v-if="type==='check'">{{statusProfiles.code}}</span>
        <el-input v-else  v-model="statusProfiles.code"></el-input>
      </el-form-item>
      <el-form-item  label="文本描述" prop="text">
        <span v-if="type==='check'">{{statusProfiles.text}}</span>
        <el-input v-else  v-model="statusProfiles.text"></el-input>
      </el-form-item>
      <el-form-item  label="长文本描述" prop="longText">
        <span  v-if="type==='check'">{{statusProfiles.longText}}</span>
        <mavon-editor v-else v-model="statusProfiles.longText"/>
      </el-form-item>
      <el-form-item v-if="type==='check'" label="详情" prop="details">
      </el-form-item>
      <el-table v-if="type==='check'" :data="statusProfilesDetails" style="width: 100%">
        <el-table-column align="left" type="index"></el-table-column>
        <el-table-column align="left" label="状态编码" prop="code"></el-table-column>
        <el-table-column align="left" label="文本描述" prop="text"></el-table-column>
        <el-table-column align="left" label="长文本描述" prop="longText"></el-table-column>
      </el-table>

      <el-form v-if="type==='add'"  :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          v-for="(detail, index) in dynamicValidateForm.details"
          :label="'添加详情' + (index+1)"
          :key="detail.key"
          :prop="'details.' + index"
          :rules="{
      required: true, message: '详情不能为空', trigger: 'blur'
    }"
        >
          <el-form  :inline="true" :model="detail" :rules="detailRule" class="demo-form-inline">
            <el-form-item label="序号" prop="sequence">
              <el-input type="number" v-model="detail.sequence" placeholder="请输入整数"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="状态编码" prop="code">
              <el-input v-model="detail.code" placeholder="状态编码"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="文本描述" prop="text">
              <el-input v-model="detail.text" placeholder="文本描述"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="长文本描述" prop="longText">
              <el-input v-model="detail.longText" placeholder="长文本描述"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="授权代码" prop="authCode">
              <el-input v-model="detail.authCode" placeholder="授权代码"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="最低状态序号" prop="lowSequence">
              <el-input type="number" v-model="detail.lowSequence" placeholder="请输入正整数"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="最高状态序号" prop="highSequence">
              <el-input type="number" v-model="detail.highSequence" placeholder="请输入正整数"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="初始状态" prop="init">
              <template>
                <el-select v-model="detail.init" clearable placeholder="请选择">
                  <el-option
                    v-for="item in initOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <br>
            <el-form-item label="完成状态" prop="completed">
              <template>
                <el-select v-model="detail.completed" clearable placeholder="请选择">
                  <el-option
                    v-for="item in completedOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-form>
          <el-button @click.prevent="removeDetail(detail)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
          <el-button @click="addDetail">新增详情</el-button>
        </el-form-item>
      </el-form>
    </el-form>

  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderItemType-detail",
    data () {
      return {
        type: '',
        header: '',
        statusProfiles: {},
        /*详情集合*/
        statusProfilesDetails:[],
        rules: {
          code: [
            {required: true, message: '请输入编码',trigger: 'blur'}
          ],
          text: [
            {required: true, message: '请输入文本描述',trigger: 'blur'}
          ],

        },
        detailRule:{
          sequence: [
            {required: true, message: '请输入整数序号（不能重复）',trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入状态编码',trigger: 'blur'}
          ],
          text: [
            {required: true, message: '请输入文本描述',trigger: 'blur'}
          ],
          lowSequence: [
            {required: true, message: '请输入最低状态序号',trigger: 'blur'}
          ],
          highSequence: [
            {required: true, message: '请输入最高状态序号',trigger: 'blur'}
          ],
          init: [
            {required: true, message: '初始状态不能为空',trigger: 'blur'}
          ],
          completed: [
            {required: true, message: '完成状态不能为空',trigger: 'blur'}
          ],
        },
        /*批量添加*/
        dynamicValidateForm: {
          details: [{
            sequence: '',//序号
            code: '',//状态编码
            text:'',//文本描述
            longText:'',//长文本描述
            authCode:'',//授权代码
            lowSequence:'',//最低状态序号
            highSequence:'',//最高状态序号
            init:'',//初始状态
            completed:''//完成状态
          }]
        },
        /*初始状态选择框*/
        initOptions:[{
          value: 'true',
          label: 'true'
        }, {
          value: 'false',
          label: 'false'
        }],
        /*完成状态选择框*/
        completedOptions:[{
          value: 'true',
          label: 'true'
        }, {
          value: 'false',
          label: 'false'
        }]
      }
    },
    activated () {
      this.$refs['statusProfiles'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.statusProfiles={};
        /*把状态参数配置 上次添加的数据清空*/
        this.dynamicValidateForm= {
          details: [{
            sequence: '',//序号
            code: '',//状态编码
            text:'',//文本描述
            longText:'',//长文本描述
            authCode:'',//授权代码
            lowSequence:'',//最低状态序号
            highSequence:'',//最高状态序号
            init:'',//初始状态
            completed:''//完成状态
          }]
        }
      }
    },
    methods: {
      getInfo (id) {
        //console.log('请求状态参数配置详情', id);
        /*查看护士详细信息*/
        const url1 = `${conf.url}/internethospital/api/status-profiles/${id}`;
        ax.get(url1,this.header).then(res => {
          this.statusProfiles = res.data;
          this.statusProfilesDetails = res.data.details;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      /*添加订单行项目类型类型*/
      create () {
        this.$refs['statusProfiles'].validate((data) =>{
          if(!data){
            return false
          }else{
            //console.log("添加状态配置信息")
            const url = `${conf.url}/internethospital/api/status-profiles`;
            let data = {
              "code": this.statusProfiles.code,
              "details": this.dynamicValidateForm.details,
              "longText": this.statusProfiles.longText,
              "text": this.statusProfiles.text
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
        })
      },
      cancel () {
        this.$router.back(-1);
      },
      /*submitForm(formName) {
        console.log(this.dynamicValidateForm.details)
//        this.$refs[formName].validate((valid) => {
//          if (valid) {
//            alert('submit!');
//          } else {
//            console.log('error submit!!');
//            return false;
//          }
//        });
      },*/
      removeDetail(item) {
        var index = this.dynamicValidateForm.details.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.details.splice(index, 1)
        }
      },
      addDetail() {
        this.dynamicValidateForm.details.push({
          sequence: '',//序号
          code: '',//状态编码
          text:'',//文本描述
          longText:'',//长文本描述
          authCode:'',//授权代码
          lowSequence:'',//最低状态序号
          highSequence:'',//最高状态序号
          init:'',//初始状态
          completed:''//完成状态
        });
      },
      onSubmit() {
        console.log('submit!');
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

</style>
