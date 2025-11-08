<template>
  <view class="complete-container">
    <!-- 信息完善卡片 -->
    <view class="complete-card">
      <!-- Logo和标题 -->
      <view class="logo-container">
        <image src="/static/logo.png" mode="widthFix" class="logo"></image>
        <view class="title">完善信息</view>
        <view class="subtitle">请填写您的个人信息完成注册</view>
      </view>

      <view class="form-container">
        <!-- 姓名输入 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="person" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            type="text" 
            v-model="name" 
            placeholder="请输入真实姓名" 
            class="input-field"
            @input="validateName"
          />
        </view>
        <view v-if="nameError" class="error-tip">{{ nameError }}</view>

        <!-- 电话输入 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="phone" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            type="number" 
            v-model="phone" 
            placeholder="请输入手机号码" 
            class="input-field"
            @input="validatePhone"
            maxlength="11"
          />
        </view>
        <view v-if="phoneError" class="error-tip">{{ phoneError }}</view>

        <!-- 设置密码 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="locked" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="请设置登录密码" 
            class="input-field"
            @input="validatePassword"
          />
          <view class="password-toggle" @click="showPassword = !showPassword">
            <uni-icons :type="showPassword ? 'eye-slash' : 'eye'" size="30rpx" color="#999"></uni-icons>
          </view>
        </view>
        <view v-if="passwordError" class="error-tip">{{ passwordError }}</view>
        
        <!-- 密码强度提示 -->
        <view v-if="password && !passwordError" class="password-strength">
          <text>密码强度：</text>
          <text :class="strengthClass">{{ passwordStrength }}</text>
        </view>

        <!-- 确认密码 -->
        <view class="input-group">
          <view class="input-icon">
            <uni-icons type="locked" size="30rpx" color="#999"></uni-icons>
          </view>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword" 
            placeholder="请再次输入密码" 
            class="input-field"
            @input="validateConfirmPassword"
          />
          <view class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
            <uni-icons :type="showConfirmPassword ? 'eye-slash' : 'eye'" size="30rpx" color="#999"></uni-icons>
          </view>
        </view>
        <view v-if="confirmPasswordError" class="error-tip">{{ confirmPasswordError }}</view>

        <!-- 完成注册按钮 -->
        <button 
          class="complete-btn" 
          :disabled="!canComplete"
          @click="handleComplete"
          :loading="isLoading"
        >
          完成注册
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const name = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const nameError = ref('')
const phoneError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 验证姓名
const validateName = () => {
  if (!name.value) {
    nameError.value = '请输入姓名'
  } else if (name.value.length < 2) {
    nameError.value = '姓名至少2个字符'
  } else {
    nameError.value = ''
  }
}

// 验证手机号
const validatePhone = () => {
  const reg = /^1[3-9]\d{9}$/
  if (!phone.value) {
    phoneError.value = '请输入手机号码'
  } else if (!reg.test(phone.value)) {
    phoneError.value = '请输入正确的手机号码'
  } else {
    phoneError.value = ''
  }
}

// 验证密码
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = '请输入密码'
  } else if (password.value.length < 6) {
    passwordError.value = '密码至少6位字符'
  } else {
    passwordError.value = ''
  }
  
  // 如果确认密码已输入，需要重新验证
  if (confirmPassword.value) {
    validateConfirmPassword()
  }
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请再次输入密码'
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = '两次输入的密码不一致'
  } else {
    confirmPasswordError.value = ''
  }
}

// 监听各个字段的变化
watch(name, validateName)
watch(phone, validatePhone)
watch(password, validatePassword)
watch(confirmPassword, validateConfirmPassword)

// 密码强度计算
const passwordStrength = computed(() => {
  if (!password.value) return ''
  
  const length = password.value.length
  const hasNumber = /\d/.test(password.value)
  const hasLetter = /[a-zA-Z]/.test(password.value)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password.value)
  
  let strength = 0
  if (length >= 6) strength++
  if (length >= 8) strength++
  if (hasNumber) strength++
  if (hasLetter) strength++
  if (hasSpecial) strength++
  
  if (strength <= 2) return '弱'
  if (strength <= 3) return '中'
  return '强'
})

// 密码强度样式
const strengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength === '弱') return 'strength-weak'
  if (strength === '中') return 'strength-medium'
  if (strength === '强') return 'strength-strong'
  return ''
})

// 是否可以完成注册
const canComplete = computed(() => {
  return name.value && 
         phone.value && 
         password.value && 
         confirmPassword.value && 
         !nameError.value && 
         !phoneError.value && 
         !passwordError.value && 
         !confirmPasswordError.value
})

// 处理完成注册
const handleComplete = () => {
  if (!canComplete.value) return
  
  isLoading.value = true
  console.log('注册信息:', {
    name: name.value,
    phone: phone.value,
    password: password.value
  })
  
  // 模拟注册请求
  setTimeout(() => {
    isLoading.value = false
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })
    
    //注册成功后跳转到首页或登录页
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
  }, 2000)
}
</script>

<style lang="scss">
/* 页面基础样式 */
page {
  overflow: hidden;
  height: 100vh;
}

.complete-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 50rpx 30rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.complete-card {
  margin-top: 100rpx;
  padding: 60rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  max-height: calc(100vh - 100rpx);
  overflow-y: auto; /* 允许内容滚动 */
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
  background-color: #fff;
  position: relative;

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
  
  .password-toggle {
    width: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
  }
}

/* 错误提示 */
.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  padding-left: 20rpx;
  height: 30rpx;
}

/* 密码强度提示 */
.password-strength {
  font-size: 24rpx;
  padding-left: 20rpx;
  height: 30rpx;
  display: flex;
  
  .strength-weak {
    color: #ff4d4f;
  }
  
  .strength-medium {
    color: #faad14;
  }
  
  .strength-strong {
    color: #52c41a;
  }
}

/* 完成注册按钮 */
.complete-btn {
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
</style>