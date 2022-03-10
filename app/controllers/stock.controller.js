const db = require("../models");
const Stock = db.stock;
const User = db.user;

exports.createStock = async (req, res) => {
    const stock = await Stock.create({
        name: req.body.name,
        type: req.body.type,
        units: req.body.units,
        amount: req.body.amount,
        used: req.body.used,
        orders: [],
        user: req.userID
    });

    await stock.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    const user = await User.findById(req.userID).catch(err => {
        return res.status(500).send({ message: err });
    });

    user.stocks.push(stock);
    await user.save().catch(err => {
        return res.status(500).send({ message: err });
    });

    return res.status(201).send("Stock created.")
}

exports.createOrder = async (req, res) => {
    const order = {
        date: Date.now(),
        amount: req.body.amount,
        pricePerUnit: req.body.pricePerUnit
    }

    const stock = await Stock.findById(req.body.stockID).catch(err => {
        return res.status(500).send({ message: err });
    });

    stock.orders.push(order);
    await stock.save().catch(err => {
        return res.status(500).send({ message: err });
    })

    return res.status(201).send("Order created.");
}

exports.updateStock = async (req, res) => {
    let bodyData = {...req.body};
    delete bodyData._id;
    delete bodyData.__v;

    Stock.findByIdAndUpdate(req.body._id, bodyData, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Stock updated.");
        }
    });
}

exports.deleteStock = async (req, res) => {
    Stock.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: err });
        } else {
            return res.status(201).send("Stock deleted.");
        }
    })
}

exports.getStockByUser = async (req, res) => {
    const user = await User.findById(req.userID).populate("stocks").catch(err => {
        return res.status(500).send({ message: err });
    })

    return res.status(200).send(user.stocks);
}