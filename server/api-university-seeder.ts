import { storage } from './storage';

interface UniversityApiData {
  name: string;
  country: string;
  'state-province'?: string;
  domains: string[];
  web_pages: string[];
  alpha_two_code: string;
}

// Sample programs by field and country to generate realistic data
const programTemplates = {
  'Engineering & Technology': [
    { name: 'Computer Science', degree: 'Bachelor', duration: 4, basefee: 45000 },
    { name: 'Electrical Engineering', degree: 'Bachelor', duration: 4, baseFee: 42000 },
    { name: 'Mechanical Engineering', degree: 'Bachelor', duration: 4, baseFee: 41000 },
    { name: 'Software Engineering', degree: 'Master', duration: 2, basefee: 38000 },
    { name: 'Data Science', degree: 'Master', duration: 2, basefee: 44000 },
    { name: 'Civil Engineering', degree: 'Bachelor', duration: 4, basefee: 40000 },
    { name: 'Biomedical Engineering', degree: 'Master', duration: 2, basefee: 43000 },
  ],
  'Business & Management': [
    { name: 'Business Administration', degree: 'Bachelor', duration: 4, baseFee: 38000 },
    { name: 'MBA', degree: 'Master', duration: 2, baseFee: 65000 },
    { name: 'Marketing', degree: 'Bachelor', duration: 4, basefee: 35000 },
    { name: 'Finance', degree: 'Bachelor', duration: 4, baseFee: 40000 },
    { name: 'International Business', degree: 'Master', duration: 2, baseFee: 42000 },
    { name: 'Management', degree: 'Bachelor', duration: 4, baseFee: 37000 },
  ],
  'Medicine & Health': [
    { name: 'Medicine', degree: 'Doctor', duration: 6, baseFee: 55000 },
    { name: 'Nursing', degree: 'Bachelor', duration: 4, baseFeee: 32000 },
    { name: 'Public Health', degree: 'Master', duration: 2, baseFee: 38000 },
    { name: 'Pharmacy', degree: 'Doctor', duration: 4, baseFeee: 48000 },
    { name: 'Dentistry', degree: 'Doctor', duration: 4, baseFeee: 52000 },
    { name: 'Physiotherapy', degree: 'Bachelor', duration: 4, baseFeee: 30000 },
  ],
  'Social Sciences': [
    { name: 'Psychology', degree: 'Bachelor', duration: 4, baseFeee: 33000 },
    { name: 'International Relations', degree: 'Bachelor', duration: 4, baseFeee: 36000 },
    { name: 'Political Science', degree: 'Bachelor', duration: 4, baseFeee: 34000 },
    { name: 'Sociology', degree: 'Bachelor', duration: 4, baseFeee: 32000 },
    { name: 'Economics', degree: 'Bachelor', duration: 4, baseFeee: 37000 },
    { name: 'Anthropology', degree: 'Bachelor', duration: 4, baseFeee: 31000 },
  ],
  'Physical Sciences': [
    { name: 'Physics', degree: 'Bachelor', duration: 4, baseFeee: 35000 },
    { name: 'Chemistry', degree: 'Bachelor', duration: 4, baseFeee: 34000 },
    { name: 'Mathematics', degree: 'Bachelor', duration: 4, baseFeee: 33000 },
    { name: 'Biology', degree: 'Bachelor', duration: 4, baseFeee: 36000 },
    { name: 'Environmental Science', degree: 'Bachelor', duration: 4, baseFeee: 35000 },
  ],
  'Arts & Design': [
    { name: 'Fine Arts', degree: 'Bachelor', duration: 4, baseFeee: 30000 },
    { name: 'Architecture', degree: 'Bachelor', duration: 5, baseFeee: 43000 },
    { name: 'Graphic Design', degree: 'Bachelor', duration: 4, baseFeee: 28000 },
    { name: 'Music', degree: 'Bachelor', duration: 4, baseFeee: 29000 },
    { name: 'Theater Arts', degree: 'Bachelor', duration: 4, baseFeee: 27000 },
  ]
};

// Fee multipliers by country to make tuition realistic
const countryFeeMultipliers: { [key: string]: number } = {
  'United States': 1.0,
  'United Kingdom': 0.8,
  'Canada': 0.7,
  'Australia': 0.9,
  'Germany': 0.05,
  'France': 0.15,
  'Netherlands': 0.25,
  'Sweden': 0.1,
  'Switzerland': 0.03,
  'Japan': 0.6,
  'Singapore': 0.5,
  'India': 0.15,
  'China': 0.25,
  'Pakistan': 0.08,
  'South Korea': 0.4,
  'New Zealand': 0.8,
  'Norway': 0.02,
  'Finland': 0.02,
  'Denmark': 0.1,
};

function generateRequirements(degree: string, country: string): string {
  const baseRequirements = {
    'Bachelor': 'High school diploma or equivalent, English proficiency test',
    'Master': 'Bachelor degree in related field, English proficiency, Letters of recommendation',
    'Doctor': 'Relevant bachelor degree, Entrance examination, Interview, Research experience'
  };
  
  const countrySpecific = {
    'United States': ', SAT/ACT scores',
    'United Kingdom': ', A-levels or equivalent',
    'Canada': ', provincial requirements',
    'Australia': ', ATAR or equivalent',
    'Germany': ', Abitur or equivalent',
    'Pakistan': ', FSc/A-levels, local entrance test',
    'India': ', 12th standard, entrance examination',
    'China': ', Gaokao or equivalent'
  };
  
  const base = baseRequirements[degree as keyof typeof baseRequirements] || 'Academic qualification required';
  const specific = countrySpecific[country] || '';
  
  return base + specific;
}

