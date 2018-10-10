<template>
  <div>
    <el-row class="header">
      <el-col :span="20"><h4>个人中心</h4></el-col>
    </el-row>
    <el-form ref="personalInfo" :model="personalInfo" label-width="80px">
      <el-form-item>
        <img class="headerPic" src="../../static/2a1a53f7bff97d0dc121e5a65926a4301.png" alt="">
      </el-form-item>
      <el-form-item label="姓  名">
        <el-input v-model="personalInfo.userName" :disabled="!onEdit"></el-input>
      </el-form-item>
      <el-form-item label="电  话">
        <el-input v-model="personalInfo.userPhone" :disabled="!onEdit"></el-input>
      </el-form-item>
      <el-form-item label="权  限">
        {{personalInfo.userRole === 0 ? "超管" : personalInfo.userRole=== 1 ? "管理员" : personalInfo.userRole === 2 ? "雇员" : "" }}
      </el-form-item>
      <el-form-item>
        <transition name = "fade">
          <el-button type="primary" plain v-if="!onEdit" @click="edit">编辑资料</el-button>
          <el-button type="primary" plain v-else @click="onEdit=false">保存</el-button>
        </transition>
        <el-button type="warning" plain @click="$router.push('change-password')">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
    export default {
      name: "personal-center",
      data () {
          return {
            personalInfo: JSON.parse(sessionStorage.getItem('userInfo')),
            onEdit: false
          }
      },
      methods: {
        edit () {
          this.onEdit = true;
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

  .el-form{
    width: 20vw;
    text-align: left;
    margin-top: 20px;
  }
  .headerPic{
    width: 10vw;
  }

  .fade-enter-active, .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    position: absolute;
  }
</style>
