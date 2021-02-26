<template>
  <div class="user-list">
    <el-card class="box-card">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="userLists"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="portrait"
          label="头像"
          width="180"
        >
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.currentPage"
        :page-sizes="[20, 30, 50]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="50%">
        <el-select v-model="roleIdList" multiple placeholder="请选择角色">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.id"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleAllocRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker: any) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      form: {
        currentPage: 1,
        pageSize: 20,
        phone: '',
        userId: '',
        startCreateTime: '',
        endCreateTime: '',
        dateRange: []
      },
      totalCount: 0,
      userLists: [],
      dialogVisible: false,
      currenUser: null, // 分配角色的当前用户
      roles: [],
      roleIdList: []
    }
  },
  created () {
    this.loadUserPages()
  },
  methods: {
    async loadUserPages () {
      const { data } = await getUserPages(this.form)
      this.userLists = data.data.records
      this.totalCount = data.data.total
    },
    handleSizeChange (val: number) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val: number) {
      console.log(`当前页: ${val}`)
    },
    onSubmit () {
      this.form.startCreateTime = this.form.dateRange[0]
      this.form.endCreateTime = this.form.dateRange[1]
    },
    async handleSelectRole (row: any) {
      this.currenUser = row
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data

      // 获取当前用户的角色
      const { data: { data: userRoles } } = await getUserRoles((this.currenUser as any).id)
      this.roleIdList = userRoles.map((item: any) => item.id)

      // 展示对话框
      this.dialogVisible = true
    },
    handleAllocRole () {
      allocateUserRoles({
        userId: (this.currenUser as any).id,
        roleIdList: this.roleIdList
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
