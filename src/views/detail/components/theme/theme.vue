<template>
   <div id='theme' v-loading="loading">
     <el-form ref="form" class="themeBox" label-position="top">
				<el-form-item label="字体">
					<el-select v-model="fontFamily" placeholder="请选择" style="width: 100%" @change="setFont">
						<el-option
								v-for="(item, index) in fontFamilyList"
								:key="index"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="字号">
					<div class="setFontSize clearfix">
						<p @click="sub()">小</p>
						<span>{{ fontSize }}</span>
						<p @click="add()">大</p>
					</div>
				</el-form-item>
				<el-form-item label="排版">
					<div class="selectBox clearfix">
						<p :class="lineHeight == 1.6 ? 'active':''" @click="setLineHeight(1.6)">
							<img src="../../../../assets/imgs/lineheight-1.6.png" alt="">
						</p>
						<p :class="lineHeight == 2 ? 'active':''" @click="setLineHeight(2)">
							<img src="../../../../assets/imgs/lineheight-2.png" alt="">
						</p>
						<p :class="lineHeight == 2.4 ? 'active':''" @click="setLineHeight(2.4)">
							<img src="../../../../assets/imgs/lineheight-2.4.png" alt="">
						</p>
						<p :class="lineHeight == 1.2 ? 'active':''" @click="setLineHeight(1.2)">
							原
						</p>
					</div>
				</el-form-item>
				<el-form-item label="主题">
					<div class="selectBox clearfix">
						<p :class="background === 'default' ? 'active':''" @click="setBackground('default')">
							<span style="background: #FFFFFF"></span>
						</p>
						<p :class="background === 'bright' ? 'active':''" @click="setBackground('bright')">
							<span style="background: #FFDDAA"></span>
						</p>
						<p :class="background === 'eyeProtection' ? 'active':''" @click="setBackground('eyeProtection')">
							<span style="background: #BFE2CB"></span>
						</p>
						<p :class="background === 'night' ? 'active':''" @click="setBackground('night')">
							<span style="background: #141414"></span>
						</p>
					</div>
				</el-form-item>
			</el-form>
   </div>
</template>
<script>

import { getThemeDetail } from '../../detail.service.js'

export default {
  components: {},
  data() {
    return {
      loading: false,
      fontFamily: null,
      fontSize: null,
      lineHeight: null,
      background: 'default',
      fontFamilyList: [
        {
          label: '微软雅黑',
          value: 'MicrosoftYaHei',
        },
        {
          label: '黑体',
          value: 'SimHei',
        },
        {
          label: '宋体',
          value: 'SimSun, Songti SC, Songti TC',
        },
        {
          label: '楷体',
          value: 'KaiTi, Kaiti SC, Kaiti TC',
        },
        {
          label: '圆体',
          value: 'YouYuan, Yuanti SC, Yuanti TC',
        },
        {
          label: '方体',
          value: 'PingFangSC-Regular, sans-serif',
        },
      ]
    };
  },
  created() {
    this.getTheme()
  },
  methods: {
    getTheme() {
      getThemeDetail().then(res => {
        if (res && res.status === 'success') {
          if(res.data) {
            this.fontFamily = res.data.fontFamily
            this.fontSize = res.data.fontSize
            this.lineHeight = res.data.lineHeight
            this.background = res.data.background
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
    // 字体
    setFont(value) {
      this.loading = true
      this.$emit('setFont', value, () => {
        this.loading = false
      })
    },
    // 字体大小减一
    sub() {
      if (this.fontSize > 12) {
        this.loading = true
        this.fontSize--;
        this.$emit('setFontSize', this.fontSize, () => {
          this.loading = false
        })
      }
    },
    // 字体大小加一
    add() {
      if (this.fontSize < 30) {
        this.loading = true
        this.fontSize++;
        this.$emit('setFontSize', this.fontSize, () => {
          this.loading = false
        })
      }
    },
    // 设置字体行高
    setLineHeight(value) {
      this.loading = true
      this.lineHeight = value;
      this.$emit('setLineHeight', this.lineHeight, this.background, () => {
        this.loading = false
      })
    },
    // 设置背景
    setBackground(value) {
      this.loading = true
      this.background = value;
      this.$emit('setBackground', this.background, () => {
        this.loading = false
      })
    },
    init() {

    },
  },
  mounted () {
    this.$nextTick(function() {
      this.init();
    });
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  #theme{
    .themeBox {
      .el-form-item__label {
        padding-bottom: 0;
        color: #999999;
        font-size: 16px;
        line-height: 40px;
      }

      .el-input__inner {
        height: 50px;
        color: #5A5D6D;
        font-size: 20px;
        line-height: 50px;
      }
    }
  }
  
</style>

<style rel="stylesheet/scss" scoped lang="scss">
	#theme {
    padding: 20px 50px;
    .themeBox{
			.selectOption {
				font-size: 18px;
				line-height: 50px;
			}
			.setFontSize {
				p {
					width: 150px;
					float: left;
					color: #333333;
					font-size: 18px;
					line-height: 50px;
					text-align: center;
					cursor: pointer;
					border:1px solid rgba(90,93,109,0.2);
					border-radius: 25px;
					&:hover {
						color: #2D4BFF;
						border: 1px solid rgba(54,82,248,0.6);
					}
				}
				span {
					width: 100px;
					float: left;
					color: #2D4BFF;
					font-size: 22px;
					line-height: 50px;
					text-align: center;
				}
			}
			.selectBox {
				p {
					width: 50px;
					height: 50px;
					float: left;
					margin-left: 66.6px;
					color: #333333;
					font-size: 22px;
					line-height: 48px;
					text-align: center;
					cursor: pointer;
					border:1px solid rgba(90,93,109,0.2);
					border-radius:25px;
					&:first-child {
						margin-left: 0;
					}
					&:hover, &.active{
						border: 1px solid rgba(54,82,248,1);
					}
					img {
						display: block;
						width: 50px;
						height: 50px;
					}
					span {
						display: block;
						width: 40px;
						height: 40px;
						margin: 4px;
						border-radius: 40px;
						box-shadow:0px 0px 2px 0px rgba(204,204,204,1);
					}
				}
      }
      .box {
        width: 100%;
        padding: 27px 50px 0 20px;
      }


      .list {
        width: 100%;
        padding: 0 40px 0 10px;

        .result {
          padding: 10px 28px 10px 24px;
          border-bottom: 1px solid rgba(90, 93, 109, 0.1);
          &:first-child {
            border-top: 1px solid rgba(90, 93, 109, 0.1);
          }
          p {
            color: #333333;
            font-size: 18px;
            line-height: 30px;
            &:before {
              content: '...';
            }
            span {
              color: #048D01;
            }
          }
        }
      }
    }
	}
</style>