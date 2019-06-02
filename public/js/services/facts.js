angular.module('factService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Facts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/facts/');
			},
			create : function(factData) {
				return $http.post('/api/facts/', factData);
			},
			delete : function(id) {
				return $http.delete('/api/facts/' + id);
			}
		}
	}]);