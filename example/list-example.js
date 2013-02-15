var http = require("http");
var GoogleMusic = require('../GoogleMusic').GoogleMusic;
http.createServer(onRequest).listen(8888);
function onRequest(request, response) {
	var googlemusic = new GoogleMusic('user@gmail.com', 'password', 'sj');
	googlemusic.Login(function(authId) { 
		googlemusic.GetCookies(function() {
			googlemusic.GetAllSongs('', function(result, response) {
				console.log(JSON.stringify(result));
			}); 
		});
	});
}