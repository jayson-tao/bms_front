<!--读者信息管理-->
<template>
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
        <Button type="error" icon="trash-a" @click="remove()">删除</Button>
        <Button type="success" icon="wrench" @click="edit()">修改</Button>
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
export default {
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
  methods: { // 表单改变
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
    remove () {
      if (this.count == 0) {
        this.$Message.warning('请至少选择一项')
        return
      }
      axios.request({
        url: 'user',
        method: 'delete',
        data: this.groupId
      }).then((result) => {
        if (result.data.success == true) {
          this.$Message.info('删除成功')
          this.gopage(this.pageNo)
        }
      })
    },
    gopage (pageNo) {
      const pageSize = this.pageSize
      const keyWord = this.keyWord
      // 只查读者
      const type = 0
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
