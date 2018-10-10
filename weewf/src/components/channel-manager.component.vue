<template>
  <div>
    <el-row class="header">

      <el-col :span="18"><h4>业务管理</h4></el-col>
      <el-col :span="6">
        <el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加医助信息</el-button>
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="8"><el-input placeholder="姓名" clearable v-model="condition.realName"></el-input></el-col>
      <el-col :span="8"><el-input placeholder="手机号" clearable v-model="condition.userName"></el-input></el-col>

      <el-col :span="8">
        <el-button type="success" plain @click="getInfo(1)">查询</el-button>
        <el-button type="danger" plain :disabled="!condition.realName && !condition.userName && !condition.startAndEndTime" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="16">
        <div class="block">
          <span class="demonstration">查询区间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="condition.startAndEndTime"
            type="daterange"
            unlink-panels
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" :disabled="!condition.startAndEndTime" plain  @click="exportExcel()">导出</el-button>
      </el-col>
    </el-row>
    <el-table  ref="multipleTable"  :data="channelList" v-loading="loading"   style="width: 100%">
      <!--<el-table-column
        type="selection"
        width="55">
      </el-table-column>-->
      <el-table-column align="left" label="姓名" prop="realName"></el-table-column>
      <el-table-column align="left" label="用户账号" prop="username"></el-table-column>
      <!--<el-table-column align="left" label="注册患者数" prop="patientNum"></el-table-column>-->
      <el-table-column align="left" label="注册总量" prop="patientNum">
        <template slot-scope="scope">
          <el-button size="mini" :disabled = '!scope.row.patientNum' type="danger" plain @click="goToSpecific('Patient', scope.row.code)">{{scope.row.patientNum ? scope.row.patientNum: '0'}}</el-button>
        </template>
      </el-table-column>
      <!--<el-table-column align="left" label="咨询数" prop="consultationNum"></el-table-column>-->
      <el-table-column align="left" label="问诊订单总量" prop="consultationNum">
        <template slot-scope="scope">
          <el-button size="mini" :disabled = '!scope.row.consultationNum'  type="danger" plain @click="goToConSpecific('Consultation', scope.row.code)">{{scope.row.consultationNum ? scope.row.consultationNum: '0'}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" prop="createdDate"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" label="简介" prop="text"></el-table-column>
      <el-table-column align="left" label="推广二维码下载">
        <template slot-scope="scope">
          <el-button size="mini"  type="warning" plain @click="downloadChannelCode(scope.row.code)">二维码下载</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
          <!--<el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
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
        :current-page.sync = "currentPage"
        @current-change="getInfo">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "nurse-manager",
    data () {
      return {
        centerDialogVisible: false,
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        condition: {
          realName: '',
          userName: '',
          startAndEndTime:''
        },
        channelList: [],
        addOne: false,
        delivery: {},
        /*时间选择器*/
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        /*复选框*/
        multipleSelection: []
      }
    },
    /*页面加载调用该方法*/
    activated () {
      this.loading = true;
      this.condition.realName = null;
      this.condition.userName = null;
      this.condition.startAndEndTime = null;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);//页面默认加载首页
      this.condition = {}
    },
    methods: {
      getInfo(currentPage) {
        /*加载订单数据*/
        let url = `${conf.url}/internethospital/api/channel?page-index=${currentPage}&page-size=10`;
        /*向后台获取数据*/
        if(this.condition.realName){
          url = `${url}&real-name=${this.condition.realName}`;
        }
        if(this.condition.userName){
          url = `${url}&user-name=${this.condition.userName}`;
        }
        ax.get(url, this.header).then(res => {
          this.channelList = res.data.content;
          this.total = res.data.totalElements;/*设置总条数*/
          this.loading = false;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      /*重置，设置字段value值为空*/
      resetCondition () {
        this.condition = {
          realName: '',
          userName: '',
          startAndEndTime:''
        }
      },
      /*
      goToDetail：RU
      type：传入类型，id：获取到该条数据的id
      */
      goToDetail (type, id) {
        this.$router.push({
          path: '/channel-manager/detail',
          query: {
            type: type,
            id: id,
          }
        });
      },
      /*跳转注册咨询页面*/
      goToSpecific (type,code,time){
        time=this.condition.startAndEndTime;
        if(time){
          this.$router.push({
            path:'/channel-manager/specific',
            query:{
              type:type,
              code:code,
              time:time
            }
          })
        }else{
          this.$message({
            type:'warning',
            message: '请选择查询区间'
          })
        }
      },
      /*跳转问诊订单页面*/
      goToConSpecific (type,code,time){
        time=this.condition.startAndEndTime;
        if(time){
          this.$router.push({
            path:'/channel-manager/consultationSpecific',
            query:{
              type:type,
              code:code,
              time:time
            }
          })
        }else{
          this.$message({
            type:'warning',
            message: '请选择查询区间'
          })
        }
      },
      /*数据删除*/
      /*deleteRow (row) {
        console.log('删除医助',row.id);
        this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
          confirmButtonText:`确定`,
          cancelButtonText:`取消`,
          type:`warning`
        }).then(()=>{
          /!*到后台执行删除操作*!/
          const url = `${conf.url}/internethospital/api/channel/`+row.id;
          ax.delete(url,this.header).then(res => {
            this.$message({
              /!*删除成功返回成功信息*!/
              message:'删除成功',
              type: 'success'
            })
            this.currentPage = 1;
            this.getInfo(this.currentPage)
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }).catch(err =>{
          this.$message.error('取消删除')
        })
      },*/
      downloadChannelCode(code){//二维码下载
        console.log(code)
        this.loading = true;
        const url = `${conf.url}/internethospital/api/channel/action/download-micro-app-qrcode?page-index=1&page-size=1&channel-code=${code}`;
        let form = document.createElement('FORM');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      },
      /*deleteRowByChoose(){//批量删除

      },*/
      exportExcel(){//导出excel
        var startAndEndTime = this.condition.startAndEndTime;
        const url = `${conf.url}/internethospital/api/channel/export/data?start-date=`+startAndEndTime[0]+`&end-date=`+startAndEndTime[1];
        let form = document.createElement('FORM');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
      },
      /*handleSelectionChange(val) {//复选框
        this.multipleSelection = val;
      }*/

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

  .el-row.search{
    height: 50px;
    line-height: 50px;
  }
  .el-row.search>.el-col{
    padding: 0 10px;
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
