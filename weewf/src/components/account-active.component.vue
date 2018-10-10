<template>
    <div id="active">
      <h2>{{ message }}</h2>
      <h4>页面将在{{ s }}秒后跳转至登陆页</h4>
    </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'

  export default {
    name: "account-active",
    data () {
      return {
        message: '',
        s: 5
      }
    },
    mounted () {
      const params = this.$route.params;
      const url = `${conf.url}/active?email=${params.email}`;
      ax.get(url).then(res => {
        console.log(res);
        this.message = '激活成功！';
        const timer = setInterval(()=>{
          this.s--;
          if (this.s <= 0) {
            clearInterval(timer);
            this.$router.push('/login');
          }
        },1000)
      }).catch(err => {
        const doNotExist = /404/g;
        const sysErr = /500/g;
        if (doNotExist.test(err)) {
          this.message = '激活失败，账号不存在';
        } else if (sysErr.test(err)) {
          this.message = '激活失败，请稍后再试';
        } else {
          this.message = '激活失败，请联系系统管理员';
          console.log(err);
        }
        const timer = setInterval(()=>{
          this.s--;
          if (this.s <= 0) {
            clearInterval(timer);
            this.$router.push('/login');
          }
        },1000)
      })
    }
  }
</script>

<style scoped>
  #active {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #cffeff;
    margin-top: 80px;
  }
</style>
