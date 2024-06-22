<script>
/** 
 * 登录页面
 *  */
import { defineComponent, ref, reactive, computed, onMounted, onActivated } from "vue";
import publicApi from '@/http/Public.js';
import userApi from '@/http/User.js';
import {
  messageSuccess,
  messageError,
} from "@/action/MessagePrompt";
import { useRoute, useRouter } from 'vue-router';
import { throttleFn_1 as throttleFn } from '@/common/DebounceAndThrottle';
import { verifiedData } from "@/common/VerifiedTools";
import { Select, ArrowRightBold, SemiSelect } from '@element-plus/icons-vue';
import { userData } from "@/store/User";
import img_1 from "@/assets/login-imgs/img-1.gif";
import img_2 from "@/assets/login-imgs/login-bg.svg";
import img_3 from "@/assets/login-imgs/code.svg";
import img_4 from "@/assets/login-imgs/login-bg-1.svg";
import img_5 from "@/assets/login-imgs/login-bg-2.svg";
import img_6 from "@/assets/login-imgs/login-bg-3.svg";
import img_7 from "@/assets/login-imgs/login-bg-4.png";

export default defineComponent({
  name: 'LoginView',
  components: {
    Select, ArrowRightBold, SemiSelect,
  },
  setup() {
    const userDataStore = userData();
    const router = useRouter();
    const route = useRoute();
    const code = route.query.code;
    const dataContainer = reactive({
      loading: false,
      img: {
        img_1,
        img_2,
        img_3,
        img_4,
        img_5,
        img_6,
        img_7,
      },
    });
    function githubLogin() {
      userApi.loginGithub(code).then(res => {
        console.log("login-github");
        console.log(res);
        let data = res.data || {};
        /** 写入全局数据 */
        userDataStore.setUserInfo({
          token: data.token || '',
        });
        messageSuccess('登录成功');
        /** 
         * 登录成功，跳转到首页
         * 其他用户信息会在路由跳转是获取到
         *  */
        let routeParams = route.query || {};
        if (routeParams.from) {
          router.push(decodeURIComponent(routeParams.from));
        } else {
          router.push('/main/index');
        }
      }).catch(err => {
        messageError(err.message)
      }).finally(() => { });
    }
    githubLogin();
    return {
      dataContainer,
      githubLogin
    };
  },
});
</script>

