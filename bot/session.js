const { promisify } = require("util");

const SessionManager = client => {
  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);

  return {
    get: key => getAsync(key),
    set: (key, data) => setAsync(key, JSON.stringify(data))
  };
};

module.exports = SessionManager;