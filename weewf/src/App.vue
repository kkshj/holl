<template>
  <div id="app">
    <el-container>
      <nav-component v-if="loggedIn"></nav-component>
      <el-container>
        <el-header>
          <header-component v-if="loggedIn"></header-component>
        </el-header>
        <el-main :class="{'loginBg': !loggedIn}">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{ dialog }}</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import NavComponent from "./components/nav.component"
import HeaderComponent from "./components/header.component"

export default {
  name: 'App',
  components: {
    NavComponent,
    HeaderComponent
  },
  data () {
    return {
      loggedIn: localStorage.getItem("token") ? true : false,
      // loggedIn: true,
      dialogVisible: false,
      dialog: '',
      chosen: ''
    }
  },
  watch: {
    $route (to, from) {
      const toPath = to.path;
      const fromPath = from.path;
      if (fromPath === '/login') {
        this.loggedIn = true;
      } else if (toPath === '/login') {
        this.loggedIn = false;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-container{
  min-height: 100vh;
}
.el-header{
  background-color: #409EFF;
  color: white;
  line-height: 60px;
}
.loginBg{
  background-color: #409EFF;
}
</style>
