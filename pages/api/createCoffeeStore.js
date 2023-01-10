const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const table = base('coffee-stores');

console.log({ table })

const createCoffeeStore = async (req, res) => {
  if (req.method == 'POST') {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;
    if (id) {
      
      try {
        const findCoffeeStoreRecord = await table.select({
          filterByFormula: `id = ${id}`
        })
          .firstPage();
  
        console.log({ id })
  
        if (findCoffeeStoreRecord.length !== 0) {
          const records = findCoffeeStoreRecord.map(record => {
            return {
              ...record.fields
            }
          })
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
            const records = createRecords.map(record => {
              return {
                ...record.fields
              }
            })
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