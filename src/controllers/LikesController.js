const Dev = require("../models/Dev");

module.exports = {
  async store(request, response) {
    const { user } = request.headers;
    const { devId } = request.params;
    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return response
        .status(400)
        .json({ error: `Developer with id ${devId}, doesn't exist` });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      console.log("We have a match");
    }

    if (!loggedDev.likes.includes(targetDev._id)) {
      loggedDev.likes.push(targetDev._id);
    } else {
      return response
        .status(400)
        .json({ error: "This like was already been taken" });
    }

    await loggedDev.save();

    return response.json(loggedDev);
  }
};
