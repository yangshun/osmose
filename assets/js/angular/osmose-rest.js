var OsmoseREST = angular.module('OsmoseREST', ['ngResource']);

(function(services){ 
	services.map(function(name){
		OsmoseREST.service(name, function() {
			var baseUrl = '/api/'+name.toLowerCase();

			this.get = function(model, cb) {
				if (model.id !== undefined) {
					socket.get(baseUrl +'/'+ model.id, function(data) {
						return cb(data);
					});		
				} else {
					socket.get(baseUrl, function(data) {
						return cb(data);
					});		
				}
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

	$scope.formatDate = function(date_string) {
		return osm_dates.timeAgo(date_string);
	}


	$scope.formatThumbnail = function(id) {
		return osm_user.getFacebookProfilePicture(id);
	}
};


var CourseController = function($route, $scope, Courses, Answers, Users, Questions) {
	$scope.getCourse = function(course_id){
		Courses.get({id: course_id}, function(res) {
			if (res.success) {
				$scope.$apply(function(){
					console.log('Course loaded: ');
					console.log(res);
					$scope.course = res.data.course;
				});
			}
		});
	}

	// TODO: Support multiple courses
	$scope.updateCourse = function(course) {
		$scope.$apply(function(){
		});
	}

	$scope.updateAnswer = function(answer) {
		var updateExistingAnswer = function() {
			$scope.course.questions.forEach(function(q) {
				q.answers.forEach(function(a) {
					if (a.id === answer.data.id) {
						// Only update the static fields
						for (prop in a.data) {
							if (typeof(prop) !== 'object'){
								a[prop]	= answer.data[prop];
							}
						}
						return;
					}
				});
			})
		}

		var createNewAnswer = function() {
			$scope.course.questions.forEach(function(q) {
				if (q.id === answer.data.question_id) {
					q.answers.push(answer.data);
					return
				}
			})
		}

		var createNewComment = function() {
			$scope.course.questions.forEach(function(q) {
				q.answers.forEach(function(a) {
					if (a.id === answer.data.parent_id) {
						a.comments.push(answer.data);	
						return;
					}
				})
			})		
		}

		var updateExistingComment = function() {
			$scope.course.questions.forEach(function(q) {
				q.answers.forEach(function(a) {
					if (a.id === answer.data.parent_id) {
						a.comments.forEach(function(c) {
							if (c.id === answer.data.id) {
								c = answer.data;
								return;
							}
						});
					}
				})
			})
		}

		$scope.$apply(function(){
			if (answer.model === 'answers') {
				if (answer.verb === 'create') {
					createNewAnswer();
				} else {
					updateExistingAnswer();
				}
			} else {
				// Update the comments	
				if (answer.verb === 'create') {
					createNewComment();
				} else {
					updateExistingComment();
				}
			}
		});
	}

	$scope.updateQuestion = function(question) {
		var updateExistingQuestion = function() {
			$scope.course.questions.forEach(function(q) {
				if (q.id === question.data.id) {
					// Only updating the static fields
					// Adding an answer to this question does not count as an update
					for (prop in question.data) {
						if (typeof(prop) !== 'object' &&
									prop !== 'answer_open' &&
									prop !== 'comment_open'){
							q[prop]	= question.data[prop];
						}
					}
					return;
				}
			})
		}

		var createNewQuestion = function() {
			$scope.course.questions.push(question.data);
		}

		var createNewComment = function() {
			$scope.course.questions.forEach(function(q) {
				if (q.id === question.data.parent_id) {
					q.comments.push(question.data);	
					return;
				}
			})		
		}

		var updateExistingComment = function() {
			$scope.course.questions.forEach(function(q) {
				q.comments.forEach(function(c) {
					if (c.id === question.data.parent_id) {
						c = question.data;
						return;
					}
				})
			})
		}

		$scope.$apply(function(){
			if (question.model === 'questions') {
				if (question.verb === 'create') {
					createNewQuestion();
				} else {
					updateExistingQuestion();
				}
			} else {
				// Update the comments	
				if (question.verb === 'create') {
					createNewComment();
				} else {
					updateExistingComment();
				}
			}
		});
	}

	$scope.addAnswer = function(question, text) {
		var answer = {
			question_id: question.id,
			user_id: 1,
			content: text
		};
		Answers.post(answer, function(data){
			$scope.updateAnswer(data);
		});
	};

	// Controls the message dispatching
	socket.on('message', function(msg) {
		// Only update the $scope course
		switch(msg.model){
			case 'courses':
				return $scope.updateCourse(msg);
			case 'questions':
				return $scope.updateQuestion(msg);
			case 'answers':
				return $scope.updateAnswer(msg);
			case 'comments':
				if (msg.data.parent_type === 'QUESTION') {
					return $scope.updateQuestion(msg);
				} else {
					return $scope.updateAnswer(msg);
				}
		}
	});

	var path = window.location.pathname.split('/');
	(function(){
		switch (path[1]) {
		case 'courses':
		case 'feed':
			var params = {};
			if (path[1] === 'courses') {
				params = {id: path[2]};
			}
			Courses.get(params, function(res) {
				if (res.success) {
					$scope.courses = res.data;
					console.log('Courses loaded');
					console.log(res);

					$scope.questions = [];
					res.data.map(function(course) {return $scope.questions = $scope.questions.concat(course.question);});
					console.log('Questions');
					console.log($scope.questions);
					// Subscribe to changes
					$scope.$apply();
					Users.get({id: 'subscribe'}, function(res){ if(!res.success) console.log('Unable to subscribe')});
				} else {
					console.log('Error retrieving courses');
					console.log(res);
				}
			});
			break;
		case 'questions':
			Questions.get({id: path[2]}, function(res) {
				if (res.success) {
					$scope.questions = [res.data.question];
					$scope.$apply();
				} else {
					console.log('Error retrieving question');
					console.log(res);
				}
			});
			break;
		}
	})()
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

	socket.post('/api/questions', question, function(data) {
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
		socket.post('/api/comments', qs_comment, function(data) {});
		socket.post('/api/answers', answer, function(data) {
			var ans_comment = {
				parent_id: data.data.answer.id,
				parent_type: 'ANSWER',
				content: generateRandomWords(300),
				user_id: 1
			};
			socket.post('/api/comments', ans_comment, function(data) {
				console.log('done');
			});
		});
	});
}

var FriendController = function($scope) {
	socket.get('/facebook/friends', function(res) {
		console.log(res.data);
		$scope.$apply(function() {
			$scope.fb_friends = res.data;
		});
	});
}

var controllers = {
	'CourseController' : CourseController,
	'AppController' : AppController,
	'FriendController' : FriendController
};

OsmoseREST.controller(controllers);
