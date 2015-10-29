Parse.initialize("4TQmEEZD3qrPIvAZu8fQa36cHuu6UGUCkVGEgbY3", "LKSyuv3WYF4nzE1KWvAXZfm2MIwnQZudrfi7NROm");


var Review = Parse.Object.extend('Review');
var allRatings;
var allReviews;
$('#stars').raty();
$('#average').raty();


// Storing user inputs and clearing the form
$('form').submit(function() {
	var review = new Review();
	var title = $("#reviewTitle").val();
	var body = $("#reviewBody").val();
	var rating =$("#stars").raty('score');

	review.set("title", title);
	review.set("body", body);
	review.set("rating", parseInt(rating));
	review.save();

	$('#reviewTitle').val('');
	$('#reviewBody').val('');
	$('#stars').raty('score', 0);
    return false
});



var getData = function() {
	allRatings = 0;
	var query = new Parse.Query(Review);
	query.find({
		success: function(results) {
			buildList(results)
		}
	})
}


var buildList = function(data) {
	$('#list').empty()
	allReviews = data.length;
	data.forEach(function(d) {
		addItem(d);
	})
}

var addItem = function(item) {
	var title = item.get('title');
	var body = item.get('body');
	var rating = item.get('rating');
	allRatings = allRatings + rating;
	var div = $(document.createElement('div')).appendTo('#list');
	
	var rRating =$(document.createElement('span')).raty({
			score: (item.get('rating'))
		}).appendTo(div);

	var rTitle = $(document.createElement('p')).text(title).appendTo(div);

	var rBody =$(document.createElement('p')).text(body).appendTo(div);
	
	var button = $('<button class="btn-danger btn-xs">remove</button>').appendTo(rTitle);

	var up =$('<button class="btn-success btn-xs">helpful</button>');
		up.click(function() {
			item.increment('ups');
			item.save().then(getData());
		});
		
		up.appendTo(rTitle);

	var down = $('<button class="btn-info btn-xs">unhelpful</button>');
		down.click(function() {
			item.increment('downs');
			item.save().then(getData());
		});
		
		down.appendTo(rTitle);



	button.click(function() {
		item.destroy({
			success:getData
		});
	});

	$('#average').raty({
		readOnly: true,
		score: allRatings/allReviews
	});
}

 getData() 