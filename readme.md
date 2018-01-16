This is a simple example demonstrating how to implement the following in Kinvey:

* Creating an implicit (anonymous) active user
* Signing up and logging in with Kinvey authentication
* Signing up and logging in with Google authentication
* Restricting data access via roles

The code relies upon two custom endpoints in Kinvey:

_addRole_

```javascript
function onRequest(request, response, modules) {
  var context = modules.backendContext,
      utils = modules.utils,
      appKey = context.getAppKey(),
      masterSecret = context.getMasterSecret(),
      userid = request.body.userid,
      roleid = request.body.roleid,
      uri = 'https://baas.kinvey.com/user/kid_rk7NMn57z/' + userid + '/roles/' + roleid,
      authString = "Basic " + utils.base64.encode(appKey + ":" + masterSecret),
      requestOptions = {
        uri:uri, 
        headers: {
          "Authorization":authString
        }
      },
      auth,
      logger = modules.logger;
  
	auth = modules.request.put(requestOptions,function(error, res, body){
		if (error){
			response.error(error);
		} else {
      response.body = JSON.parse(body);
      response.complete(res.status);
    }
  });
}
```

_deleteRole_

```javascript
function onRequest(request, response, modules) {
  var context = modules.backendContext,
      utils = modules.utils,
      appKey = context.getAppKey(),
      masterSecret = context.getMasterSecret(),
      userid = request.body.userid,
      roleid = request.body.roleid,
      uri = 'https://baas.kinvey.com/user/kid_rk7NMn57z/' + userid + '/roles/' + roleid,
      authString = "Basic " + utils.base64.encode(appKey + ":" + masterSecret),
      requestOptions = {
        uri:uri, 
        headers: {
          "Authorization":authString
        }
      },
      auth,
      logger = modules.logger;
  
	auth = modules.request.del(requestOptions,function(error, res, body){
		if (error){
			response.error(error);
		} else {
      response.body = "{}";
      response.complete(res.status);
    }
  });
}
```

A written guide explaining the code within the sample application is forthcoming.