<template>
  <div class="login-view" :style="{
    '--bg-img-1': `url(${dataContainer.img.img_1})`,
    '--bg-img-2': `url(${dataContainer.img.img_2})`,
  }">
    <div class="img-bg">
      <el-image class="img" :src="dataContainer.img.img_4" fit="contain" />
    </div>
    <div class="container">
      <div class="left">
        <el-carousel :interval="7000" arrow="never">
          <el-carousel-item>
            <div class="item">
              <el-image class="img" :src="dataContainer.img.img_7" fit="contain" />
              <div class="title">
                直接上手
              </div>
              <div class="content">
                只用写好自己的业务页面
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="item">
              <el-image class="img img-1" :src="dataContainer.img.img_5" fit="contain" />
              <div class="title">
                代码简单
              </div>
              <div class="content">
                代码简洁易懂，遇到问题好解决
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="item">
              <el-image class="img img-2" :src="dataContainer.img.img_6" fit="contain" />
              <div class="title">
                界面
              </div>
              <div class="content">
                清新小巧，布局合理
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="right">
        <div class="container">
          <div class="title">
            第三方登录
          </div>
          <div class="login-loading" v-loading="true" element-loading-text="Loading...">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: var(--bg-img-2);
  // background-size: cover;
  // backdrop-filter: blur(12px);
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  // background: #007FFF;
  // background: linear-gradient(to right,rgba(0, 128, 255, 0.421),rgba(0, 89, 178, 0.421));
  padding: 15px;
  box-sizing: border-box;
  color: rgb(32, 32, 32);
  position: relative;

  >.img-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;

    >.img {
      width: 90%;
      height: 90%;
    }
  }

  >.container {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 900px;
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.449);

    >.left {
      flex: 1 1 0;
      width: 0;
      // background-image: var(--bg-img-1);
      // background-size: cover;
      // box-shadow: inset 1px 0px 4px #0000006b;
      background-color: #e9e9e9;
      background-repeat: no-repeat;

      :deep(.el-carousel) {
        width: 100%;
        height: 100%;

        .el-carousel__container {
          width: 100%;
          height: 100%;

          .item {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;

            >.img {
              width: 100%;
              max-width: 200px;
              height: 100%;
              max-height: 200px;
              transform: scale(1.5) translateY(-40px);

              &.img-1 {
                transform: scale(1.7) translateY(-15px) translateX(-10px);
              }

              &.img-2 {
                transform: scale(1.5) translateY(-30px);
              }
            }

            >.title {
              font-size: 20px;
              color: #000000;
              margin: 10px 0 0 0;
              font-weight: bold;
              position: absolute;
              bottom: 80px;
            }

            >.content {
              font-size: 15px;
              color: #000000;
              opacity: 0.7;
              margin-top: 15px;
              position: absolute;
              bottom: 50px;
            }
          }
        }

        .el-carousel__indicators {
          bottom: 10px;
          --el-carousel-indicator-width: 40px;
          --el-carousel-indicator-height: 7px;

          .is-active {
            .el-carousel__button {
              width: 60px;
              opacity: 1;
            }
          }

          .el-carousel__button {
            border-radius: 3px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.204);
            background-color: #0059B2;
            background: linear-gradient(to right, #007FFF, #0059B2);
            opacity: 0.3;
          }
        }
      }
    }

    >.right {
      flex: 1 1 0;
      width: 0;

      >.container {
        width: 100%;
        height: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;

        >.login-loading {
          width: 100%;
          height: 383px;
        }

        >.title {
          display: flex;
          flex-direction: row;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
        }

        >.other-login-bt {
          display: flex;
          flex-direction: row;
          justify-content: center;
          justify-content: center;
          margin: 15px 0;

          >.item {
            border: 1px solid #ddd;
            border-radius: 50%;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin: 0 10px;
            height: 35px;
            width: 35px;
            cursor: pointer;
            box-shadow: inset 0 1px 4px #0000001f;
          }
        }

        >.content-1 {
          font-size: 13px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          opacity: 0.8;
        }

        >.input-container {
          width: 100%;
          max-width: 300px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          background: #eee;
          border: none;
          padding: 0 15px;
          margin: 20px 0 0 0;
          border-radius: 5px;
          height: 45px;
          box-sizing: border-box;
          transition: all 0.2s;
          box-shadow: inset 0 1px 4px #0000001f;

          &:focus-within {
            box-shadow: inset 0 1px 4px #0000001f, 0 0 0 2px #007fff !important;
          }

          :deep(.el-input) {
            flex: 1 1 0;
            width: 0;
            border: none;
            box-shadow: none;
            outline: none;
            background-color: transparent;

            .el-input__wrapper {
              border: none;
              box-shadow: none;
              outline: none;
              background-color: transparent;
              padding: 0;

              input {
                font-size: 17px;
              }
            }

            .el-input__suffix {
              .el-icon {
                font-size: 20px !important;
                color: #3c3c3c !important;
              }
            }
          }

          &.code {
            padding: 0 5px 0 15px;
          }

          >.img {
            width: 100px;
            height: calc(100% - 10px);
            margin-left: 15px;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.156);
          }
        }

        >.bt-list {
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin: 20px 0;

          :deep(.login-bt) {
            border-radius: 999px;
            border: none;
            background: #007FFF;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            padding: 12px 60px;
            letter-spacing: 1px;
            height: 45px;
            background: linear-gradient(to right, #007FFF, #0059B2);
            box-shadow: 0 3px 3px -2px #0003, 0 3px 4px #00000024, 0 1px 8px #0000001f;
          }
        }

        >.other {
          font-size: 14px;
          opacity: 0.5;
          margin-top: 0;
        }
      }
    }
  }

  >.bottom {
    position: fixed;
    bottom: 15px;
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
    color: white;

    >* {
      margin-left: 5px;
    }
  }
}
</style>
