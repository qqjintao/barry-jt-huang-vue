<template>
  <div class="login">
    <video autoplay loop muted>
      <source src="../assets/image/gongzhu.mp4" type="video/mp4"/>
    </video>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="userName">
        <el-input v-model="loginForm.userName" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" :type="pwdType" auto-complete="off" placeholder="密码"
                  @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          <svg-icon slot="suffix" @click="showPwd" icon-class="eye" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                  @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-link type="primary" @click.native.prevent="handleTry" style="float:right">没有账号？立即注册</el-link>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                   @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 弹窗 -->
    <el-dialog
      title="注册账户"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="25%">
      <div class="login-title">
        <register @changeRelatedDriver="changeRelatedDriver"></register>
      </div>
    </el-dialog>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2020 - 2025 Intertek. All Rights Reserved.</span>
      <span>天祥集團公司 版權所有</span>
    </div>
  </div>
</template>

<script>
  import {
    getCodeImg
  } from '@/api/login'
  import Cookies from 'js-cookie'
  import {
    encrypt,
    decrypt
  } from '@/utils/jsencrypt'
  import Register from './register'

  export default {
    name: 'Login',
    components: { Register },
    data() {
      return {
        codeUrl: '',
        cookiePassword: '',
        pwdType: 'password',
        loginForm: {
          userName: 'admin',
          password: 'admin123',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          userName: [{
            required: true,
            trigger: 'blur',
            message: '用户名不能为空'
          }],
          password: [{
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          }],
          code: [{
            required: true,
            trigger: 'change',
            message: '验证码不能为空'
          }]
        },
        loading: false,
        redirect: undefined,
        dialogVisible: false
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      this.getCode()
      this.getCookie()
    },
    methods: {
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = 'data:image/gif;base64,' + res.data.img
          this.loginForm.uuid = res.data.uuid
        })
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      getCookie() {
        const userName = Cookies.get('userName')
        const password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          userName: userName === undefined ? this.loginForm.userName : userName,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            if (this.loginForm.rememberMe) {
              Cookies.set('userName', this.loginForm.userName, {
                expires: 30
              })
              Cookies.set('password', encrypt(this.loginForm.password), {
                expires: 30
              })
              Cookies.set('rememberMe', this.loginForm.rememberMe, {
                expires: 30
              })
            } else {
              Cookies.remove('userName')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store
              .dispatch('Login', this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/'
                })
              })
              .catch(() => {
                this.loading = false
                this.getCode()
              })
          }
        })
      },
      //关闭对话框
      handleTry() {
        this.dialogVisible = true
      },
      //子组件返回数据改变父组件的数据
      changeRelatedDriver(params) {
        this.dialogVisible = params
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  body {
    margin: 0;
    padding: 0
  }

  video {
    position: fixed;
    right: 0px;
    bottom: 0px;
    min-width: 100%;
    min-height: 100%;
    height: auto;
    width: auto;
    z-index: -11
  }

  source {
    min-width: 100%;
    min-height: 100%;
    height: auto;
    width: auto;
  }

  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    opacity: 0.75;
    z-index: 100;

    .el-input {
      height: 38px;

      input {
        height: 38px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .login-code-img {
    height: 38px;
  }
</style>
