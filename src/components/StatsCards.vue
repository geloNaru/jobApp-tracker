<!-- filepath: c:\Users\Angelo\Desktop\jobApp-tracker\src\components\StatsCards.vue -->
<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">{{ stats.total }}</div>
      <div class="stat-label">Total Applications</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ stats.pending }}</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ stats.interviews }}</div>
      <div class="stat-label">Interviews</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{{ stats.offers }}</div>
      <div class="stat-label">Offers</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  total: number
  pending: number
  interviews: number
  offers: number
}

defineProps<{
  stats: Stats
}>()
</script>

<style scoped>
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
</style>
