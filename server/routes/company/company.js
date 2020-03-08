const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Company = require('../../models/Company');
const {verifyToken, verifyRole} = require('../../middlewares/auth');
const app = express();

app.get('/compania', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let conditions = {
        status: true
    }

    Company.find(conditions, 'name cif status')
        .skip(from)
        .limit(limit)
        .exec((err, campanies) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }
    
        Company.countDocuments(conditions,(err, sumCompanys) => {
            res.json({
                ok: true,
                campanies,
                sumCompanys
            });
        });
    });
});

// Save campany
app.post('/compania', (req, res) => {
    let body = req.body;

    let campany = new Company({
        name: body.name,
        cif: body.cif
    });

    campany.save((err, campanyDB) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            company: campanyDB
        });
    });
});

// Update campany
app.put('/compania/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'cif', 'img', 'status']);

    Company.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, campanyBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        res.json({
            ok: true,
            company: campanyBD
        });
    });
});

// Unabled campany
app.delete('/compania/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    Company.findByIdAndUpdate(id, {status: false}, {new: true}, (err, campanyBD) => {
        if(err){
            return res.status(400).json({
               ok: false,
               err  
            });
        }

        if(!campanyBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Empresa no encontrada'
                } 
             });
        }
        
        res.json({
            ok: true,
            campanyBD
        });
    });
});

module.exports = app;
