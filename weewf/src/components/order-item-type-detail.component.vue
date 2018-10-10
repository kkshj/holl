<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>订单行项目类别信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type === 'add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button v-if="type==='check'" type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <el-form ref="orderItemType" :model="orderItemType" label-width="160px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item  label="订单行项目类别名称" prop="text">
        <span  v-if="type==='check'||type==='update'">{{orderItemType.text}}</span>
        <el-input v-if="type==='add'" v-model="orderItemType.text"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-if="type==='add'" v-model="orderItemType.code"></el-input>
        <span v-else>{{orderItemType.code}}</span>
      </el-form-item>
      <el-form-item label="是否免费行项目" prop="free">
        <template v-if="type==='add'">
          <el-select v-model="orderItemType.free" clearable placeholder="请选择">
            <el-option
              v-for="item in orderItemTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <span v-else>{{orderItemType.free}}</span>
      </el-form-item>
      <!-- <el-form-item label="文本描述" prop="text">
         <span v-if="type==='check'">{{orderItemType.text}}</span>
         <el-input v-else v-model="orderItemType.text"></el-input>
       </el-form-item>-->
      <el-form-item label="长文本描述" prop="longText">
        <span v-if="type==='check'">{{orderItemType.longText}}</span>
        <mavon-editor v-else v-model="orderItemType.longText"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "orderItemType-detail",
    data () {
      return {
        type: '',
        header: '',
        orderItemType: {
          code: '',
          free: '',
          longText: '',
          text: ''
        },
        orderItemTypeOptions:[{
          value: 'true',
          label: '是'
        }, {
          value: 'false',
          label: '否'
        }],
        rules: {
          code: [
            { required: true, message: '请输入编码', trigger: 'blur'}
          ],
          text: [
            { required: true, message: '请输入订单行项目类别名称', trigger: 'blur'}
          ]
        }
      }
    },
    activated () {
      this.$refs['orderItemType'].resetFields();
      const token = localStorage.getItem("token");
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.type = this.$route.query.type;
      if (this.type !== 'add') {/*传入类型不为add，调用getinfo方法，范回数据*/
        this.getInfo(this.$route.query.id);
      }else{/*传入类型为add，把orderType赋值为空*/
        this.orderItemType={};

      }
    },
    methods: {
      getInfo (id) {
        //console.log('请求订单行项目类型详情', id);
        /*查看护士详细信息*/
        const url1 = `${conf.url}/internethospital/api/order-item-types/${id}`;
        ax.get(url1,this.header).then(res => {
          res.data.free===true? res.data.free='是' : res.data.free='否';
          this.orderItemType = res.data;
        }).catch(err => {
          console.log(err);
          this.$message({
            type: 'warning',
            message: err.response.data.message
          });
        })
      },
      /*添加订单行项目类型类型*/
      create () {
        this.$refs['orderItemType'].validate((data) =>{
          if(!data){
            return false
          }else{
            //console.log("添加订单行项目类型类型")
            const url = `${conf.url}/internethospital/api/order-item-types`;
            let data = {
              "code": this.orderItemType.code,
              "free": this.orderItemType.free,
              "longText": this.orderItemType.longText,
              "text": this.orderItemType.text
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
        })

      },
      update () {
        //console.log('修改订单行项目类型信息');
        const url = `${conf.url}/internethospital/api/order-item-types/${this.$route.query.id}`;
        let data = {
          "longText": this.orderItemType.longText,
          "text": this.orderItemType.text
        }
        /*请求后台修改*/
        ax.put(url,data,this.header
        ).then(res=>{
          this.$message({
            type:'success',
            message:'保存成功'
          })
          /*修改完成后，设置页面类型为check*/
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
