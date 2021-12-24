module.exports = {
    rolesRules: {
        //add route as key
        '/v1/api/something': [], //empty means everyone can access
    },
    roles: ['superadmin', 'admin', 'user'],
    middleware: function(routeName){
        return function(req, res, next){
            //check role here
            next()
        }
    }
}