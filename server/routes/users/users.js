const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../../models/User');
const {verifyToken, verifyRole} = require('../../middlewares/auth');
const app = express();

app.get('/usuario', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    let conditions = {
        status: true
    }

    User.find(conditions, 'name email role company status')
        .populate('company','name')
        .skip(from)
        .limit(limit)
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

// Save user
app.post('/usuario', (req, res) => {
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
app.put('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userBD) => {
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
app.delete('/usuario/:id', [verifyToken, verifyRole], (req, res) => {
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

module.exports = app;