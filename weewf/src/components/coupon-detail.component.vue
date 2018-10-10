<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>优惠券信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="coupon" :model="coupon" label-width="160px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item  label="活动名称" prop="activityId">
        <span  v-if="type==='check'||type==='update'">{{coupon.activityText}}</span>
        <el-select
          v-else
          v-model="coupon.activityId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteActivityCodeMethod">
          <el-option
            v-for="item in activityCodeOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券编码" prop="code">
        <span v-if="type==='check'||type==='update'">{{coupon.code}}</span>
        <el-input v-else v-model="coupon.code"></el-input>
      </el-form-item>

      <el-form-item label="优惠券名称" prop="text">
        <span v-if="type==='check'">{{coupon.text}}</span>
        <el-input v-else v-model="coupon.text"></el-input>
      </el-form-item>
      <el-form-item label="优惠券金额" prop="amount">
        <span v-if="type==='check'||type==='update'">{{coupon.amount.slice(1, coupon.amount.indexOf('.'))}} 元</span>
        <el-input type="number" v-else v-model="coupon.amount"></el-input>
      </el-form-item>

      <el-form-item v-if="type==='add'" label="优惠券产品名称" prop="productId">
        <el-select
          v-model="coupon.productId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteProductMethod">
          <el-option
            v-for="item in productOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-show="timeBoolean"  label="起止时间" prop="startTime">
        <span v-if="type==='check'||type==='update'">{{coupon.startTime}} 至 {{coupon.endTime}}</span>
        <div v-else class="block">
          <el-date-picker
            :disabled="startEndTimeDisable"
            @change="changeStartTime"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="coupon.startAndEndTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item v-show="inputBoolean"  label="有效天数" prop="effectiveDays">
        <span  v-if="type==='check'||type==='update'">{{coupon.effectiveDays}} 天</span>
        <el-input :disabled="effectiveBoolean" type="number"  v-else v-model="coupon.effectiveDays" @change="effectiveChange"></el-input>
      </el-form-item>
      <el-form-item label="可领取次数" prop="receiveTimes">
        <span v-if="type==='check'||type==='update'">{{coupon.receiveTimes}} 次</span>
        <el-input type="number"  v-else v-model="coupon.receiveTimes"></el-input>
      </el-form-item>

      <!--<el-form-item  v-if="type==='check'|| type==='add'" label="订单类型名称" prop="orderTypeCode">
        <span  v-if="type==='check'">{{coupon.orderTypeCode}}</span>
        <el-select
          v-else
          v-model="coupon.orderTypeCode"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteOrderTypeCodeMethod">
          <el-option
            v-for="item in orderTypeCodeOptions"
            :key="item.id"
            :label="item.text"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item   label="订单类型" prop="orderTypeCode">
        <!--<el-select
          v-model="coupon.orderTypeId"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="remoteOrderTypeIdMethod">
          <el-option
            v-for="item in orderTypeIdOptions"
            :key="item.id"
            :label="item.text"
            :value="item.id">
          </el-option>
        </el-select>-->
        <span  v-if="type==='check'||type==='update'">{{coupon.orderTypeCode}}</span>
        <el-select v-else v-model="coupon.orderTypeCode" clearable placeholder="请选择">
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label="优惠券描述" prop="longtext">
        <span v-if="type==='check'">{{coupon.longtext}}</span>
        <mavon-editor v-else v-model="coupon.longtext"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  Date.prototype.format = function (fmt) { // 定义Date类型的format函数 【必须使用 ‘= function () {}’ 的形式】
    const o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "coupon-detail",
    data () {
      return {
        type: '',
        header: '',
        coupon: {
          activityId:'',
          amount:'',
          code: '',
          effectiveDays: '',
          startTime:'',
          endTime:'',
          orderTypeCode:'',
          receiveTimes:'',
          longText: '',
          text: ''
        },
        activityCodeOptions:[],//活动编码
        orderTypeCodeOptions:[],
        productOptions:[],
        orderTypeIdOptions:[],
        orderTypeOptions:[{
          value: 'CONSULT',
          label: '网络咨询'
        }, {
          value: 'PRESCRIPTION',
          label: '处方订单'
        }],
        rules: {
          code: [{ required: true, message: '请输入优惠券编码', trigger: 'blur'}],
          text: [{ required: true, message: '请输入优惠券名称', trigger: 'blur'}],
          amount: [{ required: true, message: '请输入优惠券金额', trigger: 'blur'}],
          activityId: [{ required: true, message: '请输入活动id', trigger: 'blur'}],
          orderTypeCode: [{ required: true, message: '订单类型编码不能为空', trigger: 'blur'}],
          receiveTimes: [{ required: true, message: '领取次数不能小于1', trigger: 'blur'}],
          orderTypeId: [{ required: true, message: '订单类型名称不能为空', trigger: 'blur'}],
        },
        startEndTimeDisable: false,
        effectiveBoolean:false,
        inputBoolean: true,
        timeBoolean:true
      }
    },
    activated () {
      this.$refs['coupon'].resetFields();
      this.startEndTimeDisable=false;
      this.effectiveBoolean=false;
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.code);
      }else{/*传入类型为add*/
        this.coupon={};

      }
    },
    methods: {
      getInfo (code) {
        /*字段显示默认设置为true*/
        this.inputBoolean = true;
        this.timeBoolean = true;
        //console.log(this.header)
        const url = `${conf.url}/internethospital/api/coupons?page-index=1&page-size=10&coupon-code=${code}`;
        ax.get(url,this.header).then(res => {
          if(this.type == 'check'){//传入类型为查看，根据活动id查询活动名称
            const activityURL = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&code=`+res.data.content[0].activityCode;
            ax.get(activityURL,this.header).then(resACT =>{
              res.data.content[0].activityId = resACT.data.content[0].text;
            })
            const orderTypeURL = `${conf.url}/internethospital/api/order-types?page-index=1&page-size=10&code=`+res.data.content[0].orderTypeCode;
            ax.get(orderTypeURL,this.header).then(resOrder =>{
              res.data.content[0].orderTypeCode = resOrder.data.content[0].text;
            })
          }
          if(this.type == 'update'){
            const activityURL = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&code=`+res.data.content[0].activityCode;
            ax.get(activityURL,this.header).then(resACT =>{
              res.data.content[0].activityText = resACT.data.content[0].text;
            })
          }
          if(!res.data.content[0].effectiveDays){
            res.data.content[0].startAndEndTime = [new Date(res.data.content[0].startTime), new Date(res.data.content[0].endTime)];
            this.effectiveBoolean = true;
            if(this.type =='check'){
              //console.log('check')
              this.inputBoolean = false
            }
          }
          if(!res.data.content[0].startTime){
            this.startEndTimeDisable = true;
            if(this.type =='check'){
              this.timeBoolean = false
            }
          }
          this.coupon = res.data.content[0];
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      create () {
        this.$refs['coupon'].validate((data) =>{
          if(!data){
            return false
          }else {
            if(!this.coupon.effectiveDays && !this.coupon.startAndEndTime){
              this.$message({
                type: 'warning',
                message: '请选择起止时间或有效天数'
              });
              return false
            }else{
              if(this.coupon.amount <= 0){
                this.$message({
                  type: 'warning',
                  message: '优惠券金额应大于0'
                });
                return false
              }else{
                if(this.coupon.receiveTimes < 1){
                  this.$message({
                    type: 'warning',
                    message: '领取次数不能小于1'
                  });
                  return false
                }else{
                  const url = `${conf.url}/internethospital/api/coupons`;
                  var data;
                  if(!this.coupon.startAndEndTime){
                    data = {
                      "activityId": this.coupon.activityId,
                      "amount": -this.coupon.amount,
                      "code": this.coupon.code,
                      "effectiveDays": this.coupon.effectiveDays,
                      "endTime": null,
                      "longText": this.coupon.longtext,
                      "orderTypeCode": this.coupon.orderTypeCode,
                      "receiveTimes": this.coupon.receiveTimes,
                      "startTime": null,
                      "text": this.coupon.text
                    }
                  }else{
                    data = {
                      "activityId": this.coupon.activityId,
                      "amount": -this.coupon.amount,
                      "code": this.coupon.code,
                      "effectiveDays": null,
                      "endTime": this.coupon.startAndEndTime[1].format("yyyy-MM-dd hh:mm:ss"),
                      "longText": this.coupon.longtext,
                      "orderTypeCode": this.coupon.orderTypeCode,
                      "receiveTimes": this.coupon.receiveTimes,
                      "startTime": this.coupon.startAndEndTime[0].format("yyyy-MM-dd hh:mm:ss"),
                      "text": this.coupon.text
                    }
                  }
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
              }
            }
          }
        })
      },
      update () {
        this.$refs['coupon'].validate((data) =>{
          if(!data){
            return false
          }else{
            /*先查询活动id的状态。活动为created才能允许修改*/
            const orderTypeURL = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&code=`+this.coupon.activityCode;
            ax.get(orderTypeURL,this.header).then(resOrder =>{
              if(resOrder.data.content[0].status =='CREATED'){
                if(!this.coupon.effectiveDays && !this.coupon.startAndEndTime){
                  this.$message({
                    type: 'warning',
                    message: '请选择起止时间或有效天数'
                  });
                  return false
                }else{
                  const url = `${conf.url}/internethospital/api/coupons/${this.$route.query.id}`;
                  var data;
                  if(!this.coupon.startAndEndTime){
                    data = {
                      "activityId": this.coupon.activityId,
                      "effectiveDays": this.coupon.effectiveDays,
                      "endTime": null,
                      "orderTypeCode": this.coupon.orderTypeCode,
                      "startTime": null,
                      "productId": this.coupon.productId
                    }
                  }else{
                    data = {
                      "activityId": this.coupon.activityId,
                      "effectiveDays": null,
                      "endTime": this.coupon.startAndEndTime[1].format("yyyy-MM-dd hh:mm:ss"),
                      "orderTypeCode": this.coupon.orderTypeCode,
                      "startTime": this.coupon.startAndEndTime[0].format("yyyy-MM-dd hh:mm:ss"),
                      "productId": this.coupon.productId
                    }
                  }
                  //console.log(data)
                  /*请求后台修改*/
                  ax.put(url,data,this.header
                  ).then(res=>{
                    this.$message({
                      type:'success',
                      message:'保存成功'
                    })
                    /*修改完成后，设置页面类型为check*/
                    this.cancel()
                  }).catch(err =>{
                    console.log(err);
                    this.$message({
                      type: 'warning',
                      message: err.response.data.message
                    });
                  })
                }
              }else{
                this.$message({
                  type:'warning',
                  message:'活动状态为非创建，不能修改'
                })
              }
            })
          }
        })

      },
      remoteActivityCodeMethod(str){//活动编码查询
        if(str){
          const url = `${conf.url}/internethospital/api/activities?page-index=1&page-size=10&text=${str}`;
          ax.get(url, this.header).then(res => {
            this.activityCodeOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },
      remoteOrderTypeCodeMethod(str){//订单类型查询
        if(str){
          const url = `${conf.url}/internethospital/api/order-types?page-index=1&page-size=10&name=${str}`;
          ax.get(url, this.header).then(res => {
            this.orderTypeCodeOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },
      remoteProductMethod(str){//产品查询
        if(str){
          const url = `${conf.url}/internethospital/api/products?page-index=1&page-size=10&name=${str}`;
          ax.get(url, this.header).then(res => {
            this.productOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },
      changeStartTime(value){
        if(value){
          this.effectiveBoolean = true;
        }else{
          this.effectiveBoolean = false
        }
      },
      effectiveChange(value){
        if(value){
          this.startEndTimeDisable = true;
        }else{
          this.startEndTimeDisable = false;
        }
      },
      /*remoteOrderTypeIdMethod(str){
        if(str){
          const url = `${conf.url}/internethospital/api/order-types?page-index=1&page-size=10&name=${str}`;
          ax.get(url, this.header).then(res => {
            this.orderTypeIdOptions = res.data.content;
          }).catch(err => {
            console.log(err);
            this.$message({
              type: 'warning',
              message: err.response.data.message
            });
          })
        }
      },*/

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
