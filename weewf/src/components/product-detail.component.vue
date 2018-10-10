
<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>产品信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : type=='check '? '查看':''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <el-form ref="goods" :model="Product" label-position="left"label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="订单行项目类型" prop="orderItemTypeText">
        <span v-if="type === 'check'">{{Product.orderItemTypeText}}</span>
        <el-select
          v-model="Product.orderItemTypeText"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键字"
          :remote-method="remoteMethod">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品描述" prop="text">
        <span v-if="type === 'check'">{{Product.text}}</span>
        <el-input v-else v-model="Product.text"></el-input>
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <span v-if="type === 'check'">{{Product.manufacturer}}</span>
        <el-input v-else v-model="Product.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="规格" prop="standard">
        <span v-if="type === 'check'">{{Product.standard}}</span>
        <el-input v-else v-model="Product.standard"></el-input>
      </el-form-item>
      <el-form-item label="产品详情描述" prop="longText">
        <span>{{Product.longText}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    data () {
      return {
        header:{},
        options: [],
        value: '',
        Product:{
          orderItemTypeId:'',
          orderItemTypeText: '',
          text:'',
          manufacturer:'',
          standard: '',
          longText:''
        },
        type: '',
        rules: {
          text: [
            { required: true, message: '请输入文本描述', trigger: 'blur'}
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
      //产品详情
      getInfo(id){
        const url = `${conf.url}/internethospital/api/products/${id}`;
        console.log(url)
        ax.get(url, this.header).then(res =>{
          console.log(res)
          this.Product = res.data
        }).catch(err => {
          console.log(err);
        /*  this.$message({
            type: 'warning',
            message: err.response.data.message
          });*/
        })
      },
      remoteMethod(query){
        console.log(query);
        if(query && query !== " ") {
          const url = `${conf.url}/internethospital/api/order-item-type?page-index=1&page-size=10000&name=${query}`;
          ax.get(url, this.header).then(res => {
            console.log(res);
            this.options = res.data.content;
          }).catch(err => {
            this.$message({
              message: err.response.data.message,
              type: 'warning'
            });
            this.$message({
              message: '数据读取失败，请稍后再试',
              type: 'warning'
              });
              console.log(err);
          })
        }
      },
      create() {
        const url = `${conf.url}/internethospital/api/products`;
        console.log(url)
        const body = {
          "orderItemTypeText":this.Product.orderItemTypeText,
          "manufacturer": this.Product.manufacturer,
          "orderItemTypeId":this.Product.orderItemTypeId,
          "standard": this.Product.standard,
          "text":this.Product.text
        };
        ax.post(url, body, this.header).then((res)=> {
          console.log(res);
            this.product = res.data.content;
          }
        ).catch((err)=>{
          this.$message({
            type: 'warning',
            message: err.message
          });
        })
      },
      update() {
        const url = `${conf.url}/internethospital/api/products/${id}`;
        const body = {
          "id": "",
          "orderItemTypeText":this.Product.orderItemTypeText,
          "manufacturer": this.manufacturer,
          "orderItemTypeId":this.Product.orderItemTypeId,
          "standard": this.Product.standard,
          "text":this.Product.text
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
