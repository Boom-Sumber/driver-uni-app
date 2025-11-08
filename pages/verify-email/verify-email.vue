<template>
  <view class="verify-container">
    <!-- 验证卡片 -->
    <view class="verify-card">
      <!-- Logo和标题 -->
      <view class="logo-container">
        <image src="/static/logo.png" mode="widthFix" class="logo"></image>
        <view class="title">邮箱验证</view>
        <view class="subtitle">请输入您的邮箱地址并完成验证</view>
      </view>

      <view class="form-container">
        <!-- 邮箱输入 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="email" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            type="text" 
            v-model="email" 
            placeholder="请输入邮箱地址" 
            class="input-field"
            @input="validateEmail"
          />
        </view>
        <view v-if="emailError" class="error-tip">{{ emailError }}</view>

        <!-- 验证码输入区域 -->
        <view class="input-group code-group">
          <view class="input-icon">
            <uni-icons type="vip" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            type="number" 
            v-model="verificationCode" 
            placeholder="请输入6位验证码" 
            class="input-field code-input"
            maxlength="6"
          />
          <view class="code-btn-container">
            <button 
              class="get-code-btn" 
              :disabled="!canGetCode || countdown > 0 || isGettingCode"
              @click="handleGetCode"
              :loading="isGettingCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </view>
        </view>
        <view v-if="codeError" class="error-tip">{{ codeError }}</view>

        <!-- 验证按钮 -->
        <button 
          class="verify-btn" 
          :disabled="!canVerify"
          @click="handleVerify"
          :loading="isVerifying"
        >
          验证邮箱
        </button>
        
        <!-- 返回登录选项 -->
        <view class="back-login-container">
		  <text class="back-login-text">已有账户？</text>
          <text class="back-login-link" @click="handleBackToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const email = ref('')
const verificationCode = ref('')
const emailError = ref('')
const codeError = ref('')
const isVerifying = ref(false) // 验证邮箱的加载状态
const isGettingCode = ref(false) // 获取验证码的加载状态
const countdown = ref(0) // 倒计时秒数
let countdownTimer = null

// 验证邮箱格式
const validateEmail = () => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (email.value && !reg.test(email.value)) {
    emailError.value = '请输入正确的邮箱格式'
  } else {
    emailError.value = ''
  }
}

watch(email, validateEmail)

// 是否可以获取验证码
const canGetCode = computed(() => {
  return email.value && !emailError.value
})

// 是否可以验证
const canVerify = computed(() => {
  return email.value && verificationCode.value && !emailError.value && !codeError.value
})

// 处理获取验证码
const handleGetCode = () => {
  if (!canGetCode.value) return
  
  isGettingCode.value = true
  
  // 模拟发送验证码请求
  console.log('发送验证码到邮箱:', email.value)
  
  setTimeout(() => {
    isGettingCode.value = false
    
    // 开始倒计时
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
      }
    }, 1000)
    
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
  }, 1500)
}

// 处理验证邮箱
const handleVerify = () => {
  if (!canVerify.value) return
  
  isVerifying.value = true
  console.log('验证邮箱参数:', {
    email: email.value,
    code: verificationCode.value
  })
  
  // 模拟验证请求
  setTimeout(() => {
    isVerifying.value = false
    uni.showToast({
      title: '邮箱验证成功',
      icon: 'success'
    })
    
    //验证成功后跳转到相应页面
    uni.navigateTo({
      url: '/pages/register/register'
    })
  }, 1500)
}

// 返回登录页面
const handleBackToLogin = () => {
  uni.navigateBack()
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style lang="scss">
/* 页面基础样式 */
page {
  overflow: hidden;
  height: 100vh;
}

.verify-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 50rpx 30rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.verify-card {
  margin-top: 150rpx;
  padding: 60rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  max-height: calc(100vh - 100rpx);
  overflow: hidden;
}

/* Logo和标题样式 */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

  .logo {
    width: 130rpx;
    height: 130rpx;
    margin-bottom: 40rpx;
  }

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .subtitle {
    font-size: 26rpx;
    color: #666;
    text-align: center;
  }
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

/* 输入组样式 */
.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  height: 90rpx;
  

  .input-icon {
    width: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .input-field {
    flex: 1;
    height: 100%;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: none;
    outline: none;
  }
}

/* 验证码输入组特殊样式 */
.code-group {
  padding: 0;
  display: flex;
  align-items: stretch;
  
  .input-icon {
    width: 50rpx;
    margin-left: 20rpx;
  }
  
  .code-input {
    flex: 1;
    height: 100%;
    padding: 0 20rpx;
    font-size: 28rpx;
    border: none;
    outline: none;
  }
  
  .code-btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10rpx;
    flex-shrink: 0;
    
    .get-code-btn {
      width: 200rpx;
      height: 70rpx;
      line-height: 70rpx;
      background-color: #f5f5f5;
      color: #1296db;
      border-radius: 6rpx;
      font-size: 24rpx;
      padding: 0;
      border: none;
      white-space: nowrap;
      
      &:disabled {
        color: #999;
        background-color: #f0f0f0;
      }
    }
  }
}

/* 错误提示 */
.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  padding-left: 20rpx;
  height: 30rpx;
}

/* 验证按钮 */
.verify-btn {
  width: 99%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #1296db;
  color: #fff;
  border-radius: 8rpx;
  font-size: 30rpx;
  margin-top: 40rpx;
  padding: 0;
  appearance: none;
  -webkit-appearance: none;
  
  &:disabled {
    background-color: #bae7ff;
  }
}

/* 返回登录链接 */
.back-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #666;
}

.back-login-link {
  color: #1296db;
  cursor: pointer;
  text-decoration: underline;
}

.back-login-link:active {
  opacity: 0.8;
}
</style>