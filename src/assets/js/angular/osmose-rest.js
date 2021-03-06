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
})(['Courses', 'Users', 'Questions', 'Answers', 'Comments', 'Votes']);

var AppController =  function($scope) {
	$scope.fb_id = '';

	$scope.formatDate = function(date_string) {
		return osm_dates.timeAgo(date_string);
	}

	$scope.formatThumbnail = function(id) {
		return osm_user.getFacebookProfilePicture(id);
	}

	$scope.formatText = function(text, format_media) {
		if (typeof format_media === "undefined") {
			format_media = true;
		}

		if (!text) {
			return '';
		}		
		text = osmose_markdowns.osmosifyContent(text, format_media);
		return text;
	}
};

var CourseController = function($route, $scope, Courses, Answers, Users, Questions, Comments, Votes) {
	$scope.page_loaded = false;
	var ANIMATION_NAME = 'fadeInUp';
	$scope.question_container_class = { 'animated': true, ANIMATION_NAME: false };
	$scope.display_state = {
		title_is_link: true,
		display_ask_question: false,
		question: {
			display_comments: false,
			display_answers: false,
		},
		answers: {
			display_comments: false,
		}
	};

	if ($scope.display_type == 'question') {
		$scope.display_state.title_is_link = false;
		$scope.display_state.question.display_comments = false;
		$scope.display_state.question.display_answers = true;
		$scope.display_state.answers.display_comments = false;
	}
	console.log($scope.display_type)
	if ($scope.display_type == 'course') {
		$scope.display_state.display_ask_question = true;
	}

	$scope.getCourse = function(course_id){
		Courses.get({id: course_id}, function(res) {
			if (res.success) {
				$scope.$apply(function(){
					$scope.course = res.data.course;
				});
			}
		});
	}

	// TODO: Support multiple courses
	$scope.updateCourse = function(course) {
		$scope.$apply(function(){});
	}

	$scope.updateAnswer = function(answer) {
		var updateExistingAnswer = function() {
			$scope.questions.forEach(function(q) {
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
			$scope.questions.forEach(function(q) {
				if (q.id === answer.data.question_id) {
					q.answers.push(answer.data);
					return
				}
			})
		}

		var createNewComment = function() {
			$scope.questions.forEach(function(q) {
				q.answers.forEach(function(a) {
					if (a.id === answer.data.parent_id) {
						a.comments.push(answer.data);	
						return;
					}
				})
			})		
		}

		var updateExistingComment = function() {
			$scope.questions.forEach(function(q) {
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
			$scope.questions.forEach(function(q) {
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
			$scope.questions.unshift(question.data);
		}

		var createNewComment = function() {
			$scope.questions.forEach(function(q) {
				if (q.id === question.data.parent_id) {
					q.comments.push(question.data);	
					return;
				}
			})		
		}

		var updateExistingComment = function() {
			$scope.questions.forEach(function(q) {
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

	$scope.addQuestion = function(title, content) {
		if (title.trim() == '' || content.trim() == '') {
			return;
		} 
		var newQuestion = {
			course_id: $scope.course_id,
			title: title,
			content: content
		};
		// console.log(newQuestion)
		Questions.post(newQuestion, function(){});
	}

	$scope.addCommentInQuestion = function(question, content) {
		if (content.trim() == '') {
			return;
		} 
		var newComment = {
			parent_id: question.id,
			parent_type: 'QUESTION',
			content: content
		};
		Comments.post(newComment, function(){});
	};

	$scope.addCommentInAnswer = function(answer, content) {
		if (content.trim() == '') {
			return;
		} 
		var newComment = {
			parent_id: answer.id,
			parent_type: 'ANSWER',
			content: content
		};
		Comments.post(newComment, function(){});
	};

	$scope.addAnswer = function(question, content) {
		if (content.trim() == '') {
			return;
		} 
		var answer = {
			question_id: question.id,
			content: content
		};

		Answers.post(answer, function(){});
	};

	$scope.generateVoteClass = function(question, type) {
		switch (type) {
			case 'up':
				question.vote_class = { 'icon-thumbs-up-alt': true, 'post-action-upvote': true, 'post-action-upvoted': false };
				if (question.voted > 0) {
					question.vote_class['post-action-upvoted'] = true;
					question.vote_class['post-action-upvote'] = false;
				}
				break;
			case 'down':
				question.vote_class = { 'icon-thumbs-down-alt': true, 'post-action-downvote': true, 'post-action-downvoted': false };
				if (question.voted < 0) {
					question.vote_class['post-action-downvoted'] = true;
					question.vote_class['post-action-downvote'] = false;
				}
				break;
		}
		return question.vote_class;
	}


	$scope.upvote = function(post, type) {

		var vote = {
			id: 'upvote',
			post_id : post.id,
			post_type : type
		};
		Votes.postOne(vote, function(res){
			// console.log(res);
		});
	};

	$scope.downvote = function(post, type) {

		var vote = {
			id: 'downvote',
			post_id: post.id,
			post_type: type
		};
		Votes.postOne(vote, function(res){
			// console.log(res);
		});
	};

	$scope.updateVotesForQuestion = function(msg) {
		var question_id = msg.data.post_id;
		$scope.questions.map(function(question){
			if (question.id === question_id) {
				question.score += msg.data.change;	
				if (msg.data.voter_id === $scope.user_id) {
					question.voted = msg.data.score;
				}

				$scope.$apply();
				return;
			}
		});
	};

	$scope.updateVotesForAnswer = function(msg) {
		var answer_id = msg.data.post_id;
		$scope.questions.map(function(question){
			question.answers.map(function(answer) {
				if (answer.id === answer_id) {
					answer.score += msg.data.change;	
					if (msg.data.voter_id === $scope.user_id) {
						answer.voted = msg.data.score;
					}

					$scope.$apply();
					return;
				}
			});
		});
	}

	$scope.shareOnFacebook = function(question) {
		FB.ui({
			method: 'feed',
			name: question.title,
			caption: question.course_name,
			description: question.content,
			link: 'http://osmose.soedar.com/questions/' + question.id,
	        picture: 'http://osmose.soedar.com/img/icon-256.png'
		}, function(data) {
			console.log(data);
		});
	}

	var path = window.location.pathname.split('/');
	
	// Controls the message dispatching
	socket.on('message', function(msg) {
		// Only update the $scope course
		switch(msg.model){
			case 'courses':
				return $scope.updateCourse(msg);
			case 'questions':
				if (path[1] === 'courses' && msg.data.course_id != path[2]) {
					// Don't do trigger for the wrong course
				} else {
					return $scope.updateQuestion(msg);
				}
			case 'answers':
				return $scope.updateAnswer(msg);
			case 'comments':
				if (msg.data.parent_type === 'QUESTION') {
					return $scope.updateQuestion(msg);
				} else {
					return $scope.updateAnswer(msg);
				}
			case 'votes':
				if (msg.data.post_type === 'QUESTION') {
					return $scope.updateVotesForQuestion(msg);
				} else {
					return $scope.updateVotesForAnswer(msg);
				}
		}
	});
	
	(function(){
		// Subscribe to changes
		socket.get('/api/users/subscribe/'+path[1]+'/'+path[2], function(err, data) {
			if (err) console.log('Unable to subscribe');console.log(err);
		});

		// Set scope based on different pages
		var params = {};
		function postLoading() {
			$scope.question_container_class[ANIMATION_NAME] = true;
			$scope.page_loaded = true;
			$scope.$apply();
			$('textarea').autosize();
		}

		switch (path[1]) {
			case 'courses':
				params.id = path[2];
				Courses.get(params, function(res) {
					if (res.success) {
						if (!Array.isArray(res.data)) {
							res.data = [res.data];
						}
						$scope.courses = res.data;
						// console.log('Courses loaded');
						// console.log($scope.courses);

						$scope.questions = [];
						res.data.map(function(course) {
							return $scope.questions = $scope.questions.concat(course.questions);
						});
						// console.log('Questions');
						// console.log($scope.questions);
						postLoading();
					} else {
						// console.log('Error retrieving courses');
						// console.log(res);
					}
				});
				break;
			case 'feed':
				socket.get('/api/feed', function(res) {
					if (res.success) {
						$scope.questions = res.data;
						// console.log('questions')
						console.log($scope.questions)
						postLoading();
					}
					else {
						// console.log('Error retrieving feed');
						// console.log(res);
					}
				});
				break;
			case 'my-questions':
				socket.get('/api/my-questions', function(res) {
					$scope.$apply(function() {
						if (res.success) {
							$scope.questions = res.data;
							postLoading();
						} else {
							// console.log('Error retrieving my questions');
							// console.log(res);
						}
					});
				});
				break;
			case 'questions':
				Questions.get({id: path[2]}, function(res) {
					// console.log('therehere');
					// console.log(res);
					if (res.success) {
						$scope.questions = [res.data.question];
						// console.log('Question loaded');
						// console.log($scope.questions);
						postLoading();
					} else {
						// console.log('Error retrieving question');
						// console.log(res);
					}
				});
				Courses.get({}, function(res) {
					if (res.success) {
						$scope.courses = res.data;
						postLoading();
					} else {
						// console.log('Error retrieving course stub');
						// console.log(res);
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
	// console.log('start');
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
				// console.log('done');
			});
		});
	});
}

var InviteController = function($scope) {
	$scope.page_loaded = false;

	socket.get('/facebook/friends', function(res) {
		$scope.$apply(function() {
			$scope.fb_friends = res.data;
			$scope.page_loaded = true;
		});
	});
}

var controllers = {
	'CourseController' : CourseController,
	'AppController' : AppController,
	'InviteController' : InviteController
};

OsmoseREST.controller(controllers);
