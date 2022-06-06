let tagsCollection;
exports.registerMongoClient = (_client) => {
    tagsCollection = _client.db('pizaa-app').collection('tags');
};

exports.inserOne = async (req,res) => {
    const tag = req.body;
    try {
        await tagsCollection.insertOne(tag);
        res.send({message: 'Success on writing tag', data: JSON.stringify(tag)});
    } catch (e) {
        console.error(e);
        if (e.code === 11000) {
            res.send({message: 'Pizza with that ID already exists'});
        }
        res.sendStatus(400);
    }
}

exports.getAll = async (req, res) => {
    // try {
    //     // const tags = await ordersCollection.find().toArray();
    //     return res.json(orders);
    // } catch (e) {
    //     console.error(e);
    //     res.sendStatus(400);
    // }
};