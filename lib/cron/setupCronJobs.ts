import cron from 'node-cron';
import { cleanupOrphanedGridFSFiles } from '../cleanup/cleanupOrphanedFiles';

export function setupCronJobs() {
  // Schedule cleanup job to run at 2 AM every day
  cron.schedule('0 2 * * *', async () => {
    console.log('🕒 Running scheduled cleanup of orphaned GridFS files...');
    await cleanupOrphanedGridFSFiles();
  });

  console.log('✅ Cron jobs have been set up');
} 