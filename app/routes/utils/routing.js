const buildRouteNamingFunction = (routeName) => {
    return (req, res, next) => {
        req.routeName = routeName
        next()
    }
}

module.exports = {
    buildRoutes: function(router, routeConfig){
        routeConfig.map((routeObj) => {
            let myRoute = router.route(routeObj.route)
            routeObj.endPoints.map((endPointObj) => {
                const myEndware = endPointObj.endwares
                let finalEndwares = [buildRouteNamingFunction(endPointObj.routeName), ...myEndware]
                myRoute = myRoute[endPointObj.method](...finalEndwares)
            })
        })
        return router
    }
}