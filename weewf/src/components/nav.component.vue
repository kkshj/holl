<template>
  <el-aside width="200px">
    <h4 class="title">管理系统</h4>
    <el-menu :default-active="position">
      <!--<el-menu-item index="1" @click="goTo('/home')">-->
        <!--<i class="el-icon-menu"></i>-->
        <!--<span slot="title">控制台</span>-->
      <!--</el-menu-item>-->
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1" @click="goTo('/order-overview-manager')">订单总览</el-menu-item>
          <el-menu-item index="3-2" @click="goTo('/order-manager')">问诊订单</el-menu-item>
          <el-menu-item index="3-3" @click="goTo('/presciption-order-manager')">处方订单</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">主数据管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1" @click="goTo('/hospital-manager')">医院管理</el-menu-item>
          <el-menu-item index="4-2" @click="goTo('/department-manager')">科室管理</el-menu-item>
          <el-menu-item index="4-3" @click="goTo('/organization-department-manager')">医院科室管理</el-menu-item>
          <el-menu-item index="4-4" @click="goTo('/doctor-manager')">医生管理</el-menu-item>
          <el-menu-item index="4-5" @click="goTo('/nurse-manager')">护师管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span slot="title">活动管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="5-1" @click="goTo('/activity-manager')">活动管理</el-menu-item>
          <el-menu-item index="5-2" @click="goTo('/coupon-manager')">优惠券管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="6" @click="goTo('/carousel-manager')">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">轮播图管理</span>
      </el-menu-item>
      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">运营管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="7-1" @click="goTo('/channel-manager')">医助人员管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--<el-menu-item index="8" @click="goTo('/order-evaluation-manager')">-->
      <!--<i class="el-icon-menu"></i>-->
      <!--<span slot="title">评价管理</span>-->
      <!--</el-menu-item>-->
      <el-submenu index="9">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">排班管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="9-1" @click="goTo('/doctor-type-setting-manager')">排班管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="10">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">数据管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="10-1" @click="goTo('/order-type-manager')">订单类型管理</el-menu-item>
          <el-menu-item index="10-2" @click="goTo('/order-item-type-identifications-manager')">订单行项目确认</el-menu-item>
          <el-menu-item index="10-3" @click="goTo('/order-item-type-manager')">订单行项目类别</el-menu-item>
          <el-menu-item index="10-4" @click="goTo('/status-profiles-manager')">状态参数配置</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
  import ax from '../api/axios.api'
  import conf from '../config.json'
  export default {
    name: "nav-component",
    data () {
      return {
        position: '1',
        header: null,
        goodsClassify: []
      }
    },
    mounted () {
      const path = location.hash.slice(location.hash.indexOf('#')+2);
      let orderOverview = /order-overview-manager/g;
      let order = /order-manager/g;
      let presciptionOrder = /presciption-order-manager/g;
      let hospital = /hospital-manager/g;
      let department = /department-manager/g;
      let organizationDepartment = /organization-department-manager/g;
      let doctor = /doctor-manager/g;
      let nurse = /nurse-manager/g;
      let activity = /activity-manager/g;
      let coupon = /coupon-manager/g;
      let carousel = /carousel-manager/g;
      let channel = /channel-manager/g;
      let evaluation = /order-evaluation-manager/g;
      let doctorTypeSetting = /doctor-type-setting/g;

      this.position = path === 'home' ? '1'
        : path === 'user-manager' ? '2-1'
          : orderOverview.exec(path) ? '3-1'
            : presciptionOrder.exec(path) ? '3-3'
              : order.exec(path) ? '3-2'
                : hospital.exec(path) ? '4-1'
                  : organizationDepartment.exec(path) ? '4-3'
                    : department.exec(path) ? '4-2'
                      : doctor.exec(path) ? '4-4'
                        : nurse.exec(path) ? '4-5'
                          : activity.exec(path) ? '5-1'
                            : coupon.exec(path) ? '5-2'
                              : carousel.exec(path) ? '6'
                                : channel.exec(path) ? '7-1'
                                  : evaluation.exec(path) ? '8'
                                    : doctorTypeSetting.exec(path) ? '9-1' : '';
      const token = sessionStorage.getItem('token');
      this.header = {headers: {'X-USER-TOKEN': token}};
    },
    methods: {
      goTo (str) {
        this.$router.push(str);
      }
    }
  }
</script>

<style scoped>
  .el-menu{
    border: none;
    text-align: left;
  }
  .el-aside{
    height: 100vh;
    border-right: solid 1px #e6e6e6;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .el-aside>.title{
    height: 60px;
    line-height: 60px;
    color: #409EFF;
  }
</style>
