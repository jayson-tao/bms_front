<!--留言管理-->
<template>
  <div class="animated fadeIn">
    <Card>
      <br>
      <Row>
        <Button type="success" icon="wrench" @click="changeRead()">标记已读</Button>
        <Button type="error" icon="trash-a" @click="remove()">删除</Button>
      </Row>
      <br>
      <Row>
        <Table border :columns="columns1" :data="data1" @on-selection-change="change"></Table>
      </Row>
      <br>
      <Row>
        <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage" align="center"></Page>
      </Row>
    </Card>
  </div>
</template>
<script>
  import dateFormat from '../../libs/date'
  import axios from '../../libs/api.request'
  import Cookies from 'js-cookie'

  export default {
    data() {
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
        // 表格字段
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '姓名',
            key: 'userName'
          },
          {
            title: '留言内容',
            key: 'text',
            tooltip: true
          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              const sex = parseInt(params.row.state)
              if (sex === 0) {
                return h('div', '未读')
              } else if (sex === 1) {
                return h('div', '已读')
              }
            }
          },
          {
            title: '留言日期',
            key: 'creatTime',
            sortable: true,
            render: function (h, params) {
              return h('div', dateFormat(this.row.creatTime))
            }
          }
        ],
        // 表单数据
        data1: [],
        loading: false,
        ids: [],
        states:'',
      }
    },
    methods: {
      //选择框选中
      change(e) {
        this.setGroupId(e)
      },
      setGroupId(e) {
        this.ids = []
        this.states = ''
        for (var i = 0; i < e.length; i++) {
          this.ids.push(e[i].id)
          this.states +=e[i].state
        }
      },
      changeRead() {
        if (this.ids.length ==0) {
          this.$Message.warning('请至少选择一项')
          return
        }
        if(this.states.indexOf('1')!=-1){
          this.$Message.warning('只能标记留言状态为未读的')
          return
        }
        axios.request({
          url:'message',
          method:'put',
          data:this.ids
        }).then(resp=>{
          if(resp.data.success){
            this.$Message.success("标记成功")
          }
          this.gopage(this.pageNo)
        })

      },
      // 删除
      remove () {
        if (this.ids.length ==0) {
          this.$Message.warning('请至少选择一项')
          return
        }
        if(this.states.indexOf('0')!=-1){
          this.$Message.warning('只能删除留言状态为已读的')
          return
        }
        axios.request({
          url: 'message',
          method: 'delete',
          data: this.ids
        }).then((result) => {
          if (result.data.success == true) {
            this.$Message.info('删除成功')
            this.gopage(this.pageNo)
          }
        })
      },
      // 表格改变
      cancel(name) {
        // 清空表单字段
        this.$refs[name].resetFields()
      },
      //分页
      gopage(pageNo) {
        const pageSize = this.pageSize
        axios.request({
          url: 'message/all/'+ pageNo + '/' + pageSize,
          method: 'get'
        }).then((result) => {
          this.data1 = result.data.list
          this.pageNo = pageNo
          this.pageSize = pageSize
          this.totalCount = result.data.totalCount
        })
      },
    },
    mounted: function () {
      this.gopage(1)
    }
  }
</script>
