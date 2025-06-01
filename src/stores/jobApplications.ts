import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Application {
  id?: string
  company: string
  position: string
  location: string
  applicationDate: string
  status: string
  priority: string
  salary: string
  source: string
  contact: string
  interviewDate: string
  followupDate: string
  notes: string
}

export const useJobApplicationsStore = defineStore('jobApplications', () => {
  const applications = ref<Application[]>([])

  // Initialize with default data and load from localStorage
  const initializeStore = () => {
    const defaultData: Application[] = [
      {
        id: '1',
        company: 'DigiPlus Interactive Corp.',
        position: 'Junior Frontend Developer',
        location: 'Makati City',
        applicationDate: '2025-06-01',
        status: 'Applied',
        priority: 'High',
        salary: '₱25,000 - ₱35,000',
        source: 'https://careers.digiplus.com.ph/jobs/frontend-developer',
        contact: 'HR Department',
        interviewDate: '',
        followupDate: '2025-06-08',
        notes: 'Current internship company - good fit for my Vue.js skills',
      },
      {
        id: '2',
        company: 'Accenture',
        position: 'Associate Software Engineer',
        location: 'BGC, Taguig',
        applicationDate: '2025-06-01',
        status: 'Screening',
        priority: 'Medium',
        salary: '₱30,000 - ₱40,000',
        source: 'https://www.jobstreet.com.ph/job/associate-software-engineer-67890',
        contact: 'Jane Santos',
        interviewDate: '',
        followupDate: '2025-06-05',
        notes: 'Large consulting firm - good training programs',
      },
      {
        id: '3',
        company: 'Globe Telecom',
        position: 'React Developer',
        location: 'Ortigas Center',
        applicationDate: '2025-05-30',
        status: 'Interview Scheduled',
        priority: 'High',
        salary: '₱35,000 - ₱50,000',
        source: 'https://www.linkedin.com/jobs/view/12345678',
        contact: 'Mark Rodriguez',
        interviewDate: '2025-06-10',
        followupDate: '',
        notes: 'Perfect match for React skills - technical interview on June 10',
      },
    ]

    const stored = localStorage.getItem('jobApplications')
    if (stored) {
      applications.value = JSON.parse(stored)
    } else {
      applications.value = defaultData
      saveToStorage()
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem('jobApplications', JSON.stringify(applications.value))
  }

  // Computed statistics
  const stats = computed(() => {
    const total = applications.value.length
    const notApplied = applications.value.filter((app) => app.status === 'Not Applied').length
    const pending = applications.value.filter(
      (app) => app.status === 'Applied' || app.status === 'Screening',
    ).length
    const interviews = applications.value.filter(
      (app) => app.status === 'Interview Scheduled',
    ).length
    const offers = applications.value.filter((app) => app.status === 'Offer').length

    return { total, notApplied, pending, interviews, offers }
  })

  // Actions
  const addApplication = (application: Omit<Application, 'id'>) => {
    const newApp: Application = {
      ...application,
      id: Date.now().toString(),
    }
    applications.value.push(newApp)
    saveToStorage()
  }

  const updateApplication = (id: string, updates: Partial<Application>) => {
    const index = applications.value.findIndex((app) => app.id === id)
    if (index !== -1) {
      applications.value[index] = { ...applications.value[index], ...updates }
      saveToStorage()
    }
  }

  const deleteApplication = (id: string) => {
    applications.value = applications.value.filter((app) => app.id !== id)
    saveToStorage()
  }

  const clearAllApplications = () => {
    applications.value = []
    saveToStorage()
  }

  // Initialize store
  initializeStore()

  return {
    applications,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
    clearAllApplications,
  }
})
