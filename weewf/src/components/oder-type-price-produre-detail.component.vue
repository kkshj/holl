<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>单据定价过程确定{{type === 'add' ? '录入' : type === 'update' ? '编辑' : type=='check '? '查看':''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <el-form ref="goods" :model=" OrderTypePriceProcedure" label-position="left"label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="订单类型" prop="orderTypeId">
        <span v-if="type === 'check'">{{OrderTypePriceProcedure.orderTypeId}}</span>
      <el-select
        v-else
        v-model="OrderTypePriceProcedure.orderTypeId"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键字"
        :remote-method="remoteMethod"
        :loading="selectLoading">
        <el-option
          v-for="item in orderTypeName"
          :key="item.orderTypeId"
          :label="item.orderTypeName"
          :value="item.orderTypeId">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <span v-if="type === 'check'">{{OrderTypePriceProcedure.code}}</span>
        <el-input v-else v-model="OrderTypePriceProcedure.organizationId"></el-input>
      </el-form-item>
      <el-form-item label="文本描述" prop="text">
        <span v-if="type === 'check'">{{OrderTypePriceProcedure.text}}</span>
        <el-input v-else v-model="OrderTypePriceProcedure.text"></el-input>
      </el-form-item>
      <el-form-item label="长文本描述" prop="longtext">
        <span v-if="type === 'check'">{{OrderTypePriceProcedure.longtext}}</span>
        <el-input v-else v-model="OrderTypePriceProcedure.longtext"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "doctor-detail",
    data () {
      return {
        OrderTypePriceProcedure: {
          code: "",
          text: "",
          longtext: "",
          orderTypeName: "",
        },
        orderTypeName:[],
        type: '',
        header: '',
        doctor: {},
        rules: {
          realName: [
            { required: true, message: '请输入编码', trigger: 'blur'}
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
