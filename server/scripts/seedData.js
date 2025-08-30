const mongoose = require('mongoose');
const User = require('../src/api/models/user.model');
const Credit = require('../src/api/models/credit.model');
const Facility = require('../src/api/models/facility.model');
const Transaction = require('../src/api/models/transaction.model');
const { Achievement, UserAchievement } = require('../src/api/models/achievement.model');
const { ProductionAnalytics, PortfolioAnalytics } = require('../src/api/models/analytics.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sayantanhalder78_db_user:rAkp8NGIKFBambou@hydrolink.ab2ycyj.mongodb.net/?retryWrites=true&w=majority&appName=HydroLink');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample wallet addresses for different roles
const walletAddresses = {
  producer1: '0x1234567890123456789012345678901234567890',
  producer2: '0x2345678901234567890123456789012345678901',
  certifier1: '0x3456789012345678901234567890123456789012',
  certifier2: '0x4567890123456789012345678901234567890123',
  buyer1: '0x5678901234567890123456789012345678901234',
  buyer2: '0x6789012345678901234567890123456789012345',
};

// Seed Users
const seedUsers = async () => {
  console.log('Seeding users...');
  
  const users = [
    // Producers
    {
      name: 'GreenTech Industries',
      email: 'producer1@greentech.com',
      password: 'password123',
      role: 'Producer',
      walletAddress: walletAddresses.producer1,
      profile: {
        company: 'GreenTech Industries',
        description: 'Leading renewable energy producer specializing in solar and wind power.',
        website: 'https://greentech-industries.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Green Energy Blvd',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zipCode: '94105'
        }
      },
      roleSpecific: {
        producer: {
          facilities: [],
          totalProduction: 1250.5,
          certificationLevel: 'Premium'
        }
      },
      stats: {
        level: 8,
        points: 2400,
        streak: {
          current: 15,
          longest: 32,
          lastActivity: new Date()
        }
      },
      isVerified: true
    },
    {
      name: 'Clean Energy Solutions',
      email: 'producer2@cleanenergy.com',
      password: 'password123',
      role: 'Producer',
      walletAddress: walletAddresses.producer2,
      profile: {
        company: 'Clean Energy Solutions',
        description: 'Innovative clean energy solutions with focus on hydroelectric power.',
        website: 'https://clean-energy-solutions.com',
        phone: '+1-555-0456',
        address: {
          street: '456 Hydro Lane',
          city: 'Portland',
          state: 'OR',
          country: 'USA',
          zipCode: '97205'
        }
      },
      roleSpecific: {
        producer: {
          facilities: [],
          totalProduction: 890.3,
          certificationLevel: 'Standard'
        }
      },
      stats: {
        level: 6,
        points: 1800,
        streak: {
          current: 8,
          longest: 18,
          lastActivity: new Date()
        }
      },
      isVerified: true
    },
    // Certifiers
    {
      name: 'EcoVerify Certification',
      email: 'certifier1@ecoverify.com',
      password: 'password123',
      role: 'Certifier',
      walletAddress: walletAddresses.certifier1,
      profile: {
        company: 'EcoVerify Certification',
        description: 'Trusted third-party verification for renewable energy credits.',
        website: 'https://ecoverify.com',
        phone: '+1-555-0789',
        address: {
          street: '789 Certification Ave',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          zipCode: '73301'
        }
      },
      roleSpecific: {
        certifier: {
          verificationCount: 156,
          approvalRate: 94.2,
          specializations: ['Solar', 'Wind', 'Hydro'],
          certificationLevel: 'Expert'
        }
      },
      stats: {
        level: 12,
        points: 4200,
        streak: {
          current: 28,
          longest: 45,
          lastActivity: new Date()
        }
      },
      isVerified: true
    },
    {
      name: 'Global Green Standards',
      email: 'certifier2@globalgreen.com',
      password: 'password123',
      role: 'Certifier',
      walletAddress: walletAddresses.certifier2,
      profile: {
        company: 'Global Green Standards',
        description: 'International certification body for sustainable energy practices.',
        website: 'https://globalgreen-standards.com',
        phone: '+1-555-0321',
        address: {
          street: '321 Standards Way',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          zipCode: '80202'
        }
      },
      roleSpecific: {
        certifier: {
          verificationCount: 89,
          approvalRate: 96.7,
          specializations: ['Solar', 'Geothermal', 'Biomass'],
          certificationLevel: 'Senior'
        }
      },
      stats: {
        level: 9,
        points: 3100,
        streak: {
          current: 12,
          longest: 35,
          lastActivity: new Date()
        }
      },
      isVerified: true
    },
    // Buyers
    {
      name: 'EcoTech Corporation',
      email: 'buyer1@ecotech.com',
      password: 'password123',
      role: 'Buyer',
      walletAddress: walletAddresses.buyer1,
      profile: {
        company: 'EcoTech Corporation',
        description: 'Technology company committed to carbon neutrality through green energy credits.',
        website: 'https://ecotech-corp.com',
        phone: '+1-555-0654',
        address: {
          street: '654 Tech Park Dr',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zipCode: '98101'
        }
      },
      roleSpecific: {
        buyer: {
          totalPurchased: 450.8,
          totalRetired: 320.5,
          portfolioValue: 125000,
          sustainabilityGoals: {
            annual_offset_target: 1000,
            current_progress: 320.5
          }
        }
      },
      stats: {
        level: 7,
        points: 2100,
        streak: {
          current: 22,
          longest: 29,
          lastActivity: new Date()
        }
      },
      isVerified: true
    },
    {
      name: 'Sustainable Manufacturing Inc',
      email: 'buyer2@sustmfg.com',
      password: 'password123',
      role: 'Buyer',
      walletAddress: walletAddresses.buyer2,
      profile: {
        company: 'Sustainable Manufacturing Inc',
        description: 'Manufacturing company investing in renewable energy credits for sustainability.',
        website: 'https://sustainable-mfg.com',
        phone: '+1-555-0987',
        address: {
          street: '987 Industrial Blvd',
          city: 'Detroit',
          state: 'MI',
          country: 'USA',
          zipCode: '48201'
        }
      },
      roleSpecific: {
        buyer: {
          totalPurchased: 680.2,
          totalRetired: 450.7,
          portfolioValue: 185000,
          sustainabilityGoals: {
            annual_offset_target: 1500,
            current_progress: 450.7
          }
        }
      },
      stats: {
        level: 10,
        points: 3500,
        streak: {
          current: 18,
          longest: 42,
          lastActivity: new Date()
        }
      },
      isVerified: true
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.insertMany(users);
  console.log(`✓ Created ${createdUsers.length} users`);
  return createdUsers;
};

// Seed Facilities
const seedFacilities = async (users) => {
  console.log('Seeding facilities...');
  
  const producers = users.filter(user => user.role === 'Producer');
  
  const facilities = [
    {
      name: 'Solar Farm Alpha',
      owner: producers[0]._id,
      location: {
        address: '100 Solar Way, Mojave Desert, CA',
        city: 'Mojave',
        state: 'CA',
        country: 'USA'
      },
      energySource: 'Solar',
      capacity: 250.5,
      efficiency: 94.2,
      status: 'Active',
      commissioning: {
        startDate: new Date('2022-01-15'),
        completionDate: new Date('2022-08-30'),
        certifications: [{
          name: 'ISO 14001',
          issuedBy: 'International Organization for Standardization',
          issuedDate: new Date('2022-09-15'),
          expiryDate: new Date('2025-09-15'),
          documentUrl: 'https://certificates.iso.org/example-cert-1'
        }]
      },
      specifications: {
        technology: 'Monocrystalline Silicon',
        manufacturer: 'SolarTech Industries',
        model: 'ST-500W-Mono',
        yearInstalled: 2022,
        expectedLifespan: 25
      },
      environmentalData: {
        co2AvoidancePerMWh: 0.85,
        waterUsagePerMWh: 0.02,
        landAreaHectares: 45.2
      },
      operationalMetrics: {
        totalEnergyProduced: 1250.5,
        lastMaintenanceDate: new Date('2024-01-15'),
        nextMaintenanceDate: new Date('2024-07-15'),
        uptime: 98.7
      }
    },
    {
      name: 'Wind Farm Beta',
      owner: producers[0]._id,
      location: {
        address: '200 Wind Ridge, Plains, TX',
        city: 'Plains',
        state: 'TX',
        country: 'USA'
      },
      energySource: 'Wind',
      capacity: 150.0,
      efficiency: 92.8,
      status: 'Active',
      commissioning: {
        startDate: new Date('2021-06-01'),
        completionDate: new Date('2022-03-15'),
        certifications: [{
          name: 'Wind Power Certification',
          issuedBy: 'American Wind Energy Association',
          issuedDate: new Date('2022-04-01'),
          expiryDate: new Date('2025-04-01'),
          documentUrl: 'https://certificates.awea.org/example-cert-2'
        }]
      },
      specifications: {
        technology: 'Horizontal Axis Wind Turbine',
        manufacturer: 'WindPower Corp',
        model: 'WP-2.5MW',
        yearInstalled: 2022,
        expectedLifespan: 20
      },
      environmentalData: {
        co2AvoidancePerMWh: 0.92,
        waterUsagePerMWh: 0.001,
        landAreaHectares: 25.8
      },
      operationalMetrics: {
        totalEnergyProduced: 890.3,
        lastMaintenanceDate: new Date('2024-02-01'),
        nextMaintenanceDate: new Date('2024-08-01'),
        uptime: 95.4
      }
    },
    {
      name: 'Hydro Plant Gamma',
      owner: producers[1]._id,
      location: {
        address: '300 River Bend, Columbia River, OR',
        city: 'Hood River',
        state: 'OR',
        country: 'USA'
      },
      energySource: 'Hydro',
      capacity: 75.0,
      efficiency: 89.5,
      status: 'Active',
      commissioning: {
        startDate: new Date('2020-03-01'),
        completionDate: new Date('2021-10-30'),
        certifications: [{
          name: 'Hydroelectric Certification',
          issuedBy: 'Federal Energy Regulatory Commission',
          issuedDate: new Date('2021-11-15'),
          expiryDate: new Date('2026-11-15'),
          documentUrl: 'https://certificates.ferc.gov/example-cert-3'
        }]
      },
      specifications: {
        technology: 'Francis Turbine',
        manufacturer: 'HydroTech Solutions',
        model: 'HT-25MW',
        yearInstalled: 2021,
        expectedLifespan: 50
      },
      environmentalData: {
        co2AvoidancePerMWh: 0.95,
        waterUsagePerMWh: 0.0,
        landAreaHectares: 12.5
      },
      operationalMetrics: {
        totalEnergyProduced: 425.8,
        lastMaintenanceDate: new Date('2024-01-10'),
        nextMaintenanceDate: new Date('2024-12-10'),
        uptime: 99.2
      }
    }
  ];

  await Facility.deleteMany({});
  const createdFacilities = await Facility.insertMany(facilities);
  console.log(`✓ Created ${createdFacilities.length} facilities`);
  
  // Update users with facility references
  await User.findByIdAndUpdate(producers[0]._id, {
    $push: {
      'roleSpecific.producer.facilities': {
        $each: [createdFacilities[0]._id, createdFacilities[1]._id]
      }
    }
  });
  
  await User.findByIdAndUpdate(producers[1]._id, {
    $push: {
      'roleSpecific.producer.facilities': createdFacilities[2]._id
    }
  });
  
  return createdFacilities;
};

// Seed Credits
const seedCredits = async (users, facilities) => {
  console.log('Seeding credits...');
  
  const producers = users.filter(user => user.role === 'Producer');
  const certifiers = users.filter(user => user.role === 'Certifier');
  
  const credits = [
    // Certified Credits
    {
      creditId: 'HC-202401-ABC123-001',
      tokenId: '1001',
      producer: producers[0]._id,
      certifier: certifiers[0]._id,
      currentOwner: null,
      productionDate: new Date('2024-01-15'),
      energyAmountMWh: 125.5,
      energySource: 'Solar',
      facilityName: 'Solar Farm Alpha',
      facilityLocation: 'Mojave Desert, CA',
      proofDocumentUrl: 'https://storage.hydrolink.com/proofs/solar-farm-alpha-jan-2024.pdf',
      status: 'Certified',
      certificationDate: new Date('2024-01-20'),
      certificationNotes: 'High quality solar production with excellent efficiency metrics.',
      blockchain: {
        mintTxHash: '0xabc123def456789012345678901234567890123456789012345678901234567890',
        network: 'polygon'
      },
      environmentalImpact: {
        co2Avoided: 106.7,
        waterUsed: 2.5,
        landUsed: 45.2
      },
      pricing: {
        mintPrice: 50.0,
        currentMarketPrice: 52.5,
        currency: 'USD'
      },
      qualityMetrics: {
        purity: 98.5,
        efficiency: 94.2,
        sustainability: 96.8
      }
    },
    {
      creditId: 'HC-202401-DEF456-002',
      tokenId: '1002',
      producer: producers[0]._id,
      certifier: certifiers[1]._id,
      currentOwner: null,
      productionDate: new Date('2024-01-20'),
      energyAmountMWh: 89.3,
      energySource: 'Wind',
      facilityName: 'Wind Farm Beta',
      facilityLocation: 'Plains, TX',
      proofDocumentUrl: 'https://storage.hydrolink.com/proofs/wind-farm-beta-jan-2024.pdf',
      status: 'Certified',
      certificationDate: new Date('2024-01-25'),
      certificationNotes: 'Excellent wind power generation with consistent output.',
      blockchain: {
        mintTxHash: '0xdef456abc789012345678901234567890123456789012345678901234567890',
        network: 'polygon'
      },
      environmentalImpact: {
        co2Avoided: 82.2,
        waterUsed: 0.1,
        landUsed: 25.8
      },
      pricing: {
        mintPrice: 48.0,
        currentMarketPrice: 51.0,
        currency: 'USD'
      },
      qualityMetrics: {
        purity: 97.8,
        efficiency: 92.8,
        sustainability: 98.2
      }
    },
    {
      creditId: 'HC-202401-GHI789-003',
      tokenId: '1003',
      producer: producers[1]._id,
      certifier: certifiers[0]._id,
      currentOwner: null,
      productionDate: new Date('2024-01-25'),
      energyAmountMWh: 67.4,
      energySource: 'Hydro',
      facilityName: 'Hydro Plant Gamma',
      facilityLocation: 'Columbia River, OR',
      proofDocumentUrl: 'https://storage.hydrolink.com/proofs/hydro-plant-gamma-jan-2024.pdf',
      status: 'Certified',
      certificationDate: new Date('2024-01-30'),
      certificationNotes: 'Clean hydroelectric power with minimal environmental impact.',
      blockchain: {
        mintTxHash: '0xghi789abc012345678901234567890123456789012345678901234567890123',
        network: 'polygon'
      },
      environmentalImpact: {
        co2Avoided: 64.0,
        waterUsed: 0.0,
        landUsed: 12.5
      },
      pricing: {
        mintPrice: 45.0,
        currentMarketPrice: 47.8,
        currency: 'USD'
      },
      qualityMetrics: {
        purity: 99.2,
        efficiency: 89.5,
        sustainability: 99.5
      }
    },
    // Pending Credits
    {
      creditId: 'HC-202402-JKL012-004',
      producer: producers[0]._id,
      productionDate: new Date('2024-02-01'),
      energyAmountMWh: 98.7,
      energySource: 'Solar',
      facilityName: 'Solar Farm Alpha',
      facilityLocation: 'Mojave Desert, CA',
      proofDocumentUrl: 'https://storage.hydrolink.com/proofs/solar-farm-alpha-feb-2024.pdf',
      status: 'Pending',
      environmentalImpact: {
        co2Avoided: 83.9,
        waterUsed: 2.0,
        landUsed: 45.2
      },
      qualityMetrics: {
        purity: 98.1,
        efficiency: 93.8,
        sustainability: 96.5
      }
    },
    {
      creditId: 'HC-202402-MNO345-005',
      producer: producers[1]._id,
      productionDate: new Date('2024-02-05'),
      energyAmountMWh: 75.2,
      energySource: 'Hydro',
      facilityName: 'Hydro Plant Gamma',
      facilityLocation: 'Columbia River, OR',
      proofDocumentUrl: 'https://storage.hydrolink.com/proofs/hydro-plant-gamma-feb-2024.pdf',
      status: 'Pending',
      environmentalImpact: {
        co2Avoided: 71.4,
        waterUsed: 0.0,
        landUsed: 12.5
      },
      qualityMetrics: {
        purity: 99.0,
        efficiency: 90.2,
        sustainability: 99.3
      }
    }
  ];

  await Credit.deleteMany({});
  const createdCredits = await Credit.insertMany(credits);
  console.log(`✓ Created ${createdCredits.length} credits`);
  return createdCredits;
};

// Seed Transactions
const seedTransactions = async (users, credits) => {
  console.log('Seeding transactions...');
  
  const buyers = users.filter(user => user.role === 'Buyer');
  const certifiedCredits = credits.filter(credit => credit.status === 'Certified');
  
  const transactions = [
    {
      transactionId: 'TXN-PUR-1704204000-ABC123',
      type: 'Purchase',
      credit: certifiedCredits[0]._id,
      from: certifiedCredits[0].producer,
      to: buyers[0]._id,
      amount: 50.0,
      pricePerCredit: 52.5,
      totalValue: 2625.0,
      currency: 'USD',
      status: 'Completed',
      blockchain: {
        network: 'polygon',
        txHash: '0xpurchase123abc456def789012345678901234567890123456789012345678901',
        blockNumber: 12345678,
        gasUsed: 21000,
        gasFee: 0.02,
        confirmations: 15
      },
      fees: {
        platformFee: 13.13,
        networkFee: 0.02,
        totalFees: 13.15
      },
      audit: {
        initiatedBy: buyers[0]._id,
        approvedBy: buyers[0]._id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (compatible; HydroLink/1.0)'
      }
    },
    {
      transactionId: 'TXN-PUR-1704290400-DEF456',
      type: 'Purchase',
      credit: certifiedCredits[1]._id,
      from: certifiedCredits[1].producer,
      to: buyers[1]._id,
      amount: 35.0,
      pricePerCredit: 51.0,
      totalValue: 1785.0,
      currency: 'USD',
      status: 'Completed',
      blockchain: {
        network: 'polygon',
        txHash: '0xpurchase456def789abc012345678901234567890123456789012345678901234',
        blockNumber: 12345680,
        gasUsed: 21000,
        gasFee: 0.02,
        confirmations: 20
      },
      fees: {
        platformFee: 8.93,
        networkFee: 0.02,
        totalFees: 8.95
      },
      audit: {
        initiatedBy: buyers[1]._id,
        approvedBy: buyers[1]._id,
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (compatible; HydroLink/1.0)'
      }
    },
    {
      transactionId: 'TXN-RET-1704376800-GHI789',
      type: 'Retirement',
      credit: certifiedCredits[0]._id,
      from: buyers[0]._id,
      to: null,
      amount: 25.0,
      status: 'Completed',
      blockchain: {
        network: 'polygon',
        txHash: '0xretirement789ghi012345678901234567890123456789012345678901234567',
        blockNumber: 12345685,
        gasUsed: 18500,
        gasFee: 0.015,
        confirmations: 12
      },
      metadata: {
        reason: 'Annual carbon offset for company operations',
        notes: 'Q1 2024 carbon neutrality initiative'
      },
      fees: {
        platformFee: 0.0,
        networkFee: 0.015,
        totalFees: 0.015
      },
      audit: {
        initiatedBy: buyers[0]._id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (compatible; HydroLink/1.0)'
      }
    }
  ];

  await Transaction.deleteMany({});
  const createdTransactions = await Transaction.insertMany(transactions);
  console.log(`✓ Created ${createdTransactions.length} transactions`);
  
  // Update credit ownership
  await Credit.findByIdAndUpdate(certifiedCredits[0]._id, {
    currentOwner: buyers[0]._id
  });
  
  await Credit.findByIdAndUpdate(certifiedCredits[1]._id, {
    currentOwner: buyers[1]._id
  });
  
  return createdTransactions;
};

// Seed Achievements
const seedAchievements = async () => {
  console.log('Seeding achievements...');
  
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first transaction on the platform',
      category: 'Trading',
      type: 'first_time',
      rarity: 'Common',
      requirements: {
        threshold: 1,
        metric: 'transaction_volume'
      },
      rewards: {
        points: 50,
        badge: {
          icon: '🚀',
          color: '#3B82F6',
          design: 'circle'
        },
        title: 'Newcomer'
      }
    },
    {
      name: 'Green Producer',
      description: 'Produce your first 100 MWh of green energy',
      category: 'Production',
      type: 'milestone',
      rarity: 'Common',
      requirements: {
        threshold: 100,
        metric: 'energy_generated'
      },
      rewards: {
        points: 200,
        badge: {
          icon: '🌱',
          color: '#10B981',
          design: 'shield'
        },
        title: 'Energy Producer'
      }
    },
    {
      name: 'Certification Expert',
      description: 'Successfully certify 50 green energy credits',
      category: 'Certification',
      type: 'milestone',
      rarity: 'Uncommon',
      requirements: {
        threshold: 50,
        metric: 'credits_certified'
      },
      rewards: {
        points: 500,
        badge: {
          icon: '✅',
          color: '#8B5CF6',
          design: 'star'
        },
        title: 'Trusted Certifier'
      }
    },
    {
      name: 'Carbon Neutral',
      description: 'Retire 500 MWh worth of green energy credits',
      category: 'Environmental',
      type: 'milestone',
      rarity: 'Rare',
      requirements: {
        threshold: 500,
        metric: 'credits_retired'
      },
      rewards: {
        points: 1000,
        badge: {
          icon: '🌍',
          color: '#059669',
          design: 'crown'
        },
        title: 'Climate Champion'
      }
    },
    {
      name: 'Power Producer',
      description: 'Generate over 1000 MWh of clean energy',
      category: 'Production',
      type: 'milestone',
      rarity: 'Epic',
      requirements: {
        threshold: 1000,
        metric: 'energy_generated'
      },
      rewards: {
        points: 2000,
        badge: {
          icon: '⚡',
          color: '#F59E0B',
          design: 'diamond'
        },
        title: 'Power House'
      }
    }
  ];

  await Achievement.deleteMany({});
  const createdAchievements = await Achievement.insertMany(achievements);
  console.log(`✓ Created ${createdAchievements.length} achievements`);
  return createdAchievements;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    const users = await seedUsers();
    const facilities = await seedFacilities(users);
    const credits = await seedCredits(users, facilities);
    const transactions = await seedTransactions(users, credits);
    const achievements = await seedAchievements();
    
    console.log('\n✨ Database seeding completed successfully!');
    console.log(`
📊 Summary:
   - Users: ${users.length}
   - Facilities: ${facilities.length}
   - Credits: ${credits.length}
   - Transactions: ${transactions.length}
   - Achievements: ${achievements.length}
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
