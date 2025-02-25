const apiUrl = 'http://localhost:3000/api';

// Read file
async function readFile() {
  const fileName = document.getElementById('readFileName').value;
  const response = await fetch(`${apiUrl}/read?fileName=${fileName}`);
  const data = await response.json();
  document.getElementById('readContent').textContent = data.content || data.error;
}

// Write file
async function writeFile() {
  const fileName = document.getElementById('writeFileName').value;
  const content = document.getElementById('writeContent').value;
  await fetch(`${apiUrl}/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });
}

// Append file
async function appendFile() {
  const fileName = document.getElementById('appendFileName').value;
  const content = document.getElementById('appendContent').value;
  const data = await fetch(`${apiUrl}/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });
  document.getElementById('appendContent').textContent = data.content || data.error;
}

// Delete file
async function deleteFile() {
  const fileName = document.getElementById('deleteFileName').value;
  const data = await fetch(`${apiUrl}/delete?fileName=${fileName}`, { method: 'DELETE' });
  document.getElementById('deleteFile').textContent = data.content || data.error;
}

// Rename file
async function renameFile() {
  const oldName = document.getElementById('oldFileName').value;
  const newName = document.getElementById('newFileName').value;
  const data = await fetch(`${apiUrl}/rename`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName })
  });
  document.getElementById('renameFile').textContent = data.content || data.error;
}

// Create directory
async function createDirectory() {
  const dirName = document.getElementById('createDirName').value;
  const data = await fetch(`${apiUrl}/create-dir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dirName })
  });
  document.getElementById('CreateDirectory').textContent = data.content || data.error;
}

// Delete directory
async function deleteDirectory() {
  const dirName = document.getElementById('deleteDirName').value;
  const data = await fetch(`${apiUrl}/delete-dir?dirName=${dirName}`, { method: 'DELETE' });
  document.getElementById('deleteDirectory').textContent = data.content || data.error;
}
