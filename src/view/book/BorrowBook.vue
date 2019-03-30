<!--我要借书-->
<template>
  <div class="animated fadeIn">
    <Card>
      <Row>
        图书名称：
        <Input v-model="queryData.name" placeholder="请输入" style="margin-right:30px ;width:200px "/>
        图书类目：
        <Input v-model="queryData.type" placeholder="请输入" style="margin-right:30px ;width:200px"/>
        图书编号：
        <Input v-model="queryData.id" placeholder="请输入" style="margin-right:30px ;width:200px"/>
      </Row>
      <br>
      <Row>
        作者姓名：
        <Input v-model="queryData.author" placeholder="请输入" style="margin-right:30px ;width:200px"/>
        出版社名：
        <Input v-model="queryData.publishHouse" placeholder="请输入" style="margin-right:30px ;width:200px"/>
        <Button type="primary" shape="circle" icon="ios-search" @click="mutilSearch(1)" style="margin-left: 10px">搜索
        </Button>
      </Row>
      <br>
      <Row>
        <Table border :columns="columns1" :data="data1"></Table>
      </Row>
      <br>
      <Row>
        <Page :total="totalCount" :page-size="pageSize" :current="pageNo" @on-change="gopage" align="center"></Page>
      </Row>
      <!--申请借书表单-->
      <Modal
        v-model="borrowModal"
        title="借阅图书"
        width="60%"
        :mask-closable="false" @on-cancel="cancel('borrowForm')">
        <Form ref="borrowForm" :model="borrowForm" :rules="ruleValidate" :label-width="80">
          <FormItem label="借阅天数" prop="borrowDays">
            <RadioGroup v-model="borrowForm.borrowDays">
              <Radio label="7">一周</Radio>
              <Radio label="15">半个月</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" long @click="borrowBook('borrowForm')" :loading="loading">确定
          </Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import dateFormat, { date2Time } from '../../libs/date'
import axios from '../../libs/api.request'
import Cookies from 'js-cookie'
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
      // 添加表单数据
      borrowForm: {
        userName:'',//用户名
        bookId:null,//id
        borrowDays:0 //借阅天数
      },
      // 表格字段
      columns1: [
        {
          title: '图书编号',
          key: 'id'
        }, {
          title: '书名',
          key: 'name',
          tooltip: true
        },
        {
          title: '作者',
          key: 'author'
        },
        {
          title: '出版社',
          key: 'publishHouse',
          tooltip: true
        },
        {
          title: '库存',
          key: 'number',
          sortable: true
        },
        {
          title: '单价',
          key: 'price',
          sortable: true
        },
        {
          title: '图书类目',
          key: 'type'
        },
        {
          title: '出版日期',
          key: 'publishTime',
          sortable: true,
          render: function (h, params) {
            return h('div', dateFormat(this.row.publishTime))
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
                  //申请借书
                  click: () => {
                   this.borrowModal =true
                    this.borrowForm.bookId = params.row.id
                    this.borrowForm.userName = Cookies.get('user')
                  }
                }
              }, '借阅此书'),
            ]);
          }
        }
      ],
      // 表单数据
      data1: [],
      loading: false,
      time: '',
      borrowModal: false,
      queryData:{
        id:null,//编号
        name: '', // 书名
        author: '', // 作者
        publishHouse: '', // 出版社
        type: '', // 图书类目
      },
      // 校验规则
      ruleValidate: {
        borrowDays: [
          { required: true, message: '请选择借阅时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { // 表格改变
    cancel (name) {
      // 清空表单字段
      this.$refs[name].resetFields()
    },
    borrowBook(name){
      this.$refs[name].validate((valid) => {
        if(valid){
          this.loading = true
            axios.request({
              url:'borrowBook',
              method:'post',
              data:this.borrowForm
            }).then((resp)=>{
              if(resp.data.success){
                  this.$Message.info("借书成功")
              }else {
                this.$Message.warning(resp.data.message)
              }
              this.loading = false
              this.borrowModal = false
              this.cancel(name)
              this.gopage(this.pageNo)
            })
        }
      })
    },
    gopage (pageNo) {
      const pageSize = this.pageSize
      axios.request({
        url: 'book/' + pageNo + '/' + pageSize ,
        method: 'get'
      }).then((result) => {
        this.data1 = result.data.list
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.totalCount = result.data.totalCount
      })
    },
    mutilSearch(pageNo){
      const pageSize = this.pageSize
      axios.request({
        url: 'book/multiSearch/' + pageNo + '/' + pageSize ,
        method: 'post',
        data:this.queryData
      }).then((result) => {
        this.data1 = result.data.list
        this.pageNo = pageNo
        this.pageSize = pageSize
        this.totalCount = result.data.totalCount
        //清空搜索框
        this.queryData.id=null
        this.queryData.name = ''
        this.queryData.publishHouse=''
        this.queryData.author=''
        this.queryData.type=''
      })
    }
  },
  mounted: function () {
    this.gopage(1)
  }
}
</script>
