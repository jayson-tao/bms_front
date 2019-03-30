<!--图书信息管理-->
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
        <Button type="success" icon="wrench" @click="addBookModal">添加</Button>
        <Button type="primary" icon="plus-round" @click="updateModal">修改</Button>
        <Button type="error" icon="trash-a" @click="remove()">删除</Button>
        <!--添加表单-->
        <Modal
        v-model="addModal"
        title="添加图书类目"
        width="60%"
        :mask-closable="false" @on-cancel="cancel('addForm')">
        <Form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80">
          <FormItem label="图书名" prop="name">
            <Input v-model="addForm.name" placeholder="请输入图书名"/>
          </FormItem>
          <FormItem label="作者" prop="author">
            <Input v-model="addForm.author" placeholder="请输入作者"/>
          </FormItem>
          <FormItem label="出版社" prop="publishHouse">
            <Input v-model="addForm.publishHouse" placeholder="请输入出版社"/>
          </FormItem>
          <FormItem label="数量" prop="number">
            <Input v-model="addForm.number" placeholder="请输入图书数量"/>
          </FormItem>
          <FormItem label="单价" prop="price">
            <Input v-model="addForm.price" placeholder="请输入图书单价"/>
          </FormItem>
          <!--图书类目名-->
          <Row>
            <Col>
              <FormItem label="图书类目" prop="type">
                <Select v-model="addForm.type" filterable>
                  <Option v-for="item in typeList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="出版日期" prop="time">
            <DatePicker type="date" placeholder="请输入出版日期" v-model="time"></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" size="large" long @click="addBook('addForm')" :loading="loading">确定
          </Button>
        </div>
      </Modal>
        <!--修改表单-->
        <Modal
          v-model="editModal"
          title="添加图书类目"
          width="60%"
          :mask-closable="false" @on-cancel="cancel('editForm')">
          <Form ref="editForm" :model="editForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="图书名" prop="name">
              <Input v-model="editForm.name" placeholder="请输入图书名"/>
            </FormItem>
            <FormItem label="作者" prop="author">
              <Input v-model="editForm.author" placeholder="请输入作者"/>
            </FormItem>
            <FormItem label="出版社" prop="publishHouse">
              <Input v-model="editForm.publishHouse" placeholder="请输入出版社"/>
            </FormItem>
            <FormItem label="数量" prop="number">
              <Input v-model="editForm.number" placeholder="请输入图书数量"/>
            </FormItem>
            <FormItem label="单价" prop="price">
              <Input v-model="editForm.price" placeholder="请输入图书单价"/>
            </FormItem>
            <!--图书类目名-->
            <Row>
              <Col>
                <FormItem label="图书类目" prop="type">
                  <Select v-model="editForm.type" filterable>
                    <Option v-for="item in typeList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="出版日期" prop="time">
              <DatePicker type="date" placeholder="请输入出版日期" v-model="time"></DatePicker>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" size="large" long @click="updateBook('editForm')" :loading="loading">确定
            </Button>
          </div>
        </Modal>
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
import dateFormat, { date2Time } from '../../libs/date'
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
      // 表格字段
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
          title: '数量',
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
        }
      ],
      // 表单数据
      data1: [],
      // 类目集合
      typeList: null,
      addModal: false,
      loading: false,
      time: '',
      queryData:{
        id:null,//编号
        name: '', // 书名
        author: '', // 作者
        publishHouse: '', // 出版社
        type: '', // 图书类目
      },
      // 添加表单数据
      addForm: {
        name: '', // 书名
        author: '', // 作者
        publishHouse: '', // 出版社
        number: null, // 数量
        price: null, // 单价
        type: '', // 图书类目
        publishTime: ''// 出版日期
      },
      editModal: false,
      // 添加表单数据
      editForm: {
        id: '',
        name: '', // 书名
        author: '', // 作者
        publishHouse: '', // 出版社
        number: null, // 数量
        price: null, // 单价
        type: '', // 图书类目
        publishTime: ''// 出版日期
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '图书名不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ],
        publishHouse: [
          { required: true, message: '出版社不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '单价不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类目不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { // 表格改变
    change (e) {
      this.setGroupId(e)
      if (e.length == 1) {
        this.editForm = e[0]
        // 日期转换
        this.time = dateFormat(this.editForm.publishTime)
      }
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
    addBookModal () {
      this.addModal = true
    },
    // 添加图书
    addBook (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          this.addForm.publishTime = date2Time(this.time)
          axios.request({
            url: 'book',
            method: 'post',
            data: this.addForm
          }).then((resp) => {
            if (resp.data.success) {
              this.$Message.success('添加成功')
              this.gopage(1)
              this.time = null
            } else {
              this.$Message.error(resp.data.message)
            }
            this.loading = false
            // 关闭对话框
            this.addModal = false
            this.cancel(name)
          })
        }
      })
    },
    updateModal () {
      if (this.groupId.length != 1) {
        this.$Message.warning('请选择一项修改')
        return
      }
      this.editModal = true
    },
    updateBook (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          this.editForm.publishTime = date2Time(this.time)
          axios.request({
            url: 'book',
            method: 'put',
            data: this.editForm
          }).then((resp) => {
            if (resp.data.success) {
              this.$Message.success('更新成功')
              this.time = null
              this.gopage(1)
            } else {
              this.$Message.error(resp.data.message)
            }
            this.loading = false
            this.editModal = false
          })
        }
      })
    },
    cancel (name) {
      // 清空表单字段
      this.$refs[name].resetFields()
    },
    // 删除
    remove () {
      if (this.count == 0) {
        this.$Message.warning('请至少选择一项')
        return
      }
      axios.request({
        url: 'book',
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
    // 获取所有的图书类目
    axios.request({
      url: 'bookType/list',
      method: 'get'
    }).then((resp) => {
      this.typeList = resp.data
    })
  }
}
</script>
