import pollManager from "../models/PollManager.js";

export const getPollHistory = (req, res) => {
  const history = pollManager.getHistory();
  res.json(history);
};