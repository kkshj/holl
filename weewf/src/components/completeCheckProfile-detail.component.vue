<template>
  <div>
    <el-row class="header">
      <el-col :span="12"><h4>完整性检查{{type === 'add' ? '录入' : type === 'update' ? '编辑' : ''}}</h4></el-col>
      <el-col :span="12">
        <el-button v-if="type==='add'" type="primary" plain icon="el-icon-edit" @click="create">保存</el-button>
        <el-button v-if="type === 'update'" type="primary" plain icon="el-icon-edit" @click="update">保存</el-button>
        <el-button v-if="type==='add' || type === 'update'" type="danger" plain icon="el-icon-close" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
      <el-form ref="goods" :model="department" label-width="100px" :rules="rules" style="width: 70%; margin: 20px auto;">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="department.realName"></el-input>
        </el-form-item>
        <el-form-item label="订单抬头，订单行项" prop="realName">
          <el-input v-model="department.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="text">
          <el-input v-model="department.text"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="longText">
          <mavon-editor v-model="department.longText"/>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
  export default {
    name: "completeCheckProfile-detail",
    data () {
      return {
        type: '',
        header: '',
        department: {},
        rules: {
          realName: [
            { required: true, message: '请输入部门名称', trigger: 'blur'}
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
      getInfo (id) {
        console.log('请求医生详情', id);

      },
      create () {
        console.log(this.department)
      },
      update () {

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
