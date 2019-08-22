const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(request, response) {
    const { filtered } = request.query;
    const { user } = request.headers;
    const loggedDev = await Dev.findById(user);

    if (filtered && !user) {
      return response
        .status(400)
        .json({ message: "An user id is necessary to filter" });
    } else if (filtered && user) {
      const filteredUsers = await Dev.find({
        $and: [
          { _id: { $ne: user } },
          { _id: { $nin: loggedDev.likes } },
          { _id: { $nin: loggedDev.dislikes } }
        ]
      });

      return response.json(filteredUsers);
    }

    const devsInfos = await Dev.find();

    if (!devsInfos) {
      return response.json({ message: "There isn't any dev stored" });
    }

    return response.json(devsInfos);
  },

  async show(request, response) {
    const { devId } = request.params;
    const devInfos = await Dev.findById(devId);

    if (!devInfos) {
      return response.json({ message: "Developer doesn't exist" });
    }

    return response.json(devInfos);
  },

  async store(request, response) {

    console.log('requesting: ', request.body)

    const { username } = request.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists) {
      return response.json(userExists);
    }

    const githubUser = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url: avatar } = githubUser.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return response.json(dev);
  }
};
