<template>
    <div>
      <el-row class="header">
        <el-col :span="20"><h4>用户管理</h4></el-col>
        <el-col :span="4"><el-button type="primary" plain icon="el-icon-plus" @click="addOne=true">添加成员</el-button></el-col>
      </el-row>
      <el-row class="search">
        <el-col :span="6"><el-input placeholder="用户姓名" clearable v-model="condition.userName"></el-input></el-col>
        <el-col :span="7"><el-input placeholder="用户电话" clearable v-model="condition.userPhone"></el-input></el-col>
        <el-col :span="6">
          <el-select v-model="condition.userRole" placeholder="请选择用户权限">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="雇员" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button type="success" plain @click="getInfo()">搜索</el-button>
          <el-button type="danger" plain :disabled="!condition.userName && !condition.userPhone && !condition.userRole" @click="resetCondition()">重置</el-button>
        </el-col>
      </el-row>
      <el-table :data="userInfo" stripe v-loading="loading" style="width: 100%">
        <el-table-column align="left" type="index"></el-table-column>
        <el-table-column align="left" prop="account" label="账号" width="150"></el-table-column>
        <el-table-column align="left" prop="userName" label="姓名"></el-table-column>
        <el-table-column align="left" prop="userPhone" label="电话"></el-table-column>
        <el-table-column align="left" prop="userRole" label="角色">
          <template slot-scope="scope">
            <span>{{ scope.row.userRole === 0 ? "没点--数吗？" : scope.row.userRole === 1 ? "管理员" : scope.row.userRole === 2 ? "雇员" : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="creator" label="创建者"></el-table-column>
        <el-table-column align="left" prop="registerDate" label="创建日期"></el-table-column>
        <el-table-column align="left" prop="status" label="账号状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 0 ? "未激活" : scope.row.status === 1 ? "已激活" : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="handleActive(scope.$index, scope.row)" :disabled="scope.row.status === 1">激活</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="创建用户" :visible.sync="addOne" width="50%">
        <el-form ref="user" :rules="rules" :model="user" label-position="left" label-width="100px">
          <el-form-item label="用户账号" prop="account">
            <el-input v-model="user.account" placeholder="请输入邮箱地址作为账号"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="user.userName" placeholder="请输入用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="userPhone">
            <el-input v-model="user.userPhone" placeholder="请输入用户电话"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="userRole">
            <el-select v-model="user.userRole" placeholder="请选择用户权限">
              <el-option label="管理员" value="1"></el-option>
              <el-option label="雇员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="createNew('user')">立即创建</el-button>
            <el-button type="warning" plain @click="addOne = false">取消</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          width="25%"
          title="提示"
          :visible.sync="alert"
          append-to-body>
          <span>{{ dialog }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="alert = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-dialog>
    </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "user-manager",
    data () {
      return {
        loading: true,
        condition: {
          userName: '',
          userPhone: '',
          userRole: ''
        },
        userInfo: [],
        addOne: false,
        user: {
          account: '',
          userName: '',
          userRole: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g, message: '请输入邮箱作为账号，否则无法激活账号', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户姓名', trigger: 'blur' }
          ],
          userPhone: [
            { required: true, message: '请输入用户电话', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' }
          ],
          userRole: [
            { required: true, message: '请选择用户权限', trigger: 'change' }
          ]
        },
        alert: false,
        dialog: '',
        token: '',
        header: {}
      }
    },
    mounted () {
      this.token = sessionStorage.getItem('token');
      this.header = {headers: {'X-USER-TOKEN': this.token}};
      this.getInfo();
    },
    methods: {
      getInfo () {
        const uRole = this.condition.userRole ? parseInt(this.condition.userRole) : this.condition.userRole;
        let url = `${conf.url}/user?userName=${this.condition.userName}&userPhone=${this.condition.userPhone}&userRole=${uRole}`;
        ax.get(url, this.header).then(res => {
          this.userInfo = res.data;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          const overdue = /404/g;
          const noRight = /401/g;
          const sysErr = /500/g;
          if (overdue.test(err)) {
            this.$message({
              message: '登陆验证过期，请重新登陆',
              type: 'warning'
            });
            sessionStorage.clear();
            setTimeout(()=>{
              this.$router.push("/login");
            },3000)
          } else if (sysErr.test(err)) {
            this.$message({
              message: '服务器链接错误，请稍后再试',
              type: 'warning'
            });
          } else if (noRight.test(err)) {
            this.$message({
              message: '没有权限查看当前页面数据'
            });
          } else {
            this.$message({
              message: '未知错误，请联系系统管理员'
            });
            console.log(err);
          }
        })
      },
      resetCondition () {
        this.condition = {
          userName: '',
          userPhone: '',
          userRole: ''
        }
      },
      createNew (formName) {
        const url = `${conf.url}/user`;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false;
          } else {
            console.log(this.user);
            ax.post(url, this.user, this.header).then(res => {
              this.addOne = false;
              this.loading = true;
              this.getInfo();
              this.user = {
                account: '',
                userName: '',
                userRole: ''
              };
            }).catch(err => {
              this.alert = true;
              this.user = {
                account: '',
                userName: '',
                userRole: ''
              };
              const sysErr = /500/g;
              const alreadyE = /400/g;
              const overdue = /404/g;
              if (sysErr.test(err)) {
                this.dialog = '服务器链接错误，请稍后再试';
              } else if (alreadyE.test(err)) {
                this.dialog = '用户账号已存在';
              } else if (overdue.test(err)) {
                this.dialog = '验证已过期，请从新登陆';
                sessionStorage.clear();
                setTimeout(()=>{
                  this.alert = false;
                  this.$router.push("/login");
                },3000)
              } else {
                this.dialog = '未知错误，请联系系统管理员';
                console.log(err);
              }
            })
          }
        });
      },
      handleActive (i, data) {
        console.log(data);
        const url = `${conf.url}/active`;
        const info = {email: data.account};
        ax.post(url, info, this.header).then(res => {
          this.$message({
            message: '邮件已发送,请通知账号使用者查收',
          });
        }).catch(err => {
          console.log(err);
          const unknownE = /400/g;
          const noRight = /401/g;
          const overdue = /404/g;
          if (unknownE.test(err)) {
            this.$message({
              message: '服务器链接错误，请稍后再试',
              type: 'warning'
            });
          } else if (noRight.test(err)) {
            this.$message({
              message: '没有权限进行这个操作',
              type: 'danger'
            });
          } else if (overdue.test(err)) {
            this.$message({
              message: '验证已过期',
              type: 'warning'
            });
            sessionStorage.clear();
            setTimeout(()=>{
              this.$router.push("/login");
            },3000)
          } else {
            this.$message({
              message: '服务器链接错误，请稍后再试',
              type: 'warning'
            });
          }
        })
      },
      handleDelete (i, data) {
        const url = `${conf.url}/user/${data._id}`;
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ax.delete(url, this.header).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loading = true;
            this.getInfo();
          }).catch(err => {
            const sysError = /500/g;
            const noRight = /401/g;
            const hasDone = /403/g;
            const overdue = /404/g;
            if (sysError.test(err)) {
              this.$message({
                message: '服务器链接错误，请稍后再试',
                type: 'warning'
              });
            } else if (noRight.test(err)) {
              this.$message({
                message: '没有权限进行这个操作',
                type: 'danger'
              });
            } else if (overdue.test(err)) {
              this.$message({
                message: '验证已过期',
                type: 'warning'
              });
              sessionStorage.clear();
              setTimeout(()=>{
                this.$router.push("/login");
              },3000)
            } else if (hasDone.test(err)) {
              this.$message({
                message: '用户已删除，请勿重复操作',
                type: 'warning'
              });
            } else {
              this.$message({
                message: '服务器链接错误，请稍后再试',
                type: 'warning'
              });
              console.log(err);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
.el-row.header>.el-col:first-child, .el-row.search>.el-col:last-child{
  text-align: left;
}
.el-row.header>.el-col:last-child{
  text-align: right;
}
.el-row.search{
  height: 50px;
  line-height: 50px;
}
.el-row.search>.el-col{
  padding: 0 10px;
}
.el-table .td{
  text-align: left;
}
.el-form{
  width: 70%;
  margin: 0 auto;
}
.el-select{
  width: 100%;
}
.el-dialog .el-form-item{
  text-align: left;
}
</style>
