let pizzasCollection;
exports.registerMongoClient = (_client) => {
    pizzasCollection = _client.db('pizaa-app').collection('pizzas');
};

exports.getAll = async (req, res) => {
   
    try {

        let { search, tags, page } = req.query;
        const pageSize = 2;
        let filterQuery = {};

        if(tags && tags.length){
            tags = JSON.parse(tags);
        }

        if (search && search.length){
            filterQuery = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    {ingredients: {$regex: search, $options: 'i'}},
                ],
                // tags: { $elemMatch: {$in: tags}}
            }
            // filterQuery.name = {$regex: search, $options: 'i'};
        }
        if (tags && tags.length){
            filterQuery.tags =     {$all: tags}
            
        }
        if (page) {
            page = parseInt(page);
        }
        console.log('filterQuery', filterQuery);
        const pizzas = await pizzasCollection
        .find(filterQuery)
        .skip((page - 1)* pageSize)
        .limit(pageSize)
        .toArray();
        return res.json(pizzas);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
    }
};

exports.getOne = async (req, res) => {
    const id = req.params.id;
    try {
        const pizza = await pizzasCollection.findOne({_id: id});
        res.json(pizza);
    } catch (e) {
        console.error(e);
    }
};

exports.insertOne = async (req, res) => {
    const pizza = req.body;
    try {
        await pizzasCollection.insertOne(pizza);
        res.send({message: 'Success on writing pizza', data: JSON.stringify(pizza)});
    } catch (e) {
        console.error(e);
        if (e.code === 11000) {
            res.send({message: 'Pizza with that ID already exists'});
        }
        res.sendStatus(400);
    }
};

exports.deleteOne = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pizzasCollection.deleteOne({_id: id});
        res.json(result);
    } catch (e) {
        console.error(e);
    }
};

exports.updateOne = async (req, res) => {
    const id = req.params.id;
    const newPizza = req.body;
    try {
        const result = await pizzasCollection.findOneAndUpdate({_id: id}, {$set: newPizza});
        res.json(result);
    } catch (e) {
        console.error(e);
    }
};


