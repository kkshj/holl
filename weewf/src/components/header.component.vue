<template>
  <div>
    <el-dropdown class="right" @command="goTo">
      <el-button>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="/login">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="right">Welcome {{user}}</span>
    <!--<img src="../../static/2a1a53f7bff97d0dc121e5a65926a4301.png" class="header-icon right">-->
  </div>
</template>

<script>
    export default {
      name: "header-component",
      data () {
        return {
          user: '',
          header: ''
        }
      },
      mounted () {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log(userInfo);
        this.user = userInfo.first_name
      },
      methods: {
        goTo (str) {
          this.$router.push(str);
        }
      }
    }
</script>

<style scoped>
  .header-icon{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: 10px;
    border: solid 1px #ffffff;
    box-sizing: border-box;
  }
  button.el-button{
    width: 20px;
    padding: 0;
    background-color: transparent;
    border: none;
  }
  button.el-button i{
    margin: 0;
    color: white;
  }
</style>
