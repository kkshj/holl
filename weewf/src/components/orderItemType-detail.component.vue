<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>订单类型信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="goods" :model="orderType" label-width="140px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="订单类型编码" prop="code">
        <span v-if="type==='check'||type === 'update'">{{orderType.code}}</span>
        <el-input v-else v-model="orderType.code"></el-input>
      </el-form-item>
      <el-form-item label="订单类型简介" prop="text">
        <span v-if="type==='check'">{{orderType.text}}</span>
        <el-input v-else v-model="orderType.text"></el-input>
      </el-form-item>
      <el-form-item v-if="type==='add' || type === 'update'" label="定价过程" prop="orderTypeProcedureCode">
        <el-select
          v-model="orderType.orderTypeProcedureCode"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteOrderTypePriceMethod">
          <el-option
            v-for="item in orderTypePriceOptions"
            :key="item.code"
            :label="item.text"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="销售、合同、服务" prop="scene">
        <span v-if="type==='check'">{{orderType.scene}}</span>
        <template v-else>
          <el-select v-model="orderType.scene" clearable placeholder="请选择">
            <el-option
              v-for="item in sceneOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item v-if="type==='add' || type === 'update'" label="状态参数" prop="statusProfileCode">

        <el-select
          v-model="orderType.statusProfileCode"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteStatusProfileCodeMethod">
          <el-option
            v-for="item in statusProfileCodeOptions"
            :key="item.code"
            :label="item.text"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="订单创建规则" prop="orderCreateRule">
        <span v-if="type==='check'">{{orderType.scene}}</span>
        <template v-else>
          <el-select v-model="orderType.orderCreateRule" clearable placeholder="请选择">
            <el-option
              v-for="item in orderCreateRuleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="订单类型描述" prop="longText">
        <span v-if="type==='check'">{{orderType.longText}}</span>
        <mavon-editor v-else v-model="orderType.longText"/>
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
        orderType: {
          code: '',
          longText: '',
          orderCreateRule: '',
          orderTypeProcedureCode: '',
          scene: '',
          statusProfileCode: '',
          text: ''
        },
        /*订单类型定价过程*/
        orderTypePriceOptions:[],
        /*状态参数*/
        statusProfileCodeOptions:[],
        /*销售合同服务*/
        sceneOptions: [{
          value: 'CONSULTATION',
          label: '咨询'
        }, {
          value: 'PRESCRIPTION',
          label: '服务'
        }, {
          value: 'INSPECTION',
          label: '检查'
        }],
        /*订单创建类型规则*/
        orderCreateRuleOptions:[{
          value: 'EVERY_DAY_ONLY_ONE',
          label: '一天只能创建一个'
        }, {
          value: 'SIGNAL_TO_SIGNAL_SERVICE',
          label: '单对单服务'
        }, {
          value: 'NONE',
          label: '无限制'
        }, {
          value: 'REF_CREATE_ONLY_ONE',
          label: '参考创建一个'
        }, {
          value: 'REF_CREATE_MULTI',
          label: '参考创建多个'
        },{
          value: 'DENY_REF',
          label: '严禁参照'
        }],
        rules: {
          code: [{ required: true, message: '请输入订单类型编码', trigger: 'blur'}],
          text: [{ required: true, message: '请输入订单类型简介', trigger: 'blur'}]
        }
      }
    },
    activated () {
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      //console.log(this.type)
      //console.log(this.$route.query);
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.orderType={};
      }
    },
    methods: {
      getInfo (id) {
        //console.log('请求订单类型详情', id);
        /*查看护士详细信息*/
        const url = `${conf.url}/internethospital/api/order-types/${id}`;
        ax.get(url,this.header).then(res => {
          this.orderType = res.data;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },

      /*添加订单类型*/
      create () {
        //console.log("添加订单类型信息")
        const url = `${conf.url}/internethospital/api/order-types`;
        /*订单创建scene：{
                  CONSULTATION,
                  PRESCRIPTION,
                  INSPECTION
                  }
          订单创建规则：EVERY_DAY_ONLY_ONE,//一天只得创建一个，比如义诊
                        SIGNAL_TO_SIGNAL_SERVICE,//单对单服务,服务包，网络咨询等
                        NONE,//没有限制
                        REF_CREATE_ONLY_ONE,//参考创建只能一个
                        REF_CREATE_MULTI,
                        DENY_REF;//严禁参照
        */
        let data = {
          "code": this.orderType.code,
          "longText": this.orderType.longText,
          "orderCreateRule": this.orderType.orderCreateRule,
          "orderTypeProcedureCode": this.orderType.orderTypeProcedureCode,
          "scene": this.orderType.scene,
          "statusProfileCode": this.orderType.statusProfileCode,
          "text": this.orderType.text
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
      },
      update () {
        /*query拼接，body：用data*/
        //console.log('修改订单类型信息');
        const url = `${conf.url}/internethospital/api/order-types/${this.$route.query.id}`;
        let data = {
          "code": this.orderType.code,
          "longText": this.orderType.longText,
          "orderCreateRule": this.orderType.orderCreateRule,
          "orderTypeProcedureCode": this.orderType.orderTypeProcedureCode,
          "scene": this.orderType.scene,
          "statusProfileCode": this.orderType.statusProfileCode,
          "text": this.orderType.text
        }
        //console.log(data)
        /*请求后台修改*/
        ax.put(url,data,this.header
        ).then(res=>{
        }).then(res=>{
          this.$message({
            type:'success',
            message:'保存成功'
          })
          this.cancel();
        }).catch(err =>{
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
      /*
      查询定价过程得到数据，根据code获取id传入订单类型定价过程id，完成订单类型的创建
      **/
      remoteOrderTypePriceMethod(str){
        //console.log(str)
        const url = `${conf.url}/internethospital/api/order-type-price-procedure?page-index=1&page-size=100`;
        ax.get(url,this.header
        ).then(res =>{
          this.orderTypePriceOptions=res.data.content;
        }).catch(err =>{
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      /*
      查询状态参数，根据code获取id传入订单类型状态参数id完成订单类型的创建
      * */
      remoteStatusProfileCodeMethod(str){
        //console.log(str)
        const url = `${conf.url}/internethospital/api/status-profiles?page-index=1&page-size=100`;
        ax.get(url,this.header
        ).then(res =>{
          this.statusProfileCodeOptions = res.data.content;
        }).catch(err =>{
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
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
