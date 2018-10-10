<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>医助信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="channel" :model="channel" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="医助姓名" prop="realName">
        <span v-if="type==='check'||type === 'update'">{{channel.realName}}</span>
        <el-input v-else v-model="channel.realName"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="username">
        <span v-if="type==='check'||type === 'update'">{{channel.username}}</span>
        <el-input maxlength="11" v-else v-model="channel.username"></el-input>
      </el-form-item>
      <el-form-item v-if="type==='check'" label="医助编码" prop="code">
        <span >{{channel.code}}</span>
        <!--<el-input  v-model="channel.code"></el-input>-->
      </el-form-item>
      <el-form-item v-if="type==='add'" label="渠道来源" prop="sourceType">
        <el-select v-model="sourceTypeSelect" clearable placeholder="请选择">
          <el-option
            selected
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="text">
        <span v-if="type==='check'">{{channel.text}}</span>
        <el-input v-else v-model="channel.text"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="longText">
        <span v-if="type==='check'">{{channel.longText}}</span>
        <mavon-editor v-else v-model="channel.longText"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderType-detail",
    data () {
      return {
        type: '',
        header: '',
        channel: {
          realName:'',
          username:'',
          code:'',
          sourceType:'',
          text:'',
          longText:''
        },
        sourceTypeSelect:'CHANNEL',
        sourceOptions:[{
          value: 'CHANNEL',
          label: '运营'
        }],
        rules: {
          username: [{ required: true, message: '请输入11位用户账号', trigger: 'blur'}],
          realName: [{ required: true, message: '请输入医助姓名', trigger: 'blur'}],
          //sourceType: [{ required: true, message: '渠道来源不能为空', trigger: 'change'}],
        },
        fullscreenLoading: false
      }
    },
    activated () {
      this.$refs['channel'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.channel={};
      }
    },
    methods: {
      getInfo (id) {
        /*查看医助详情*/
        const url = `${conf.url}/internethospital/api/channel/${id}`;
        ax.get(url,this.header).then(res => {
          this.channel = res.data;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },

      /*添加医助信息*/
      create () {
        this.$refs['channel'].validate((data) =>{
          if(!data){
            return false
          }else{
            this.fullscreenLoading = true;
            //console.log("添加医助信息")
            const url = `${conf.url}/internethospital/api/channel`;
            let data = {
              "longText": this.channel.longText,
              "realName": this.channel.realName,
              "sourceType": this.sourceTypeSelect,
              "text": this.channel.text,
              "username": this.channel.username
            }
            ax.post(url,data,this.header).then(res=>{
              this.fullscreenLoading = false;
              this.$message({
                type:'success',
                message:'保存成功'
              })
              this.cancel()
            }).catch(err =>{
              this.fullscreenLoading = false;
              console.log(err);
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
            })
          }
        })
      },
      update(){
        this.fullscreenLoading = true;
        //console.log('修改医助信息');
        const url = `${conf.url}/internethospital/api/channel/${this.$route.query.id}`;
        let data = {
          "longText": this.channel.longText,
          "text": this.channel.text
        }
        /*请求后台修改*/
        ax.put(url,data,this.header).then(res=>{
          this.fullscreenLoading = false;
          this.$message({
            type:'success',
            message:'保存成功'
          })
          /*修改完成后，设置页面类型为check*/
          this.cancel()
        }).catch(err =>{
          this.fullscreenLoading = false;
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
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

</style>
