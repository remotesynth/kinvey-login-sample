var client = Kinvey.init({
    appKey: 'kid_rk7NMn57z',
    appSecret: '3ecc483bd0864882b0c69965030961c6'
});

const heroRoleId = '0278b7bf-749f-453f-9b74-4a0b2afcfcff',
    villainRoleId = '1707214d-5c2f-436c-82d4-6e198749251d';

// for the sake of simplicity in a sample app, I am always logging the current active user out when the page is loaded
var promise = Kinvey.User.logout();

// sign up a new user with Kinvey authentication
document.getElementById('signup-button').addEventListener('click', function(event) {
    // TODO: perform form validation
    var user = new Kinvey.User();
    var promise = user.signup({
        username: document.getElementById('email').value,
        password: document.getElementById('password').value
    })
    .then(function(user) {
        loginSuccess();
        console.log(user);
    })
    .catch(function(error) {
        // for the sake of simplicity, I'm just displaying any errors that the API sends me back
        document.getElementById('error').innerHTML = error.message;
    });
});

// login using the Kinvey authentication
document.getElementById('login-button').addEventListener('click', function(event) {
    var user = new Kinvey.User();
    var promise = user.login({
        username: document.getElementById('email').value,
        password: document.getElementById('password').value
    })
    .then(function(user) {
        loginSuccess();
        console.log(user);
    })
    .catch(function(error) {
        document.getElementById('error').innerHTML = error.message;
    });
});

// sign up or log in with Google authentication
document.getElementById('google-login').addEventListener('click', function(event) {
    var promise = Kinvey.User.loginWithMIC(window.location.href);
    promise.then(function onSuccess(user) {
        loginSuccess();
        console.log(user);
    }).catch(function onError(error) {
        document.getElementById('error').innerHTML = error.message;
    });
});

// log in an implicit user (i.e. anonymous) that defaults to the all users role
document.getElementById('nosignin').addEventListener('click', function () {
    loginSuccess();
    document.getElementById('rolechooser').classList.add('fadeout');
    var promise = Kinvey.User.signup()
    .then(function(user) {
        loadData();
    }).catch(function(error) {
        console.log(error);
    });
}, true);

// just in case, remove the other role first then pass the hero role id to assign the role
document.getElementById('hero-button').addEventListener('click', function() {
    var userid = Kinvey.User.getActiveUser(client)._id,
        promise = Kinvey.CustomEndpoint.execute('deleteRole', {
        userid: userid,
        roleid: villainRoleId
    })
    .then(function(response) {
        setRole(heroRoleId);
    })
    .catch(function(error) {
        console.log(error);
    });
});

// // just in case, remove the other role first then pass the villain role id to assign the role
document.getElementById('villain-button').addEventListener('click', function() {
    var userid = Kinvey.User.getActiveUser(client)._id,
        promise = Kinvey.CustomEndpoint.execute('deleteRole', {
        userid: userid,
        roleid: heroRoleId
    })
    .then(function(response) {
        setRole(villainRoleId);
    })
    .catch(function(error) {
        console.log(error);
    });
        
});

// change some styles when a user log in succeeds
function loginSuccess() {
    var rolechooser = document.getElementById('rolechooser');

    document.getElementById('signup').classList.add('fadeout');
    document.getElementById('wrapper').classList.add('form-success');
    rolechooser.classList.remove('hidden');    
    rolechooser.classList.add('fadein');
}

// set the user role via the REST API (not available in SDK at the moment)
function setRole(roleid) {
    var userid = Kinvey.User.getActiveUser(client)._id,
        promise = Kinvey.CustomEndpoint.execute('addRole', {
            userid: userid,
            roleid: roleid
        })
        .then(function(response) {
            console.log(response);
            document.getElementById('rolechooser').classList.add('fadeout');
            loadData();
        })
        .catch(function(error) {
            console.log(error);
        });
}

// load data from 3 collections - one with all user access, one with hero only and one with villain only
function loadData() {
    var ordinary_ds = Kinvey.DataStore.collection('ordinary-people'),
        heroes_ds = Kinvey.DataStore.collection('heroes'),
        villains_ds = Kinvey.DataStore.collection('villains');
    ordinary_ds.pull()
    .then(function(ordinaries) {
        var el = document.getElementById('ordinaries-list'),
        chrList = '';
        ordinaries.forEach(function(ordinary) {
            chrList += '<li>' + ordinary.name + '</li>';
        });
        el.innerHTML = chrList;
        displayCharacters();
    })
    .catch(function(error) {
        console.log(error);
    });
    heroes_ds.pull()
    .then(function(heroes) {
        var el = document.getElementById('heroes-list'),
        chrList = '';
        heroes.forEach(function(hero) {
            chrList += '<li>' + hero.hero_name + '</li>';
        });
        el.innerHTML = chrList;
        displayCharacters();
    })
    .catch(function(error) {
        console.log(error);
        if (error.code == 401) {
            var el = document.getElementById("heroes-list").innerHTML = '<li>Unauthorized</li>'
        }
    });
    villains_ds.pull()
    .then(function(villains) {
        var el = document.getElementById('villains-list'),
            chrList = '';
        villains.forEach(function(villain) {
            chrList += '<li>' + villain.villain_name + '</li>';
        });
        el.innerHTML = chrList;
        displayCharacters();
    })
    .catch(function(error) {
        console.log(error);
        if (error.code == 401) {
            var el = document.getElementById("villains-list").innerHTML = '<li>Unauthorized</li>'
        }
    });
}

// just a simple utility to determine if the lists are already displayed and display them
function displayCharacters() {
    display = document.getElementById('display-characters');
    if (display.classList.contains('hidden')) {
        display.classList.remove('hidden');
        display.classList.add('fadein');
    }
}