<template>
  <div>
    <el-row class="header">
      <el-col :span="20"><h4>密码修改</h4></el-col>
    </el-row>
    <el-steps :active="active"  align-center>
      <el-step title="确认密码并修改" icon="el-icon-edit"></el-step>
      <el-step title="完成" icon="el-icon-success"></el-step>
      <el-step title="失败" icon="el-icon-error"></el-step>
    </el-steps>
    <el-form ref="password" :model="password" label-width="100px" :rules="rules" v-if="active === 1">
      <el-form-item label="原密码" prop="originally">
        <el-input v-model="password.originally" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input v-model="password.pass" type="password"></el-input>
      </el-form-item>
      <el-form-item label="再确认密码" prop="confirmPassword">
        <el-input v-model="password.confirmPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="confirm('password')">确认</el-button>
        <el-button type="danger" plain @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-row class='success' v-if="active === 2">
      <el-col><span class="el-icon-success"></span></el-col>
      <el-col>密码修改成功！页面将会在{{sec}}秒后跳转至登陆页面。</el-col>
    </el-row>
    <el-row class='error' v-if="active === 3">
      <el-col><span class="el-icon-error"></span></el-col>
      <el-col>密码修改失败！如果您忘了原始密码请联系管理员为您重置；<br/>页面将会在{{sec}}秒后跳转至个人中心。</el-col>
    </el-row>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
    export default {
      name: "change-password",
      data () {
        const validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.password.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          active: 1,
          password: {
            originally: '',
            pass: '',
            confirmPassword: '',
          },
          rules: {
            originally: [
              { required: true, message: '请输入原密码', trigger: 'blur' }
            ],
            pass: [
              { required: true, message: '请输入新密码', trigger: 'blur' }
            ],
            confirmPassword: [
              { validator: validatePass2, trigger: 'blur' }
            ]
          },
          sec: 5,
          header: '',
          token: ''
        }
      },
      mounted () {
        this.token = sessionStorage.getItem('token');
        this.header = {headers: {'X-USER-TOKEN': this.token}};
      },
      methods: {
        confirm (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const url = `${conf.url}/password`;
              ax.put(url, this.password, this.header).then(res => {
                console.log(res);
                this.active= 2;
                sessionStorage.clear();
                const timer = setInterval(()=>{
                  this.sec--;
                  if (this.sec === 0) {
                    clearInterval(timer);
                    this.$router.push("/login");
                  }
                },1000)
              }).catch(err => {
                console.log(err);
                const overdue = /404/g;
                if (overdue.test(err)) {
                  this.$message({
                    message: '登陆验证过期，请重新登陆',
                    type: 'warning'
                  });
                  sessionStorage.clear();
                  setTimeout(()=>{
                    this.$router.push("/login");
                  },3000)
                } else {
                  this.active= 3;
                  const timer = setInterval(()=>{
                    this.sec--;
                    if (this.sec === 0) {
                      clearInterval(timer);
                      this.$router.push("/personal-center");
                    }
                  },1000)
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
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

  .el-steps{
    margin-top: 20px;
  }
  .el-form{
      width: 20vw;
      text-align: left;
      margin-top: 20px;
    }

  .el-row span{
    margin: 60px auto;
    font-size: 60px;
  }
  .el-row.success span{
    color: #67C23A;
  }
  .el-row.error span{
    color: #F56C6C;
  }
</style>
