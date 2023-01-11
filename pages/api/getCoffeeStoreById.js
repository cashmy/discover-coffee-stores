import { table, getMinifiedRecords } from '../../lib/Airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const findCoffeeStoreRecord = await table.select({
        filterByFormula: `id = "${id}"`
      })
        .firstPage();

      if (findCoffeeStoreRecord.length !== 0) {
        const records = getMinifiedRecords(findCoffeeStoreRecord);
        res.statusCode = 200
        res.json(records)
      } else {
        res.status(404);
        res.json({ error: '"id" could not be found in Airtable' });
      }
    }else {
      res.status(400);
      res.json({ error: 'id is required' });
    }
  } catch (error) {
    res.status(501);
    res.json({ error: `Something went wrong: ${error}` });
  }
}

export default getCoffeeStoreById;