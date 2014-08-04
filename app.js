(function() {
var Crypt = require('sjcl.js');
var b64 = require('base64.js');
var md5 = require('md5.js');
  return {
  requests: {

  },

  events: {
      'app.activated':'init'
    },

    init: function() {
      var d = new Date();
      var payload = {
        "jti": md5.MD5("poop").toString(),
        "iat": d.getTime(),
        "name": "Dan",
        "email": "dpawluk@zendesk.com"

      };
      var secret = 'the secret';

      var payload = this.JWTEncode(secret,payload);
      console.log(payload);
      var url = this.JWTURLCreate('subdomain',payload,'https://subdomain.zendesk.com/agent')
      console.log(url);
    },


  JWTEncode: function(key,payload) {
      var segments = [];
      var header = { typ: 'JWT', alg: 'HS256'};

      var key = Crypt.codec.utf8String.toBits(key);
      var hmac = new Crypt.misc.hmac(key);

      segments.push(this.base64urlEncode(JSON.stringify(header)));
      segments.push(this.base64urlEncode(JSON.stringify(payload)));
      segments.push(this.base64urlEncode(b64.decode(Crypt.codec.base64.fromBits(hmac.encrypt(segments.join('.'))))));

      return(segments.join('.'));
  },

  JWTURLCreate: function(subdomain, payload, redirect) {
    return helpers.fmt("https://%@.zendesk.com/access/jwt?jwt=%@&return_to=%@", subdomain, payload, redirect)
  },

  base64urlEncode: function (arg) {
    var s = b64.encode(arg); // Standard base64 encoder
    s = s.split('=')[0]; // Remove any trailing '='s
    s = s.replace(/\+/g, '-'); // 62nd char of encoding
    s = s.replace(/\//g, '_'); // 63rd char of encoding
    // TODO optimize this; we can do much better
    return s;
  }

};
}());
