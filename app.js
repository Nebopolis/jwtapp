(function() {
var Crypt = require('sjcl.js');
var b64 = require('base64.js');
var md5 = require('md5.js');
  return {
  requests: {

  },

  events: {
      'app.activated':'doSomething'
    },

    doSomething: function() {
      var test = Crypt.encrypt("bah", "somethingtoencrypt", {count:2048, salt:"salt", ks:256});
      var header = { typ: 'JWT', alg: 'HS256'};
      var d = new Date();
      var payload = {
        "jti": md5.MD5("poop").toString(),
        "iat": d.getTime(),
        "name": "Dan",
        "email": "dpawluk@zendesk.com"

      };
      var segments = [];
      var secret = 'somelongsecretforauthingJWT';
      var hash = Crypt.hash.sha256;
      var key = Crypt.codec.utf8String.toBits(secret);
      var hmac = new Crypt.misc.hmac(key, hash);
      var result = hmac.encrypt(payload);
      var end = this.base64urlEncode(b64.decode(Crypt.codec.base64.fromBits(result)));
      segments.push(this.base64urlEncode(JSON.stringify(header)));
      segments.push(this.base64urlEncode(JSON.stringify(payload)));
      console.log(end);
    },

    base64urlEncode: function (arg)
  {
    var s = b64.encode(arg); // Standard base64 encoder
    s = s.split('=')[0]; // Remove any trailing '='s
    s = s.replace(/\+/g, '-'); // 62nd char of encoding
    s = s.replace(/\//g, '_'); // 63rd char of encoding
    // TODO optimize this; we can do much better
    return s;
  }
  };

}());
