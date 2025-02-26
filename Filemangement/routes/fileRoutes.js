const express = require('express');
const stream = require('fs'); // for writible streams
const fs = require('fs').promises;
const path = require('path');
const pdfParser = require('pdf-parse');
const PDFDocument = require('pdfkit');
const { json } = require('stream/consumers');
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
    const dataBuffer = await fs.readFile(getFilePath(fileName));
    const pdfdata = await pdfParser(dataBuffer)
    return res.status(200).json({ content: pdfdata.text });
  } catch(err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/write', async (req, res) => {
  try {
    const { fileName, content } = req.body;

    if (checkext(fileName)) {
      console.log("file ext is not pdf!");
      return res.status(400).json({ error: "file ext is not pdf!" });
    }

    const filepath = getFilePath(fileName);
    const doc = new PDFDocument();
    const writeStream =  stream.createWriteStream(filepath);

    doc.pipe(writeStream);
    doc.text(content);
    doc.end();

    writeStream.on('finish', () => {
      console.log("pdf file written successfully")
      return res.status(201).json({ message: 'PDF file written successfully', filepath });
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});
router.post('/append', async (req, res) => {
  try {
    const { fileName, content } = req.body;

    if (checkext(fileName)) {
      console.log("file ext is not pdf!");
      return res.status(400).json({ error: "file ext is not pdf!" });
    }
    const dataBuffer = await fs.readFile(getFilePath(fileName)); // get old content and concat with new content
    const oldcontent = (await pdfParser(dataBuffer)).text

    const filepath = getFilePath(fileName);
    const doc = new PDFDocument();
    const writeStream =  stream.createWriteStream(filepath);

    doc.pipe(writeStream);
    doc.text(oldcontent+content);
    doc.end();

    writeStream.on('finish', () => {
      console.log("pdf file written successfully")
      return res.status(201).json({ message: 'PDF file written successfully', filepath });
    });

  } catch (err) {
    console.log(err);
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
    console.log("renamed successfully")
    return res.status(400).json({ error: 'Both old and new file names are required' });
  }

  const oldFilePath = getFilePath(oldName);
  const newFilePath = getFilePath(newName);

  try {
    // Check if the old file exists
    await fs.access(oldFilePath);

    // Rename the file
    await fs.rename(oldFilePath, newFilePath);
    console.log("file renamed successfully")
    return res.json({ message: 'File renamed successfully' });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ error: err.message });
  }
});

router.post('/create-dir', async (req, res) => {
  const { dirName } = req.body;

  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }

  const dirPath = getFilePath(dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true }); // Creates nested directories if needed
    res.json({ message: 'Directory created successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



router.delete('/delete-dir', async (req, res) => {
  const { dirName } = req.query;
  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }
  const dirPath = getFilePath(dirName);

  try {
    await fs.rm(dirPath, { recursive: true, force: true }); // Deletes even if it's not empty
    return res.json({ message: 'Directory deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
    await fs.unlink(getFilePath(fileName));
    console.log("file deleted successfully")
    return res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
