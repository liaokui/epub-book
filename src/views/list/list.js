import { getToken, removeToken, removeUid, removeUsername } from '../../utils/auth'
import { getBookList, removeBook } from './list.service'

const ePub = window.ePub;
export default {
  components: {},
  data () {
    return {
      uploadAction: '/api/upload/epub',
      uploadHeaders: {
        'Authorization': getToken()
      },
      keyword: null,
      isUploading: false,
      list: [],
      imgReadUrl: process.env.VUE_APP_imgReadUrl,
      uploadData: {
        name: 'epub'
      },
      uploadFileList: [],
      progress: 0,
      noMore: false,
      isLoading: true,
      continueLoading: false,
      page: {
        num: 0,
        size: 10,
        total: null,
      },
    }
  },
  created () {
    this.clearList()
  },
  methods: {
    // 清空后查询
    clearList(){
      this.page.num = 0;
      this.loading = true;
      this.noMore = false;
      this.list = [];
      this.getList();
    },
    // 获取项目列表
    getList(key) {
      if (key === 'load') {
        this.isLoading = false;
        this.continueLoading = true;
      }
      if (key === 'load' && this.list.length >= this.page.total) {
        this.isLoading = false;
        this.noMore = true;
        this.continueLoading = false;
        return true;
      }
      this.page.num++;
      const params = {
        keyword: this.keyword,
        pageNumber: this.page.num,
        pageSize: this.page.size,
      };
      getBookList(params).then(res => {
        if (res && res.status === 'success') {
          if (res.data && res.data.list && Array.isArray(res.data.list)) {
            this.list = this.list.concat(res.data.list.map( item => {
              return item
            }))
            this.page.total = res.data.count;
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.continueLoading = false;
        this.isLoading = true;
      }, error => {
        this.$message({
          type: 'error',
          message: error,
        });
      });
    },
    delBook(id) {
      const params = {
        'id': id
      }
      this.$confirm('此操作将删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeBook(params).then(res => {
          if (res && res.status === 'success') {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.clearList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }, error => {
          this.message.error(error)
          this.loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    exit(){
      removeToken()
      removeUsername()
      removeUid()
      this.$router.push({path: '/login'});
    },
    // 滚动事件
    handleScroll() {
      const height = document.getElementById('scrollCover').
          querySelector('.el-scrollbar__bar').offsetTop;

      const scrollHeight = document.getElementById('scrollCover').
          querySelector('.is-vertical').
          querySelector('.el-scrollbar__thumb').offsetHeight;

      const scrollDistance = document.getElementById('scrollCover').
          querySelector('.is-vertical').
          querySelector('.el-scrollbar__thumb').
          style.
          transform.
        split('translateY(')[1].split('%')[0] / 100;
      const bottomDistance = height - (scrollHeight * ( 1 + scrollDistance ))
      if (this.isLoading && bottomDistance < 100) {
        this.getList('load');
      }
    },
    uploading(event, file) {
      this.progress = parseInt(file.percentage);
    },
    bookHandleChange(file, fileList) {
      this.uploadFileList = fileList.slice();
    },
    bookHandleSuccess(response) {
      if (response && response.status === 'success') {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.isUploading = false;
        this.clearList();
      } else {
        this.$message({
          message: response.msg,
          type: 'error'
        })
        this.isUploading = false;
      }
    },
    async beforeBookUpload(file) {
      if (file && (file.type === 'application/epub' || file.type === 'application/epub+zip')) {
        let title,cover
        const book = ePub(file);
        await book.ready.then( async arr => {
          await book.archive.getBase64(book.cover).then(url => {
            title = arr[2].title;
            cover = url;
            book.destroy();
          })
        });
        this.uploadData.title = title
        this.uploadData.cover = cover
        this.isUploading = true;
        return true;
      } else {
        this.$message.error('上传的图书必须为epub格式!');
        return false;
      }
    },
    handleError(){
      this.isUploading = false;
      this.$message.error('上传出错');
    },
    delUploadingBook(){
      this.isUploading = false;
      this.$refs.uploadBook.abort();
    },
    init() {
      window.addEventListener('scroll', this.handleScroll, true);
    }
  },
  mounted () {
    this.$nextTick(function() {
      this.init();
    });
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true);
  },
}