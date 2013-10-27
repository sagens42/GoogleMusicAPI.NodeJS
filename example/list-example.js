var http = require("http");
var GoogleMusic = require('../').GoogleMusicApi;
var googlemusic = new GoogleMusic('user@gmail.com', 'password');
googlemusic.Login(function () {
	googlemusic.GetAllSongs('', function(result) {
		var length = result.length;
		var i;
		for (i=0;i<length; i++) {
			console.log(result[i].title);
		}
	}); 
});
