const DEFAULT_TIMEOUT = 5000;

exports.command = function(selector, timeout) {
  if (!timeout) {
    timeout = DEFAULT_TIMEOUT;
  }

  this.waitForElementVisible(selector, timeout)
    .click(selector)

  return this; // allows the command to be chained.
};