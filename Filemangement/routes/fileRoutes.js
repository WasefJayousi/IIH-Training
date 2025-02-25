const express = require('express');
const fs = require('fs'); // for writible streams
const fspromises = require('fs').promises;
const path = require('path');
const pdfParser = require('pdf-parse');
const PDFDocumentkit = require('pdfkit');
const { PDFDocument } = require('pdf-lib');
const router = express.Router();
// Helper function to get absolute file path (prevents path traversal attacks)
const getFilePath = (fileName) => path.join(__dirname, '..', 'storage', path.basename(fileName));

const checkext = (fileName) => {
  if (path.extname(fileName) !== '.pdf') {
    return true
  }
}

router.get('/read', async (req, res) => {
  try {
    const fileName = req.query.fileName
    const dataBuffer = await fspromises.readFile(getFilePath(fileName));
    const pdfData = await pdfParser(dataBuffer);
    console.log(pdfData.text)
    return res.status(200).json({ content: pdfData.text });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message });
  }
});

router.post('/write', async (req, res) => {
  try {
    const { fileName, content } = req.body;

    if(checkext(fileName))
      {
        console.log("file ext is not pdf!")
        return res.status(400).json({error:"file ext is not pdf!"})
      }
    const filepath = getFilePath(fileName)

    const doc = new PDFDocument()
    const writeStream = fs.createWriteStream(filepath)

    doc.pipe(writeStream)
    doc.text(content)
    doc.end()

    writeStream.on('finish', () => {
      return res.status(201).json({ message: 'PDF file written successfully', filepath });
    });
    writeStream.on('error', (err) => {
      return res.status(500).json({ error: err.message });
    });
    console.log('File written successfully')
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/append', async (req, res) => {
  const { fileName, content } = req.body;
  try {
    if(checkext(fileName))
      {
        console.log("file ext is not pdf!")
        return res.status(400).json({error:"file ext is not pdf!"})
      }
    await fspromises.appendFile(getFilePath(fileName), content, 'binary');
    console.log("content appended")
    return res.status(201).json({ message: 'Content appended successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/rename', async (req, res) => {
  const { oldName, newName } = req.body;
  if(checkext(newName))
    {
      console.log("file ext is not pdf!")
      return res.status(400).json({error:"file ext is not pdf!"})
    } // check on newName because oldName already validated to be pdf extension
  if (!oldName || !newName) {
    return res.status(400).json({ error: 'Both old and new file names are required' });
  }

  const oldFilePath = getFilePath(oldName);
  const newFilePath = getFilePath(newName);

  try {
    // Check if the old file exists
    await fspromises.access(oldFilePath);

    // Rename the file
    await fspromises.rename(oldFilePath, newFilePath);
    res.json({ message: 'File renamed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-dir', async (req, res) => {
  const { dirName } = req.body;

  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }

  const dirPath = getFilePath(dirName);

  try {
    await fspromises.mkdir(dirPath, { recursive: true }); // Creates nested directories if needed
    res.json({ message: 'Directory created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete('/delete-dir', async (req, res) => {
  const { dirName } = req.query;
  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }
  const dirPath = getFilePath(dirName);

  try {
    await fspromises.rm(dirPath, { recursive: true, force: true }); // Deletes even if it's not empty
    res.json({ message: 'Directory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/delete', async (req, res) => {
  try {
    const fileName = req.query.fileName
    if(checkext(fileName))
      {
        console.log("file ext is not pdf!")
        return res.status(400).json({error:"file ext is not pdf!"})
      }
    await fspromises.unlink(getFilePath(fileName));
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
