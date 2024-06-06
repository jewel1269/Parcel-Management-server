const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://juyelhabib272732:rz3E3tP7oDEykPMv@cluster0.gwpu1ni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client
      .db('parcelSystemManagement')
      .collection('users');
    const featuresCollection = client
      .db('parcelSystemManagement')
      .collection('features');
    const bookingCollection = client
      .db('parcelSystemManagement')
      .collection('bookings');
    const assignBookCollection = client
      .db('parcelSystemManagement')
      .collection('assignBook');

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const exitingUser = await userCollection.findOne(query);
      if (exitingUser) {
        return res.send({ message: 'user already exits', inssertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post('/bookings', async (req, res) => {
      const item = req.body;
      const result = await bookingCollection.insertOne(item);
      res.send(result);
    });

    app.get('/bookings', async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    });

    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });

    app.patch('/updateBooking/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const item = req.body;
        console.log(item); // Corrected the variable name here

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid ID format' });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            phoneNumber: item.phoneNumber,
            parcelType: item.parcelType,
            parcelWeight: item.parcelWeight,
            receiverName: item.receiverName,
            receiverPhoneNumber: item.receiverPhoneNumber,
            deliveryAddress: item.deliveryAddress,
            deliveryDate: item.deliveryDate,
            latitude: item.latitude,
            longitude: item.longitude,
          },
        };

        const result = await bookingCollection.updateOne(filter, updatedDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        res.send({ message: 'Booking updated successfully', result });
      } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.patch('/updateDeliver/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const status = req.body.status;
        const deliveryManEmail = req.body.deliveryManEmail;
        console.log(deliveryManEmail, status);

        const filter = { email: email };
        const update = {
          $set: {
            status: status,
            deliveryManEmail: deliveryManEmail,
          },
        };

        const result = await bookingCollection.updateOne(filter, update, {
          upsert: true,
        });

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        res.send({ message: 'Booking updated successfully', result });
      } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.patch('/updateDeliverBooking/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const item = req.body;
        console.log(item.status, id);

        const filter = { _id: new ObjectId(id) }; // Filter by email
        const updatedDoc = {
          $set: {
            status: item.status,
          },
        };
        const result = await bookingCollection.updateOne(filter, updatedDoc);
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        res.send({ message: 'Booking updated successfully', result });
      } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.patch('/updateStatus/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const item = req.body;

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid ID format' });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            status: item.status,
          },
        };
        const result = await bookingCollection.updateOne(filter, updatedDoc);
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        res.send({ message: 'Booking updated successfully', result });
      } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.patch('/updateRole/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const item = req.body;
        console.log(item);

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid ID format' });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: item.role,
          },
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: 'Booking not found' });
        }

        res.send({ message: 'Booking updated successfully', result });
      } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.get('/Spacificbookings', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/usersInfo', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.get('/features', async (req, res) => {
      const result = await featuresCollection.find().toArray();
      res.send(result);
    });

    // Delivary man

    app.get('/Delivar', async (req, res) => {
      try {
        const role = req.query.role;
        console.log(role);
        const query = { role: role };
        const result = await userCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching delivery men:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.post('/assignBook', async (req, res) => {
      try {
        const item = req.body;
        console.log(item);
        item.bokingId = item._id;
        delete item._id;

        const result = await assignBookCollection.insertOne(item);
        res.status(201).send(result); // Send a 201 status code for successful creation
      } catch (error) {
        console.error('Error inserting item:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    app.get('/assignBook', async (req, res) => {
      const result = await assignBookCollection.find().toArray();
      res.send(result);
    });

    app.get('/assignBook', async (req, res) => {
      const email = req.query.email;
      const query = { 'assignedDeliveryman.email': email };
      const result = await assignBookCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
