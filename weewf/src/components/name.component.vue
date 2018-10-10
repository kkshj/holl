<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>订单管理</h4></el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <dialog :visible.sync="docName"></dialog>
  </div>
</template>

<script>
    export default {
      name: "name",
      data () {
        return {
          header: '',
          docName: false
        }
      },
      activated () {  // 当页面激活时调用
        const token = sessionStorage.getItem('token');
        this.header = {headers: {'Authorization': 'Bearer '+token}};
        this.getInfo();
      },
      methods: {
        getInfo () {

        },
        getDetail () {

        },
        create () {

        },
        update () {

        },
        deleteRow () {

        },
        cancel () {

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
