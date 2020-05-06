<template>
  <div id='search'>
    <div class="search-container" v-loading="loading">
      <div class="box">
        <el-input placeholder="全文搜索(区分大小写)" prefix-icon="el-icon-search" v-model="keyword"
          size="large" @keyup.enter.native="search" style="width: 100%"></el-input>
			</div>
			<div class="list scrollbar" v-if="result.length > 0">
				<div class="result clearfix" v-for="(item, index) in result" :key="index">
					<p class="wordOverflow3" @click="gotoResult(item.cfi)" v-html="item.html"></p>
				</div>
			</div>
			<div class="noContent"  v-if="result.length === 0">
				<p>空空如也~~</p>
			</div>
		</div>
  </div>
</template>
<script>

export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      keyword: null,
      loading: false,
    };
  },
  computed: {
    result() {
      if (this.list.length > 0 && this.keyword) {
        return this.list.map(val => {
          let htmlArr = val.excerpt.split(this.keyword)
          let html = htmlArr[0] + `<span style="color: #048D01;font-weight: bold">${ this.keyword }</span>` + htmlArr[1];
          return {
            html: html,
            ...val,
          };
        });
      } else {
        return [];
      }
    },
  },
  created() {},
  methods: {
    // 搜索
    search() {
      // Python
      if (this.keyword) {
        this.loading = true
        this.$emit('search', this.keyword, () => {
          this.loading = false
        });
      }
    },
    // 跳转
    gotoResult(cfi) {
      this.$emit('gotoResult', cfi);
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
  #search {
    .el-input__inner{
      height: 36px;
      line-height: 36px;
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
      padding-left: 15px;
      padding-right: 30px;
    }
    .el-input__prefix {
      right: 5px;
      left: unset;
      i {
        font-size: 20px;
      }
    }
  }

</style>
<style rel="stylesheet/scss" scoped lang="scss">
	#search {
    .box {
      padding: 30px;
    }
		.list {
      width: calc(100% - 6px);
      height: calc(100vh - 186px);
      padding: 0 24px 0 30px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 30px;
			.result {
				padding: 10px 28px 10px 24px;
				border-bottom: 1px solid rgba(90, 93, 109, 0.1);
				&:first-child {
					border-top: 1px solid rgba(90, 93, 109, 0.1);
				}
				p {
					color: #666666;
					font-size: 16px;
					line-height: 30px;
          cursor: pointer;
          span {
            font-size: 18px;
          }
				}
			}
		}
		.noContent {
			width: 100%;
			height: 40px;
			position: absolute;
			top: 20%;
			left: 0;
			color: #999999;
			p {
				font-size: 20px;
				text-align: center;
				line-height: 40px;
			}
		}
	}
</style>