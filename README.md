GoogleMusicAPI.NodeJS an unofficial API for Google Play Music
=====================
GOOGLE MUSIC API

allows control of
`Google Music <http://music.google.com>` with NodeJS.

**Requires:** 
- GoogleClientLogin (use file in project, original module does not have needed feature)
- restler

```javascript
	var googlemusic = new GoogleMusic('user@gmail.com', 'password');
	googlemusic.Login(function () {
		googlemusic.GetAllSongs('', function(result) {
			var length = result.length;
			var i;
			for (i=0 ; i<length ; i++) {
				console.log(result[i].title); // get title of all songs
			}
		});
		googlemusic.GetPlaylist('All', function(result) {
			var length = result.length;
			var i;
			for (i=0 ; i<length ; i++) {
				console.log(result[i].playListId); // get id of all playlists
			}
		});
	});
```