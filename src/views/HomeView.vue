<!-- filepath: c:\Users\Angelo\Desktop\jobApp-tracker\src\views\HomeView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Delete } from '@element-plus/icons-vue'
import { useJobApplicationsStore, type Application } from '@/stores/jobApplications'
import StatsCards from '@/components/StatsCards.vue'
import ApplicationsTable from '@/components/ApplicationsTable.vue'
import ApplicationFormDialog from '@/components/ApplicationFormDialog.vue'

const store = useJobApplicationsStore()

const showAddDialog = ref(false)
const editingApplication = ref<Application | null>(null)

function handleEdit(application: Application) {
  editingApplication.value = application
  showAddDialog.value = true
}

function handleDelete(id: string) {
  ElMessageBox.confirm('Are you sure you want to delete this application?', 'Confirm Delete', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      store.deleteApplication(id)
      ElMessage.success('Application deleted successfully!')
    })
    .catch(() => {
      // User cancelled
    })
}

function handleSave(applicationData: Omit<Application, 'id'>, id?: string) {
  if (id) {
    store.updateApplication(id, applicationData)
    ElMessage.success('Application updated successfully!')
  } else {
    store.addApplication(applicationData)
    ElMessage.success('Application added successfully!')
  }
  editingApplication.value = null
}

function handleAddNew() {
  editingApplication.value = null
  showAddDialog.value = true
}

function clearAllApplications() {
  ElMessageBox.confirm(
    'Are you sure you want to clear all applications? This cannot be undone.',
    'Clear All Applications',
    {
      confirmButtonText: 'Clear All',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      store.clearAllApplications()
      ElMessage.success('All applications cleared!')
    })
    .catch(() => {
      // User cancelled
    })
}

function exportToCSV() {
  const headers = [
    'Company',
    'Position',
    'Location',
    'Application Date',
    'Status',
    'Priority',
    'Salary Range',
    'Source',
    'Contact Person',
    'Interview Date',
    'Follow-up Date',
    'Notes',
  ]

  const csvData = store.applications.map((app) => [
    app.company,
    app.position,
    app.location,
    app.applicationDate,
    app.status,
    app.priority,
    app.salary,
    app.source,
    app.contact,
    app.interviewDate,
    app.followupDate,
    app.notes,
  ])

  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${(field || '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n')

  // Add BOM for UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `job_applications_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)

  ElMessage.success('CSV file exported successfully!')
}
</script>

<template>
  <div id="app">
    <div class="app-container">
      <div class="main-card">
        <!-- Header -->
        <div class="header">
          <h1>Job Application Tracker</h1>
          <p>
            Manage your job search like a pro - Track applications, interviews, and opportunities
          </p>
        </div>

        <!-- Export Info -->
        <el-alert
          title="📊 Export Options"
          description="Export your data to CSV for Excel compatibility, or copy table data directly to spreadsheets."
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        >
        </el-alert>

        <!-- Statistics Cards -->
        <StatsCards :stats="store.stats" />

        <!-- Controls -->
        <div class="controls-section">
          <div>
            <el-button type="primary" @click="handleAddNew" :icon="Plus">
              Add New Application
            </el-button>
            <el-button type="success" @click="exportToCSV" :icon="Download">
              Export to CSV
            </el-button>
          </div>
          <div>
            <el-button type="danger" @click="clearAllApplications" :icon="Delete">
              Clear All
            </el-button>
          </div>
        </div>

        <!-- Applications Table -->
        <ApplicationsTable
          :applications="store.applications"
          @edit="handleEdit"
          @delete="handleDelete"
        />

        <!-- Add/Edit Dialog -->
        <ApplicationFormDialog
          v-model:visible="showAddDialog"
          :editing-application="editingApplication"
          @save="handleSave"
        />
      </div>
    </div>
  </div>
</template>

<style>
/* ...existing code... */
</style>

<style>
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.app-container {
  padding: 20px;
  min-height: 100vh;
}

.main-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  margin: 0;
}

.header p {
  color: #666;
  font-size: 1.1rem;
  margin: 10px 0 0 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.controls-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-status-tag {
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 12px;
}

.priority-tag {
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  padding: 2px 8px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.export-info {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #2196f3;
  color: #1565c0;
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .main-card {
    padding: 20px;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
