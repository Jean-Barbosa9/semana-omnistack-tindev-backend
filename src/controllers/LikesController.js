const Dev = require("../models/Dev");

module.exports = {
  async store(request, response) {
    const { user } = request.headers;
    const { devId } = request.params;
    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);
    const { io, connectedUsers } = request;

    if (!targetDev) {
      return response
        .status(400)
        .json({ error: `Developer with id ${devId}, doesn't exist` });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = connectedUsers[user];
      const targetSocket = connectedUsers[devId];

      if (loggedSocket) {
        io.to(loggedSocket).emit("match", targetDev);
      }

      if (targetSocket) {
        io.to(targetSocket).emit("match", loggedDev);
      }
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
