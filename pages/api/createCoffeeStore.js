import { table, getMinifiedRecords, findRecordByFilter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method == 'POST') {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;
    if (id) {
      try {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.statusCode = 200
          res.json(records)
        } else {
          if (id && name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl
                }
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records)
            res.status(200)
          } else {
            res.status(400)
            res.json({ message: "Name is missing" })
          }
        }
      } catch (error) {
        console.error('Error creating or finding record', error);
        res.status(500);
        res.json({ message: "Error creating or finding record", error });
      }
    } else {
      res.status(400)
      res.json({ message: "Id is missing" })
    }
  }
}

export default createCoffeeStore;