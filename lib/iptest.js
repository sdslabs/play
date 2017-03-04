var json = require('../public/config.json');

module.exports = (function() {
    var testIp = function(ipAddress) {
        var sds = '192.168.208',
            valid = true;
        if (json.env === "developer") {
            return valid;
        }
        if (ipAddress.substr(0, 11) != sds) {
            valid = false;
        }
        return valid;
    };
  return {testIP : testIp};
})();
