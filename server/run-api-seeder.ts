import { seedUniversitiesFromAPI } from './api-university-seeder';

// Clear existing data and seed with API data
async function runSeeding() {
  try {
    console.log('🚀 Starting API-based university seeding...');
    
    const result = await seedUniversitiesFromAPI();
    
    console.log('\n✅ Seeding process completed successfully!');
    console.log(`📊 Final Results:`);
    console.log(`   Universities: ${result.universities}`);
    console.log(`   Programs: ${result.programs}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeding();