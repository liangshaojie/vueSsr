<template>
    <section class="container">
        <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
    </section>
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    asyncData({req}) {
      return {
        name: req ? 'server' : 'client'
      }
    },
    head() {
      return {
        title: `测试页面`
      }
    },
    beforeMount() {
      const wx = window.wx
      const url = window.location.href

      this.$store.dispatch('getWechatSignature', encodeURIComponent(url) )
          .then(res => {
            if (res.data.success) {
              const params = res.data.params
              wx.config({
                debug: true,
                appId: params.appId,
                timestamp: params.timestamp,
                nonceStr: params.noncestr,
                signature: params.signature,
                jsApiList: [
                  'previewImage',
                  'uploadImage',
                  'downloadImage',
                  'chooseImage',
                  'onMenuShareTimeline',
                  'hideAllNonBaseMenuItem',
                  'showMenuItems',
                  'hideMenuItems'
                ]
              })
              wx.ready(() => {
                wx.previewImage({
                  current: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2919535460,3965929771&fm=96', // 当前显示图片的http链接
                  urls: ['https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2919535460,3965929771&fm=96'] // 需要预览的图片http链接列表SSS
                });
                console.log('success');
              })
            }
          })
    }
  }
</script>

<style scoped>
    .title {
        margin-top: 50px;
    }

    .info {
        font-weight: 300;
        color: #9aabb1;
        margin: 0;
        margin-top: 10px;
    }

    .button {
        margin-top: 50px;
    }
</style>
