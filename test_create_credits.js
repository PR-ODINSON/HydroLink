const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try Atlas first, then fall back to local MongoDB
    const atlasUri = 'mongodb+srv://sayantanhalder78_db_user:rAkp8NGIKFBambou@hydrolink.ab2ycyj.mongodb.net/?retryWrites=true&w=majority&appName=HydroLink';
    const localUri = 'mongodb://localhost:27017/hydrolink';

    try {
      await mongoose.connect(atlasUri);
      console.log('MongoDB Atlas connected successfully.');
    } catch (atlasError) {
      console.log('Atlas connection failed, trying local MongoDB...');
      await mongoose.connect(localUri);
      console.log('Local MongoDB connected successfully.');
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

// User Schema (simplified)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  walletAddress: String
}, { timestamps: true });

// Credit Schema (simplified)
const CreditSchema = new mongoose.Schema({
  creditId: String,
  tokenId: String,
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  certifier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productionDate: Date,
  energyAmountMWh: Number,
  energySource: String,
  facilityName: String,
  facilityLocation: String,
  proofDocumentUrl: String,
  status: { type: String, default: 'Certified' },
  isSold: { type: Boolean, default: false },
  soldAt: Date,
  certificationDate: Date,
  environmentalImpact: {
    co2Avoided: Number,
    waterUsed: Number,
    landUsed: Number
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Credit = mongoose.model('Credit', CreditSchema);

// Create test data
const createTestData = async () => {
  try {
    await connectDB();

    // Find or create a producer
    let producer = await User.findOne({ role: 'Producer' });
    if (!producer) {
      producer = new User({
        name: 'Green Energy Corp',
        email: 'producer@greentech.com',
        password: 'hashed_password',
        role: 'Producer',
        walletAddress: '0x1234567890abcdef'
      });
      await producer.save();
      console.log('Created producer:', producer.name);
    } else {
      console.log('Found existing producer:', producer.name);
    }

    // Find or create a certifier
    let certifier = await User.findOne({ role: 'Certifier' });
    if (!certifier) {
      certifier = new User({
        name: 'Carbon Trust',
        email: 'certifier@carbontrust.com',
        password: 'hashed_password',
        role: 'Certifier',
        walletAddress: '0xabcdef1234567890'
      });
      await certifier.save();
      console.log('Created certifier:', certifier.name);
    } else {
      console.log('Found existing certifier:', certifier.name);
    }

    // Check if credits already exist
    const existingCredits = await Credit.countDocuments({ status: 'Certified', isSold: false });
    console.log('Existing available credits:', existingCredits);

    if (existingCredits === 0) {
      // Create test credits
      const testCredits = [
        {
          creditId: 'HC-2024-TEST001',
          tokenId: 'TOKEN-001',
          producer: producer._id,
          certifier: certifier._id,
          productionDate: new Date('2024-01-15'),
          energyAmountMWh: 1500,
          energySource: 'Solar',
          facilityName: 'Solar H2 Plant Alpha',
          facilityLocation: 'Nevada, USA',
          proofDocumentUrl: 'https://example.com/proof1.pdf',
          status: 'Certified',
          isSold: false,
          certificationDate: new Date('2024-01-20'),
          environmentalImpact: {
            co2Avoided: 3.2,
            waterUsed: 2500,
            landUsed: 5.5
          }
        },
        {
          creditId: 'HC-2024-TEST002',
          tokenId: 'TOKEN-002',
          producer: producer._id,
          certifier: certifier._id,
          productionDate: new Date('2024-01-18'),
          energyAmountMWh: 2200,
          energySource: 'Wind',
          facilityName: 'Wind H2 Plant Beta',
          facilityLocation: 'Kansas, USA',
          proofDocumentUrl: 'https://example.com/proof2.pdf',
          status: 'Certified',
          isSold: false,
          certificationDate: new Date('2024-01-25'),
          environmentalImpact: {
            co2Avoided: 4.8,
            waterUsed: 1800,
            landUsed: 8.2
          }
        },
        {
          creditId: 'HC-2024-TEST003',
          tokenId: 'TOKEN-003',
          producer: producer._id,
          certifier: certifier._id,
          productionDate: new Date('2024-01-22'),
          energyAmountMWh: 1800,
          energySource: 'Hydro',
          facilityName: 'Hydro H2 Plant Gamma',
          facilityLocation: 'Oregon, USA',
          proofDocumentUrl: 'https://example.com/proof3.pdf',
          status: 'Certified',
          isSold: false,
          certificationDate: new Date('2024-01-28'),
          environmentalImpact: {
            co2Avoided: 3.9,
            waterUsed: 3200,
            landUsed: 4.1
          }
        }
      ];

      await Credit.insertMany(testCredits);
      console.log('Created', testCredits.length, 'test credits');
    }

    // Show final counts
    const totalCredits = await Credit.countDocuments();
    const availableCredits = await Credit.countDocuments({ status: 'Certified', isSold: false });
    console.log('Total credits in DB:', totalCredits);
    console.log('Available credits for purchase:', availableCredits);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
