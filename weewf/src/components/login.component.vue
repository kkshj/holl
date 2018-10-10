<template>
    <div @keyup.enter="login('user')">
      <div class="container">
        <el-form ref="user" :rules="rules" :model="user">
          <h4>用户登陆</h4>
          <el-form-item prop="account">
            <el-input size="large" prefix-icon="el-icon-p" class="el-icon-person" v-model="user.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input size="large" prefix-icon="el-icon-d" class="el-icon-lock" type="password" v-model="user.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-button type="primary" size="small" @click="login('user')">登  陆</el-button>
        </el-form>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="20%">
        <span>{{ dialog }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
    export default {
      name: "login",
      data () {
        return {
          dialogVisible: false,
          dialog: '',
          popover: '',
          user: {
            account: '',
            password: ''
          },

          rules: {
            account: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              // { min: 6, message: '密码长度最少为6个字符 ', trigger: 'blur' }
            ]
          }
        }
      },

      methods: {
        login (formName) {
          const url = `${conf.url}/users/channels/internet-hospital/token`;
          this.$refs[formName].validate((valid) => {
            if (!valid) {
              return false;
            } else {
              const data = {
                "username": this.user.account,
                "password": this.user.password
              };
              ax.post(url, data).then(res => {
                console.log(res.data.access_token);
                console.log(res.data)
                const user = res.data;
                this.$router.push("/home");
                localStorage.setItem('userInfo', JSON.stringify(user));
                /*设置token到localStorage，通过getItem获取*/
                localStorage.setItem('token', user.access_token);
                localStorage.setItem('username', user.username);
              }).catch(err => {
                this.user = {
                  account: '',
                  password: ''
                };
                this.dialogVisible = true;
                this.dialog = err.response.data.message;
              });
            }
          });
        }




        // login (formName) {
        //   const user = {id: '1', token: 'aaa', name: 'llllll'};
        //   this.$router.push("/home");
        //   sessionStorage.setItem('userInfo', JSON.stringify(user[0]));
        //   sessionStorage.setItem('token', user[0].token);
        //
        //   const url = `${conf.url}/login`;
        //   this.$refs[formName].validate((valid) => {
        //     if (!valid) {
        //       return false;
        //     } else {
        //       ax.post(url, this.user).then(res => {
        //         const user = res.data;
        //         this.$router.push("/home");
        //
        //         sessionStorage.setItem('userInfo', JSON.stringify(user[0]));
        //         sessionStorage.setItem('token', user[0].token);
        //       }).catch(err => {
        //         this.user = {
        //           account: '',
        //           password: ''
        //         };
        //         this.dialogVisible = true;
        //         const notFind = /404/g;
        //         const sysErr = /500/g;
        //         const noJurisdiction = /401/g;
        //         if (notFind.test(err)) {
        //           this.dialog = '用户名或密码错误'
        //         } else if (sysErr.test(err)) {
        //           this.dialog = '服务器链接错误，请稍后再试';
        //         } else if (noJurisdiction.test(err)) {
        //           this.dialog = '没有登陆权限，请联系系统管理员';
        //         } else {
        //           this.dialog = '未知错误，请联系系统管理员';
        //           console.log(err);
        //         }
        //       });
        //     }
        //   });
        // }

      }
    }
</script>

<style scoped>
.container{
  width: 1200px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
}
.el-form{
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-top: -260px;
  margin-left: -200px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #F2F6FC;
}
.el-form>h4{
  height: 100px;
  line-height: 100px;
  background-color: #EBEEF5;
  padding-left: 20px;
  text-align: left;
}
.el-form-item{
  padding: 0 20px;
  margin-top: 50px;
}
.el-form .el-button{
  width: 360px;
  margin-top: 30px;
}
</style>
