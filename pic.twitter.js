Titanium.include('oauth.js');
//Titanium.include('iso8601.js');
//Titanium.include('sha1.js');

// upload picture to pic.twitter /w xAuth

function getTokens_sendTweet(){

    var un = usernameVal;
    var pw = passwordVal;
    var oauth_consumer_secret = 'xxxxxxxx';
    var oauth_consumer_key    = 'xxxxxxxx';

    var requestUrl = 'https://api.twitter.com/oauth/access_token';
    var ck  = oauth_consumer_key;
    var cks = oauth_consumer_secret;
    var accessor = {consumerSecret: cks};
    var message = {
            method: 'POST',
            action: requestUrl,
            parameters: [
                ['oauth_signature_method', 'HMAC-SHA1'],
                ['oauth_consumer_key', ck],
                ['oauth_version', '1.0'],
                ['x_auth_username', un],
                ['x_auth_password', pw],   
                ['x_auth_mode', 'client_auth'],
                ['format', 'json']
            ]
        };

    OAuth.setTimestampAndNonce(message);
    OAuth.setParameter(message, 'oauth_timestamp', OAuth.timestamp());
    OAuth.SignatureMethod.sign(message, accessor);
    finalUrl = OAuth.addToURL(message.action, message.parameters);	

    var xhr = Titanium.Network.createHTTPClient();

    xhr.onerror = function(e)
    {
        Ti.API.info("ERROR " + e.error);
    };
    
    xhr.onload = function()
    {
        var uri = this.responseText;
        var queryString = {};
 		Ti.API.info(uri);

        uri.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function($0, $1, $2, $3) { queryString[$1] = $3; }
        );

        ftoken  = queryString['oauth_token'];
        fstoken = queryString['oauth_token_secret'];

        //sendTweet();

    };

    xhr.open('POST', finalUrl);
    xhr.send();
}

function sendTweet(){

    var oauth_consumer_secret = 'xxxxx';
    var oauth_consumer_key    = 'xxx';

    var requestUrl = 'https://upload.twitter.com/1/statuses/update_with_media.json';
    var accessor = {tokenSecret: fstoken,consumerSecret: oauth_consumer_secret};
    var message = {
            method: "POST",
            action: requestUrl,
            parameters: [
                ['oauth_signature_method', 'HMAC-SHA1'],
                ['oauth_consumer_key', oauth_consumer_key],
                ['oauth_version', '1.0'],
                ['oauth_token', ftoken]
            ]
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
    OAuth.SignatureMethod.sign(message, accessor);
    var postingUrl = OAuth.addToURL(message.action, message.parameters);
 
    var xhr = Titanium.Network.createHTTPClient();
    xhr.setTimeout(30000);

	xhr.onerror = function(e)
	{
        Ti.API.info("ERROR " + e.error);
	};

    xhr.onload = function(){
        var reply = this.responseText;
		var json = JSON.parse(this.responseText);
		var image_url = json.entities.media;

		Ti.API.info(image_url[0].media_url); 
		Ti.API.info(image_url[0].media_url_https);
        Titanium.Media.beep();
    };

	xhr.onsendstream = function(e) {
	};

 	xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.open('POST', postingUrl);

    //picture
    var sendImage = Titanium.UI.createImageView({
            image:SendImage,
            width :128,
            height:128
    });
    image = sendImage.toImage();

    //status is text
    xhr.send({status:xxxxxxx, media:image});
}
