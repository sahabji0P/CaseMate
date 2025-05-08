import mongoose from 'mongoose';
import Document from '../models/Documents';
import connectDB, { gfsBucket } from '../mongodb';

export async function cleanupOrphanedGridFSFiles() {
  try {
    const { connection } = await connectDB();
    const db = connection.db;

    if (!db) {
      throw new Error('Database connection not established');
    }

    // Get all file entries in fs.files
    const allFilesCursor = db.collection('fs.files').find({});
    const allFiles = await allFilesCursor.toArray();

    console.log(`🔍 Starting cleanup of ${allFiles.length} files...`);

    for (const file of allFiles) {
      const exists = await Document.exists({ fileId: file._id });
      if (!exists) {
        try {
          await gfsBucket!.delete(file._id);
          console.log(`✅ Deleted orphaned file: ${file.filename} (${file._id})`);
        } catch (deleteErr) {
          console.error(`❌ Error deleting orphaned file ${file._id}:`, deleteErr);
        }
      }
    }

    console.log("🧹 Orphan cleanup completed.");
  } catch (error) {
    console.error("❌ Error in cleanup job:", error);
  }
} 