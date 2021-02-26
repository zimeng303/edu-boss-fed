<template>
  <div class="resource-list">
    <el-card class="box-card">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="form.url" placeholder="资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="全部" clearable>
            <el-option
              v-for="item in resourceCategories"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="default"
            @click="onReset"
            :disabled="isLoading"
          >重置</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="isLoading"
          >查询搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="clearfix">
        <el-button type="default">添加</el-button>
        <el-button type="default">资源分类</el-button>
      </div>
      <el-table
        :data="resources"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px;">
        <el-table-column
          type="index"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          width="180">
        </el-table-column>
         <el-table-column
          prop="description"
          label="描述"
          width="180">
        </el-table-column>
         <el-table-column
          prop="address"
          label="资源路径"
          width="180">
        </el-table-column>
         <el-table-column
          prop="createdTime"
          label="添加时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)"  type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
        total 总记录数
        page-size 每页大小
        分页组件会自动根据 total 和 page-size 计算出一共分多少页
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [], // 资源列表
      form: {
        name: null,
        url: null,
        categoryId: null,
        current: 1, // 当前页，默认查询第一页数据
        size: 10 // 每页大小
      },
      totalCount: 0, // 总数量
      resourceCategories: [], // 资源分类列表
      isLoading: true // 加载状态
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResources () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第一页
      this.loadResources()
    },
    handleEdit () {
      console.log('submit!')
    },
    handleDelete () {
      console.log('submit!')
    },
    handleSizeChange (val: number) {
      console.log(`每页 ${val} 条`)
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
