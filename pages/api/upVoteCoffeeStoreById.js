import { table, findRecordByFilter, getMinifiedRecords } from '../../lib/airtable-interface';

const upVoteCoffeeStoreById = async (req, res) => {

  if (req.method === 'PUT') {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0]; // get the first record 
          const calculateVoting = parseInt(record.voting) + 1;

          const updateRecord = await table.update([
            {
              "id": record.recordId,
              "fields": {
                voting: calculateVoting
              }
            }
          ])
          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.statusCode = 201
            res.json(minifiedRecords[0])
          }

        } else {
          res.statusCode = 404
          res.json({ message: "Coffee store Id does not exist" })
        }

      } else {
        res.status(400)
        res.json({ message: "Id is missing" })
      }
    } catch (error) {
      res.statusCode = 500;
      res.json({ msg: `Error upVoting coffee store ${error}` });
    }

  } else {
    res.statusCode = 404;
    res.json({ msg: 'Method not allowed' });
  }
}

export default upVoteCoffeeStoreById;