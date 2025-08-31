const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hydrolink');

// Define schemas directly
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  walletAddress: String
});

const CreditSchema = new mongoose.Schema({
  creditId: String,
  tokenId: String,
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certifier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  energyAmountMWh: Number,
  energySource: { type: String, enum: ['Solar', 'Wind', 'Hydro', 'Geothermal', 'Biomass', 'Other'] },
  facilityName: String,
  facilityLocation: String,
  productionDate: Date,
  status: String,
  isSold: Boolean,
  certificationDate: Date,
  environmentalImpact: {
    co2Avoided: Number,
    waterUsed: Number,
    landUsed: Number
  },
  blockchain: {
    network: String
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Credit = mongoose.model('Credit', CreditSchema);

async function addCredits() {
  try {
    // Create users if they don't exist
    let producer = await User.findOne({ role: 'Producer' });
    if (!producer) {
      producer = await User.create({
        name: 'GreenTech Industries',
        email: 'producer@greentech.com',
        password: '$2a$10$hashedpassword',
        role: 'Producer',
        walletAddress: '0x1234567890123456789012345678901234567890'
      });
    }

    let certifier = await User.findOne({ role: 'Certifier' });
    if (!certifier) {
      certifier = await User.create({
        name: 'EcoVerify Certification',
        email: 'certifier@ecoverify.com',
        password: '$2a$10$hashedpassword',
        role: 'Certifier',
        walletAddress: '0x3456789012345678901234567890123456789012'
      });
    }

    // Add credits
    const credits = [
      {
        creditId: 'HC-2024-SOLAR001',
        tokenId: 'TOKEN-SOLAR001',
        producer: producer._id,
        certifier: certifier._id,
        energyAmountMWh: 1500,
        energySource: 'Solar',
        facilityName: 'SolarTech Hydrogen Plant',
        facilityLocation: 'California, USA',
        productionDate: new Date('2024-02-01'),
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-02-08'),
        environmentalImpact: {
          co2Avoided: 5.2,
          waterUsed: 2100,
          landUsed: 12.5
        },
        blockchain: { network: 'polygon' }
      },
      {
        creditId: 'HC-2024-WIND002',
        tokenId: 'TOKEN-WIND002',
        producer: producer._id,
        certifier: certifier._id,
        energyAmountMWh: 2200,
        energySource: 'Wind',
        facilityName: 'WindPower H2 Station',
        facilityLocation: 'Texas, USA',
        productionDate: new Date('2024-02-15'),
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-02-22'),
        environmentalImpact: {
          co2Avoided: 7.8,
          waterUsed: 1800,
          landUsed: 15.2
        },
        blockchain: { network: 'polygon' }
      },
      {
        creditId: 'HC-2024-HYDRO003',
        tokenId: 'TOKEN-HYDRO003',
        producer: producer._id,
        certifier: certifier._id,
        energyAmountMWh: 3200,
        energySource: 'Hydro',
        facilityName: 'HydroGen Station Alpha',
        facilityLocation: 'Oregon, USA',
        productionDate: new Date('2024-03-01'),
        status: 'Certified',
        isSold: false,
        certificationDate: new Date('2024-03-08'),
        environmentalImpact: {
          co2Avoided: 9.1,
          waterUsed: 3500,
          landUsed: 8.7
        },
        blockchain: { network: 'polygon' }
      }
    ];

    // Clear existing credits and add new ones
    await Credit.deleteMany({});
    await Credit.insertMany(credits);
    
    console.log(`✅ Added ${credits.length} credits to database`);
    
    // Verify
    const count = await Credit.countDocuments({ status: 'Certified', isSold: false });
    console.log(`✅ Verified: ${count} certified credits available`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

addCredits();
