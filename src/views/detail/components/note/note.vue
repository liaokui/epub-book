<template>
  <div id='note'>
    <div class="list scrollbar" v-if="list.length > 0" v-loading="loading">
      <div class="note clearfix" v-for="(item, index) in list" :key="index">
        <p class="clearfix">
          <span><i class="el-icon-edit"></i>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <i class="el-icon-delete delIcon" @click="delNote(item._id)"></i>
          <!-- <span>{{ 1 }}</span> -->
        </p>
        <p class="content wordOverFlow2" @click="gotoNotePosition(item.cfi)">{{ item.word }}</p>
        <div class="bottom clearfix" v-if="item.type === 'note'">
          <p :class="'tips ' + item.underlineClass">记</p>
          <p class="remarks wordOverFlow2">{{ item.note }}</p>
        </div>
      </div>
    </div>
    <div class="noNote" v-if="list.length <= 0">
      <p>暂时没有笔记</p>
      <p>在阅读时拖动鼠标选中文字添加笔记</p>
    </div>
  </div>
</template>
<script>

import { getNote } from '../../detail.service'

export default {
  components: {},
  props: {
    bookId: {
      type: String,
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      loading: false,
      list: []
    };
  },
  created() {
    this.getNoteList()
  },
  methods: {
    getNoteList(){
      this.list = []
      const params = {
        'bookId': this.bookId
      }
      this.loading = true
      getNote(params).then(res => {
        if (res && res.status === 'success') {
          if (res.data && Array.isArray(res.data)) {
            this.list = res.data
          }
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.loading = false
      }, error => {
        this.$message({
          message: error,
          type: 'error'
        })
        this.loading = false
      });
    },
    delNote(id){
      this.$confirm('此操作将删除该笔记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delNote', id, () => {
          this.getNoteList()
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    gotoNotePosition(cfi) {
      this.$emit('gotoNote', cfi);
    },
    init() {},
  },
  mounted () {
    this.$nextTick(function() {
      this.init();
    });
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
#note {
  .list {
    width: calc(100% - 6px);
    height: calc(100vh - 90px);
    padding: 20px 24px 0 30px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 30px;
    .note {
      padding: 10px 16px 10px 20px;
      color: #999999;
      line-height: 20px;
      border-bottom: 1px solid rgba(90, 93, 109, 0.1);
      p {
        color: #333333;
        font-size: 16px;
        line-height: 20px;
        &.content {
          line-height: 30px;
          cursor: pointer;
        }
        &:first-child {
          margin-bottom: 3px;
        }
        span {
          float: right;
          // color: #223FEE;
          font-size: 14px;
          i {
            display: block;
            float: left;
            margin-left: 0;
            margin-right: 10px;
            line-height: 20px;
            &.default {
              color: #3652F8;
            }
            &.green {
              color: #1CB555;
            }
            &.orange {
              color: #F19149;
            }
            &.blue {
              color: #00A0E9;
            }
            &.violet {
              color: #C490BF;
            }
          }
          &:first-child {
            float: left;
          }
        }
        i.delIcon {
          float: right;
          margin-left: 16px;
          color: #FF5555;
          cursor: pointer;
          
        }
        &.remarks {
          position: relative;
          padding-left: 10px;
          margin-top: 6px;
          margin-left: 30px;
          color: #9D5E00;
          line-height: 30px;
          border-left: 1px solid rgba(90,93,109,0.5);
        }

      }
      .bottom {
        position: relative;
        .tips {
          padding: 0 12px 0 0;
          float: left;
          font-size: 18px;
          line-height: 30px;
          font-weight: bold;
          &.default {
              color: #3652F8;
            }
            &.green {
              color: #1CB555;
            }
            &.orange {
              color: #F19149;
            }
            &.blue {
              color: #00A0E9;
            }
            &.violet {
              color: #C490BF;
            }
        }
      }
    }
  }
  .noNote {
    width: 100%;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    color: #BBBBBB;
    p {
      margin-bottom: 40px;
      font-size: 40px;
      text-align: center;
      line-height: 40px;
      &:last-child {
        font-size: 20px;
        line-height: 20px;
      }
      i {
        margin: 0 5px;
        font-size: 30px;
      }
    }
  }
}
</style>