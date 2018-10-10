<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>机构定价条件详情{{type === 'add' ? '录入' : type === 'update' ? '编辑' : type=='check '? '查看':''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type ==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>

    <el-form ref="goods" :model="organizationPriceCondition" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">

      <el-form-item label="定价条件id" prop="id">
        <span v-if="type === 'check'">{{organizationPriceCondition.id}}</span>
        <el-input v-else v-model="organizationPriceCondition.id"></el-input>
      </el-form-item>

      <el-form-item label="所属机构" prop="organizationText">
        <span v-if="type === 'check'">{{organizationPriceCondition.organizationText}}</span>
        <el-select v-else
                   v-model="organizationPriceCondition.organizationId"
                   filterable remote reserve-keyword placeholder="请输入关键词"
                   :remote-method="organizationMethod">
          <el-option
            v-for="item in organizations"
            :key="item.id" :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="金额" prop="amount">
        <span v-if="type === 'check'">{{organizationPriceCondition.amount}}</span>
        <el-input v-else v-model="organizationPriceCondition.amount"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <span v-if="type === 'check'">{{organizationPriceCondition.quantity}}</span>
        <el-input v-else v-model="organizationPriceCondition.quantity"></el-input>
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <div class="block">
          <span v-if="type === 'check'" class="demonstration">{{organizationPriceCondition.startTime}}</span>
          <el-date-picker v-else
                          v-model="value1"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-time-picker
          v-model="value2"
          :picker-options="{selectableRange: '18:30:00 - 18:29:59'}"
          placeholder="任意时间点">
        </el-time-picker>
      </el-form-item>

      <el-form-item label="结束时间" prop="endTime">
        <div class="block">
          <span v-if="type === 'check'" class="demonstration">{{organizationPriceCondition.endTime}}</span>
          <el-date-picker v-else
                          value-format="yyyy-MM-dd"
                          v-model="value1"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </div>

        <el-time-picker
          v-model="value3"
          :picker-options="{selectableRange: '18:30:00 - 20:30:00'}"
          placeholder="任意时间点">
        </el-time-picker>
      </el-form-item>

    </el-form>


  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "organization-price-condition-detail",
    data () {
      return {
        type:'',
        organizationPriceCondition: {
          id: "",
          organizationId: "",
          amount: "",
          quantity:"",
          startTime:"",
          endTime:"",
        },
        value2: new Date(2016, 9, 10, 18, 40),
        value3: new Date(2016, 9, 10, 18, 40),

        value1:'',
        selectLoading: false,
        organizations:[],
        departments: [],

        rules: {
          realName: [
            { required: true, message: '请输入编码', trigger: 'blur'}
          ]
        }
      }
    },
    activated () {
      const token = localStorage.getItem('token');
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      console.log(this.$route.query);
      if (this.type !== 'add') {
        this.getInfo(this.$route.query.id);
      }
    },
    mounted() {
    },

    methods: {
      getInfo(id){
        console.log('定价条件id查询getInfo:', id);
        const url = `${conf.url}/internethospital/api/organization-price-condition/${id}`;
        console.log(url);
        ax.get(url).then(res => {
          let url = `${conf.url}/internethospital/api/organizations/${res.data.organizationId}`;
          ax.get(url).then(resp => {
            console.log('请求所属机构resp::::::::',resp);
            res.data.organizationText = resp.data.text;
            this.organizationPriceCondition = res.data;
            console.log('organizationPriceCondition赋值之后',this.organizationPriceCondition);
          });

        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },

      create() {
        const url = `${conf.url}/internethospital/api/organization-price-condition`;
        const body = {
          "productId": this.organizationPriceCondition.productId,
          "organizationId": this.organizationPriceCondition.organizationId,
          "amount": this.organizationPriceCondition.amount,
          "quantity": this.organizationPriceCondition.quantity,
          "startTime": this.organizationPriceCondition.startTime,
          "endTime": this.organizationPriceCondition.endTime,
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
        const url = `${conf.url}/internethospital/api/organization-price-condition/${id}`;
        const body = {
          "productId": this.organizationPriceCondition.productId,
          "organizationId": this.organizationPriceCondition.organizationId,
          "amount": this.organizationPriceCondition.amount,
          "quantity": this.organizationPriceCondition.quantity,
          "startTime": this.organizationPriceCondition.startTime,
          "endTime": this.organizationPriceCondition.endTime,
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

      //所属机构查询
      organizationMethod(query) {
        if(query && query !== " "){
          this.selectLoading = true;
          const url = `${conf.url}/internethospital/api/organizations?page-index=1&page-size=10&text=${query}&type=HOSPITAL`;
          ax.get(url, this.header).then(res => {
            console.log(res)
            console.log('机构关键字查询query：'.query);
            this.organizations = res.data.content;
            this.selectLoading = false;
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
          })
        }
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
