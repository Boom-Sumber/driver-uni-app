import { createClient } from "@/uni_modules/anfun-supabase/dist/index.js";


// 从环境变量中读取Supabase配置信息
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// 验证配置是否存在
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase配置缺失，请确保.env文件中已配置VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY')
}

// 创建Supabase客户端实例
const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '')

export default supabase


