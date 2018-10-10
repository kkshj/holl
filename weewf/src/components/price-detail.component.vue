<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>订单信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : type=='check '? '查看':''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <el-form ref="goods" :model="OrganizationPriceCondition" label-position="left"label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="机构名称" prop="organizationId">
        <span v-if="type === 'check'">{{OrganizationPriceCondition.organizationId}}</span>
        <el-select  v-else v-model="OrganizationPriceCondition.organizationName" filterable placeholder="请选择">
          <el-option
            v-for="item in organizationName"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <span v-if="type === 'check'">{{OrganizationPriceCondition.amount}}</span>
        <el-input v-else v-model="OrganizationPriceCondition.amount"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop=" quantity">
        <span v-if="type === 'check'">{{OrganizationPriceCondition.quantity}}</span>
        <el-input-number v-else v-model="OrganizationPriceCondition" :min="0" placeholder="请输入数量"></el-input-number>
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <div class="block">
          <span class="demonstration">请选择时间</span>
          <el-date-picker
            v-model="OrganizationPriceCondition"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item label="结束时间" prop="endTime">
        <div class="block">
          <span class="demonstration">请选择时间</span>
          <el-date-picker
            v-model="OrganizationPriceCondition"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: "doctor-detail",
    data () {
      return {
        OrganizationPriceCondition: {
          organizationId: "",
          organizationName: "",
          amount: "",
          quantity: "",
          startTime: "",
         endTime: "",
        },
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
        value2: '',
        value3: '',
        number:'',
        type: '',
        header: '',
        doctor: {},
        rules: {
          amount: [
            { required: true, message: '请输入金额', trigger: 'blur'}
          ]
        }
      }
    },
    activated () {
      const token = '';
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }
    },
    methods: {
      getInfo(page) {
        const url = `${conf.url}/internethospital/api/product?page-index=${page}&page-size=10`;
        ax.get(url, this.header).then(res => {
          console.log(res)

        }).catch(err => {
          console.log(err);
          /*  this.$message({
              type: 'warning',
              message: err.response.data.message
            });*/
        })
      },
      create() {
        const url = `${conf.url}/internethospital/api/product`;
        const body = {
          "id": "string",
          "longText": "string",
          "manufacturer": "string",
          "name": "string",
          "orderItemTypeId": "string",
          "standard": "string",
          "text": "string"
        };
        ax.post(url, body, this.header).then(res => {
          console.log(res);
          this.getInfo(1)
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      update() {
        const url = `${conf.url}/internethospital/api/product/${id}`;
        const body = {
          "id": "string",
          "longText": "string",
          "manufacturer": "string",
          "name": "string",
          "orderItemTypeId": "string",
          "standard": "string",
          "text": "string"
        };
        ax.put(url, body, this.header).then(res => {
          console.log(res);
          this.getInfo(1)
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      deleteRow(id) {
        const url = `${conf.url}/internethospital/api/product?id=${id}`;
        ax.delete(url, this.header).then(res => {
          console.log(res);
          this.getInfo()
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      check(id){
        const url = `${conf.url}/internethospital/api/product?id=${id}`;
        ax.get(url, this.header).then(res => {
          connsole.log(res)
          this.produclist = res;
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
  .el-form-item{
    text-align: left;
  }

</style>