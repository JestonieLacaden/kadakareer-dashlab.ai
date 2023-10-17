/*
    Read Me!!!
    All Methods/Function here must input an array of documentBuffer and must return key-value pairs of the specified document

    E.g :

    Input: 
    ( [buffer1, buffer2] )

    Output : 
    [[name: "John"], [surname: "Doe"], [age: "25"], [sex: "male"]]
*/
const result = require("../test_documents/MFOWS-Annex_G-Psychological_Evaluation Form_Pg1.json");
const result2 = require("../test_documents/MFOWS-Annex_G-Psychological_Evaluation Form_Pg2.json");
const textractUtils = require("../utils/textractUtils");
const converter = require("json-2-csv")
const fs = require("fs")
const path = require("path")

const {
  TextractClient,
  AnalyzeDocumentCommand,
} = require("@aws-sdk/client-textract");

const client = new TextractClient({
  region: "us-east-1",
});

const dpl = async (documentBuffers) => {
  // Implement logic here
  return null;
};

const dps = (documentBuffers) => {
  // Implement logic here
  return null;
};

const dprl = async (documentBuffers) => {
  // Implement logic here
  return null;
};

const dprs = async (documentBuffers) => {
  // Implement logic here
  return null;
};

const mai = async (documentBuffers) => {
  // Implement logic here
  return null;
};

const magef = async (documentBuffers) => {
  const textractResults = [];

  documentBuffers.forEach((documentBuffer) => {
    const command = new AnalyzeDocumentCommand({
      Document: {
        Bytes: documentBuffer,
      },
      FeatureTypes: ["TABLES", "FORMS", "SIGNATURES", "LAYOUT"],
    });

    client.send(command).then((result) => {
      textractResults.push(result);
    });
  });

  const extractionResults = [];
  textractResults.forEach((textractResult, index) => {
    const keyValues = textractUtils.extractKeyValuePairs(textractResult);
    const tables = textractUtils.getTableValues(textractResult);

    extractionResults.push({
      page: index + 1,
      key_values: keyValues,
      tables: tables,
    });
  });

  return extractionResults;
};

// Input : documentBuffers
/* Output : 
    [
        {
            document: int
            extractedWord: string[]
        }
    ]
*/

const extractWords = async (documentBuffers) => {
  const textractResult = await textractUtils.sendRequestToTextractClient(
    documentBuffers,
    AnalyzeDocumentCommand,
    client
  );

  let blocks = textractResult.map((res) => res.Blocks);

  let a = blocks.map((e) =>
    e.filter((z) => z.BlockType === "WORD").map((e) => e.Text)
  );

  let index = 0;
  a = a.map((e) => {
    index++;
    return { documentPage: index, extractedWord: e };
  });

  return a;
};

const readJSONToCSVAndStore = async (fileDirectory, filename, jsonDocuments) => {
  try {
    const filePath = path.join(fileDirectory, filename);

    let existingCSV;
    let existingJSON = [];

    if (fs.existsSync(filePath)) {
      existingCSV = fs.readFileSync(filePath, 'utf-8');
      existingJSON = await converter.csv2json(existingCSV);
    }

    const newJSON = [...existingJSON, ...jsonDocuments];

    const updatedCSV = await converter.json2csv(newJSON);
    console.log(updatedCSV);

    fs.writeFileSync(filePath, updatedCSV, 'utf-8');
    console.log(`CSV data has been saved to ${filePath}`);
    return updatedCSV
  } catch (error) {
    console.error('Error while reading, converting, or saving CSV:', error);
  }
};

module.exports = {
  dpl,
  dps,
  dprl,
  dprs,
  mai,
  magef,
  extractWords,
  readJSONToCSVAndStore,
};
