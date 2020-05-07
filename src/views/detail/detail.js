import Theme from './components/theme/theme.vue'
import Search from './components/search/search.vue'
import Note from './components/note/note.vue'
import { removeToken, removeUid, removeUsername } from '../../utils/auth'
import { getBookDetail, getThemeDetail, updateTheme, getNote, createNote, updateNote, removeNote } from './detail.service'

import $ from 'jquery'
const ePub = window.ePub;

export default {
  components: {
    Theme,
    Search,
    Note,
  },
  data() {
    return {
      id: null,
      url: null,
      title: null,
      drawerStatus: false,
      drawerTitle: null,
      themeStatus: false,
      searchStatus: false,
      noteStatus: false,
      nextStatus: false,
      prevStatus: false,
      searchResult: [],
      bookLoading: false,
      book: null,
      bookRendition: null,
      bookFrame: null,
      themes: null,
      themesObj: {},
      theme: null,
      display: null,
      currentChapterList: [],
      currentChapter: {},
      bookInfo: {},
      chapterDetailList: [],
      chapterList: [],
      // 文字菜单
      wordMenuStatus: false,
      wordMenuMode: 'add', // 'add' || 'edit'
      wordMenuTop: 0,
      wordMenuLeft: 0,
      // 当前处理文字
      wordSelectedValue: null,
      wordSelectedCfi: null,
      wordSelectedRangeObj: null,
      wordSelectedColorClassName: null,
      wordSelectedNote: null,
      wordSelectedNoteId: null,
      // 笔记表单
      noteFormStatus: false,
      noteFormTop: 0,
      noteFormLeft: 0,
      noteFormWord: null,
      // 笔记显示列表
      noteList: [],
      noteShowList: [],
      // 鼠标状态
      mouseSelectStatus: false,
      // 查看图片
      imgDialogStatus: false,
      imgSrc: null,
      testTop: 0,
      testLeft: 0,
    }
  },
  created() {
    
  },
  methods: {
    init() {
      if (this.$route.query && this.$route.query.id) {
        this.id = this.$route.query.id;
        this.getDetail();
        window.addEventListener('scroll', this.handleScroll, true);
      } else {
        this.$message({
          message: '无法获取图书ID',
          type: 'warning'
        })
      }
    },
    // 获取图书详情
    getDetail() {
      const params = {
        'id': this.id
      }
      getBookDetail(params).then(res => {
        if (res && res.status === 'success') {
          this.url = res.data.url
          this.title = res.data.title
          this.bookInit(this.url)
        }else{
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.message.error(error)
      });
    },
    // 图书解析渲染
    bookInit(url) {
      this.bookLoading = true;
      this.book = ePub(url);
      this.bookRendition = this.book.renderTo('book', {
        width: '100%',
        flow: "scrolled-doc",
        // height: '100%',
        // spread: 'always',
        // ignoreClass: 'annotator-hl',
      });
      this.display = this.bookRendition.display();
      this.bookFrame = document.getElementById('book').getBoundingClientRect();
      this.renderInit();
    },
    // 图书加载后配置
    renderInit() {
      // 图书加载完成
      this.book.ready.then( async () => {
        console.log('图书加载完成');
        console.log(this.book);
        this.bookLoading = false;
        this.getTheme()
        // 生成目录
        this.chapterDetailList = this.book.navigation.toc.map( item => {
          let knot = []
          if (item.subitems.length > 0) {
            knot = item.subitems.map( val => {
              let secondaryKnot = []
              if (val.subitems.length > 0) {
                secondaryKnot = val.subitems.map( v => {
                  return {
                    id: v.id,
                    label: v.label,
                    href: v.href,
                  }
                })
              }
              return {
                id: val.id,
                label: val.label,
                href: val.href,
                knot: secondaryKnot,
                unfold: true
              }
            })
          }
          return {
            id: item.id,
            label: item.label,
            href: item.href,
            knot,
            unfold: true
          }
        })

        // 生成目录一级列表
        this.chapterList = []
        this.chapterDetailList.map(item => {
          this.chapterList.push(item)
          if (item.knot.length > 0) {
            item.knot.map(val => {
              this.chapterList.push({
                parent: item,
                ...val
              })
              if (val.knot.length > 0) {
                val.knot.map(v => {
                  this.chapterList.push({
                    parent: val,
                    ...v
                  })
                })
              }
            })
          }
          return {
            parent: null,
            ...item
          }
        })
        // 章节变化
        this.bookRendition.on('rendered', (section) => {
          console.log('章节变化');
          this.currentChapterList = this.chapterList.filter(item => {
            return item.href.split('#')[0] === section.href.split('#')[0]
          }).map(item => {
            let offsetTop = 0
            if (item.href.split('#').length > 1) {
              let chapterDom = this.bookRendition.getContents(item.href)[0].document.getElementById(item.href.split('#')[1]);
              offsetTop = chapterDom.offsetTop
            }
            return {
              offsetTop,
              ...item
            }
          }) 
          if (this.currentChapterList.length > 0) {
            this.currentChapter = this.currentChapterList[0]
            this.noteChange()
            const top = $('#chapter' + this.currentChapter.id)[0].offsetTop
            if ($('#record')[0].scrollTop > top + 30) {
              setTimeout(() => {
                $('#record').animate({ scrollTop: top }, 500);
              }, 300)
            }
          }
          let link = this.bookRendition.getContents()[0].content.getElementsByTagName(
              'a');
          if (link.length > 0) {
            for (let i = 0; i < link.length; i++) {
              link[i].addEventListener('click', (e) => {
                e.preventDefault();
                let href, directory
                if (this.book.path.directory === '//') {
                  directory = '/'
                } else {
                  directory = this.book.path.directory
                }
                if (!e.target.href) { 
                  if (!e.target.parentNode.href) {
                    href = e.target.parentNode.parentNode.pathname.split(directory)[1] + e.target.parentNode.parentNode.hash
                  } else {
                    href = e.target.parentNode.pathname.split(directory)[1] + e.target.parentNode.hash
                  }
                } else {
                  href = e.target.pathname.split(directory)[1] + e.target.hash
                }
                this.goToChapter({href})
              }, false);
            }
          }
        });
        // 页码变化
        this.bookRendition.on('relocated', location => {
          console.log('页码变化');
          this.nextStatus = !location.atEnd;
          this.prevStatus = !location.atStart;
          this.toolTipsStatus = false;
          this.annotateStatus = false;
        });
        // 布局变化
        this.bookRendition.on('layout', () => {
          console.log('布局变化');
        });
        // 选中文字
        this.bookRendition.on('selected', (cfiRange, contents) => {
          let range, rangeObj, scrollTop, fs = this.themesObj.fontSize,
            lh = parseInt(this.themesObj.lineHeight * 10) / 10;
          range = this.getRange(cfiRange);
          rangeObj = this.getRangeRect(cfiRange);
          scrollTop = $('.el-scrollbar__wrap').scrollTop()
          this.mouseSelectStatus = true;
          this.wordSelectedCfi = cfiRange;
          this.wordSelectedRangeObj = rangeObj;
          this.wordMenuTop = rangeObj.top - scrollTop + this.bookFrame.top + 50 - fs * lh - 125
          this.wordMenuLeft = rangeObj.left % this.bookFrame.width + this.bookFrame.left + rangeObj.width / 2 - 150;
          this.wordMenuStatus = true;
          this.wordMenuMode = 'add';
          this.wordSelectedValue = range.toString();
        });
        // 鼠标点下去
        this.bookRendition.on('mousedown', (event, contents) => {
          this.mouseSelectStatus = false;
        });
        // 鼠标松开
        this.bookRendition.on('mouseup', (event, contents) => {
          if (!this.mouseSelectStatus) {
            if (this.wordMenuStatus || this.noteFormStatus) {
              this.wordMenuStatus = false;
              this.noteFormStatus = false;
              this.clearSelectInfo();
            }
            this.noteShowList.map(item => {
              item.isShowed = false;
              return item;
            });
          }
          this.mouseSelectStatus = false;
        });
        // 点击事件
        this.bookRendition.on('click', event => {
          // 点击目标为图片
          if (event.path[0].nodeName === 'IMG') {
            this.imgDialogStatus = true;
            this.imgSrc = event.path[0].src;
          }
        });
        // 点击选中文字
        this.bookRendition.on('markClicked', (cfiRange, object, contents) => {
          let range, rangeObj, scrollTop, fs = this.themesObj.fontSize,
            lh = parseInt(this.themesObj.lineHeight * 10) / 10;
          range = this.getRange(cfiRange);
          rangeObj = this.getRangeRect(cfiRange);
          scrollTop = $('.el-scrollbar__wrap').scrollTop()
          this.wordSelectedCfi = cfiRange;
          this.wordSelectedRangeObj = rangeObj;
          if (object) {
            this.wordSelectedNoteId = object.id
            this.wordSelectedColorClassName = object.underlineClass;
            this.wordSelectedNote = object.note
          }
          this.wordMenuTop = rangeObj.top - scrollTop + this.bookFrame.top + 50 - fs * lh - 125
          this.wordMenuLeft = rangeObj.left % this.bookFrame.width + this.bookFrame.left + rangeObj.width / 2 - 150;
          this.noteShowList.map(item => {
            item.isShowed = false;
            return item;
          });
          this.noteFormStatus = false;
          this.wordMenuStatus = true;
          this.wordMenuMode = 'edit';
          this.wordSelectedValue = range.toString();
        });
      });
    },
    // 复制文字
    copyWord() {
      const oInput = document.createElement('input');
      oInput.value = this.wordSelectedValue;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand('Copy');
      oInput.style.display = 'none';
      document.body.removeChild(oInput);
      this.bookRendition.getContents(this.wordSelectedCfi)[0].document.getSelection().empty();
      if (this.wordMenuStatus || this.noteFormStatus) {
        this.wordMenuStatus = false;
        this.noteFormStatus = false;
        this.clearSelectInfo();
      }
      this.$message({
        message: '内容已成功复制到粘贴板!',
        type: 'success'
      })
    },
    // 分享
    share() {
      this.bookRendition.getContents(this.wordSelectedCfi)[0].document.getSelection().empty();
      if (this.wordMenuStatus || this.noteFormStatus) {
        this.wordMenuStatus = false;
        this.noteFormStatus = false;
        this.clearSelectInfo();
      }
      this.$message({
        message: '分享成功！',
        type: 'success'
      })
    },
    // 打开批注编辑框
    openAnnotateDialog () {
      let scrollTop, fs = this.themesObj.fontSize,
        lh = parseInt(this.themesObj.lineHeight * 10) / 10;
      scrollTop = $('.el-scrollbar__wrap').scrollTop()
      this.wordMenuStatus = false;
      this.noteShowList.map(item => {
        item.isShowed = false;
        return item;
      });
      this.noteFormTop = this.wordSelectedRangeObj.top - scrollTop + this.bookFrame.top + 50 - fs * lh - 237
      this.noteFormLeft = this.wordSelectedRangeObj.left % this.bookFrame.width + this.bookFrame.left + this.wordSelectedRangeObj.width / 2 - 200;
      this.noteFormStatus = true;
      this.noteFormWord = this.wordSelectedNote;
    },
    // 编辑批注
    editNoteContent(item) {
      this.bookRendition.emit('markClicked', item.cfi, {
        id: item._id,
        cfi: item.cfi,
        underlineClass: item.underlineClass,
        note: item.note,
      });
      this.openAnnotateDialog();
    },
    // 批注
    createAnnotate() {
      if (!this.noteFormWord) {
        this.$message({
          message: '笔记内容不能为空!',
          type: 'error'
        })
        this.closeAnnotateDialog();
        return true;
      } else {
        if (this.wordMenuMode === 'add') {
          this.addNote('note', this.noteFormWord)
        } else {
          this.editNote({
            type: 'note',
            note: this.noteFormWord
          })
        }
      }
    },
    // 获取批注标记坐标
    getNoteTipsPosition(cfi) {
      let left, top, range, otherRange, rangeObj, otherRangeObj,
        fs = this.themesObj.fontSize,
        lh = parseInt(this.themesObj.lineHeight * 10) / 10;
      range = this.getRange(cfi);
      if (!range) {
        return true;
      }
      otherRange = range.cloneRange();
      otherRange.collapse(false);
      rangeObj = range.getBoundingClientRect();
      otherRangeObj = otherRange.getBoundingClientRect();
      top = otherRangeObj.top + this.bookFrame.top + fs * 1.2 + 11;
      left = otherRangeObj.left % this.bookFrame.width + this.bookFrame.left;
      if (Math.abs(otherRangeObj.left % this.bookFrame.width - 0.04 *
        this.bookFrame.width) < 10 ||
        Math.abs(otherRangeObj.left % this.bookFrame.width - 0.54 *
          this.bookFrame.width) < 10) {
        if (otherRangeObj.top <= (3 * lh / 0.4 + fs - 6)) {
          if (Math.abs(otherRangeObj.left % this.bookFrame.width - 0.04 *
            this.bookFrame.width) < 10) {
            top = rangeObj.top + this.bookFrame.top + fs * 1.2 + 11 + rangeObj.height - fs * lh - 2;
            left = left + 0.92 * this.bookFrame.width - 5;
          } else {
            top = rangeObj.top + this.bookFrame.top + fs * 1.2 + 11 + rangeObj.height - fs * lh - 2;
            left = left - 0.08 * this.bookFrame.width - 3;
          }
        } else {
          top = top - fs * lh;
          left = left + 0.42 * this.bookFrame.width - 3;
        }
      }
      let extraTop;
      if (this.themesObj.fontFamily === 'MicrosoftYaHei' || this.themesObj.fontFamily ===
        'PingFangSC-Regular, sans-serif') {
        extraTop = 0;
      } else {
        extraTop = -5;
      }
      return {
        top: top + extraTop,
        left: left,
      };
    },
    // 清理选中信息
    clearSelectInfo() {
      this.noteShowList.map(item => {
        item.isShowed = false;
        return item;
      });
      this.wordMenuMode = 'add';
      this.wordSelectedCfi = null;
      this.wordSelectedColorClassName = null;
      this.wordSelectedValue = null;
      this.wordSelectedNote = null;
      this.noteFormWord = null;
      this.wordSelectedNoteId = null;
    },
    // 页面变化笔记回显
    noteChange() {
      this.getNoteList(() => {
        this.noteList.map(item => {
          this.bookRendition.annotations.remove(item.cfi, 'underline');
          this.bookRendition.annotations.add('underline', item.cfi, {
            id: item._id,
            cfi: item.cfi,
            underlineClass: item.underlineClass,
            note: item.note,
          }, () => {}, item.underlineClass, {});
        });
        this.createAnnotationDom();
      })
    },
    // 创建批注dom
    createAnnotationDom() {
      const svg = document.querySelector('svg');
      const gArr = document.querySelectorAll('svg g');
      const container = document.querySelector('.epub-view');
      const scrollTop = $('.el-scrollbar__wrap').scrollTop()
      this.$refs.note.style = svg.style.cssText;
      this.noteShowList = [];
      this.noteList.map((item, index) => {
        gArr.forEach(val => {
          if (item.type === 'note' && item.cfi === val.dataset['cfi']) {
            const line = val.querySelectorAll('line')[val.querySelectorAll(
              'line').length - 1];
            const left = line.x2.baseVal.value;
            const top = line.y2.baseVal.value;
            this.noteShowList.push({
              isShowed: false,
              top: top - 10,
              left: left,
              cTop: top - 10 - 70 + this.bookFrame.top - scrollTop,
              cLeft: left % this.bookFrame.width + this.bookFrame.left - 140 +
                10,
              ...item,
            });
          }
        });
      });
      container.appendChild(this.$refs.note);
    },
    // 显示笔记
    showNote(cfi) {
      const scrollTop = $('.el-scrollbar__wrap').scrollTop()
      this.noteShowList.map(item => {
        if (item.cfi === cfi) {
          item.isShowed = !item.isShowed
          item.cTop = item.top - 40 + this.bookFrame.top - scrollTop
        } else {
          item.isShowed = false
        }
        return item
      })
      this.wordMenuStatus = false;
      this.noteFormStatus = false;
    },
    // 获取笔记列表
    getNoteList(done) {
      this.noteList = []
      const params = {
        'bookId': this.id
      }
      getNote(params).then(res => {
        if (res && res.status === 'success') {
          if (res.data && Array.isArray(res.data)) {
            this.noteList = res.data.filter(item => {
              return item.href.split('#')[0] === this.currentChapter.href.split('#')[0];
            })
            done && done()
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
      });
    },
    // 添加笔记
    addNote(type, note) {
      const params = {
        bookId: this.id,
        href: this.currentChapter.href,
        cfi: this.wordSelectedCfi,
        word: this.wordSelectedValue,
        type: type || 'underline',
        underlineClass: this.wordSelectedColorClassName || 'default',
        note: note || this.wordSelectedNote,
      }
      createNote(params).then(res => {
        if (res && res.status === 'success') {
          this.bookRendition.getContents(this.wordSelectedCfi)[0].document.getSelection().empty();
          this.noteChange();
          if (this.wordMenuStatus || this.noteFormStatus) {
            this.wordMenuStatus = false;
            this.noteFormStatus = false;
            this.clearSelectInfo();
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
      });
    },
    // 编辑笔记
    editNote(obj) {
      const params = {
        id: this.wordSelectedNoteId,
        bookId: this.id,
        ...obj
      }
      updateNote(params).then(res => {
        if (res && res.status === 'success') {
          this.noteChange();
          if (this.wordMenuStatus || this.noteFormStatus) {
            this.wordMenuStatus = false;
            this.noteFormStatus = false;
            this.clearSelectInfo();
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
      });
    },
    // 删除笔记
    deleteNote(id, done) {
      const params = {
        'bookId': this.id,
        'id': id || this.wordSelectedNoteId,
      }
      removeNote(params).then(res => {
        if (res && res.status === 'success') {
          done && done()
          this.bookRendition.annotations.remove(this.wordSelectedCfi, 'underline');
          this.noteChange();
          if (this.wordMenuStatus || this.noteFormStatus) {
            this.wordMenuStatus = false;
            this.noteFormStatus = false;
            this.clearSelectInfo();
          }
          this.$message({
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
      });
    },
    // 上一章
    prev(){
      if (this.book.package.metadata.direction === 'rtl') {
        this.bookRendition.next();
      } else {
        this.bookRendition.prev();
      }
    },
    // 下一章
    next(){
      if (this.book.package.metadata.direction === 'rtl') {
        this.bookRendition.prev();
      } else {
        this.bookRendition.next();
      }
    },
    // 章节跳转
    goToChapter(item) {
      this.bookRendition.display(item.href).then(() => {
        let offsetTop = 0
        if (item.href.split('#').length > 1) {
          offsetTop = this.bookRendition.getContents(item.href)[0].document.getElementById(item.href.split('#')[1]).offsetTop;
        }
        $('.el-scrollbar__wrap').animate({ scrollTop: offsetTop }, 500);
      }).catch(error => {
        console.log(error)
      })
    },
    // 章节href转为cfi
    async searchChapter(href) {
      const book = this.book;
      const id = href.split('#')[1];
      const item = book.spine.get(href);
      await item.load(book.load.bind(book));
      const el = id ? item.document.getElementById(id) : item.document.body;
      return item.cfiFromElement(el);
    },
    // 打开主题框
    openThemeDialog () {
      this.drawerTitle = '主题'
      this.drawerStatus = true;
      this.toggleDrawer(() => {
        this.themeStatus = true;
      });
    },
    // 打开搜索框
    openSearchDialog () {
      this.drawerTitle = '搜索'
      this.drawerStatus = true;
      this.searchResult = [];
      this.toggleDrawer(() => {
        this.searchStatus = true;
      });
    },
    // 打开笔记框
    openNoteDialog () {
      this.drawerTitle = '笔记';
      this.drawerStatus = true;
      this.toggleDrawer(() => {
        this.noteStatus = true;
      });   
    },
    // 打开抽屉
    toggleDrawer(done, isClose) {
      this.themeStatus = false;
      this.searchStatus = false;
      this.noteStatus = false;
      if (done) {
        if (typeof done === 'function') {
          done();
        }
      }
      if (isClose) {
        this.drawerStatus = false;
      }
    },
    // 获取主题
    getTheme() {
      getThemeDetail().then(res => {
        if (res && res.status === 'success') {
          if (res.data) {
            this.themesObj = {
              fontFamily: res.data.fontFamily,
              fontSize: res.data.fontSize,
              lineHeight: res.data.lineHeight,
              background: res.data.background,
            }
            this.setBookTheme();
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.message.error(error)
      });
    },
    // 主题设置初始化
    setBookTheme() {
      this.themes = this.bookRendition.themes;
      this.themes.font(this.themesObj.fontFamily);
      this.themes.fontSize(this.themesObj.fontSize);
      this.registerTheme(this.themesObj.lineHeight);
      this.themes.select(this.themesObj.background);
      this.theme = this.themesObj.background;
    },
    // 设置字体
    setFont (value, callback) {
      this.editTheme(value, null, null, null, () => {
        this.themes.font(value);
      })
      setTimeout(() => {
        callback && callback()
      }, 300)
      this.noteChange();
    },
    // 设置字体大小
    setFontSize (value, callback) {
      this.editTheme(null, value, null, null, () => {
        this.themes.fontSize(value + 'px');
      })
      setTimeout(() => {
        callback && callback()
      }, 300)
      this.noteChange();
    },
    // 设置行高
    setLineHeight(value, bg, callback) {
      this.editTheme(null, null, value, null, () => {
        this.registerTheme(value);
        this.themes.select(bg);
        this.theme = value;
      })
      setTimeout(() => {
        callback && callback()
      }, 300)
      this.noteChange();
    },
    // 设置背景颜色
    setBackground(value, callback) {
      this.editTheme(null, null, null, value, () => {
        this.themes.select(value);
        this.theme = value;
      })
      setTimeout(() => {
        callback && callback()
      }, 300)
      this.noteChange();
    },
    // 注册主题
    registerTheme(value) {
      this.themes.register({
        'default': {
          'body': {
            'background': '#ffffff', 'color': '#666666',
          },
          '::selection': {
            'color': '#ffffff',
            'background': '#409EFF',
          },
          '*': { 'line-height': value + '!important' },
        },
        'bright': {
          'body': {
            'background': '#FFDDAA', 'color': '#666666', 'line-height': 2,
          },
          '::selection': {
            'color': '#ffffff',
            'background': '#409EFF',
          },
          '*': { 'line-height': value + '!important' },
        },
        'eyeProtection': {
          'body': {
            'background': '#BFE2CB', 'color': '#666666', 'line-height': 2,
          },
          '::selection': {
            'color': '#ffffff',
            'background': '#409EFF',
          },
          '*': { 'line-height': value + '!important' },
        },
        'night': {
          'body': {
            'background': '#141414', 'color': '#FFFFFF', 'line-height': 2,
          },
          '::selection': {
            'color': '#ffffff',
            'background': '#409EFF',
          },
          '*': { 'line-height': value + '!important' },
        },
      });
    },
    // 更新主题
    editTheme(fontFamily, fontSize, lineHeight, background, done) {
      const params = {
        fontFamily,
        fontSize,
        lineHeight,
        background,
      }
      updateTheme(params).then(res => {
        if (res && res.status === 'success') {
          done && done()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
      });
    },
    // 搜索关键词
    search(value, done) {
      const book = this.book;
      Promise.all(book.spine.spineItems.map(item => {
        return new Promise((resolve, reject) => {
          item.load(book.load.bind(book)).then(result => {
            resolve(item.find.bind(item, value));
          }).catch(results => {
            item.unload.bind(item);
          });
        });
      }),
      ).then(results => {
        Promise.all(results).then(results => {
          this.searchResult = results.map(item => {
            return item();
          }).reduce((item1, item2) => {
            return item1.concat(item2);
          }, []);
          done && done();
        });
      });
    },
    // 笔记跳转
    gotoNote(cfi) {
      this.bookRendition.display(cfi).then(() => {
        const rectTop = this.getRangeRect(cfi).top
        $('.el-scrollbar__wrap').animate({ scrollTop: rectTop - 100 }, 500);
        this.toggleDrawer(null, true);
      })
    },
    // 退出登录
    exit() {
      removeToken()
      removeUsername()
      removeUid()
      this.$router.push({path: '/login'});
    },
    // 滚动事件
    handleScroll () {
      const scrollTop = $('.el-scrollbar__wrap').scrollTop()
      const list = this.currentChapterList.filter(item => {
        return scrollTop >= item.offsetTop
      }) 
      this.currentChapter = list[list.length - 1]
      if (this.wordSelectedCfi) {
        this.bookRendition.getContents(this.wordSelectedCfi)[0].document.getSelection().empty();
      }
      this.noteShowList.map(item => {
        item.isShowed = false;
        return item;
      });
      if (this.wordMenuStatus || this.noteFormStatus) {
        this.wordMenuStatus = false;
        this.noteFormStatus = false;
        this.clearSelectInfo();
      }
    },
    // 获取Range对象
    getRange(cfi) {
      let range;
      if (this.bookRendition.getRange(cfi)) {
        range = this.bookRendition.getRange(cfi);
        return range;
      } else {
        return false;
      }
    },
    // 获取矩形对象
    getRangeRect(cfi) {
      let range;
      if (this.bookRendition.getRange(cfi)) {
        range = this.bookRendition.getRange(cfi);
        return range && range.getBoundingClientRect();
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true);
  },
}