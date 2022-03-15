const db = require("../models");
const Field = db.field;
const User = db.user;

exports.addField = async (req, res) => {
    const field = await Field.create({
        name: req.body.name,
        user: req.userID,
        crop: req.body.crop,
        rpa_field_id: req.body.rpa_field_id,
        geometry: req.body.geometry,
        area_ha: req.body.area_ha
    });

    await field.save().catch((err) => {
        return res.status(500).send({ message: err });
    });

    const user = await User.findById(req.userID).catch((err) => {
        return res.status(500).send({ message: err });
    });
    
    user.fields.push(field);
    await user.save().catch((err) => {
        return res.status(500).send({ message: err });
    });
    
    return res.status(201).send("Field created.");
}

exports.updateField = async (req, res) => {
   let bodyData = {...req.body};
   delete bodyData._id;
   delete bodyData.__v;

   Field.findByIdAndUpdate(req.body._id, bodyData, (err, result) => {
       if (err) {
           return res.status(500).send({ message: err });
       } else {
           return res.status(201).send("Field updated.");
       }
   })
}

exports.getFieldByUser = async (req, res) => {
    const user = await User.findById(req.userID).populate("fields").catch((err) => {
        return res.status(500).send({ message: err });
    })

    res.status(200).send(user.fields);
}

exports.deleteAllFieldsByUser = async (req, res) => {
    Field.deleteMany({user: req.userID}).catch(err => {
        return res.status(500).send({message: err});
    });

    return res.status(201).send("Fields deleted.");
}