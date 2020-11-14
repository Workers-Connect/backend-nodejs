const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../../models/User');
const RecoveryPassword = require('../../models/RecoveryPassword');
const {verifyToken, verifyRole} = require('../../middlewares/auth');
const cors = require('cors');
const app = express();

app.get('/usuario', cors(), [verifyToken], (req, res) => {

    /*let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 100;
    limit = Number(limit);
    */
    let conditions = {
        status: true
    }

    User.find(conditions, 'name email role company status')
        .populate('company','name')
        //.skip(from)
        //.limit(limit)
        .exec((err, users) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }
    
        User.countDocuments(conditions,(err, sumUsers) => {
            res.json({
                ok: true,
                users,
                sumUsers
            });
        });
    });
});

// Details user
app.get('/usuario/:id', cors(), [verifyToken], (req, res) => {
    let id = req.params.id;

    User.findById(id, (err, userBD) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }

        res.json({
            ok: true,
            usuario: userBD
        });
    });
});

// Save user
app.post('/usuario', cors(), (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        company: body.company
    });

    user.save((err, userDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });
    });
});

// Update user
app.put('/usuario/:id', cors(), [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'password']);

    if (body.password !== '') {
        body = {
            img: body.img,
            name: body.name,
            email: body.email,
            role: body.role,
            password: bcrypt.hashSync(body.password, 10)
        }
    } else {
        body = {
            img: body.img,
            name: body.name,
            email: body.email,
            role: body.role
        }
    }

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, userBD) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }

        res.json({
            ok: true,
            usuario: userBD
        });
    });
});

// Unabled user
app.delete('/usuario/:id', cors(), [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id, {status: false}, {new: true}, (err, userBD) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err  
            });
        }

        if(!userBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                } 
            });
        }
        
        res.json({
            ok: true,
            userBD
        });
    });
});

// Change password user
app.put('/cambiar-clave/:id', cors(), (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['password']);

    RecoveryPassword.findByIdAndDelete(id, (err, recoveryPasswordDB) => {

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

        User.findByIdAndUpdate(recoveryPasswordDB.user, {password: bcrypt.hashSync(body.password, 10)}, {new: true}, (err, userBD) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err  
                });
            }
    
            res.json({
                ok: true,
                usuario: userBD
            });
        });
    });
});

module.exports = app;