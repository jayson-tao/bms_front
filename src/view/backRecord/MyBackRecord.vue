<!--我的催还记录-->
<template>
  <div class="animated fadeIn">
    <Card>
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
            title: 'id',
            key: 'id'
          },
          {
            title: '图书名',
            key: 'bookName'
          },
          {
            title: '借书天数(天)',
            key: 'borrowDays',
            sortable: true
          },
          {
            title: '借书日期',
            key: 'borrowTime',
            sortable: true,
            render: function (h, params) {
              return h('div', dateFormat(this.row.borrowTime))
            }
          },
          {
            title: '应还日期',
            key: 'backTime',
            sortable: true,
            render: function (h, params) {
              return h('div', dateFormat(this.row.backTime))
            }
          },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              const sex = parseInt(params.row.state)
              if (sex === 2) {
                return h('div', '催还中')
              } else if (sex === 3) {
                return h('div', '已还书')
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    //催还
                    click: () => {
                      this.ids = []
                      this.ids.push(params.row.id)
                      this.backBook()
                    }
                  }
                }, '立即还书'),
              ]);
            }
          }
        ],
        // 表单数据
        data1: [],
        userId:null,//用户id
        ids: [],//id数组
        // 校验规则
        ruleValidate: {
          borrowDays: [
            {required: true, message: '请选择借阅时间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //选择框选中
      change(e){
        this.setGroupId(e)
      },
      setGroupId (e) {
        this.ids = []
        for (var i = 0; i < e.length; i++) {
          this.ids.push(e[i].id)
        }
      },
      //取消催还-》借阅中
      cancelBackBook(){
        if(this.ids.length==0){
          this.$Message.info("请至少选择一项")
          return
        }
        const state = 1
        axios.request({
          url: 'borrowBook/'+state,
          method: 'put',
          data: this.ids
        }).then(resp => {
          this.ids = []
          if (resp.data.success) {
            this.$Message.info("取消成功")
          }
          this.gopage(this.pageNo)
        })
      },
      // 表格改变
      cancel(name) {
        // 清空表单字段
        this.$refs[name].resetFields()
      },
      //还书
      backBook() {
        const state = 3
        axios.request({
          url: 'borrowBook/'+this.userId+'/'+state,
          method: 'put',
          data: this.ids
        }).then(resp => {
          this.ids = []
          if (resp.data.success) {
            this.$Message.info("归还成功")
          }
          this.gopage(this.pageNo)
        })
      },
      //分页
      gopage(pageNo) {
        const pageSize = this.pageSize
        const state = 2 //表示借阅中
        this.userId = Cookies.get("userId")
        axios.request({
          url: 'borrowBook/record/'+this.userId+'/'+ pageNo + '/' + pageSize + '/' + state,
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
