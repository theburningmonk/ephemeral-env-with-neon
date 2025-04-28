#!/usr/bin/env node

const { createApiClient, EndpointType } = require('@neondatabase/api-client');

// Check if required environment variables are set
if (!process.env.NEON_API_KEY) {
  console.error('Error: NEON_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.NEON_PROJECT_ID) {
  console.error('Error: NEON_PROJECT_ID environment variable is not set');
  process.exit(1);
}

// Get command line arguments
const [parentBranchName, newBranchName] = process.argv.slice(2);

if (!parentBranchName || !newBranchName) {
  console.error('Usage: node scripts/create-branch.cjs <parent-branch> <new-branch>');
  process.exit(1);
}

async function createBranch() {
  try {
    const neon = createApiClient({
      apiKey: process.env.NEON_API_KEY,
    });

    console.log(`Finding parent branch "${parentBranchName}"...`);
    
    const branches = await neon.listProjectBranches({
      search: parentBranchName,
      projectId: process.env.NEON_PROJECT_ID,
      limit: 1000,
    });

    const parentBranch = branches.data.branches.find(x => x.name === parentBranchName);
    
    if (!parentBranch) {
      console.error(`Parent branch "${parentBranchName}" not found`);
      process.exit(1);
    }
    
    console.log(`Creating branch "${newBranchName}" from parent branch "${parentBranchName}"...`);
    const response = await neon.createProjectBranch(process.env.NEON_PROJECT_ID, {
      branch: {
        name: newBranchName,
        parent_id: parentBranch.id
      },
      endpoints: [
        {
          type: EndpointType.ReadWrite,
          autoscaling_limit_min_cu: 0.25,
          autoscaling_limit_max_cu: 1,
        },
      ],
    });

    console.log('Branch created successfully!');
    console.log('Branch details:', response.data.branch);

    console.log('Getting connection URL...');
    const getUrlResponse = await neon.getConnectionUri({ 
      projectId: process.env.NEON_PROJECT_ID,
      branch_id: response.data.branch.id,
      database_name: 'todos', // change this to the database name you want to connect to
      role_name: 'todos_owner', // change this to the role name you want to connect with
    });

    console.log('Connection URL:', getUrlResponse.data.uri);
  } catch (error) {
    console.error('Error creating branch:', error.message, error);
    process.exit(1);
  }
}

createBranch(); 