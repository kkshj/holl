<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>首页论播图管理</h4></el-col>
      <el-col :span="6"><el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加轮播图信息</el-button></el-col>
    </el-row>

    <el-table :data="shufflings" v-loading = "loading" style="width: 100%">
      <el-table-column align="left" type="index"></el-table-column>

      <el-table-column align="left" label="缩略图" prop="imgUrl">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" style="width: 40px;height: 40px;display: block;"/>
        </template>
      </el-table-column>

      <!--<el-table-column align="left" label="图片id" prop="id"></el-table-column>-->
      <el-table-column align="left" label="平台类型" prop="platformType"></el-table-column>
      <el-table-column align="left" label="跳转类型" prop="jumpType">
        <template slot-scope="scope">
          <span>{{scope.row.jumpType === 'INTERNAL' ? '内部' : '外部'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="跳转链接" prop="skipLinks"></el-table-column>
      <el-table-column align="left" label="所属医院" prop="organizationText"></el-table-column>

      <el-table-column align="left" label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
          <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :current-page="currentPage"
      :total="listCount"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>


<script>

  import ax from '../api/axios.api'
  import conf from '../config.json'

    export default {
        name: "carousel",

        data () {
          return {
            loading: false,
            condition: {
              orderCode: '',
              customerPhone: '',
              address: '',
              status: ''
            },

            shufflings: [],
            addOne: false,
            delivery: {},

            listCount: 0,
            currentPage: 1,
            p: {
              contactPhone: ''
            },

          }
        },

      activated () {
        const token = localStorage.getItem('token');
        this.header = {headers: {'Authorization': 'Bearer '+token}};
        this.type = this.$route.query.type;
        console.log(this.$route.query);

        this.loading = true;
        this.getInfo(1);
        this.currentPage = 1;
      },

      // mounted () {
      //   this.getInfo(1);
      // },

        methods: {
          getInfo(page) {
            const url = `${conf.url}/internethospital/api/image-shufflings?page-index=${page}&page-size=10`;
            ax.get(url, this.header).then(res => {
              console.log(res);
              for (let i in res.data.content){
                if (res.data.content[i].organizationId) {
                  let url = `${conf.url}/internethospital/api/organizations/${res.data.content[i].organizationId}`;
                  ax.get(url, this.header).then(resp => {
                    console.log(resp.data.text)
                    res.data.content[i].organizationText = resp.data.text;
                    this.shufflings = res.data.content;

                  })
                } else {
                  this.shufflings = res.data.content;
                  this.loading = false
                }
              }
            }).catch(err => {
              console.log(err);
              this.$message({
                type: 'warning',
                message: err.response.data.message
              });
            })
          },

          resetCondition () {
            this.condition = {
              orderCode: '',
              customerPhone: '',
              address: '',
              status: ''
            }
          },



          goToDetail (type, id) {
            console.log("goToDetail::::::::::::",id)
            this.$router.push({
              path: '/carousel-manager/detail',
              query: {
                type: type,
                id: id
              }
            });
          },

          deleteRow (row) {
            console.log("row.id打印：：",row.id);
            this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
              confirmButtonText:`确定`,
              cancelButtonText:`取消`,
              type:`warning`
            }).then(() =>{
              const url = `${conf.url}/internethospital/api/image-shufflings/${row.id}`;
              ax.delete(url, this.header).then(res => {
                console.log(res);
                this.getInfo(this.currentPage)
              }).catch(err => {
                this.$message({
                  type: 'warning',
                  message: err.response.data.message
                });
              })
            })
          },

          changePage (p) {
            this.getInfo(p);
            this.currentPage = p;
          },

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

  .el-row.search{
    height: 50px;
    line-height: 50px;
  }
  .el-row.search>.el-col{
    padding: 0 10px;
    text-align: left;
  }

  .el-form{
    width: 70%;
    margin: 0 auto;
  }
  .el-select{
    width: 100%;
  }
  .el-dialog .el-form-item{
    text-align: left;
  }


</style>
