<template>
  <div id='login'>
    <p class="title">EPUB在线电子书</p>
    <el-card class="box-card loginCard">
      <p class="title">登录</p>
      <el-form :model="loginForm"
               :rules="rules"
               ref="loginForm"
               class="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password"
                    placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="validateBox clearfix">
            <el-input v-model="loginForm.code"
                      placeholder="验证码" @keyup.enter.native="handleForm('loginForm')">
              <template slot="append">
                <span v-html="codeHtml"
                      @click="getCode()"></span>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     class="submitBtn"
                     v-loading="loading"
                     @click="handleForm('loginForm')">登陆</el-button>
        </el-form-item>
      </el-form>
      <p class="tips">账号： admin 密码：123456</p>
    </el-card>
  </div>
</template>
<script>
  import index from './login'
  export default index
</script>
<style rel='stylesheet/scss' lang='scss'>
  #login .loginCard .loginForm .validateBox .el-input-group__append {
    padding: 0;
  }
</style>
<style rel='stylesheet/scss' scoped lang='scss'>
@import './login.scss';
</style>