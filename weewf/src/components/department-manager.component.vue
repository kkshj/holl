<template>
  <div>
    <el-row class="header">
      <el-col :span="18"><h4>科室信息</h4></el-col>
      <el-col :span="6"><el-button type="primary" plain icon="el-icon-plus" @click="goToDetail('add', '')">添加科室信息</el-button></el-col>
    </el-row>

    <el-table :data="departmentListInfo" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.secondDepartment">
            <el-table-column align="left" label="logo" prop="logoUrl">
              <template slot-scope="scope">
                <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" style="width: 40px;height: 40px;display: block;"/>
                <span v-else >{{"暂无头像"}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="科室名称" prop="text"></el-table-column>
            <el-table-column align="left" label="科室编码" prop="code"></el-table-column>
            <el-table-column align="left" label="父级科室" prop="parentText"></el-table-column>
            <el-table-column align="left" label="操作" width="240">
              <template slot-scope="scope">
                <el-button size="mini" type="success" plain @click="goToDetail('check', scope.row.id)">查看</el-button>
                <el-button size="mini" type="primary" plain @click="goToDetail('update', scope.row.id)">修改</el-button>
                <el-button size="mini" type="danger" plain @click="deleteRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="left" type="index"></el-table-column>
      <el-table-column align="left" label="logo" prop="logoUrl">
        <template slot-scope="scope">
          <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" style="width: 40px;height: 40px;display: block;"/>
          <span v-else >{{"暂无头像"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="科室名称" prop="text"></el-table-column>
      <el-table-column align="left" label="科室编码" prop="code"></el-table-column>

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
        name: "department-manager",
        data () {
          return {
            condition: {
              orderCode: '',
              customerPhone: '',
              address: '',
              status: ''
            },
            departmentListInfo: [],
            addOne: false,
            delivery: {},

            listCount: 0,
            currentPage: 1,
            p: {
              contactPhone: ''
            },
            departmentDetail: {
              id: '',
              code: '',
              name: '',
              text: '',
              longText: '',
              type: '',
              logoUrl:  '',
              parentId: '',
              standDepartment: '',
              organizationId: '',
              organizationText: ''
            }

          }
        },

        activated () {
          const token = localStorage.getItem('token');
          this.header = {headers: {'Authorization': 'Bearer '+token}};
          this.type = this.$route.query.type;

          this.loading = true;
          this.getInfo(1);
          this.currentPage = 1;
        },
        // mounted () {
        //   this.getInfo(this.currentPage)
        // },
        methods: {
          getInfo(page) {
            const url = `${conf.url}/internethospital/api/departments?page-index=${page}&page-size=10&type=HOSPITAL_DEPARTMENT&show-all=true&stand-department=true`;
            ax.get(url, this.header).then(res => {
              console.log(res);
              this.departmentListInfo = res.data.content;
              this.listCount = res.data.totalElements;

              for (let i in this.departmentListInfo){
                let url = `${conf.url}/internethospital/api/departments?page-index=1&page-size=100&parent-id=${this.departmentListInfo[i].id}`;
                ax.get(url, this.header).then(resp => {
                  for (let j in resp.data.content){
                    resp.data.content[j].parentText = this.departmentListInfo[i].text;
                  }
                  this.departmentListInfo[i].secondDepartment = resp.data.content
                })
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
            console.log("id传递：",id);
            this.$router.push({
              path: '/department-manager/detail',
              query: {
                type: type,
                id: id
              }
            });
          },

          deleteRow (row) {
            this.$confirm(`此操作将删除该条数据，是否继续？`,`提示`,{
              confirmButtonText:`确定`,
              cancelButtonText:`取消`,
              type:`warning`
            }).then(() =>{
              const url = `${conf.url}/internethospital/api/departments/${row.id}`;
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
