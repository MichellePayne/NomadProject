var nomadApp = {}

nomadApp.url = 'https://nomadlist.com/api/v2/list/cities/'
nomadApp.key = 'EDcwZCGMD5gMmdWT3BrI'
nomadApp.client = 'hackeryou'

// where the city name is recorded
nomadApp.cityName;

// ajax call that populates the drop-down menu
nomadApp.getCity = function() {
	$.ajax({
		url: nomadApp.url,
		method: 'GET',
		dataType: 'json',
		data: {
			client: nomadApp.client,
			key: nomadApp.key
		}
	}).then(function(cities) {

		// $('select').css('text-transform','uppercase');
		var eachCity = cities.result
		
		eachCity.forEach(function(city) {
			// console.log(city)
			var cityClean = city.replace(/-/g, " ");
			$('select').append($("<option>").text(cityClean).val(city));
		})
	})
};

// gets the costs and stuff from the city selected
nomadApp.getCityInfo = function(cityName) {
	$.ajax({
		url: nomadApp.url + cityName,
		method: 'GET',
		dataType: 'json',
		data: {
			client: nomadApp.client,
			key: nomadApp.key,
		}
	}).then(function(cityOptions) {
		// variables for each cost needed, makes sure there are cost results first
		if (cityOptions.result[0] !== undefined) {
			var airbnbCost = cityOptions.result[0].cost.airbnb_median.USD;
		} 

		if (cityOptions.result[0] !== undefined) {
			var hotelCost = cityOptions.result[0].cost.hotel.USD;
		} 

		if (cityOptions.result[0] !== undefined) {
			var coffeeCost = cityOptions.result[0].cost.coffee_in_cafe.USD;
		} 

		if (cityOptions.result[0] !== undefined) {
			var beerCost = cityOptions.result[0].cost.beer_in_cafe.USD;
		} 

		if (cityOptions.result[0] !== undefined) {
			var nomadCost = cityOptions.result[0].cost.nomad.USD;
		} 

		// url for image
		if (cityOptions.result[0] !== undefined) {
			var cityImage1000 = `https://nomadlist.com${cityOptions.result[0].media.image["1000"]}`;
		} else {
			var cityImage1000 = 'https://unsplash.it/1000'
		}

		// total budget 
		var budget = $('#budget').val();
		
		// airbnb or hotel
		var stay = $('.active').data('value');
		console.log(stay);
		// how many pints/day
		var alcohol = $('[name=alcohol]').val();
		// how many cups/day
		var coffee = $('[name=coffee]').val();

		// calculating individual costs per day 
		var alcoholPerDay = (alcohol * beerCost);
		var coffeePerDay = (coffee * coffeeCost);
		// radio button for hotel or airbnb
		if (stay === 'airbnb_median') {
			var stayCost =  airbnbCost;
		} else {
			var stayCost =  hotelCost;
		}

		var foodCost = ((nomadCost / 30) - hotelCost);

		// calculating total costs per day
		var totalDays = Math.floor(budget / (foodCost + stayCost + alcoholPerDay + coffeePerDay));

		// if initial costs from api are undefined... 
		if (airbnbCost === undefined && beerCost === undefined && coffeeCost === undefined && hotelCost === undefined) {
			$('.results').text('ERROR');
		}
		// if someone enters negative budget 
		else if (budget < 0) {
			$('.results').text('Maybe you should get a credit loan first');
		} 
		// the cost of travel per day in selected city
		else {
			$('.results').text(`You can stay in ${nomadApp.cityName} for ${totalDays} days based on your selected style of travel`).css('background', `url('${cityImage1000}')`);
		}
		
	})
}

nomadApp.events = function() {
	// when form is submitted
	$('.headerNext').on('click', function(e){
		e.preventDefault();
		$('.firstScreen').hide();
		$('.secondScreen').show();
	})

	$(".headerNext").hover(function(){
		$(this).toggleClass("is-active");
	})

	$('.headerBack').on('click', function(e) {
		e.preventDefault();
		location.reload();
		$('.secondScreen').hide();
		$('.firstScreen').show();
	})

	$('.housing').click(function() {
		$('.housing').removeClass('active');
		$(this).addClass('active');
	})

	$('form').on('submit', function(e) {
		e.preventDefault();
		$('.results').show();
		// get city name
		nomadApp.cityName = $('#city').val();
		nomadApp.getCityInfo(nomadApp.cityName);
	});

	$('#budget').on('change', function() {
		if ($('#budget').val() !== '') {
			$('.submitButton').removeAttr('disabled');
		}
	})
	$('.fa-info-circle').on('click', function() {
		$('.credits p').toggle('fadeIn');
	})
}

nomadApp.init = function () {
	nomadApp.getCity()
	nomadApp.events();
	$(".js-example-basic-single").select2();
}

$(function() {
	nomadApp.init();
})