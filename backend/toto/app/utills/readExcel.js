const fs = require('fs');
const xlsx = require('xlsx');

// Function to convert Excel date-time to JavaScript Date
function excelDateToJSDate(excelDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const dateOffset = (excelDate - 25569) * millisecondsPerDay;
  const jsDate = new Date(dateOffset);
  return jsDate;
}

function formatDate(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString('en-US', options);
}

function readExcelSheetToJson(filePath, sheetName) {
  try {
    // Load the Excel file
    const workbook = xlsx.readFile(filePath);

    // Check if the specified sheet exists in the workbook
    if (!workbook.Sheets.hasOwnProperty(sheetName)) {
      throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
    }

    // Get the specified sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert Excel data to JSON
    const jsonData = xlsx.utils.sheet_to_json(sheet, {
      raw: false, // Parse dates instead of keeping them as raw Excel date values
      dateNF: 'yyyy-mm-dd HH:mm:ss', // Define the date format
      cellDates: true, // Treat cell values as dates
    });

    // Iterate through the JSON data and format date values
    for (const row of jsonData) {
      if (row['date ']) {
        row.date = formatDate(row['date ']);
        delete row['date ']; // Remove the old key
      }
    }

    // Save the JSON data to a file
    const outputFileName = `${sheetName}.json`;
    const jsonContent = JSON.stringify(jsonData, null, 2).replace(/"date "/g, '"date"');
    fs.writeFileSync(outputFileName, jsonContent);
    console.log(`Data from '${sheetName}' sheet converted to JSON and saved as '${outputFileName}'.`);
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  readExcelSheetToJson,
};
