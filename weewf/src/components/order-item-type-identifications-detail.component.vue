<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>订单行项目确认信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="OrderItemTypeIdentification" :model="OrderItemTypeIdentification" label-width="160px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item  v-if="type==='check'" label="订单类型名称" prop="orderTypeText">
        <span>{{OrderItemTypeIdentification.orderTypeText}}</span>
      </el-form-item>
      <el-form-item v-if="type==='check'" label="订单行项目类型名称" prop="orderItemTypeText">
        <span >{{OrderItemTypeIdentification.orderItemTypeText}}</span>
      </el-form-item>
      <el-form-item v-if="type==='add' || type==='update'" label="订单类型编码" prop="orderTypeCode">
        <el-input  v-model="OrderItemTypeIdentification.orderTypeCode"></el-input>
      </el-form-item>
      <el-form-item v-if="type==='add' || type==='update'" label="订单行项目类型编码" prop="orderItemTypeCode">
        <el-input  v-model="OrderItemTypeIdentification.orderItemTypeCode"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderType-detail",
    data () {
      return {
        type: '',
        header: '',
        OrderItemTypeIdentification: {
          orderTypeCode:'',//订单类型编码
          orderItemTypeCode:''//订单行项目类型编码
        },

        rules: {
          orderTypeCode: [{ required: true, message: '请输入订单类型编码', trigger: 'blur'}],
          orderItemTypeCode: [{ required: true, message: '请输入订单行项目类型编码', trigger: 'blur'}],

        }
      }
    },
    activated () {
      this.$refs['OrderItemTypeIdentification'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      //console.log(this.type)
      //console.log(this.$route.query);
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.OrderItemTypeIdentification={};
      }
    },
    methods: {
      getInfo (id) {
        //console.log('请求订单行项目确认详情', id);
        /*查看订单行项目确认详细信息*/
        const url = `${conf.url}/internethospital/api/order-item-type-identifications/${id}`;
        ax.get(url,this.header).then(res => {
          this.OrderItemTypeIdentification = res.data;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      /*添加订单行项目确认类型*/
      create () {
        this.$refs['OrderItemTypeIdentification'].validate((data) =>{
          if(!data){
            return false
          }else{
            //console.log("添加订单行项目确认类型信息")
            const url = `${conf.url}/internethospital/api/order-item-type-identifications`;
            let data = {
              "orderItemTypeCode": this.OrderItemTypeIdentification.orderItemTypeCode,
              "orderTypeCode": this.OrderItemTypeIdentification.orderTypeCode
            }
            //console.log(data)
            ax.post(url,data,this.header
            ).then(res=>{
              this.$message({
                type:'success',
                message:'保存成功'
              })
              this.cancel()
            }).catch(err =>{
              console.log(err);
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
            })
          }
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

</style>
