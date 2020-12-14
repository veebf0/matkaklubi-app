const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const salas6na = 'KalaSuppG0';
const andmebaas = 'veebg0'; // <= Pane X asemel siia enda number
const uri = `mongodb+srv://veebg0:${salas6na}@cluster0.qz3rv.mongodb.net/${andmebaas}?retryWrites=true&w=majority`;

const matk1 = {
  matk: 1,
  nimi: 'Rattamatk Tapal',
  kirjeldus: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis expedita quisquam tenetur assumenda ullam ipsa, ut perspiciatis eveniet libero hic vero reprehenderit amet aperiam harum, delectus vel quibusdam consequatur esse!',
  piltUrl: '/matkaklubi/pildid/rattamatk2.jpg',
  registreeruUrl: '/registreeru?matk=1',
  registreerunud: []
}

const matk2 = {
  matk: 2,
  nimi: 'Kepikõnnimatk Tartus',
  kirjeldus: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit, earum quibusdam? Esse, dolore quaerat ipsam dolor animi cumque temporibus perferendis in vitae corrupti nesciunt voluptatibus voluptatem mollitia alias nihil magnam.',
  piltUrl: '/matkaklubi/pildid/matk_tartus1.jpg',
  registreeruUrl: '/registreeru?matk=2',
  registreerunud: []
}

const matk3 = {
  matk: 3,
  nimi: 'Süstamatk Kõrvemaal',
  kirjeldus: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consectetur sed atque dolore. Molestias numquam deserunt libero. Facere tenetur nobis vero perspiciatis rerum distinctio animi magni, repellat modi saepe maxime beatae!',
  piltUrl: '/matkaklubi/pildid/syst1.jpg',
  registreeruUrl: '/registreeru?matk=3',
  registreerunud: []
}

const matk4 = {
  matk: 4,
  nimi: 'Jalutuskäik õitsevate kirsside keskel Türis',
  kirjeldus: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit numquam temporibus, neque odit dolores quibusdam iusto, aperiam eligendi nobis qui cum aut architecto laboriosam, expedita soluta id quaerat illo officiis.',
  piltUrl: '/matkaklubi/pildid/kirsi6ied_tyril.jpg',
  registreeruUrl: '/registreeru?matk=4',
  registreerunud: []
}

const matk5 = {
  matk: 5,
  nimi: 'Teine jalutuskäik õitsevate kirsside keskel Türis',
  kirjeldus: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit numquam temporibus, neque odit dolores quibusdam iusto, aperiam eligendi nobis qui cum aut architecto laboriosam, expedita soluta id quaerat illo officiis.',
  piltUrl: '/matkaklubi/pildid/kirsi6ied_tyril.jpg',
  registreeruUrl: '/registreeru?matk=5',
  registreerunud: []
}

const matkad = [matk1, matk2, matk3, matk4, matk5];

function registreeri(req, res) {
  const nimi = req.query.nimi;
  const matkIndex = req.query.matkIndex;
  const email = req.query.email;
  const markus = req.query.markus || ''
  console.log(`Käivtati registreerumine. Registreerus ${nimi} matkale ${matkIndex} ja kelle email on ${email}`);
  const matkaAndmed = { index: matkIndex, nimi: nimi, email: email, markus: markus };
  //TODO: Lisa matkaAndmed registreerumiste info juurde
  // ...
  //matkad[matkIndex-1].registreerunud.push(matkaAndmed)
  console.log(matkad[matkIndex-1])

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
   client.connect((err) => {
       if (err) {
           res.send({ error: 'Viga: ' + err.message });
       } else {
           const collection = client.db(andmebaas).collection('matkaklubi_' + andmebaas + '_registreerumised');
           collection.insertOne(matkaAndmed, (err) => {
               client.close();
               if (err) {
                   return res.send({ error: 'Viga andmete lisamisel: ' + err.message });
               }
               res.send({ success: true });
           });
       }
   });
}

function naitaMatkaAdminLehte(req, res) {
  const andmed = matkad[req.query.matk-1]
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((err) => {
      if (err) {
          res.send({ error: 'Viga: ' + err.message });
      } else {
          const collection = client.db(andmebaas).collection('matkaklubi_' + andmebaas + '_registreerumised');
          collection.find({index : andmed.matk.toString()})
          .toArray( (err, registreerumised) => {
              client.close();
              if (!err) {
                  console.log(registreerumised)
                  andmed.registreerunud = registreerumised
              }
  
              res.render('pages/admin', {andmed: andmed})
          });
      }
  });
 }
 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/matkaklubi', {matkad: matkad}))
  .get('/registreeru', (req, res) => res.render('pages/registreerumine', {matk : req.query.matk, andmed: matkad[req.query.matk-1] }))  
  .get('/admin', naitaMatkaAdminLehte)  
  .get('/kontakt', (req, res) => res.render('pages/kontakt'))
  .get('/kinnita', registreeri)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
