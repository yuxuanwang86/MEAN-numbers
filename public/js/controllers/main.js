angular.module('factController', [])

	// inject the Fact service factory into our controller
	.controller('mainController', ['$scope', '$http', 'Facts', function ($scope, $http, Facts) {
		$scope.formData = {};
		// GET =====================================================================
		// when landing on the page, get all facts and show them
		// use the service to get all the facts
		Facts.get()
			.success(function (data) {
				$scope.facts = data;
			});



		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFact = function () {
			$scope.processing = true;
			if ($scope.formData.text != undefined) {
				// call the create function from our service (returns a promise object)
				Facts.create($scope.formData)
					// if successful creation, call our get function to get all the new facts
					.success(function (data) {
						$scope.facts = data; // assign our new list of facts
						$scope.processing = false;
					});
				$scope.formData = {}; // clear the form so our user is ready to enter another
			}


			if ($scope.formData.text == undefined)
				$scope.processing = false;
		};

		// DELETE ==================================================================
		// delete a fact after checking it
		$scope.deleteFact = function (id) {
			Facts.delete(id)
				// if successful creation, call our get function to get all the new facts
				.success(function (data) {
					$scope.facts = data; // assign our new list of facts
				});
		};
	}]);