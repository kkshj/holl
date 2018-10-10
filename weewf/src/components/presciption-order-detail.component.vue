<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>处方订单信息</h4></el-col>
      <el-col :span="12">
        <el-button type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="prescription" :model="prescription" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="订单号" prop="orderHeaderNumber">
        <span>{{prescription.orderHeaderNumber}}</span>
      </el-form-item>
      <el-form-item label="交易流水号" prop="orderHeaderNumber">
        <span>{{prescription.payOrderId}}</span>
      </el-form-item>
      <el-form-item label="所属医院" prop="organizationText">
        <span>{{prescription.organizationText}}</span>
      </el-form-item>
      <el-form-item label="所属科室" prop="departmentText">
        <span>{{prescription.departmentText}}</span>
      </el-form-item>
      <el-form-item  label="医生姓名" prop="doctorName">
        <span>{{prescription.doctorName}}</span>
      </el-form-item>
      <el-form-item label="患者姓名" prop="patientName">
        <span>{{prescription.patientName}}</span>
      </el-form-item>
      <el-form-item label="患者电话" prop="patientName">
        <span>{{prescription.patientUsername}}</span>
      </el-form-item>
      <el-form-item label="患者性别" prop="patientGender">
        <span>{{prescription.patientGender}}</span>
      </el-form-item>
      <el-form-item label="患者年龄" prop="patientAge">
        <span>{{prescription.patientAge}} 岁</span>
      </el-form-item>
      <el-form-item label="处方总金额" prop="amount">
        <span>￥{{prescription.amount}}</span>
      </el-form-item>
      <el-form-item label="订单状态" prop="statusText">
        <span>{{prescription.statusText}}</span>
      </el-form-item>
      <el-form-item label="开方时间" prop="createdDate">
        <span>{{prescription.createdDate}}</span>
      </el-form-item>
      <el-form-item label="过期时间" prop="expireDate">
        <span>{{prescription.expireDate}}</span>
      </el-form-item>
      <el-form-item label="诊断" prop="diagnosis">
        <span>{{prescription.diagnosis}}</span>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <span>{{prescription.comment}}</span>
      </el-form-item>

    </el-form>
    <h4>药品详情</h4>
    <br>
    <el-table :data="prescriptionItems" style="width: 100%">
      <el-table-column align="left" label="药品名" prop="medicineName"></el-table-column>
      <el-table-column align="left" label="药品厂家" prop="medicineManufacturer"></el-table-column>
      <el-table-column align="left" label="药品规格" prop="standard"></el-table-column>
      <el-table-column align="left" label="用法用量" prop="comment">
        <template slot-scope="scope">
          <span>{{scope.row.usageText}} {{scope.row.frequencyText}} 一次{{scope.row.takeQuantity}}{{scope.row.dosageUnitText}} {{scope.row.durationDays}}日</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="配送数量">
        <template slot-scope="scope">
          <span>{{scope.row.shippingQuantity}}{{scope.row.shippingUnitText}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="金额" prop="amount">
        <template slot-scope="scope">
          <span>￥{{scope.row.amount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <br>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "prescription-detail",
    data () {
      return {
        type: '',
        header: '',
        prescription: {},
        prescriptionItems:[],
        rules: {}
      }
    },
    activated () {
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.$route.query.headId);
    },
    methods: {
      getInfo (headId) {
        const url = `${conf.url}/internethospital/api/orders/prescriptions/${headId}`;
        ax.get(url,this.header).then(res => {
          if (res.data.amount.toString().indexOf('.') < 0) {
            res.data.amount = res.data.amount + '.00'
          } else {
            if (res.data.amount.toString().slice(res.data.amount.toString().indexOf('.') + 1).length < 2) {
              res.data.amount = res.data.amount + '0'
            } else {
              res.data.amount = res.data.amount.toString().slice(0, res.data.amount.toString().indexOf('.') + 3)
            }
          }
          for(let i in res.data.items){
            if (res.data.items[i].amount.toString().indexOf('.') < 0) {
              res.data.items[i].amount = res.data.items[i].amount + '.00'
            } else {
              if (res.data.items[i].amount.toString().slice(res.data.items[i].amount.toString().indexOf('.') + 1).length < 2) {
                res.data.items[i].amount = res.data.items[i].amount + '0'
              } else {
                res.data.items[i].amount = res.data.items[i].amount.toString().slice(0, res.data.items[i].amount.toString().indexOf('.') + 3)
              }
            }
          }

          this.prescription = res.data;
          this.prescriptionItems = res.data.items;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      cancel () {
        this.$router.back(-1);
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
</style>
