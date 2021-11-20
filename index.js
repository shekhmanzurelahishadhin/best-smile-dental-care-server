const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
    try {
      await client.connect();
      const database = client.db("best-smile-dental-care");
      const serviceCollection = database.collection("services");
      
      const appointmentCollection = database.collection("appointment");

      console.log('db connected successfully');

      // get all api data 
      app.get('/services',async(req,res)=>{
        console.log('post hitted');
        const cursor = serviceCollection.find({});
        const services =await cursor.toArray();
        res.send(services)
      });
      // get single service 
      app.get('/details/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.json(result);
      })
      // insert appointment 
      app.post('/appointment',async(req,res)=>{
        const appointment = req.body;
        const result = await appointmentCollection.insertOne(appointment);
        res.json(result);
      })

      // get appointment by email 
      app.post('/appointment/manage', async(req,res)=>{
        email = req.body.email;
        
        // console.log(typeof email)
        const query = {email:email}
        // console.log(query);
        const appointments = await appointmentCollection.find(query).toArray();
        // console.log(appointments);
        res.json(appointments)
      })

      // delete appointment 
      app.delete('/appointment/delete/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        console.log(query);
        const result = await appointmentCollection.deleteOne(query);
        res.json(result);

      })
       // get single appointment  
       app.get('/appointment/details/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await appointmentCollection.findOne(query);
        res.json(result);
      })
      // update appointment //
      app.put('/appointment/update/:id',async(req,res)=>{
        console.log('update hitted');
        const id = req.params.id;
        console.log(id);
        const updatedAppointment = req.body;
  
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            firstName: updatedAppointment.firstName,
            lastName: updatedAppointment.lastName,
            email: updatedAppointment.email,
            Number: updatedAppointment.Number,
            serviceId: updatedAppointment.serviceId,
            serviceTitle: updatedAppointment.serviceTitle,
            country: updatedAppointment.country,
            gender: updatedAppointment.gender,
            city: updatedAppointment.city,
            zip: updatedAppointment.zip,
            day: updatedAppointment.day,
            time: updatedAppointment.time,
          },
        };
        const result = await appointmentCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("best smile server is running");
  });
  app.listen(port, () => {
    console.log("best smile running on port number:", port);
  });
  