<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <a @click="registerModal=true">注册</a>
          <p class="login-tip">图书信息管理系统1.0</p>
          <!--注册表单-->
          <Modal v-model="registerModal" title="用户注册" @on-cancel="cancel"
                 :mask-closable="false">
            <Form ref="registerForm" :model="registerForm" :rules="ruleValidate" :label-width="80">
              <FormItem label="用户名" prop="username">
                <Input v-model="registerForm.username" placeholder="请输入用户名"/>
              </FormItem>
              <FormItem label="密码" prop="password">
                <Input type="password" v-model="registerForm.password" placeholder="请输入密码"/>
              </FormItem>
              <FormItem label="确认密码" prop="passwordCheck">
                <Input type="password" v-model="registerForm.passwordCheck" placeholder="请确认密码"/>
              </FormItem>
              <FormItem label="性别" prop="sex">
                <RadioGroup v-model="registerForm.sex">
                  <Radio label="1">男</Radio>
                  <Radio label="0">女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="年龄" prop="age">
                <Input v-model="registerForm.age" placeholder="请输入年龄"/>
              </FormItem>
              <FormItem label="真实姓名" prop="name">
                <Input v-model="registerForm.name" placeholder="请输入真实姓名"/>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="primary" size="large" long @click="userResgister('registerForm')" :loading="loading">注册
              </Button>
            </div>
          </Modal>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import axios from '../../libs/api.request'
import Cookies from 'js-cookie'
import { setToken } from '../../libs/util'

export default {
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
     const validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        axios.request({
          url: 'user/register/' + value,
          method: 'get'
        }).then((result) => {
          if (result.data.success == false) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      registerModal: false,
      // 设置了loading属性 点击确定按钮对话框不会自动消失，并显示 loading 状态，需要手动关闭对话框
      loading: false,
      // 用户注册模型数据
      registerForm: {
        username: '',
        password: '',
        passwordCheck: '',
        phone: '',
        sex: '',
        age: '',
        // 真实姓名
        name: ''
      },
      // 注册表单校验规则

      ruleValidate: {
        username: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        passwordCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输真实姓名', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    // 登录
    handleSubmit ({ userName, password }) {
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
      //   })
      // })
      axios.request({
        url: 'oauth/token',
        method: 'post',
        params: {
          'username': userName,
          'password': password,
          'grant_type': 'password',
          'client_secret': 123456,
          'client_id': 'bms_front'
        }
        // 设置请求头 authorization :basic auth
        // auth: {
        //   username: 'bms_front',
        //   password: '123456'
        // }
      }).then((resp) => {
        this.$Message.info("登录成功")
        // 得到token
        let access_token = resp.data.access_token
        Cookies.set('user', userName)
        setToken(access_token)
        this.$router.push({
          name: this.$config.homeName
        })
      }).catch(() => {
        this.$Message.warning('用户名或密码错误')
      })
    },
    // 用户注册
    userResgister (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          axios.request({
            url: 'user/register',
            method: 'post',
            data: this.registerForm
          }).then((result) => {
            if (result.data.success) {
              this.$Message.info('注册成功')
              this.$refs[name].resetFields()
              this.registerModal = false
            } else {
              this.$Message.error(result.data.message)
            }
            this.loading = false
          })
        }
      })
    },
    cancel () {
      this.$Message.info('关闭成功')
      // 清空表单字段
      this.$refs['registerForm'].resetFields()
    }
  }
}
</script>

<style>

</style>
