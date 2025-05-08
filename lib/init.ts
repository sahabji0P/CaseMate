import { setupCronJobs } from './cron/setupCronJobs';

// Initialize cron jobs
if (process.env.NODE_ENV === 'production') {
  setupCronJobs();
} 