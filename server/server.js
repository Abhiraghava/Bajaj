import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));


const dbURI = 'mongodb+srv://abhi:abhi146@cluster0.kdd6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


const userSchema = new mongoose.Schema({
  user_id: String,
  email: String,
  roll_number: String,
  numbers: [String],
  alphabets: [String],
  highest_lowercase_alphabet: [String],
  file_valid: Boolean,
  file_mime_type: String,
  file_size_kb: String,
}, { timestamps: true });


const User = mongoose.model('User', userSchema);


const isAlphabet = (char) => /^[a-zA-Z]$/.test(char);
const isNumber = (value) => /^[0-9]+$/.test(value);
const getHighestLowercaseAlphabet = (array) => {
  const lowercaseAlphabets = array.filter((char) => /^[a-z]$/.test(char));
  return lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];
};
const getFileDetails = (fileB64) => {
  if (!fileB64) {
    return { file_valid: false, file_mime_type: null, file_size_kb: null };
  }

  try {
    const buffer = Buffer.from(fileB64, 'base64');
    const sizeInKB = buffer.length / 1024;
    const mimeType = sizeInKB > 0 ? 'application/octet-stream' : null;

    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: sizeInKB.toFixed(2),
    };
  } catch (err) {
    return { file_valid: false, file_mime_type: null, file_size_kb: null };
  }
};


app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});


app.post('/bfhl', async (req, res) => {
  const { data, file_b64 } = req.body;
  const full_name = "Abhi";
  const dob = "17091999";
  const user_id = `${full_name}_${dob}`;
  const email = "john@xyz.com"; 
  const roll_number = "ABCD123"; 

 
  const numbers = data.filter(isNumber);
  const alphabets = data.filter(isAlphabet);

  
  const highestLowercaseAlphabet = getHighestLowercaseAlphabet(alphabets);

 
  const fileDetails = getFileDetails(file_b64);

 
  try {
    const newUser = new User({
      user_id: user_id,
      email: email,
      roll_number: roll_number,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      file_valid: fileDetails.file_valid,
      file_mime_type: fileDetails.file_mime_type,
      file_size_kb: fileDetails.file_size_kb,
    });

    await newUser.save(); 

    
    res.status(200).json({
      is_success: true,
      user_id: user_id,
      email: email,
      roll_number: roll_number,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      file_valid: fileDetails.file_valid,
      file_mime_type: fileDetails.file_mime_type,
      file_size_kb: fileDetails.file_size_kb,
    });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    res.status(500).json({
      is_success: false,
      error: 'Database error',
    });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
