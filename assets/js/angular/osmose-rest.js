var OsmoseREST = angular.module('OsmoseREST', ['ngResource']);

(function(services){ 
	services.map(function(name){
		OsmoseREST.service(name, function() {
			var baseUrl = '/api/'+name.toLowerCase();
			this.getAll = function(course, cb) {
				console.log(baseUrl);
				socket.get(baseUrl, function(data) {
					return cb(data);
				});
			};

			this.get = function(model, cb) {
				socket.get(baseUrl +'/'+ model.id, function(data) {
					return cb(data);
				});		
			};

			this.post = function(model, cb) {
				socket.post(baseUrl +'/'+ model.id, function(data) {
					return cb(data);
				});		
			};

			this.delete = function(model, cb) {
				socket.delete(baseUrl +'/'+ model.id, function(data) {
					return cb(data);
				});		
			};
			
			this.put = function(model, cb) {
				socket.put(baseUrl +'/'+ model.id, function(data) {
					return cb(data);
				});
			};
		});
	});
})(['Courses', 'Users', 'Questions', 'Answers', 'Comments']);

OsmoseREST.controller('LandingController', function($scope) {
	$scope.fb_id = '';
	socket.get('/api/me', function(fb) {
		if(fb.success) {
			$scope.$apply(function() {
				$scope.fb_id = fb.data.id;
				$scope.name = fb.data.name;
				$scope.picturelink = 'http://graph.facebook.com/'+fb.data.id+'/picture?type=large';
			});
		}
	});
});

OsmoseREST.controller('CourseController', function($scope, Courses) {
	Courses.get({id: 1}, function(res) {
		var course = res.data.course;
		$scope.$apply(function(){
			console.log(course);
			$scope.course = course;
		});
	})
});