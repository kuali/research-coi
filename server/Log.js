class Log {
  info(message) {
    let date = new Date().toISOString();
    console.info(`${date} INFO  ${message}`);
  }

  warn(message) {
    let date = new Date().toISOString();
    console.warn(`${date} WARN  ${message}`);
  }

  error(message) {
    let date = new Date().toISOString();
    console.error(`${date} ERROR ${message}`);
  }
}

export default new Log();
