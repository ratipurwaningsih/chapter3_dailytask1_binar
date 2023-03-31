// live coding dan daily task
// import atau panggil package yang kita mau pake di aplikasi kita
const express = require('express');
const fs = require("fs");

const app = express();
const PORT = 3000;

// untuk ngebaca si json
app.use(express.json ());

// proses baca file json nya dengan FS module, dan json nya dibantu dibaca dengan JSON.parse
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))


// url utama  dari aplikasi
// req = request
// res = response
app.get('/', (req, res) => {
    res.send('Hello FSW 3 yang luar biasa dari server nih !');
})

app.post('/', (req, res) => {
    res.send('Kita bisa ngelakuin Post di url ini');
})

app.get('/person', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            person: persons
        }
    });
})

// DAILY TASK 1 CHAPTER 3
// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put 
// 3) bikin validasi di create/edit API utk request body

// get person by id (data satuan)
// :id url parameter
// UNTUK NGAMBIL/NGELIHAT DATA 
app.get('/person/:id', (req, res) => {
    // console.log(req)
    // console.log(req.params);

    const id = req.params.id * 1;
    const person = persons.find(el => el.id === id);
    
    // jika person/:id yang diminta tidak ada di person.json maka akan menampilkan validasi sbg berikut:
    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `person dengan id ${id} tersebut invalid/tidak tersedia`
        })
    } else {
        res.status(200).json({
            status: 'success',
            data: {
                person
            }
        });
    }
})

// HTTP Method PUT = edit existing dataa
// app.put('/person/:id', (req, res) => {
//     const id = req.params.id * 1;
//     const person = persons.find(el => el.id === id);

//     res.status(200).json({
//         status: 'success',
//         message: `data dari id ${id} nya berhasil berubah`
//     });
// })

// HTTP Method DELETE = delete existing data
// UNTUK MENGHAPUS DATA
app.delete('/person/:id', (req, res) => {
    const id = req.params.id * 1;

    const index = persons.findIndex(element => element.id === id);
    const person = persons.find(el => el.id === id);

// Jika person/:id yang diminta tidak ada di person.json maka akan menampilkan validasi sbg berikut dengan status failed
    if (!person) {
        res.status(400).json({
            status: 'failed',
            message: `person dengan id ${id} tersebut invalid/tidak ada`
        })
    }
    if (index !== -1) {
        persons.splice(index, 1);
    }

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: 'success',
                message: `data dari id ${id} nya berhasil dihapus`
            });
        }
    )
})

// UNTUK MEMBUAT DATA BARU
app.post('/person', (req, res) => {

    // console.log(persons.length - 1)
    const newId = persons.length - 1 + 10;
    const newPerson = Object.assign({ id: newId }, req.body)

    // validasi kalau name nya udah ada, maka tidak bisa create data baru
    const personName = persons.find(el => el.name === req.body.name);
    // console.log(personName)
    const lengthName = req.body.name.length < 3
    const cukupUmur = req.body.age < 20

    // validasi jika panjang huruf kurang dari 3 karakter, maka tidak bisa membuat data baru
    if (lengthName) {
        res.status(400).json({
            status: 'failed',
            message: `panjang huruf ${req.body.name} kurang dari 3 karakter`
        })
    }
    // validasi jika nama sudah ada, maka akan berstatus failed dan tidak bisa membuat data baru
    else if (personName) {
        res.status(400).json({
            status: 'failed',
            message: `name ${req.body.name} already exist`
        })
    } 
    // validasi jika belum cukup umur, maka akan berstatus failed dan tidak membuat data baru
    else if (cukupUmur) {
        res.status(400).json({
            status: 'failed',
            message: `name ${req.body.name} belum cukup umur`
        })
    } else {
        persons.push(newPerson);
        fs.writeFile(
            `${__dirname}/person.json`,
            JSON.stringify(persons),
            errr => {
                res.status(201).json({
                    status: 'success',
                    data: {
                        person: newPerson
                    }
                })
            }
        )
    }
})


// UNTUK MENGEDIT DATA
app.put('/person/:id', (req, res) => {
    const id = req.params.id * 1;
    const personIndex = persons.findIndex(el => el.id === id);
    const cukupUmur = req.body.age < 20

    if (personIndex !== -1) {
      persons[personIndex] = { ...persons[personIndex], ...req.body };
      fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            // validasi jika umur belum cukup maka akan menampilkan status failed, dan tidak dapat mengedit data
            if (cukupUmur) {
                res.status(400).json({
                    status: 'failed',
                    message: `umur ${req.body.age} belum cukup`
                })
            } 
            // validasi jika data berhasil diubah, maka akan menunjukkan status success dan data berhasil di ubah
            else {
                res.status(200).json({
                    status: 'success',
                    message: `data dari id ${id} nya berhasil diubah`,
                    data: persons[personIndex]
                })
            }
        })
    } 
    // validasi jika person/:id nya tidak ditemukan maka akan menunjukkan status failed, dan tidak bisa mengubah data
    else {
      res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${id} tidak ditemukan`
      });
    }
  });

// memulai server nya
app.listen(PORT, () => {
    console.log(`App running on localhost: ${PORT}`)
})