const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
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

module.exports = app;