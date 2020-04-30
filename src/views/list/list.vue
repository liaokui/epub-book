<template>
  <div id='list'>
    <header class="clearfix">
      <div class="header">
        <div class="title">
          <p><i class="el-icon-reading"></i>在线EPUB电子书</p>
        </div> 
        <p class="exit" @click="exit()"><i class="iconfont iconexit"></i></p> 
        <div class="search">
          <el-input placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="keyword" size="medium" @keyup.enter.native="clearList()"></el-input>
        </div>  
      </div>
    </header>
    <section class="container">
      <el-scrollbar id="scrollCover" class="app-el-scrollbar"
        ref="componentScrollBar"> 
        <div class="content clearfix">
          <div class="book" v-for="(item, index) in list" :key="index">
            <el-card>
              <div class="cover">
                <p class="delBtn" @click="delBook(item._id)"><i class="el-icon-delete"></i></p>
                <router-link :to="{'path': '/detail', 'query': {'id': item._id}}">
                  <el-image :src="imgReadUrl + item.cover" fit="cover" :preview-src-list="[imgReadUrl + item.cover]"></el-image>
                </router-link>
              </div> 
            </el-card>
            <router-link :to="{'path': '/detail', 'query': {'id': item._id}}">
              <p class="title wordOverFlow">{{ item.title }}</p>
            </router-link>
          </div>
          <div v-if="isUploading" class="book">
            <el-card>
              <p class="delBtn" @click="delUploadingBook()">
                <i class="el-icon-close" />
              </p>
              <div class="cover">
                <el-progress
                  :percentage="progress"
                  type="circle"
                  style="margin-top: 70px" />
              </div>
            </el-card>
          </div>
          <div v-show="!isUploading" class="book">
            <el-upload
              ref="uploadBook"
              :action="uploadAction"
              :headers="uploadHeaders"
              :show-file-list="false"
              :data="uploadData"
              :on-progress="uploading"
              :on-change="bookHandleChange"
              :on-success="bookHandleSuccess"
              :on-error="handleError"
              :before-upload="beforeBookUpload"
              class="book-uploader">
              <div slot="trigger" class="upload-book">
                <i class="el-icon-plus" />
                <span>点击上传图书</span>
              </div>
            </el-upload>
          </div>
          <el-collapse-transition>
            <div v-if="continueLoading" class="load">
              <i class="el-icon-loading"></i>
              <span>加载中 ~~</span>
            </div>
          </el-collapse-transition>
          <p v-if="noMore" class="nomore">没有更多了~~</p>
        </div>
        <footer>
          <p>Copyright © 2018 LK. All rights reserved.</p>
        </footer>
        <el-backtop target=".el-scrollbar .el-scrollbar__wrap"
                    :bottom="40"
                    :visibility-height='100'>
          <i class="el-icon-top"></i>
        </el-backtop>
      </el-scrollbar>
    </section>
  </div>
</template>
<script>
  import index from './list'
  export default index
</script>
<style rel='stylesheet/scss' lang='scss'>
  #list {
    .container {
      .content {
        .book {
          .el-card__body {
            padding: 0;
            position: relative;
            overflow: hidden;
          }
        }
      }
    }
    .el-scrollbar {
      height: 100%;
      .el-scrollbar__wrap {
        overflow-x: hidden;
        .el-backtop i {
          display: block;
          width: 100%;
          height: 40px;
          font-size: 20px;
          font-weight: bold;
          line-height: 44px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style rel='stylesheet/scss' scoped lang='scss'>
  @import './list.scss';
</style>