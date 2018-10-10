<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>{{type === 'Consultation' ? '问诊订单' : type === 'Patient' ? '注册用户' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button  type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-table  ref="information"  :data="information" v-loading="loading" style="width: 100%">

      <el-table-column v-if="type==='Patient'" align="left" label="用户姓名" prop="name"></el-table-column>
      <el-table-column v-if="type==='Patient'" align="left" label="用户电话" prop="phone"></el-table-column>
      <el-table-column v-if="type==='Patient'" align="left" label="注册时间" prop="createdDate"></el-table-column>
    </el-table>
    <!--layout代表组件布局，子组件名用逗号分隔
        属性： total代表总条目数
        事件： current-change用于监听页数改变，而内容也发生改变-->
    <div class="block">
      <br>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="getInfo">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderType-detail",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        type: '',
        header: '',
        information:[]
      }
    },
    activated () {
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;//获取类型
      this.code = this.$route.query.code;//获取编码
      this.time = this.$route.query.time;//获取时间
      this.getInfo(this.currentPage);//页面默认加载首页
    },
    methods: {
      getInfo(currentPage) {
        const url = `${conf.url}/internethospital/api/patients?page-index=${currentPage}&page-size=10&channel-code=${this.code}&start-date=${this.time[0]}&end-date=${this.time[1]}`;
        ax.get(url, this.header).then(res => {
          for(let i in res.data.content) {
            if (res.data.content[i].createdDate.indexOf("T")) {
              res.data.content[i].createdDate = res.data.content[i].createdDate.replace('T', ' ')
            }
          }
          this.information = res.data.content;
          this.total = res.data.totalElements;
          /*设置总条数*/
          this.loading = false;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      cancel() {
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
