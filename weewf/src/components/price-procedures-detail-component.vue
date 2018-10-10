<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>定价过程信息{{type === 'add' ? '录入' : type === 'update' ? '编辑' : type=='check '? '查看':''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type ==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>


    <el-form ref="PriceProcedureDetail" :model="PriceProcedureDetail" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
      <el-form-item label="编码" prop="code">
        <span v-if="type === 'check'">{{PriceProcedureDetail.code}}</span>
        <el-input v-else v-model="PriceProcedureDetail.code"></el-input>
      </el-form-item>
      <el-form-item label="定价过程详情" prop="code">
        <!--<el-select v-model="PriceProcedureDetail.details.id" placeholder="请选择活动区域">-->
          <!--<el-option label="区域一" value="shanghai"></el-option>-->
          <!--<el-option label="区域二" value="beijing"></el-option>-->
        <!--</el-select>-->

        <template slot-scope="props">
          <span v-if="type === 'check'">{{PriceProcedureDetail.pageable}}</span>

        </template>


      </el-form-item>

      <el-form-item label="文本描述" prop="text">
        <span v-if="type === 'check'">{{PriceProcedureDetail.text}}</span>
        <el-input v-else v-model="PriceProcedureDetail.text"></el-input>
      </el-form-item>
      <el-form-item label="长文本描述" prop="longtext">
        <p v-if="type === 'check'">{{PriceProcedureDetail.longText}}</p>
        <mavon-editor v-else v-model="PriceProcedureDetail.longText"/>
      </el-form-item>

    </el-form>


  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "price-procedures-detail",
    data () {
      return {
        type:'',
        PriceProcedureDetail: {
          id: "",
          code: "",
          text: "",
          longtext:"",
        },
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
    mounted() {
    },

    methods: {
      getInfo(id){
        console.log('请求医生id详情getInfo:', id);
        const url = `${conf.url}/internethospital/api/price-procedures/${id}`;
        console.log(url);
        ax.get(url).then(res => {
          this.PriceProcedureDetail = res.data;

        }).catch(err => {
          console.log(err);
          this.$message({
            message: '',
            type: 'danger'
          });
        })
      },
      // getInfo(page) {
      //   const url = `${conf.url}/internethospital/api/product?page-index=${page}&page-size=10`;
      //   ax.get(url, this.header).then(res => {
      //     console.log(res)
      //     this.PriceProcedureDetail = res.data;
      //   }).catch(err => {
      //     console.log(err);
      //       this.$message({
      //         type: 'warning',
      //         message: err.response.data.message
      //       });
      //   })
      // },

      create() {
        const url = `${conf.url}/internethospital/api/price-procedures`;
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
