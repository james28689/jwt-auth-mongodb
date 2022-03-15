const db = require("../models");
const Sale = db.sale;
const User = db.user;

exports.createSale = async (req, res) => {
    const sale = await Sale.create({
        crop: req.body.crop,
        amount: req.body.amount,
        price: req.body.price,
        date: Date.now(),
        field: req.body.field,
        user: req.userID
    });

    await sale.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    const user = await User.findById(req.userID).catch(err => {
        return res.status(500).send({ message: err });
    });

    user.sales.push(sale);
    await user.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(201).send("Sale created.");
}

exports.updateSale = async (req, res) => {
    let bodyData = {...req.body};
    delete bodyData._id;
    delete bodyData.__v;

    Sale.findByIdAndUpdate(req.body._id, bodyData, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Stock updated.");
        }
    });
}

exports.deleteSale = async (req, res) => {
    Sale.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Sale deleted.");
        }
    });
}

exports.getSalesByUser = async (req, res) => {
    const user = await User.findById(req.userID).populate("sales").catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(200).send(user.sales);
}

exports.deleteAllSalesByUser = async (req, res) => {
    Sale.deleteMany({user: req.userID}).catch(err => {
        return res.status(500).send({message: err});
    });

    return res.status(201).send("Sales deleted.");
}