<!--我的留言-->
<template>
  <div class="animated fadeIn">
    <Card>
      <br>
      <Row>
        <Button type="success" icon="wrench" @click="addMessageModal">添加留言</Button>
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
      <!--添加留言-->
      <Modal
        v-model="messageModal"
        title="添加留言"
        width="60%"
        :mask-closable="false" @on-cancel="cancel('addForm')">
        <Form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80">
          <FormItem label="留言内容:" prop="text">
            <Input type="textarea" v-model="addForm.text" placeholder="请输入留言内容"/>
          </FormItem>
        </Form>
          <div slot="footer">
            <Button type="primary" size="large" long @click="addMessage('addForm')" :loading="loading">确定
            </Button>
          </div>
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
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '留言内容',
            key: 'text'
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
        messageModal: false,
        ids:[],
        addForm: {
          userId: Cookies.get("userId"), // 用户id
          userName: Cookies.get("name"),//用户名
          text: '' //留言内容
        },
        // 校验规则
        ruleValidate: {
          text: [
            {required: true, message: '请输入留言内容', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //选择框选中
      change(e) {
        this.setGroupId(e)
      },
      setGroupId(e) {
        this.ids = []
        for (var i = 0; i < e.length; i++) {
          this.ids.push(e[i].id)
        }
      },
      addMessageModal() {
        this.messageModal = true
      },
      //添加
      addMessage(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true
            axios.request({
              url: 'message',
              method: 'post',
              data: this.addForm
            }).then(resp => {
              this.ids = []
              if (resp.data.success) {
                this.$Message.info("添加成功")
              } else {
                this.$Message.error(resp.data.message)
              }
              this.gopage(this.pageNo)
              this.messageModal = false
              this.loading = false
              this.cancel(name)
            })
          }
        })
      },
      // 删除
      remove () {
        if (this.ids.length ==0) {
          this.$Message.warning('请至少选择一项')
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
        let userId = Cookies.get("userId")
        const pageSize = this.pageSize
        axios.request({
          url: 'message/' + userId + '/' + pageNo + '/' + pageSize,
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
