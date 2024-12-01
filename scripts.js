// Fetch codes from the backend
async function fetchCodes() {
    const response = await fetch('http://localhost:5000/codes');
    const data = await response.json();
    return data;
  }
  
  // Display codes (fetch from backend)
  async function displayCodes(filter = '') {
    const codeList = document.getElementById('codeList');
    const codes = await fetchCodes();
    const filteredCodes = codes.filter(code => code.topic.toLowerCase().includes(filter.toLowerCase()));
  
    codeList.innerHTML = filteredCodes
      .map(
        (codeItem, index) => `
          <div>
            <h3>${codeItem.topic}</h3>
            <pre>${codeItem.code}</pre>
            <button class="edit" onclick="editCode(${index})">Edit</button>
            <button class="delete" onclick="deleteCode(${index})">Delete</button>
          </div>
        `
      )
      .join('');
  }
  
  // Add new code (send to backend)
  document.getElementById('codeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const topic = document.getElementById('topic').value;
    const code = document.getElementById('code').value;
  
    const response = await fetch('http://localhost:5000/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, code })
    });
  
    const newCode = await response.json();
    displayCodes();
  });
  
  // Edit code
  async function editCode(index) {
    const topic = prompt('Edit the topic:', codes[index].topic);
    const code = prompt('Edit the code:', codes[index].code);
  
    if (topic && code) {
      codes[index] = { topic, code };
      localStorage.setItem('codes', JSON.stringify(codes)); // Save changes
      displayCodes();
    }
  }
  
  // Delete code
  async function deleteCode(index) {
    if (confirm('Are you sure you want to delete this code?')) {
      codes.splice(index, 1);
      localStorage.setItem('codes', JSON.stringify(codes)); // Save changes
      displayCodes();
    }
  }
  
  // Search for codes
  document.getElementById('search').addEventListener('input', (event) => {
    displayCodes(event.target.value);
  });
  
  // Initial load
  displayCodes();
  