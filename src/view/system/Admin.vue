<!--读者信息管理-->
<template >
  <div class="animated fadeIn">
    <Card>
      <Row>
        用户名：
        <Input v-model="keyWord" placeholder="请输入..." style="width:200px"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="gopage(1)" style="margin-left: 10px">搜索
        </Button>
      </Row>
      <br>
      <Row>
        <Button type="success" icon="wrench" @click="addAdmin" v-if="viewAccessSuper">添加为管理员</Button>
        <Button type="error" icon="trash-a" @click="removeAdmin" v-if="viewAccessSuper">取消管理员</Button>
      </Row>
      <br>
      <Row>
        <Table border :columns="columns1" :data="data1" @on-selection-change="change"></Table>
      </Row>
      <br>
      <Row>
        <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage"
              align="center"></Page>
      </Row>
    </Card>
  </div>
</template>
<script>
import dateFormat from '../../libs/date'
import axios from '../../libs/api.request'
import { hasOneOf } from '@/libs/tools'
export default {
  computed: {
    access () {
      return this.$store.state.user.access
    },
    viewAccessSuper () {
      return hasOneOf(['2'], this.access)
    }
  },
  data () {
    return {
      pageSize: 3,
      pageNo: 1,
      totalPage: 0,
      totalCount: 0,
      keyWord: '',
      // 表单选中的id数组
      groupId: null,
      roles: null,
      count: 0,
      // 表单字段
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username'
        }, {
          title: '姓名',
          key: 'name'
        }, {
          title: '角色',
          key: 'role',
          render: (h, params) => {
            const sex = parseInt(params.row.role)
            if (sex === 0) {
              return h('div', '读者')
            } else if (sex === 1) {
              return h('div', '管理员')
            } else {
              return h('div', '超级管理员')
            }
          }
        },
        {
          title: '电话',
          key: 'telephone'
        },
        {
          title: '性别',
          key: 'sex',
          render: (h, params) => {
            const sex = parseInt(params.row.sex)
            if (sex === 0) {
              return h('div', '女')
            } else if (sex === 1) {
              return h('div', '男')
            }
          }
        },
        {
          title: '年龄',
          key: 'age',
          sortable: true
        },
        {
          title: '注册时间',
          key: 'createTime',
          sortable: true,
          render: function (h, params) {
            return h('div', dateFormat(this.row.createTime))
          }
        }
      ],
      // 表单数据
      data1: []
    }
  },
  methods: {
    // 表单改变
    change (e) {
      this.setGroupId(e)
    },
    setGroupId (e) {
      this.groupId = []
      this.roles = '',
      // 记录选了几个选择框
      this.count = e.length
      for (var i = 0; i < e.length; i++) {
        this.groupId.push(e[i].id)
        this.roles += e[i].role
      }
    },
    addAdmin () {
      if (this.count == 0) {
        this.$Message.warning('请至少选择一项')
        return
      }
      if (this.roles.indexOf('1') != -1 || this.roles.indexOf('2') != -1) {
        this.$Message.warning('只能添加读者为管理员')
        return
      }
      // 异步请求
      axios.request({
        url: 'user/role/1',
        method: 'put',
        data: this.groupId
      }).then((result) => {
        if (result.data.success == true) {
          this.$Message.info('添加成功')
          this.gopage(this.pageNo)
        }
      })
    },
    removeAdmin () {
      if (this.count == 0) {
        this.$Message.warning('请至少选择一项')
        return
      }
      if (this.roles.indexOf('0') != -1 || this.roles.indexOf('2') != -1) {
        this.$Message.warning('只能取消管理员')
        return
      }
      // 异步请求
      axios.request({
        url: 'user/role/0',
        method: 'put',
        data: this.groupId
      }).then((result) => {
        if (result.data.success == true) {
          this.$Message.info('取消成功')
          this.gopage(this.pageNo)
        }
      })
    },
    gopage (pageNo) {
      const pageSize = this.pageSize
      const keyWord = this.keyWord
      // 只查读者
      const type = -1
      axios.request({
        url: 'user/' + pageNo + '/' + pageSize + '/' + type + '/' + keyWord,
        method: 'get'
      }).then((result) => {
        this.data1 = result.data.list
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.totalCount = result.data.totalCount
      })
    }
  },
  mounted: function () {
    this.gopage(1)
  }
}
</script>
