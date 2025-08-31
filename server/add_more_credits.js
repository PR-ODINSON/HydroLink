require('dotenv').config();
const mongoose = require('mongoose');
const Credit = require('./src/api/models/credit.model');
const User = require('./src/api/models/user.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hydrolink');
    console.log('MongoDB connected for adding credits');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const addCredits = async () => {
  try {
    // Create or find producer
    let producer = await User.findOne({ role: 'Producer' });
    if (!producer) {
      producer = new User({
        name: 'GreenTech Industries',
        email: 'producer@greentech.com',
        password: 'password123',
        role: 'Producer',
        walletAddress: '0x1234567890123456789012345678901234567890'
      });
      await producer.save();
      console.log('✅ Created producer user');
    }

    // Create or find certifier
    let certifier = await User.findOne({ role: 'Certifier' });
    if (!certifier) {
      certifier = new User({
        name: 'EcoVerify Certification',
        email: 'certifier@ecoverify.com',
        password: 'password123',
        role: 'Certifier',
        walletAddress: '0x3456789012345678901234567890123456789012'
      });
      await certifier.save();
      console.log('✅ Created certifier user');
    }

    // Add multiple certified credits
    const newCredits = [
      {
        creditId: 'HC-2024-SOLAR001',
        tokenId: 'TOKEN-SOLAR001',
        producer: producer._id,
        certifier: certifier._id,
        productionDate: new Date('2024-02-01'),
        energyAmountMWh: 1500,
        energySource: 'Solar',
        facilityName: 'SolarTech Hydrogen Plant',
        facilityLocation: 'California, USA',
        proofDocumentUrl: 'https://example.com/solar-proof1.pdf',
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-02-08'),
        environmentalImpact: {
          co2Avoided: 5.2,
          waterUsed: 2100,
          landUsed: 12.5
        },
        blockchain: {
          network: 'polygon'
        }
      },
      {
        creditId: 'HC-2024-HYDRO002',
        tokenId: 'TOKEN-HYDRO002',
        producer: producer._id,
        certifier: certifier._id,
        productionDate: new Date('2024-02-15'),
        energyAmountMWh: 3200,
        energySource: 'Hydro',
        facilityName: 'HydroGen Station Alpha',
        facilityLocation: 'Oregon, USA',
        proofDocumentUrl: 'https://example.com/hydro-proof2.pdf',
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-02-22'),
        environmentalImpact: {
          co2Avoided: 8.7,
          waterUsed: 5400,
          landUsed: 6.8
        },
        blockchain: {
          network: 'polygon'
        }
      },
      {
        creditId: 'HC-2024-NUCLEAR003',
        tokenId: 'TOKEN-NUCLEAR003',
        producer: producer._id,
        certifier: certifier._id,
        productionDate: new Date('2024-03-01'),
        energyAmountMWh: 4500,
        energySource: 'Other',
        facilityName: 'NuclearH2 Production Facility',
        facilityLocation: 'Texas, USA',
        proofDocumentUrl: 'https://example.com/nuclear-proof3.pdf',
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-03-08'),
        environmentalImpact: {
          co2Avoided: 12.3,
          waterUsed: 8900,
          landUsed: 2.1
        },
        blockchain: {
          network: 'polygon'
        }
      }
    ];

    for (const creditData of newCredits) {
      const existingCredit = await Credit.findOne({ creditId: creditData.creditId });
      if (!existingCredit) {
        const credit = new Credit(creditData);
        await credit.save();
        console.log(`✅ Added credit: ${creditData.creditId}`);
      } else {
        console.log(`⚠️  Credit already exists: ${creditData.creditId}`);
      }
    }

    // Check total available credits
    const totalCredits = await Credit.countDocuments({ status: 'Certified', isSold: false });
    console.log(`\n📊 Total available credits: ${totalCredits}`);

  } catch (error) {
    console.error('Error adding credits:', error);
  }
};

const main = async () => {
  await connectDB();
  await addCredits();
  mongoose.disconnect();
  console.log('✅ Done!');
};

main();
