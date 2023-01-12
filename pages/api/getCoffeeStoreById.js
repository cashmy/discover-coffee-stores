import { findRecordByFilter } from '../../lib/airtable-interface';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {

      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
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