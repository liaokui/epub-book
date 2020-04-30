<template>
  <div id='detail'>
    <header class="clearfix">
      <router-link :to="{'path': '/list'}">
        <p class="return btn"><i class="el-icon-arrow-left"></i></p>
      </router-link>
      <div class="title">
        <p class="wordOverFlow">{{ title }}</p>
      </div>  
      <div class="menu clearfix">
        <p class="btn" @click="openThemeDialog()"><i class="iconfont icontheme"></i></p>
        <p class="btn" @click="openSearchDialog()"><i class="el-icon-search"></i></p>
        <p class="btn" @click="openNoteDialog()"><i class="iconfont iconnote"></i></p>
        <p class="btn" @click="exit()"><i class="iconfont iconexit"></i></p>
      </div>
    </header>
    <section class="container">
      <el-scrollbar id="scrollCover" class="app-el-scrollbar"
        ref="componentScrollBar"> 
        <div id="content" class="content clearfix">
          <div id="record" class="record">
            <div class="list">
              <div class="chapter" v-for="(item, index) in chapterDetailList" :key="index">
                <div :id="'chapter' + item.id" class="title clearfix">
                  <p :class="(currentChapter && currentChapter.href === item.href) ? 'wordOverFlow active' : 'wordOverFlow'" :title="item.label" @click="goToChapter(item.cfi)">{{ item.label }}</p>
                  <i :class="item.unfold ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" v-if="item.knot.length > 0" @click="item.unfold = !item.unfold"></i>
                </div>
                <el-collapse-transition>
                  <div class="knot" v-if="item.knot.length > 0" v-show="item.unfold">
                    <div :id="'chapter' + val.id" class="title secondary" v-for="(val, ind) in item.knot" :key="index + '' + ind">
                      <p :class="(currentChapter && currentChapter.href === val.href) ? 'wordOverFlow active' : 'wordOverFlow'" :title="val.label" @click="goToChapter(val.cfi)">{{ val.label }}</p>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </div>
          </div>
          <div class="bar"></div>
          <div class="article">
            <div class="handleBox clearfix">
              <p class="prev" v-if="prevStatus" @click="prev()"><i class="el-icon-arrow-left"></i>上一章</p>
              <p class="next" v-if="nextStatus" @click="next()">下一章<i class="el-icon-arrow-right"></i></p>
            </div>
            <div :class="'bookBox ' + theme">
              <div id="book" v-loading="bookLoading"></div>
            </div>
          </div>
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

    <!-- 文字选中菜单栏 -->
    <div id="wordMenu" v-if="wordMenuStatus" :style="{'top': wordMenuMode === 'add' ? (wordMenuTop + 60 + 'px') : (wordMenuTop + 'px'),
		'left': wordMenuLeft + 'px', 'height': wordMenuMode === 'add' ? '60px' : '120px'}">
      <div class="colorList clearfix" v-if="wordMenuMode === 'edit'">
        <p :class="wordSelectedColorClassName === 'green' ? 'active' : ''">
          <span style="background: #1CB555" @click="editNote({ 'underlineClass' : 'green' })"></span></p>
        <p :class="wordSelectedColorClassName === 'orange' ? 'active' : ''">
          <span style="background: #F19149" @click="editNote({ 'underlineClass' : 'orange' })"></span></p>
        <p :class="wordSelectedColorClassName === 'blue' ? 'active' : ''">
          <span style="background: #00A0E9" @click="editNote({ 'underlineClass' : 'blue' })"></span></p>
        <p :class="wordSelectedColorClassName === 'violet' ? 'active' : ''">
          <span style="background: #C490BF" @click="editNote({ 'underlineClass' : 'violet' })"></span></p>
      </div>
      <div class="tool clearfix">
        <p @click="copyWord()">复制</p>
        <p @click="share()">分享</p>
        <p v-if="wordMenuMode === 'add'" @click="addNote('underline')">划线</p>
        <p v-if="wordMenuMode === 'edit'" @click="deleteNote()">清除</p>
        <p @click="openAnnotateDialog()">批注</p>
      </div>
		</div>
    <p class="test" :style="{'top': testTop + 'px','left': testLeft + 'px'}"></p>

    <!-- 笔记表单 -->
    <div id="noteForm" class="top" v-if="noteFormStatus"
          :style="{'top': noteFormTop + 'px', 'left': noteFormLeft + 'px'}">
      <p>批注</p>
      <span class="wordOverflow">{{ wordSelectedValue }}</span>
      <el-input type="textarea" v-model="noteFormWord" :rows="5"></el-input>
      <p class="complete" @click="createAnnotate()">保 存</p>
    </div>

    <!-- 笔记显示 -->
    <div id="noteShowList" ref="note">
      <div id="noteShow" v-for="(item, index) in noteShowList" :key="index"
            :class="item.underlineClass" :style="{'top': item.top + 'px','left': item.left + 'px'}">
        <div class="clearfix" @click="showNote(item.cfi)">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="noteContent" v-if="item.isShowed" :style="{'top': item.cTop + 'px','left': item.cLeft + 'px'}">
          <p class="wordOverFlow" @click.stop="editNoteContent(item)">{{ item.note }}</p>
        </div>
      </div>
    </div>

    <!-- 右侧菜单抽屉 -->
    <el-drawer :visible.sync="drawerStatus" direction="rtl" :before-close="toggleDrawer" :title="drawerTitle" size="500px" :destroy-on-close="true">
      <!-- <p>我是内容</p> -->
      <theme v-if="themeStatus" @setFont="setFont" @setFontSize="setFontSize"
              @setLineHeight="setLineHeight" @setBackground="setBackground"></theme>
      <search v-if="searchStatus" @closeDialog="toggleDrawer" :list.sync="searchResult"
              @search="search" @gotoResult="gotoNote"></search>
      <note v-if="noteStatus" :bookId="id" @closeDialog="toggleDrawer" @delNote="deleteNote" @gotoNote="gotoNote"></note>
    </el-drawer>
    <!-- 图片放大Dialog -->
    <div id="imgDialog" v-if="imgDialogStatus" @click="imgDialogStatus = false">
      <img :src="imgSrc" alt="">
    </div>
  </div>
</template>
<script>
  import index from './detail'
  export default index
</script>
<style rel='stylesheet/scss' lang='scss'>
  #detail {
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
    .el-drawer__header {
      padding: 6px 20px;
      line-height: 48px;
      margin: 0;
      background-color: #223FEE;
      span {
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        outline: none;
      }
      button {
        outline: none;
      }
      i {
        color: #ffffff;
        font-size: 24px;
      }
    }
    .epub-view {
			svg {
				g {
					rect {
						stroke: none;
					}

					line {
						stroke-opacity: 1;
					}

					&.default {
						cursor: pointer;

						line {
							stroke: #3652F8;
						}
					}

					&.green {
						cursor: pointer;

						line {
							stroke: #1CB555;
						}
					}

					&.orange {
						cursor: pointer;

						line {
							stroke: #F19149;
						}
					}

					&.blue {
						cursor: pointer;

						line {
							stroke: #00A0E9;
						}
					}

					&.violet {
						cursor: pointer;

						line {
							stroke: #C490BF;
						}
					}
				}
			}
		}
  }
</style>
<style rel='stylesheet/scss' scoped lang='scss'>
  @import './detail.scss';
</style>