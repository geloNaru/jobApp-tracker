<!-- filepath: c:\Users\Angelo\Desktop\jobApp-tracker\src\components\ApplicationFormDialog.vue -->
<template>
  <el-dialog
    :title="editingApplication ? 'Edit Application' : 'Add New Application'"
    v-model="dialogVisible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      :model="currentApplication"
      label-width="140px"
      :rules="formRules"
      ref="applicationForm"
    >
      <el-form-item label="Company Name" prop="company">
        <el-input v-model="currentApplication.company" placeholder="Company Name"></el-input>
      </el-form-item>

      <el-form-item label="Position" prop="position">
        <el-input v-model="currentApplication.position" placeholder="Job Title"></el-input>
      </el-form-item>

      <el-form-item label="Location" prop="location">
        <el-input v-model="currentApplication.location" placeholder="City, State"></el-input>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Applied Date" prop="applicationDate">
            <el-date-picker
              v-model="currentApplication.applicationDate"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Interview Date">
            <el-date-picker
              v-model="currentApplication.interviewDate"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-select
              v-model="currentApplication.status"
              placeholder="Select status"
              style="width: 100%"
            >
              <el-option label="Not Applied" value="Not Applied"></el-option>
              <el-option label="Applied" value="Applied"></el-option>
              <el-option label="Screening" value="Screening"></el-option>
              <el-option label="Interview Scheduled" value="Interview Scheduled"></el-option>
              <el-option label="Offer" value="Offer"></el-option>
              <el-option label="Rejected" value="Rejected"></el-option>
              <el-option label="Withdrawn" value="Withdrawn"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Priority" prop="priority">
            <el-select
              v-model="currentApplication.priority"
              placeholder="Select priority"
              style="width: 100%"
            >
              <el-option label="High" value="High"></el-option>
              <el-option label="Medium" value="Medium"></el-option>
              <el-option label="Low" value="Low"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Salary Range">
            <el-input
              v-model="currentApplication.salary"
              placeholder="₱25,000 - ₱35,000"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Source">
            <el-input
              v-model="currentApplication.source"
              placeholder="JobStreet, LinkedIn, etc."
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Contact Person">
        <el-input v-model="currentApplication.contact" placeholder="HR Contact"></el-input>
      </el-form-item>

      <el-form-item label="Follow-up Date">
        <el-date-picker
          v-model="currentApplication.followupDate"
          type="date"
          placeholder="Select date"
          style="width: 100%"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="Notes">
        <el-input
          v-model="currentApplication.notes"
          type="textarea"
          :rows="3"
          placeholder="Notes, requirements, interview feedback, etc."
        >
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSave">
          {{ editingApplication ? 'Update' : 'Save' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { Application } from '@/stores/jobApplications'

const props = defineProps<{
  visible: boolean
  editingApplication?: Application | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [application: Omit<Application, 'id'>, id?: string]
}>()

const dialogVisible = ref(props.visible)
const applicationForm = ref()

const currentApplication = reactive({
  company: '',
  position: '',
  location: '',
  applicationDate: '',
  status: 'Applied',
  priority: 'Medium',
  salary: '',
  source: '',
  contact: '',
  interviewDate: '',
  followupDate: '',
  notes: '',
})

const formRules = {
  company: [{ required: true, message: 'Please enter company name', trigger: 'blur' }],
  position: [{ required: true, message: 'Please enter position title', trigger: 'blur' }],
  location: [{ required: true, message: 'Please enter location', trigger: 'blur' }],
  applicationDate: [
    { required: true, message: 'Please select application date', trigger: 'change' },
  ],
  status: [{ required: true, message: 'Please select status', trigger: 'change' }],
  priority: [{ required: true, message: 'Please select priority', trigger: 'change' }],
}

watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    // Load data when dialog opens
    if (newVal && props.editingApplication) {
      loadApplicationData(props.editingApplication)
    } else if (newVal && !props.editingApplication) {
      resetForm()
    }
  },
)

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

watch(
  () => props.editingApplication,
  (app) => {
    if (app && props.visible) {
      loadApplicationData(app)
    }
  },
  { immediate: true },
)

function loadApplicationData(app: Application) {
  Object.assign(currentApplication, {
    company: app.company || '',
    position: app.position || '',
    location: app.location || '',
    applicationDate: app.applicationDate || '',
    status: app.status || 'Applied',
    priority: app.priority || 'Medium',
    salary: app.salary || '',
    source: app.source || '',
    contact: app.contact || '',
    interviewDate: app.interviewDate || '',
    followupDate: app.followupDate || '',
    notes: app.notes || '',
  })
}

function resetForm() {
  Object.assign(currentApplication, {
    company: '',
    position: '',
    location: '',
    applicationDate: '',
    status: 'Applied',
    priority: 'Medium',
    salary: '',
    source: '',
    contact: '',
    interviewDate: '',
    followupDate: '',
    notes: '',
  })
}

function handleClose() {
  resetForm()
  dialogVisible.value = false
}

function handleSave() {
  if (!currentApplication.company || !currentApplication.position || !currentApplication.location) {
    ElMessage.error('Please fill in required fields')
    return
  }

  const appData = { ...currentApplication }
  const id = props.editingApplication?.id

  emit('save', appData, id)
  handleClose()
}
</script>
