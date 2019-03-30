<!--我的借阅记录-->
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
      <Modal
        v-model="reBorrowModal"
        title="图书续借"
        @on-ok="reBorrow"
        @on-cancel="cancel">
        <p>只能续借一周（7天）</p>
      </Modal>
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
            title: '作者',
            key: 'bookAuthor'
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
                    //续借
                    click: () => {
                      this.ids = []
                      this.ids.push(params.row.id)
                      this.reBorrowModal = true
                    }
                  }
                }, '续借'),
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
                }, '还书'),
              ]);
            }
          }
        ],
        // 表单数据
        data1: [],
        loading: false,
        time: '',
        reBorrowModal: false,
        queryData: {
          bookName: '', // 书名
          userName: ''//用户名
        },
        userId:null,
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
      reBorrow(){
        axios.request({
          url: 'borrowBook/reBorrow',
          method: 'put',
          data: this.ids
        }).then(resp => {
          this.ids = []
          if (resp.data.success) {
            this.$Message.info("续借成功")
          }else {
            this.$Message.error(resp.data.message)
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
        this.userId =Cookies.get("userId")
        const pageSize = this.pageSize
        const state = 1 //表示已借阅
        axios.request({
          url: 'borrowBook/record/'+this.userId+'/' + pageNo + '/' + pageSize + '/' + state,
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