function generateDeadlines(): string {
  const deadlines = [
    '2024-11-30', '2024-12-15', '2025-01-15', '2025-02-01', 
    '2025-03-01', '2025-04-15', '2025-05-01', '2025-06-30'
  ];
  return deadlines[Math.floor(Math.random() * deadlines.length)];
}

function generatePrograms(country: string): any[] {
  const fields = Object.keys(programTemplates);
  const selectedFields = fields.sort(() => 0.5 - Math.random()).slice(0, 3); // 3 random fields
  const programs: any[] = [];
  
  const multiplier = countryFeeMultipliers[country] || 0.3;
  
  selectedFields.forEach(field => {
    const fieldPrograms = programTemplates[field as keyof typeof programTemplates];
    const randomPrograms = fieldPrograms.sort(() => 0.5 - Math.random()).slice(0, 2); // 2 programs per field
    
    randomPrograms.forEach(program => {
      const fee = Math.round((program.baseFeee || program.baseFeee || program.baseFeee || 35000) * multiplier);
      programs.push({
        programName: program.name,
        field: field,
        degree: program.degree,
        duration: program.duration,
        tuitionFee: fee,
        requirements: generateRequirements(program.degree, country),
        applicationDeadline: generateDeadlines(),
      });
    });
  });
  
  return programs;
}

async function fetchUniversitiesFromAPI(countries: string[]) {
  const allUniversities: UniversityApiData[] = [];
  
  for (const country of countries) {
    try {
      console.log(`Fetching universities from ${country}...`);
      const response = await fetch(`https://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch universities for ${country}: ${response.status}`);
        continue;
      }
      
      const universities = await response.json();
      
      if (!Array.isArray(universities)) {
        console.error(`Invalid response format for ${country}`);
        continue;
      }
      
      // Take top universities per country based on country size
      const limit = country === 'United States' ? 15 : 
                   ['United Kingdom', 'Canada', 'Australia'].includes(country) ? 10 : 
                   8;
      
      const selectedUniversities = universities.slice(0, limit);
      allUniversities.push(...selectedUniversities);
      
      console.log(`✓ Fetched ${selectedUniversities.length} universities from ${country}`);
      
      // Add delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error fetching universities for ${country}:`, error);
    }
  }
  
  return allUniversities;
}

export async function seedUniversitiesFromAPI() {
  try {
    console.log('🌍 Starting API-based university data seeding...');
    
    const targetCountries = [
      'Pakistan', 'United States', 'United Kingdom', 'Canada', 
      'Australia', 'Germany', 'France', 'Netherlands', 'Sweden',
      'Switzerland', 'Japan', 'Singapore', 'India', 'China',
      'South Korea', 'New Zealand', 'Norway', 'Finland'
    ];
    
    console.log(`📡 Fetching data for ${targetCountries.length} countries...`);
    const apiUniversities = await fetchUniversitiesFromAPI(targetCountries);
    
    console.log(`📊 Total universities fetched: ${apiUniversities.length}`);
    
    let successCount = 0;
    let programCount = 0;
    
    for (let i = 0; i < apiUniversities.length; i++) {
      const uni = apiUniversities[i];
      
      try {
        // Create unique user ID
        const userId = `api_uni_${i + 1}_${Date.now()}`;
        
        // Extract location info
        const city = uni['state-province'] || uni.country;
        const website = uni.web_pages?.[0] || `https://${uni.domains?.[0] || 'university.edu'}`;
        const email = `admissions@${uni.domains?.[0] || 'university.edu'}`;
        
        // Create user for university
        await storage.upsertUser({
          id: userId,
          email: email,
          firstName: uni.name.split(' ')[0] || 'University',
          lastName: uni.name.split(' ').slice(1).join(' ') || 'Institute',
        });
        
        // Create university profile
        const university = await storage.createUniversityProfile({
          userId: userId,
          universityName: uni.name,
          country: uni.country,
          city: city,
          website: website,
          description: `Leading educational institution in ${uni.country} offering comprehensive academic programs and research opportunities. Committed to excellence in higher education and student success.`,
        });
        
        // Generate and add programs
        const programs = generatePrograms(uni.country);
        
        for (const programData of programs) {
          try {
            await storage.createUniversityProgram({
              universityId: university.id,
              ...programData,
            });
            programCount++;
          } catch (progError) {
            console.error(`  Failed to add program ${programData.programName}`);
          }
        }
        
        successCount++;
        console.log(`✓ ${successCount}. ${uni.name} (${uni.country}) - ${programs.length} programs`);
        
      } catch (error) {
        console.error(`✗ Failed to process ${uni.name}:`, error);
      }
    }
    
    console.log(`\n🎉 API Seeding completed successfully!`);
    console.log(`📈 Statistics:`);
    console.log(`   Universities added: ${successCount}`);
    console.log(`   Programs added: ${programCount}`);
    console.log(`   Countries covered: ${new Set(apiUniversities.map(u => u.country)).size}`);
    console.log(`   Success rate: ${Math.round((successCount / apiUniversities.length) * 100)}%`);
    
    return { universities: successCount, programs: programCount };
    
  } catch (error) {
    console.error('❌ Error during API seeding:', error);
    throw error;
  }
}