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

			this.postOne = function(model, cb) {
				socket.post(baseUrl +'/'+ model.id, model, function(data) {
					return cb(data);
				});		
			};

			this.post = function(model, cb) {
				socket.post(baseUrl, model, function(data) {
					return cb(data);
				});
			};

			this.delete = function(model, cb) {
				socket.delete(baseUrl +'/'+ model.id, function(data) {
					return cb(data);
				});		
			};
			
			this.put = function(model, cb) {
				socket.put(baseUrl +'/'+ model.id, model, function(data) {
					return cb(data);
				});
			};
		});
	});
})(['Courses', 'Users', 'Questions', 'Answers', 'Comments']);

var AppController =  function($scope) {
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

	$scope.formatDate = function(date_string) {
		return osm_dates.timeAgo(date_string);
	}


	$scope.formatThumbnail = function(id) {
		return osm_user.getFacebookProfilePicture(id);
	}
});

var CourseController = function($scope, Courses) {
	Courses.get({id: 1}, function(res) {
		var course = res.data.course;
		$scope.$apply(function(){
			console.log(course);
			$scope.course = course;
		});
	})
}

var User = function($scope, Users) {
	console.log('RUNNING NOW');
}

var generateRandomWords = function(length) {
	var text = [];
	var wordLength = 10;

	for(var i=Math.floor(Math.random()*Math.min(wordLength,length-wordLength));length > wordLength;) {
		text.push(Math.random().toString(36).substring(2,i+2) + ' ');
		length -= i+1;
	}
	return text.join('');
}

var trythis = function() {
	console.log('start');
	var question = {
		user_id: 1,
		title: generateRandomWords(50),
		content: generateRandomWords(300),
		course_id: 1
	};
	console.log(question);

	socket.post('/api/questions', question, function(data) {
		console.log('questions post: ');
		console.log(data);
		var answer = {
			question_id: data.data.question.id,
			user_id: 1,
			content: generateRandomWords(50)
		};

		var qs_comment = {
			parent_id: data.data.question.id,
			parent_type: 'QUESTION',
			content: generateRandomWords(50),
			user_id: 1
		};
		socket.post('/api/comments', qs_comment, function(data) {console.log('q_comment: ');console.log(data);});
		socket.post('/api/answers', answer, function(data) {
			console.log('answer: ');
			console.log(data);
			var ans_comment = {
				parent_id: data.data.answer.id,
				parent_type: 'ANSWER',
				content: generateRandomWords(300),
				user_id: 1
			};
			socket.post('/api/comments', ans_comment, function(data) {
				console.log('a_comments: ');
				console.log(data);
				console.log('done');
			});
		});
	});
}

var controllers = {
	'CourseController' : CourseController,
	'AppController' : AppController,
	'User': User
};

OsmoseREST.controller(controllers);
