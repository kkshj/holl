<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>处方订单管理</h4></el-col>
      <el-col :span="6">
        <!--<el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单</el-button>-->
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="4"><el-input placeholder="请输入就诊人电话" clearable v-model="condition.userPhone"></el-input></el-col>
      <el-col :span="4">
        <el-select
          v-model="condition.hospitalId"
          filterable
          remote
          placeholder="请输入医院"
          :remote-method="remoteHospitalMethod">
          <el-option
            v-for="item in hospitalOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="condition.departmentId"
          filterable
          remote
          placeholder="所属科室"
          :remote-method="remoteDepartmentMethod">
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
            <span style="float: left">{{ item.text }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="condition.healerId"
          filterable
          remote
          placeholder="请输入医生姓名"
          :remote-method="remoteHealerMethod">
          <el-option
            v-for="item in healerOptions"
            :key="item.doctorId"
            :label="item.doctorName"
            :value="item.doctorId">
            <span style="float: left">{{ item.doctorName}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="condition.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.departmentId&&!condition.hospitalId && !condition.healerId && !condition.status && !condition.userPhone" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="prescriptionlist"  v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="orderHeaderNumber" label="订单号"></el-table-column>
      <el-table-column align="left" prop="payOrderId" label="交易流水号"></el-table-column>
      <el-table-column align="left" prop="organizationText" label="所属医院"></el-table-column>
      <el-table-column align="left" prop="departmentText" label="所属科室"></el-table-column>
      <el-table-column align="left" prop="doctorName" label="医生姓名"></el-table-column>
      <el-table-column align="left" prop="patientName" label="患者姓名"></el-table-column>
      <el-table-column align="left" prop="patientUsername" label="患者电话"></el-table-column>
      <el-table-column align="left" prop="patientAge" label="患者年龄"></el-table-column>
      <!--<el-table-column align="left" prop="patientGender" label="患者性别">
        <template slot-scope="scope">
          <span>{{scope.row.patientGender==='MAN' ? '男' : '女'}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="left" prop="createdDate" label="开方时间"></el-table-column>
      <!--<el-table-column align="left" :show-overflow-tooltip="true" prop="diagnosis" label="诊断"></el-table-column>
      <el-table-column align="left" :show-overflow-tooltip="true" prop="comment" label="备注"></el-table-column>-->
      <el-table-column header-align="left" align="right" label="处方总金额">
        <template slot-scope="scope">
          <span>￥{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="left" align="center" prop="statusText" label="状态文本"></el-table-column>
      <!--<el-table-column align="left" prop="completed" label="是否结束"></el-table-column>-->
      <el-table-column align="left" width="140px" prop="amount" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.orderHeaderId)">查看详情</el-button>
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
        :currentPage = 'currentPage'
        @current-change="getInfo">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "order-manager",
    data () {
      return {
        currentPage:1,//默认开始页面
        total:0,//默认数据总数
        loading:false,
        condition: {
          hospitalId: '',
          healerId: '',
          status: '',
          userPhone: ''
        },
        prescriptionlist: [],
        addOne: false,
        delivery: {},
        hospitalOptions: [],
        departmentOptions: [],
        healerOptions: [],
        statusOptions: [
          {value: 'CREATED', label: '已创建'},
          {value: 'SIGNED', label: '已签章'},
          {value: 'AUDITED', label: '已审方'},
          {value: 'PAYED', label: '已支付'},
          {value: 'SHIPPED', label: '已配送'},
          {value: 'REFUNDED', label: '已退款'},
          {value: 'EXPIRED', label: '已过期'},
        ]
      }
    },
    mounted () {/*订单不刷新*/
      this.loading = true;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.currentPage);
    },
    activated() {
      let isGoToDetail = sessionStorage.getItem('goToDetail')
      if (isGoToDetail !== '1') {
        this.condition.hospitalId=null;
        this.condition.healerId=null;
        this.condition.status=null;
        this.condition={}//切换菜单栏，搜索设置为空
        this.getInfo(1);
      } else {
        sessionStorage.setItem('goToDetail', '2')
      }
    },
    methods: {
      getInfo(currentPage) {
        this.currentPage = currentPage;
        /*加载订单数据*/
        let url = `${conf.url}/internethospital/api/orders/prescriptions?page-index=${currentPage}&page-size=10`;
        if (this.condition.hospitalId) {
          url = `${url}&organization-id=${this.condition.hospitalId}`
        }
        if (this.condition.departmentId){
          url = `${url}&department-id=${this.condition.departmentId}`;
        }
        if (this.condition.healerId) {
          if (this.healerOptions.find(h => h.doctorId === this.condition.healerId)) {
            url =`${url}&doctor-id=${this.condition.healerId}`
          }
        }
        if (this.condition.status) {
          url =`${url}&status=${this.condition.status}`
        }
        if (this.condition.userPhone) {
          url =`${url}&user-phone=${this.condition.userPhone}`
        }
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          for(let i in res.data.content) {
            if (res.data.content[i].createdDate.indexOf("T")) {
              res.data.content[i].createdDate = res.data.content[i].createdDate.replace('T', ' ');
            }
            if (res.data.content[i].amount.toString().indexOf('.') < 0) {
              res.data.content[i].amount = res.data.content[i].amount + '.00'
            } else {
              if (res.data.content[i].amount.toString().slice(res.data.content[i].amount.toString().indexOf('.') + 1).length < 2) {
                res.data.content[i].amount = res.data.content[i].amount + '0'
              } else {
                res.data.content[i].amount = res.data.content[i].amount.toString().slice(0, res.data.content[i].amount.toString().indexOf('.') + 3)
              }
            }
          }
          this.prescriptionlist = res.data.content;
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
      resetCondition () {
        this.condition = {
          hospitalId:'',
          healerId:'',
          status:'',
          userPhone: ''
        }
      },
      remoteHospitalMethod (query) {
        if (query) {
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=1000&text=${query}&type=HOSPITAL`;
          ax.get(url,this.header).then(res =>{
            this.hospitalOptions = res.data.content;
          })
        }
      },
      remoteHealerMethod (query) {/*医生模糊查询*/
        if (query) {
          let url = `${conf.url}/internethospital/api/doctors?page-index=1&page-size=1000&name=${query}&sort-method=CONSULTATION_QUANTITY`;
          if (this.condition.hospitalId) {
            url = `${url}&organization-id=${this.condition.hospitalId}`;
          }
          if (this.condition.departmentId){
            url = `${url}&department-id=${this.condition.departmentId}`;
          }
          ax.get(url,this.header).then(res => {
           this.healerOptions = res.data.content;
          })
        }
      },
      remoteDepartmentMethod (query){
        if (query) {
          let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&text=${query}&type=HOSPITAL_DEPARTMENT`;
          if (this.condition.hospitalId) {
            url = `${url}&organization-id=${this.condition.hospitalId}`;
          }
          ax.get(url,this.header).then(res =>{
            this.departmentOptions = res.data.content;
          })
        }
      },
      goToDetail (type, headId) {
        sessionStorage.setItem('goToDetail','1')
        this.$router.push({
          path: '/presciption-order-manager/detail',
          query: {
            type:type,
            headId: headId
          }
        });
      },
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
