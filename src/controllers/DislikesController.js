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

    if (!loggedDev.likes.includes(targetDev._id)) {
      loggedDev.dislikes.push(targetDev._id);
    } else {
      return response
        .status(400)
        .json({ error: "This dislike was already been taken" });
    }

    await loggedDev.save();

    return response.json(loggedDev);
  }
};
