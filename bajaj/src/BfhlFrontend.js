import React, { useState } from 'react';
import axios from 'axios';

const BfhlFrontend = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [dropdownSelection, setDropdownSelection] = useState([]);

 
  document.title = 'RA2111047010146';

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleDropdownChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setDropdownSelection(options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const parsedInput = JSON.parse(jsonInput);
      setError('');

    
      const res = await axios.post('http://localhost:3001/bfhl', parsedInput);
      setResponse(res.data); 
    } catch (err) {
      setError('Invalid JSON input. Please enter a valid JSON.');
      setResponse(null);
    }
  };

  // Function to render response based on dropdown selections
  const renderResponse = () => {
    if (!response) return null;
    const { alphabets, numbers, highest_lowercase_alphabet } = response;

    return (
      <div style={styles.responseContainer}>
        {dropdownSelection.includes('Alphabets') && (
          <div style={styles.responseBlock}>
            <h4>Alphabets:</h4>
            <p>{alphabets.join(', ') || 'None'}</p>
          </div>
        )}
        {dropdownSelection.includes('Numbers') && (
          <div style={styles.responseBlock}>
            <h4>Numbers:</h4>
            <p>{numbers.join(', ') || 'None'}</p>
          </div>
        )}
        {dropdownSelection.includes('Highest lowercase alphabet') && (
          <div style={styles.responseBlock}>
            <h4>Highest Lowercase Alphabet:</h4>
            <p>{highest_lowercase_alphabet || 'None'}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>BFHL Frontend</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label htmlFor="json-input" style={styles.label}>JSON Input:</label>
          <textarea
            id="json-input"
            value={jsonInput}
            onChange={handleJsonChange}
            placeholder='Enter JSON like: { "data": ["A","C","z"] }'
            rows="4"
            cols="50"
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.button}>Submit</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {response && (
        <>
          <div style={styles.dropdownContainer}>
            <label htmlFor="dropdown" style={styles.label}>Select Data to Display:</label>
            <select
              id="dropdown"
              multiple
              value={dropdownSelection}
              onChange={handleDropdownChange}
              style={styles.dropdown}
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest Lowercase Alphabet</option>
            </select>
          </div>

          {/* Render the response data based on dropdown selection */}
          {renderResponse()}
        </>
      )}
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  dropdownContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdown: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  responseContainer: {
    marginTop: '20px',
  },
  responseBlock: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
  },
};

export default BfhlFrontend;
