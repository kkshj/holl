<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>订单总览</h4></el-col>
      <el-col :span="6">
        <!--<el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加订单</el-button>-->
      </el-col>
    </el-row>
    <el-row class="search">
      <el-col :span="5"><el-input placeholder="请输入订单号" clearable v-model="condition.orderNumber"></el-input></el-col>
      <el-col :span="5"><el-input placeholder="请输入就诊人电话" clearable v-model="condition.userPhone"></el-input></el-col>
      <el-col :span="5">
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
            :value="item.code">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="condition.healerId"
          filterable
          remote
          placeholder="请输入医生/护士名"
          :remote-method="remoteHealerMethod">
          <el-option
            v-for="item in healerOptions"
            :key="item.doctorId || item.nurseId"
            :label="item.doctorName || item.nurseName"
            :value="item.doctorName || item.nurseName">
            <span style="float: left">{{ item.doctorName || item.nurseName }}</span>
            <span style="float: left; color: #8492a6; font-size: 10px; margin-left:5px;">{{ item.doctorName ? '医生' : item.nurseName ? '护士' : ''}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.organizationText }}</span>
          </el-option>
        </el-select>
      </el-col>
      <!--<el-col :span="5">
        <el-select v-model="condition.status" placeholder="请选择订单状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>-->
      <el-col :span="4">
        <el-button type="success" plain @click="getInfo(1)">搜索</el-button>
        <el-button type="danger"  plain :disabled="!condition.orderNumber && !condition.hospitalId && !condition.healerId && !condition.userPhone" @click="resetCondition()">重置</el-button>
      </el-col>
    </el-row>
    <el-table :data="orderViewList"  v-loading="loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" prop="orderNumber" label="订单号"></el-table-column>
      <el-table-column align="left" prop="payOrderId" label="交易流水号"></el-table-column>
      <el-table-column align="left" prop="orderTypeText" label="订单类型"></el-table-column>
      <el-table-column align="left" prop="organizationText" label="所属医院"></el-table-column>
      <el-table-column align="left" prop="departmentText" label="所属科室"></el-table-column>
      <el-table-column align="left" prop="statusText" label="订单状态"></el-table-column>
      <el-table-column align="left" label="医生/护士姓名">
        <template slot-scope="scope">
          <span>{{scope.row.doctorName||scope.row.nurseName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="patientName" label="就诊人姓名"></el-table-column>
      <el-table-column align="left" prop="purchaserUsername" label="就诊人电话"></el-table-column>
      <el-table-column align="left" prop="createdDate" label="创建时间"></el-table-column>
      <el-table-column header-align="center" align="right" prop="amount" label="金额"></el-table-column>
      <!--<el-table-column align="left" prop="payMethod" label="支付方式"></el-table-column>-->
<!--      <el-table-column align="left" width="140px" prop="amount" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail(scope.row.orderTypeCode, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>-->
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
        :currentPage="currentPage"
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
          orderNumber: '',
          hospitalId: '',
          healerId: '',
          userPhone: '',
        },
        orderViewList: [],
        addOne: false,
        delivery: {},
        hospitalOptions: [],
        healerOptions: [],
        /*statusOptions: [
          {value: 'CREATED', label: '已创建'},
          {value: 'EXPIRED', label: '已过期'},
          {value: 'PAYED', label: '已付款'},
          {value: 'SIGNED', label: '已签章'}
        ]*/
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
        this.condition.orderNumber=null;
        this.condition.hospitalId=null;
        this.condition.healerId=null;
        this.condition={}//切换菜单栏，搜索设置为空
        this.getInfo(1);
      } else {
        sessionStorage.setItem('goToDetail', '2')
      }
    },

    methods: {
      getInfo(currentPage) {
        this.currentPage=currentPage
        /*加载订单数据*/
        let url = `${conf.url}/internethospital/api/orders/?page-index=${currentPage}&page-size=10`;
        if (this.condition.orderNumber) {
          url =`${url}&order-number=${this.condition.orderNumber}`
        }
        if (this.condition.hospitalId) {
          url = `${url}&organization-code=${this.condition.hospitalId}`
        }
        if (this.condition.healerId) {
          url =`${url}&medical-staff-name=${this.condition.healerId}`
        }
        if (this.condition.userPhone){
          url =`${url}&user-phone=${this.condition.userPhone}`
        }
        /*if (this.condition.status) {
          url =`${url}&statuses=${this.condition.status}`
        }*/
        /*向后台获取数据*/
        ax.get(url, this.header).then(res => {
          let content = res.data.content;
          for(let i in content){
            if(content[i].amount == null || content.amount == ""){
              content[i].amount = "无价格"
            } else {
              if(content[i].amount.toString().indexOf('.') < 0){
                content[i].amount = content[i].amount + '.00'
              }else {
                if (content[i].amount.toString().slice(content[i].amount.toString().indexOf('.') + 1).length < 2) {
                  content[i].amount = content[i].amount + '0'
                } else {
                  content[i].amount = content[i].amount.toString().slice(0, content[i].amount.toString().indexOf('.') + 3)
                }
              }
              content[i].amount = '￥' + content[i].amount;
            }
          }
          this.orderViewList = content;
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
          orderNumber: '',
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
      remoteHealerMethod (query) {
        if (query) {
          const urlDoctor = `${conf.url}/internethospital/api/doctors?page-index=1&page-size=1000&name=${query}&sort-method=CONSULTATION_QUANTITY`;
          ax.get(urlDoctor).then(res => {
            const urlNurse = `${conf.url}/internethospital/api/nurses?page-index=1&page-size=1000&name=${query}&sort-method=CONSULTATION_QUANTITY`;
            ax.get(urlNurse).then(resp => {
              this.healerOptions = resp.data.content.concat(res.data.content);
            })
          })
        }
      },
      goToDetail (code, row) {
        sessionStorage.setItem('goToDetail','1')
        if(code == 'PRESCRIPTION'){//处方订单
          this.$router.push({
            path: '/presciption-order-manager/detail',
            query: {
              type:'check',
              headId: row.id
            }
          });
        }else{
          this.$router.push({
            path: '/order-manager/detail',
            query: {
              id: row.id,
              healerId: row.doctorId || row.nurseId
            }
          });
        }

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
