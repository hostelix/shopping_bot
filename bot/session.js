const { promisify } = require("util");

const SessionManager = client => {
  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);

  return {
    get: key => getAsync(key).then(data => JSON.parse(data)),
    set: (key, data) => setAsync(key, JSON.stringify(data)),
    update: (key, data) =>
      getAsync(key)
        .then(res => JSON.parse(res))
        .then(res => setAsync(key, JSON.stringify({ ...res, data })))
  };
};

module.exports = SessionManager;
