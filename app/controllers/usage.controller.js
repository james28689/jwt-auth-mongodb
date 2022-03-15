const db = require("../models");
const Usage = db.usage;
const User = db.user;

exports.createUsage = async (req, res) => {
    const usage = await Usage.create({
        date: Date.now(),
        amount: req.body.amount,
        stock: req.body.stock,
        field: req.body.field,
        user: req.userID
    });

    await usage.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    const user = await User.findById(req.userID).catch(err => {
        return res.status(500).send({ message: err });
    })
    user.usages.push(usage);
    await user.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(201).send("Usage created.");
}

exports.updateUsage = async (req, res) => {
    let bodyData = {...req.body};
    delete bodyData._id;
    delete bodyData.__v;

    Usage.findByIdAndUpdate(req.body._id, bodyData, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Stock updated.");
        }
    });
}

exports.deleteUsage = async (req, res) => {
    Usage.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Sale deleted.");
        }
    });
}

exports.getUsagesByUser = async (req, res) => {
    const user = await User.findById(req.userID).populate("usages").catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(200).send(user.usages);
}

exports.deleteAllUsagesByUser = async (req, res) => {
    Usage.deleteMany({user: req.userID}).catch(err => {
        return res.status(500).send({message: err});
    });

    return res.status(201).send("Usages deleted.");
}