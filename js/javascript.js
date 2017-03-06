var bookingModel = Backbone.Model.extend({
	defaults: {
		name: "",
		table: "",
		phone: "",
		time: ""
	}
});

var allBookings = Backbone.Collection.extend({});

var allBookingsCollection;
var cache = window.localStorage.getItem('cacheBookings');
cache = JSON.parse(cache);

if(cache && cache.length != 0) {

	allBookingsCollection = new allBookings(cache);
} else {

	allBookingsCollection = new allBookings();
}

var bookingView = Backbone.View.extend({

	model: new bookingModel,

	tagName: "tr",

	events: {
		'click .edit-booking': 'editBooking',
		'click .update-booking': 'updateBooking',
		'click .cancel-booking': 'cancelBooking',
		'click .delete-booking': 'deleteBooking'
	},

	initialize: function() {
		this.template = _.template($('.bookingTableListTemplate').html());
	},

	editBooking: function() {

		$('.edit-booking').hide();
		$('.delete-booking').hide();
		this.$('.update-booking').show();
		this.$('.cancel-booking').show();
		
		var name = this.$('.name').html();
		var table = this.$('.table').html();
		var phone = this.$('.phone').html();
		var time = this.$('.time').html();
		
		this.$('.name').html('<input type="text" class="form-control name-update" value="'+ name +'">');
		this.$('.table').html('<input type="text" class="form-control table-update" value="'+ table +'">');
		this.$('.phone').html('<input type="text" class="form-control phone-update" value="'+ phone +'">');
		this.$('.time').html('<input type="text" class="form-control time-update" value="'+ time +'">');

		$('input.time-update').timepicker();
	},

	updateBooking: function() {

		this.model.set('name', $('.name-update').val());
		this.model.set('table', $('.table-update').val());
		this.model.set('phone', $('.phone-update').val());
		this.model.set('time', $('.time-update').val());
	},
	
	cancelBooking: function() {
		bookingsView.render();
	},
	
	deleteBooking: function() {
		this.model.destroy();
	},

	render: function() {

		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var allBookingsView = Backbone.View.extend({

	model: allBookingsCollection,

	el: $('#bookingTableBody'),

	initialize: function() {

		var that = this;
		that.model.on('add', that.render, that);
		that.model.on('change', function() {
			setTimeout(function() {
				that.render();
			});
		}, that);
		that.model.on('remove', that.render, that);
	},

	render: function() {

		var that = this;

		this.$el.html('');

		_.each(this.model.toArray(), function(note) {

			that.$el.append((new bookingView({ model: note })).render().$el);
		});

		window.localStorage.setItem('cacheBookings', JSON.stringify(that.model));
	}
});

var bookingsView = new allBookingsView();

var startTrackingBookingList = function() {

	setTimeout(function() {

		var cacheData = window.localStorage.getItem('cacheBookings');
		cacheData = JSON.parse(cacheData);
		
	}, 50000);
}

$(document).ready(function() {

	bookingsView.render();

	$('.time_input').timepicker();

	$('.add-booking').on('click', function() {

		if($('.name_input').val() != '' && $('.table_input').val() != '' && $('.phone_input').val() != '' && $('.time_input').val() != '') {
			
			var booking = new bookingModel({
				name: $('.name_input').val(),
				table: $('.table_input').val(),
				phone: $('.phone_input').val(),
				time: $('.time_input').val()
			});

			$('.name_input').val('');
			$('.table_input').val('');
			$('.phone_input').val('');
			$('.time_input').val('');

			allBookingsCollection.add(booking);
		} else {

			alert("Please fill all infomation!");
		}
	});

	// startTrackingBookingList();
});