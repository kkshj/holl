<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>查询订单聊天记录</h4></el-col>
      <el-col :span="12">
        <!--<el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>-->
        <!--<el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>-->
        <el-button type="danger" plain icon="el-icon-back" @click="cancel">返回</el-button>
      </el-col>
    </el-row>
    <span v-if="chatRecordList.length===0">暂无聊天记录</span>
    <el-row v-for="(item,index) in chatRecordList" :key="index" style="margin-top: 10px; padding-bottom: 10px; border-bottom: 1px #e2e2e2 solid;">

      <el-col :span="4">{{item.personType === 'HEALER' ? '医生' : '患者'}}：</el-col>
      <el-col :span="20" style="text-align: left">
        <span v-if="item.msgType === 'TIMTextElem'">{{item.msgContent}}</span>
        <span v-if="item.msgType === 'TIMFaceElem'">[表情]</span>
        <span v-if="item.msgType === 'TIMSoundElem'">[语音消息]</span>
        <img v-if="item.msgType === 'TIMImageElem'" :src="item.msgContent" style="width: 60px;">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "doctor-detail",
    data () {
      return {
        header: '',
        chatRecordList: []
      }
    },
    activated () {
      const token = '';
      this.header = {headers: {'Authorization': 'Bearer '+token}};
      this.getInfo(this.$route.query.id);
      this.chatRecordList={}
    },
    methods: {
      getInfo(id) {
        console.log(id)
        const url = `${conf.url}/internethospital/api/chat-message?order_header_id=${id}&page_index=1&page_size=100000`;
        ax.get(url).then(res => {
          for (let i in res.data.content){
            res.data.content[i].personType = res.data.content[i].fromAccount === this.$route.query.healerId ? 'HEALER' : 'PATIENT'
            if (res.data.content[i].msgType === 'TIMImageElem') {
              res.data.content[i].msgContent = res.data.content[i].msgContent.slice(res.data.content[i].msgContent.indexOf('url='))
              res.data.content[i].msgContent = res.data.content[i].msgContent.slice(4, res.data.content[i].msgContent.indexOf('),'))
              console.log(res.data.content[i].msgContent)
            }
          }
          this.chatRecordList = res.data.content;
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
  .el-form{
    width: 70%;
    margin: 0 auto;
  }
  .el-form-item{
    text-align: left;
  }

</style>
