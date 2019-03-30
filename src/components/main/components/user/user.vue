<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <a href="javascript:void(0)">
        <!--用户名-->
        <span class="main-user-name">{{username}}</span>
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="ownSpace">个人中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import {mapActions} from 'vuex'
  import Cookies from 'js-cookie'
  import axios from '../../../../libs/api.request'

  export default {
    data() {
      return {
        username: ''
      }
    },
    name: 'User',
    props: {
      userAvator: {
        type: String,
        default: ''
      }
    },
    methods: {
      ...mapActions([
        'handleLogOut',
      ]),
      logout() {
        this.handleLogOut().then(() => {
          this.$Message.info("退出成功")
          this.$router.push({
            name: 'login'
          })
        })
      },
      ownSpace() {
        this.$router.push({
          name: 'own-space'
        })
      },
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.logout()
            break
          case 'ownSpace':
            this.ownSpace()
            break
        }
      }
    },
    mounted: function () {
      this.username = Cookies.get('user')
    }
  }
</script>
