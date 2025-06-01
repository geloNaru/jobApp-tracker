<!-- filepath: c:\Users\Angelo\Desktop\jobApp-tracker\src\components\ApplicationsTable.vue -->
<template>
  <div class="table-container">
    <div class="filter-section">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-input
            v-model="filters.search"
            placeholder="Search company, position..."
            clearable
            prefix-icon="Search"
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.status" placeholder="Status" clearable>
            <el-option label="All" value="" />
            <el-option label="Applied" value="Applied" />
            <el-option label="Screening" value="Screening" />
            <el-option label="Interview Scheduled" value="Interview Scheduled" />
            <el-option label="Offer" value="Offer" />
            <el-option label="Rejected" value="Rejected" />
            <el-option label="Withdrawn" value="Withdrawn" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filters.priority" placeholder="Priority" clearable>
            <el-option label="All" value="" />
            <el-option label="High" value="High" />
            <el-option label="Medium" value="Medium" />
            <el-option label="Low" value="Low" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-col>
        <el-col style="padding-left: 80px" :span="4">
          <el-button @click="clearFilters">Clear Filters</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="filteredApplications"
      style="width: 100%"
      :default-sort="{ prop: 'applicationDate', order: 'descending' }"
      stripe
      border
    >
      <el-table-column prop="company" label="Company" width="180" sortable>
        <template #default="scope">
          <strong>{{ scope.row.company }}</strong>
        </template>
      </el-table-column>

      <el-table-column prop="position" label="Position" width="200" sortable> </el-table-column>

      <el-table-column prop="location" label="Location" width="150" sortable> </el-table-column>

      <el-table-column prop="applicationDate" label="Applied" width="120" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.applicationDate) }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="Status" width="140" sortable>
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" class="custom-status-tag" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="priority" label="Priority" width="100" sortable>
        <template #default="scope">
          <el-tag :type="getPriorityType(scope.row.priority)" class="priority-tag" size="small">
            {{ scope.row.priority }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="salary" label="Salary Range" width="140"> </el-table-column>

      <el-table-column prop="source" label="Source" width="120">
        <template #default="scope">
          <div class="source-cell">
            <el-link
              v-if="isValidUrl(scope.row.source)"
              :href="scope.row.source"
              target="_blank"
              type="primary"
              class="source-link"
              :title="scope.row.source"
            >
              {{ getSourceDisplayText(scope.row.source) }}
            </el-link>
            <span v-else class="source-text">{{ scope.row.source || '-' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="interviewDate" label="Interview" width="120">
        <template #default="scope">
          {{ scope.row.interviewDate ? formatDate(scope.row.interviewDate) : '-' }}
        </template>
      </el-table-column>

      <el-table-column prop="notes" label="Notes" width="200" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="scope">
          <div class="action-buttons">
            <el-button size="small" type="primary" :icon="Edit" @click="$emit('edit', scope.row)">
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="$emit('delete', scope.row.id)"
            >
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { Application } from '@/stores/jobApplications'

const props = defineProps<{
  applications: Application[]
}>()

defineEmits<{
  edit: [application: Application]
  delete: [id: string]
}>()

const filters = reactive({
  search: '',
  status: '',
  priority: '',
  dateRange: null as [string, string] | null,
})

// Add computed property for filtered data
const filteredApplications = computed(() => {
  let filtered = props.applications

  // Search filter (company, position, location)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (app) =>
        app.company.toLowerCase().includes(searchLower) ||
        app.position.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower),
    )
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((app) => app.status === filters.status)
  }

  // Priority filter
  if (filters.priority) {
    filtered = filtered.filter((app) => app.priority === filters.priority)
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
    const [startDate, endDate] = filters.dateRange
    filtered = filtered.filter((app) => {
      if (!app.applicationDate) return false
      const appDate = new Date(app.applicationDate).toISOString().split('T')[0]
      return appDate >= startDate && appDate <= endDate
    })
  }

  return filtered
})
function clearFilters() {
  filters.search = ''
  filters.status = ''
  filters.priority = ''
  filters.dateRange = null
}
function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusType(status: string) {
  const statusMap: Record<string, string> = {
    Applied: '',
    Screening: 'warning',
    'Interview Scheduled': 'info',
    Offer: 'success',
    Rejected: 'danger',
    Withdrawn: 'info',
  }
  return statusMap[status] || ''
}

function getPriorityType(priority: string) {
  const priorityMap: Record<string, string> = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success',
  }
  return priorityMap[priority] || ''
}

function isValidUrl(string: string): boolean {
  if (!string) return false
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function getSourceDisplayText(url: string): string {
  if (!isValidUrl(url)) return url

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // Map common job sites to friendly names
    const siteMap: Record<string, string> = {
      'indeed.com': 'Indeed',
      'ph.indeed.com': 'Indeed PH',
      'linkedin.com': 'LinkedIn',
      'jobstreet.com': 'JobStreet',
      'kalibrr.com': 'Kalibrr',
      'glassdoor.com': 'Glassdoor',
      'monster.com': 'Monster',
      'careers.google.com': 'Google Careers',
      'jobs.lever.co': 'Lever',
      'greenhouse.io': 'Greenhouse',
    }

    // Check for exact matches first
    for (const [domain, name] of Object.entries(siteMap)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return name
      }
    }

    // For company career pages, try to extract company name
    if (
      hostname.includes('careers') ||
      urlObj.pathname.includes('careers') ||
      urlObj.pathname.includes('jobs')
    ) {
      const parts = hostname.split('.')
      if (parts.length >= 2) {
        const companyName = parts[parts.length - 2]
        return `${companyName.charAt(0).toUpperCase() + companyName.slice(1)} Careers`
      }
    }

    // Fallback: show domain name (truncated if too long)
    const domain = hostname.replace('www.', '')
    return domain.length > 15 ? domain.substring(0, 12) + '...' : domain
  } catch {
    return url.length > 15 ? url.substring(0, 12) + '...' : url
  }
}
</script>

<style scoped>
.filter-section {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.source-cell {
  max-width: 100%;
  overflow: hidden;
}

.source-link {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-size: 12px;
}

.source-link:hover {
  text-decoration: underline;
}

.source-text {
  font-size: 12px;
  color: #666;
}
</style>
