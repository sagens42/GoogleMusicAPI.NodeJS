var GoogleMusicApi = require('../index.js').GoogleMusicApi;

var gMusic = new GoogleMusicApi('email', 'password');
gMusic.Login(function() {
    gMusic.GetAllSongs('', function(result) {
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].title);
        }
    });
});