const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const RecoveryPassword = require('../../models/RecoveryPassword');
const cors = require('cors');
const app = express();

app.post('/login', cors() ,(req, res) =>{
    
    let body = req.body;

    User.findOne({email: body.email}, (err, user) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err  
            });
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incrorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incrorrectos'
                }
            });
        }

        let token = jwt.sign({
            user
        }, process.env.SEED_AUTH, {expiresIn: process.env.TOKEN_TIME});

        res.json({
            ok: true,
            user,
            token
        });

    });
});

app.post('/recordar-contrasena', cors() ,(req, res) =>{
    
    let body = req.body;

    User.findOne({email: body.email}, (err, user) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err  
            });
        }

        if(!user){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no se encontró'
                }
            });
        }

        // Generar un código para validar el reseteo de la contraseña.
        let recoveryPassword = new RecoveryPassword({
            user: user._id,
            code: Math.random().toString().substr(2, 5),
            company: user.company
        });

        recoveryPassword.save((err, recoveryPasswordDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err  
                });
            }

            res.json({
                ok: true,
                code: recoveryPasswordDB._id
            });
        });
    });
});

app.get('/recordar-contrasena/:id', cors() ,(req, res) =>{
    let id = req.params.id;

    RecoveryPassword.findById(id, (err, recoveryPasswordDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }

        if(!recoveryPasswordDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'La petición a expirado'
                } 
            });
        }

        res.json({
            ok: true,
            id: recoveryPasswordDB._id
        });
    });
});

module.exports = app;