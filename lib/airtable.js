const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const table = base('coffee-stores');

const getMinifiedRecord = (record) => {
  return {
    ...record.fields
  }
}

const getMinifiedRecords = (records) => {
  return records = records.map(record => getMinifiedRecord(record));
}

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table.select({
    filterByFormula: `id = "${id}"`
  })
    .firstPage();
  return getMinifiedRecords(findCoffeeStoreRecord);
}


export { table, findRecordByFilter, getMinifiedRecords };