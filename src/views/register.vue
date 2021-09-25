<template> 
  <el-form :model="user" :rules="rules" ref="userFrom" style="text-align:center">
    <el-form-item prop="userName">
      <el-input v-model="user.userName" type="text" auto-complete="off" placeholder="账号">
        <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input v-model="user.phone" type="text" auto-complete="off" placeholder="手机">
        <svg-icon slot="prefix" icon-class="phone" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="user.email" type="text" auto-complete="off" placeholder="邮箱">
        <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="sex">
      <el-select v-model="user.sex" placeholder="请选择性别" style="width: 100%;">
        <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="nickNameZh">
      <el-input v-model="user.nickNameZh" type="text" auto-complete="off" placeholder="名称(中文)">
        <svg-icon slot="prefix" icon-class="wechat" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="nickNameEn">
      <el-input v-model="user.nickNameEn" type="text" auto-complete="off" placeholder="名称(英文)">
        <svg-icon slot="prefix" icon-class="wechat" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="user.password" :type="pwdType" auto-complete="off" placeholder="密码">
        <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        <svg-icon slot="suffix"  @click="showPwd" icon-class="eye" class="el-input__icon input-icon" />
      </el-input>
    </el-form-item>
    <el-button type="primary" @click="onSubmit('userFrom')">立即注册</el-button>
  </el-form>
</template>
<script>
  import {
    register
  } from '@/api/login'
  export default {
    name: 'Register',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          callback()
        }
      };
      const validateMobile = (rule, value, callback) => {
        if (!/^1[345678]\d{9}$/.test(value)) {
          callback(new Error('请输入正确是手机号'))
        } else {
          callback()
        }
      };
      const validateEmail = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入有效的邮箱'));
        } else {
          callback()
        }
      };
      return {
        user: {
          userName: '',
          phone: '',
          email: '',
          sex: '',
          nickNameZh: '',
          nickNameEn: '',
          password: ''
        },
        pwdType: 'password',
        // 性别状态字典
        sexOptions: [],
        rules: {
          userName: [{
              required: true,
              message: '请输入用户名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur'
            }
          ],
          phone: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: validateMobile
            }
          ],
          email: [{
              required: true,
              message: '请输入电子邮箱',
              trigger: 'blur'
            },
            {
              validator: validateEmail
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              validator: validatePass
            }
          ],
        }
      };
    },
    created() {
      this.getDicts("sys_user_sex").then(response => {
        this.sexOptions = response.data;
      });
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(JSON.stringify(this.user)).then(response => {
              console.log(response)
              if (response.code == '200') {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '注册成功',
                  type: 'success',
                  duration: 1000
                });
                this.$emit("changeRelatedDriver", false);
              } else {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 1000
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      }
    }
  }
</script>
