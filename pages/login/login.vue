<template>
  <view class="login-container">
	
    <!-- 登录卡片 -->
    <view class="login-card">
      <!-- 原有Logo和表单内容保持不变 -->
      <view class="logo-container">
        <image src="/static/logo.png" mode="widthFix" class="logo"></image>
        <view class="title">登 录</view>
		<view class="subtitle">记录您的每一次行程</view>
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
            placeholder="请输入邮箱" 
            class="input-field"
            @input="validateEmail"
          />
        </view>
        <view v-if="emailError" class="error-tip">{{ emailError }}</view>

        <!-- 密码输入 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="locked" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码" 
            class="input-field"
          />
        </view>

        <view class="forgot-password" @click="handleForgot">
          <text>忘记密码?</text>
        </view>

        <button 
          class="login-btn" 
          :disabled="!canLogin"
          @click="handleLogin"
          :loading="isLoading"
        >
          登录
        </button>
		<!-- 新增：立即注册选项 -->
		        <view class="register-container">
		          <text class="register-text">还没有账号？</text>
		          <text class="register-link" @click="handleRegister">立即注册</text>
		        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 逻辑部分保持不变
import { ref, computed, watch } from 'vue'

const email = ref('')
const password = ref('')
const emailError = ref('')
const isLoading = ref(false)

const validateEmail = () => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (email.value && !reg.test(email.value)) {
    emailError.value = '请输入正确的邮箱格式'
  } else {
    emailError.value = ''
  }
}

watch(email, validateEmail)

const canLogin = computed(() => {
  return email.value && password.value && !emailError.value
})

const handleLogin = () => {
  if (!canLogin.value) return
  
  isLoading.value = true
  console.log('登录参数:', {
    email: email.value,
    password: password.value
  })
  
  setTimeout(() => {
    isLoading.value = false
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    uni.switchTab({
      url: '/pages/index/index'
    })
  }, 1500)
}

const handleForgot = () => {
  uni.showToast({
    title: '跳转至找回密码页',
    icon: 'none'
  })
}

// 新增：处理注册跳转
const handleRegister = () => {
  // 跳转到邮箱验证页面（假设邮箱验证路径为/pages/verify-email/verify-email）
  uni.navigateTo({
    url: '/pages/verify-email/verify-email'
  })
}
</script>

<style lang="scss">
/* 关键修改：限制页面高度并禁止滚动 */
page {
  overflow: hidden; /* 禁止页面滚动 */
  height: 100vh; /* 强制页面高度等于屏幕高度 */
}

.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 50rpx 30rpx;
  box-sizing: border-box; /* 确保内边距不会增加总高度 */
  overflow: hidden; /* 容器内内容超出也不滚动 */
}

.login-card {
  margin-top: 150rpx;
  padding: 60rpx 30rpx;
  width: 100%;
  box-sizing: border-box; /* 包含内边距和边框在宽度内 */
  /* 可选：限制卡片最大高度，防止内容过多 */
  max-height: calc(100vh - 100rpx); 
  overflow: hidden; /* 卡片内容超出不滚动 */
}

/* 其他样式保持不变 */
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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

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
  }

  .input-field {
    flex: 1;
    height: 100%;
    padding: 0 20rpx;
    font-size: 28rpx;
  }
}

.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  padding-left: 20rpx;
  height: 30rpx;
}

.forgot-password {
  align-self: flex-end;
  color: #1296db;
  font-size: 26rpx;
  margin-top: 10rpx;
  cursor: pointer;
}

/* 其他样式保持不变 */
  
  .login-btn {
    width: 99%;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #1296db;
    color: #fff;
    border-radius: 8rpx;
    font-size: 30rpx;
    margin-top: 40rpx;
    padding: 0;
    appearance: none; /* 清除浏览器默认样式 */
    -webkit-appearance: none; /* 兼容webkit内核 */
  }
  
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
    font-size: 26rpx;
    color: #666;
  }
  
  .register-link {
    color: #1296db;
    margin-left: 10rpx;
    cursor: pointer;
    text-decoration: underline; /* 下划线强调可点击 */
  }
  
  .register-link:active {
    opacity: 0.8; /* 点击反馈 */
  }

  
  
</style>
