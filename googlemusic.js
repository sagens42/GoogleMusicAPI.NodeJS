exports.GoogleMusic = GoogleMusic;

var GoogleClientLogin = require('./GoogleClientLogin').GoogleClientLogin;
var restler = require('restler');

function GoogleMusic(email, password, service) {
	this.googleAuth = new GoogleClientLogin({
	  email: email,
	  password: password,
	  service: service,
	  accountType: GoogleClientLogin.accountTypes.google
	});
}

GoogleMusic.prototype.Login = function(onSuccess, onFailure, onCaptchaRequest) {
	var self = this;
	self.googleAuth.on(GoogleClientLogin.events.login, function(){
	  onSuccess(self.googleAuth.getAuthId());
	});
	self.googleAuth.on(GoogleClientLogin.events.error, function(e) {
		switch(e.message) {
		  case GoogleClientLogin.errors.loginFailed:
			if (this.isCaptchaRequired()) {
			  onCaptchaRequest(this.getCaptchaUrl(), this.getCaptchaToken());
			} else {
				if (typeof onFailure !== "undefined") {
					onFailure();
				}
				self.Login(onSuccess, onFailure, onCaptchaRequest);
			}
			break;
		  case GoogleClientLogin.errors.tokenMissing:
		  case GoogleClientLogin.errors.captchaMissing:
			throw new Error('You must pass the both captcha token and the captcha')
			break;
		}
		throw new Error('Unknown error');
	});
	self.googleAuth.login();
}

GoogleMusic.prototype.GetCookies = function(callback) {
	var self = this;
	self.sendRequest('get','https://play.google.com/music/listen?u=0', null, null, function(result, response) {
		self.cookies = {};
		response.headers['set-cookie'] && response.headers['set-cookie'].forEach(function(cookie) {
			var parts = cookie.split('=');
			self.cookies[parts[0].trim()] = (parts[1]||'').trim();
		});
		callback();
	});
}

GoogleMusic.prototype.GetAllSongs = function(continuationToken, callback) {
	var option = {};
	option.continuationToken = continuationToken;
	return this.sendRequest('post','https://play.google.com/music/services/loadalltracks?u=0&xt=' + this.cookies['xt'], option, null, callback);
}


GoogleMusic.prototype.sendRequest = function(type, url, option, body, callback) {
  var self = this;
  if((callback === null || callback === undefined) && body !== null) {
	callback = body;
	body = null;
  }

  if((callback === null || callback === undefined) && option !== null) {
	callback = option;
	option = null;
  }

  if(body && typeof body == 'object'){
	body = JSON.stringify(body)
  }
  
  if (self.googleAuth.getAuthId() === undefined)
  {
  	throw 'Try to login first';
  }
  
  callback = callback || function(){};
  option = option || {};
  
  var restRequest = null;
  var requestOption = { query:option, parser:restler.parsers.json };
  requestOption.headers = {};
  requestOption.headers['Authorization'] = 'GoogleLogin auth=' + self.googleAuth.getAuthId();
  if(body){
	requestOption.data = body;
	requestOption.headers['content-type'] = 'application/json';
  }
  
  switch(type.toLowerCase()){
	
	case 'del':
	case 'delete':
		restRequest = restler.del(url, requestOption);
	  break;
	  
	case 'put': restRequest = restler.put(url, requestOption);
	  break;
	
	case 'post': restRequest = restler.post(url, requestOption);
	  break;
	
	default : restRequest = restler.get(url, requestOption);
  }
  

  restRequest.on('complete', function(result, response ) {
	if(result instanceof Error || response.statusCode != 200){
	  return callback(result, response);
	}
	
	return callback(result, response);
  })
}