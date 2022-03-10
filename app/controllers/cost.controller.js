const db = require("../models");
const Cost = db.cost;
const User = db.user;

exports.createCost = async (req, res) => {
    const cost = await Cost.create({
        date: Date.now(),
        title: req.body.title,
        detail: req.body.detail,
        amount: req.body.amount,
        field: req.body.field,
        user: req.userID,
    });

    await cost.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    const user = await User.findById(req.userID).catch(err => {
        return res.status(500).send({ message: err });
    });

    user.costs.push(cost);
    await user.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(201).send("Cost created.");
}

exports.updateCost = async (req, res) => {
    let bodyData = {...req.body};
    delete bodyData._id;
    delete bodyData.__v;

    Cost.findByIdAndUpdate(req.body._id, bodyData, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Cost updated.");
        }
    });
}

exports.deleteCost = async (req, res) => {
    Cost.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Cost deleted.");
        }
    });
}

exports.getCostsByUser = async (req, res) => {
    const user = await User.findById(req.userID).populate("costs").catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(200).send(user.costs);
}