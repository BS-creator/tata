/**
 * Created by bisconti on 09/10/14.
 */
/**
 * Login to a Group S Transfer.
 *
 * @param {String} email
 * @param {String} password
 */

exports.login = function(login, password){
    return function(nightmare) {
        nightmare
            .viewport(800, 1600)
            .goto('https://localhost:4000/')
                .type('#login', login)
                .type('#password', password)
                .click('#submit-login')
            .wait();
    };
};
