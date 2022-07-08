<script setup lang="ts">
import { ref } from 'vue'


</script>

<template>
  <div class="container">
    <h1>Login</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      status-icon
      label-width="120px"
      class="demo-ruleForm"
      style="width: 60%;"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="ruleForm.username" type="username"/>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('doLogin', ruleForm)"
          >Submit</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.container {
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
<script lang="ts">
import { reactive, } from 'vue'
import { FormRules, FormInstance } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  password: '',
  username: '',
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: 'Please input username.', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password.', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
  ]
})


const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>