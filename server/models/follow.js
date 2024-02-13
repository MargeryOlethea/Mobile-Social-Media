const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoDB");

const getCollection = () => {
  const db = getDatabase();
  const followCollection = db.collection("follows");
  return followCollection;
};

// CREATE NEW FOLLOW
const addFollow = async (followingId, followerId) => {
  const newFollow = await getCollection().insertOne({
    followerId: new ObjectId(followerId),
    followingId: new ObjectId(followingId),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const follow = await getCollection().findOne({
    _id: new ObjectId(newFollow.insertedId),
  });

  return follow;
};

module.exports = { addFollow };
