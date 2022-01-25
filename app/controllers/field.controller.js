const db = require("../models");
const Field = db.field;
const User = db.user;

exports.addField = async (req, res) => {
    const field = await Field.create({
        name: req.body.name,
        user: req.body.userID,
        rpa_field_id: req.body.rpa_field_id,
        geometry: req.body.geometry
    });
    await field.save().catch((err) => {
        res.status(500).send({ message: err });
        return;
    });

    const user = await User.findById(req.body.userID).catch((err) => {
        return res.status(500).send({ message: err })
    })
    user.fields.push(field);
    await user.save().catch((err) => {
        res.status(500).send({ message: err });
        return;
    });

    return res.status(201).send("Field created.")
}

exports.getFieldByUser = async (req, res) => {
    const user = await User.findById(req.body.userID).populate("fields").catch((err) => {
        res.status(500).send({ message: err });
        return;
    })

    res.status(200).send(user.fields);
}