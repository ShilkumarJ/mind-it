/* global MindMapService */
/* global Router */
/* global mindMapService */
mindMapService = new MindMapService();
Template.MyButton.events({
	'click #clickme': function () {
		// 1. cretate root node with defualt title
		var mindMapId = mindMapService.createRootNode('New Mindmap'),
			link = '/create/' + mindMapId;
		// 2. Go to canvas root note
		Router.go(link);
		localStorage.clear();
	}
});


Template.home.onRendered(function(){
	$('.home-bg').slick({
		dots: true,
  	infinite: true,
  	speed: 300,
  	slidesToShow: 1
  });

  $("#about-us").click(function() {
		 $('#aboutUs-modal').modal('show');
	});

});