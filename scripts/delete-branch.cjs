#!/usr/bin/env node

const { createApiClient } = require('@neondatabase/api-client');

// Check if required environment variables are set
if (!process.env.NEON_API_KEY) {
  console.error('Error: NEON_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.NEON_PROJECT_ID) {
  console.error('Error: NEON_PROJECT_ID environment variable is not set');
  process.exit(1);
}

// Get command line argument
const [branchName] = process.argv.slice(2);

if (!branchName) {
  console.error('Usage: node scripts/delete-branch.cjs <branch-name>');
  process.exit(1);
}

async function deleteBranch() {
  try {
    const neon = createApiClient({
      apiKey: process.env.NEON_API_KEY,
    });

    console.log(`Finding branch "${branchName}"...`);
    
    const branches = await neon.listProjectBranches({
      search: branchName,
      projectId: process.env.NEON_PROJECT_ID,
      limit: 1000,
    });

    const branch = branches.data.branches.find(x => x.name === branchName);
    
    if (!branch) {
      console.error(`Branch "${branchName}" not found`);
      process.exit(1);
    }
    
    console.log(`Deleting branch "${branchName}"...`);
    await neon.deleteProjectBranch(process.env.NEON_PROJECT_ID, branch.id);

    console.log('Branch deleted successfully!');
  } catch (error) {
    console.error('Error deleting branch:', error.message);
    process.exit(1);
  }
}

deleteBranch(); 