<template>
  <div class="animated fadeIn">
    <Card>
      <Row>
        <Button type="primary" icon="plus-round" @click="openAddModal">新建</Button>
        <Button type="success" icon="wrench" @click="editType">修改</Button>
        <Button type="error" icon="trash-a" @click="removeType">删除</Button>
        <!--添加表单-->
        <Modal
          v-model="addModal"
          title="添加图书类目"
          width="60%"
          :mask-closable="false" @on-cancel="cancel('addForm')">
          <Form ref="addForm" :model="addForm" :rules="ruleValidate" :label-width="80">
            <Row>
              <Col span="14">
                <FormItem label="等级" prop="level">
                  <RadioGroup v-model="addForm.level">
                    <Radio label="0">一级目录</Radio>
                    <Radio label="1">子目录</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="类目名" prop="name">
              <Input v-model="addForm.name" placeholder="请输入类目名"/>
            </FormItem>
            <FormItem label="描述" prop="description">
              <Input v-model="addForm.description" placeholder="请输入类目描述"/>
            </FormItem>
            <Row>
              <Col span="11">
                <FormItem label="父类目" prop="pid">
                  <Select v-model="addForm.pid" filterable>
                    <Option :value="parentType.id" :key="parentType.id">{{ parentType.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div slot="footer">
            <Button type="primary" size="large" long @click="addBookType('addForm')" :loading="loading">确定
            </Button>
          </div>
        </Modal>
        <!--修改表单-->
        <Modal
          v-model="editModal"
          title="修改图书类目"
          width="60%"
          :mask-closable="false" @on-cancel="cancel('editForm')">
          <Form ref="editForm" :model="editForm" :rules="ruleValidate" :label-width="80">
            <Row>
              <Col span="14">
                <FormItem label="等级" prop="level">
                  <RadioGroup v-model="editForm.level" @on-change="changeLevel">
                    <Radio label="0">一级目录</Radio>
                    <Radio label="1">子目录</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="类目名" prop="name">
              <Input v-model="editForm.name" placeholder="请输入类目名"/>
            </FormItem>
            <FormItem label="描述" prop="description">
              <Input v-model="editForm.description" placeholder="请输入类目描述"/>
            </FormItem>
            <Row>
              <Col>
                <FormItem label="父类目" prop="pid" v-bind:hidden="hidden">
                  <Select v-model="editForm.pid" filterable>
                    <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div slot="footer">
            <Button type="primary" size="large" long @click="updateBookType('editForm')" :loading="loading">确定
            </Button>
          </div>
        </Modal>
      </Row>
      <br/>
      <p>图书类目列表</p>
      <hr/>
      <Row>
        <div>
          <ul id="typeTree" class="ztree"></ul>
        </div>
      </Row>
    </Card>
  </div>
</template>

<script>
import axios from '../../libs/api.request'
// 导入ztree的依赖
import 'ztree/js/jquery-1.4.4.min.js'
import 'ztree/js/jquery.ztree.core.min.js'
import 'ztree/js/jquery.ztree.excheck.min.js'
import 'ztree/css/zTreeStyle/zTreeStyle.css'

export default {
  name: 'BookType',
  data () {
    return {
      addModal: false,
      loading: false,
      addForm: {
        // 类目名
        name: '',
        description: '',
        pid: null,
        // 类目等级
        level: '0'
      },
      editForm: {
        // 类目名
        name: '',
        description: '',
        pid: null,
        // 类目等级
        level: '0'
      },
      parentType: {
        id: '',
        name: ''
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '条目名不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择图书类目等级', trigger: 'blur' }
        ]
      },
      // tree的节点数据
      treeNodes: [],
      addZTree: {},
      updateZTree: {},
      // ztree的配置
      setting: {
        check: {
          // 设置不显示选择框
          enable: true,
          chkboxType: { 'Y': '', 'N': '' }
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'pId',
            rootPId: 0
          }
        }
      },
      // 类目集合
      typeList: null,
      groupId: null,
      editModal: false,
      hidden: true
    }
  },
  methods: {
    openAddModal () {
      this.addModal = true
      // 判断是否勾选了树节点
      let checkedNodes = this.addZTree.getCheckedNodes(true)
      if (checkedNodes.length > 0) {
        this.parentType.id = checkedNodes[0].id
        this.addForm.pid = checkedNodes[0].id
        this.parentType.name = checkedNodes[0].name
        this.addForm.level = '1'
      }
    },
    editType () {
      // 获取选中的节点
      let checkedNodes = this.addZTree.getCheckedNodes(true)
      if (checkedNodes.length == 1) {
        this.editModal = true
        this.editForm.id = checkedNodes[0].id
        // 查询所有类目
        axios.request({
          url: 'bookType/list',
          method: 'get'
        }).then((resp) => {
          this.typeList = resp.data
        })
      } else {
        this.$Message.warning('只能选择一项进行修改')
        return
      }
      // 获取条目信息
      axios.request({
        url: 'bookType/' + this.editForm.id,
        method: 'get'
      }).then((resp) => {
        this.editForm = resp.data
        this.editForm.level = resp.data.level + ''
        this.changeLevel()
      })
    },
    // 更新类目
    updateBookType (name) {
      axios.request({
        url: 'bookType',
        method: 'put',
        data: this.editForm
      }).then((resp) => {
        if (resp.data.success) {
          this.$Message.success('更新成功')
          this.findAllTypes()
        } else {
          this.$Message.error(resp.data.message)
        }
        this.loading = false
        this.editModal = false
        this.cancel(name)
      })
    },
    // 修改表单判断
    changeLevel () {
      if (this.editForm.level == '1') {
        this.hidden = false
      } else {
        // 一级目录
        this.hidden = true
        this.editForm.pid = 0
      }
    },
    // 删除目录
    removeType () {
      // 获取选中的节点
      let checkedNodes = this.addZTree.getCheckedNodes(true)
      if (checkedNodes.length > 0) {
        // 获取节点id
        this.groupId = []
        for (let i = 0; i < checkedNodes.length; i++) {
          this.groupId.push(checkedNodes[i].id)
        }
      } else {
        this.$Message.warning('请至少选择一项')
        return
      }
      axios.request({
        url: 'bookType',
        method: 'delete',
        data: this.groupId
      }).then((resp) => {
        if (resp.data.success) {
          this.$Message.info('删除成功')
          this.findAllTypes()
        } else {
          this.$Message.error(resp.data.message)
        }
        this.groupId = []
      })
    },
    addBookType (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          axios.request({
            url: 'bookType',
            method: 'post',
            data: this.addForm
          }).then((result) => {
            if (result.data.success) {
              this.loading = false
              this.$Message.info('添加成功')
              this.findAllTypes()
            } else {
              this.$Message.error(result.data.message)
              this.loading = false
            }
            this.addModal = false
            this.cancel(name)
          })
        }
      })
    },
    cancel (name) {
      // 清空表单字段
      this.$refs[name].resetFields()
    },
    findAllTypes () {
      axios.request({
        url: 'bookType',
        method: 'get'
      }).then(resp => {
        this.treeNodes = resp.data
        // 用于初始化树节点
        this.addZTree = $.fn.zTree.init($('#typeTree'), this.setting, this.treeNodes)
        this.updateZTree = $.fn.zTree.init($('#updateTree'), this.setting, this.treeNodes)
      })
    }
  },
  mounted: function () {
    // 查询图书类目
    this.findAllTypes()
  }
}
</script>
