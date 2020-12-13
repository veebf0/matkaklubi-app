const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const matk1 = {
  nimi: 'Rattamatk Tapal',
  kirjeldus: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis expedita quisquam tenetur assumenda ullam ipsa, ut perspiciatis eveniet libero hic vero reprehenderit amet aperiam harum, delectus vel quibusdam consequatur esse!',
  piltUrl: '/matkaklubi/pildid/rattamatk2.jpg',
  registreeruUrl: '/registreeru?matk=1',
  registreerunud: []
}

const matk2 = {
  nimi: 'Kepikõnnimatk Tartus',
  kirjeldus: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit, earum quibusdam? Esse, dolore quaerat ipsam dolor animi cumque temporibus perferendis in vitae corrupti nesciunt voluptatibus voluptatem mollitia alias nihil magnam.',
  piltUrl: '/matkaklubi/pildid/matk_tartus1.jpg',
  registreeruUrl: '/registreeru?matk=2',
  registreerunud: []
}

const matk3 = {
  nimi: 'Kepikõnnimatk Tartus',
  kirjeldus: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit, earum quibusdam? Esse, dolore quaerat ipsam dolor animi cumque temporibus perferendis in vitae corrupti nesciunt voluptatibus voluptatem mollitia alias nihil magnam.',
  piltUrl: '/matkaklubi/pildid/matk_tartus1.jpg',
  registreeruUrl: '/registreeru?matk=2',
  registreerunud: []
}

const matkad = [matk1, matk2, matk3];

function registreeri(req, res) {
  const nimi = req.query.nimi;
  const matkIndex = req.query.matkIndex;
  const email = req.query.email;
  console.log(`Käivtati registreerumine. Registreerus ${nimi} matkale ${matkIndex} ja kelle email on ${email}`);
  const matkaAndmed = { index: matkIndex, nimi: nimi, email: email };
  //TODO: Lisa matkaAndmed registreerumiste info juurde
  // ...
  matkad[matkIndex-1].registreerunud.push(matkaAndmed)
  console.log(matkad[matkIndex-1])

  res.send({ 
    success: true,
    teade : `Käivtati registreerumine. Registreerus ${nimi} matkale ${matkIndex} ja kelle email on ${email}` 
  });
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/matkaklubi'))
  .get('/registreeru', (req, res) => res.render('pages/registreerumine', {matk : req.query.matk, andmed: matkad[req.query.matk-1] }))  
  .get('/admin', (req, res) => res.render('pages/admin', {andmed: matkad[req.query.matk-1] }))  
  .get('/kontakt', (req, res) => res.render('pages/kontakt'))
  .get('/kinnita', registreeri)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
