<template>
    <div id="error">
        <div class="block">
            <span @click="reload()"><i class="icon iconfont icon-ai245"></i>刷新</span>
            <router-link :to="{path: '/'}"><i class="icon iconfont icon-web-icon-"></i>返回首页</router-link>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {}
        },
        methods: {
            reload(){
                window.location.reload()
            },
            init () {

            }
        },
        mounted () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }

</script>
<style scoped rel="stylesheet/scss" lang="scss">
    #error {
      width: 100%;
      padding: 10px 0;
        .block {
            width: 465px;
            height: 212px;
            position: relative;
            margin: calc(50vh - 237.5px) auto;
            background: url("../../assets/imgs/404.png");
            background-size: cover;
            cursor: pointer;
            a, span {
                position: absolute;
                bottom: 35px;
                right: 80px;
                color: #5F7F94;
                font-size: 14px;
                &:first-child {
                    right: 180px;
                }
            }
        }
    }
</style>
