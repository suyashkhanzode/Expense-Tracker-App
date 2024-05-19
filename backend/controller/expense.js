const Expense = require('../models/expense');
const User = require('../models/user')
const Sequelize = require('../utils/database')

exports.addExpense = (req,res,next) =>{
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category
    const userId = req.user.id;
    User.findByPk(userId)
    .then((user) =>{
        Expense.create({
            description :description,
            amount : amount,
            category : category,
            userId : userId
        })
        .then((result) =>{
            res.status(201).json({message : result})
        })
        .catch((err) =>{
            res.json({message : err})
        })
    })
    
};

exports.getExpense = (req,res,next) =>{
    
    const userId = req.user.id;
    debugger
    Expense.findAll({
        where :{
            userId : userId
        }
    })
    .then((result) =>{
        res.status(201).json(result)
    })
    .catch((err) =>{
        res.json({message : err})
    })

};

exports.deleteExpense = (req,res,next) =>{
    const id = req.params.id;
    Expense.destroy({
        where :{
            id : id
        }
    })
    .then((result) =>{
        res.status(201).json({message : result})
    })
    .catch((err) =>{
        res.json({message : err})
    })
}

exports.updateExpense = (req,res,next) =>{
    const title = req.body.title;
    const amount = req.body.amount;
    const id = req.params.id;
    Expense.update(
       { title :title,
        amount:amount,
       },
        {
        where :{
            id :id
        }
       }
    )
    .then((result) =>{
        res.status(201).json({message : result})
    })
    .catch((err) =>{
        res.json({message : err})
    })
}

exports.getAllExpensesWithUsers = (req, res, next) => {
    Expense.findAll({
        include: [{
            model: User,
            attributes: ['id', 'name', 'email'] // Adjust the attributes as needed
        }]
    })
    .then(expenses => {
        res.status(200).json(expenses);
    })
    .catch(err => {
        res.status(500).json({
            message: 'An error occurred while fetching expenses',
            error: err
        });
    });
};


exports.getExpensesGroupedByUser = (req, res, next) => {
    Expense.findAll({
        attributes: [
            
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
        ],
        include: [{
            model: User,
            attributes: ['name']
        }],
        group: ['userId', 'user.id'],
        order: [[Sequelize.literal('totalAmount'), 'DESC']]
    })
    .then(expenses => {
        res.status(200).json(expenses);
    })
    .catch(err => {
        res.status(500).json({
            message: 'An error occurred while fetching expenses',
            error: err
        });
    });
};



