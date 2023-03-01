let qsRegex;
let buttonFilter;

// ===============
// store filter for each group
var filters = [];

// ===============

// jQuery init Isotope
const $grid = $('.blog-masonry').isotope({
    itemSelector: ".post-masonry",
    layoutMode: 'fitRows',
	sortAscending: {
		date: true,
		dateAsc: false,
		name: true,
		nameAsc: false,
		status: true
	},
    getSortData: {
		date: function(itemElem) {
			var date = $(itemElem).find('.date').text();
			date = parseFloat(date.replaceAll("-", ""));
			return date;
		},
		dateAsc: function(itemElem) {
			var date = $(itemElem).find('.date').text();
			date = parseFloat(date.replaceAll("-", ""));
			return date;
		},
		name: '.name',
		nameAsc: ".name",
      	status: '[data-status]',
    },
	filter: function() {
		var $this = $(this);
		var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
		var buttonResult = buttonFilter ? $this.is( buttonFilter ) : true;
		return searchResult && buttonResult;
	}
});



// FILTER COUNTER
var iso = $grid.data('isotope');
var $filterCount = $('.filterCount');

function updateFilterCount() {
    $filterCount.text( iso.filteredItems.length + ' items' );
}
updateFilterCount();


  
// filter functions
var filterFns = {
    year2023: function() {
      	var date = $(this).find('.date').text();
      	date = parseInt(date.substring(0, 4));
      	return date == 2023;
    },
	year2022: function() {
		var date = $(this).find('.date').text();
		date = parseInt(date.substring(0, 4));
		return date == 2022;
  	},
	year2021: function() {
		var date = $(this).find('.date').text();
		date = parseInt(date.substring(0, 4));
		return date == 2021;
	},

    label_html: function() {
        var label = $( this ).find(".tag-html").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_js: function() {
        var label = $( this ).find(".tag-js").attr('class');
        if (label === undefined) return false;
        return true;
    },

    label_app: function() {
        var label = $( this ).find(".tag-app").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_game: function() {
        var label = $( this ).find(".tag-game").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_guide: function() {
        var label = $( this ).find(".tag-guide").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_idle: function() {
        var label = $( this ).find(".tag-idle").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_tool: function() {
        var label = $( this ).find(".tag-tool").attr('class');
        if (label === undefined) return false;
        return true;
    },
    label_showcase: function() {
        var label = $( this ).find(".tag-showcase").attr('class');
        if (label === undefined) return false;
        return true;
    },

};







// bind sort button click
$('#sorts').on( 'click', 'button', function() {
    var sortByValue = $(this).attr('data-sort-by');
    $grid.isotope({ sortBy: sortByValue });
});

// change is-checked class on buttons
// $('#sorts')
$('.button-group').each( function( i, buttonGroup ) {
	var $buttonGroup = $( buttonGroup );
	$buttonGroup.on( 'click', 'button', function() {
		$buttonGroup.find('.is-checked').removeClass('is-checked');
		$( this ).addClass('is-checked');
	});
});
    
// use value of search field to filter
var $quicksearch = $('.quicksearch').keyup( debounce( function() {
	qsRegex = new RegExp( $quicksearch.val(), 'gi' );
	$grid.isotope();
}, 200 ) );

// debounce so filtering doesn't happen every millisecond
// used for search bar
function debounce( fn, threshold ) {
	var timeout;
	threshold = threshold || 100;
	return function debounced() {
		clearTimeout( timeout );
		var args = arguments;
		var _this = this;
		function delayed() {
			fn.apply( _this, args );
            updateFilterCount();
		}
		timeout = setTimeout( delayed, threshold );
	};
}




// bind filter button click
$('#filters').on('click', 'button', function() {
    buttonFilter = $( this ).attr('data-filter');
    // use filterFn if matches value
    buttonFilter = filterFns[ buttonFilter ] || buttonFilter;

	$grid.isotope();
    updateFilterCount();
});

// =============== v
// change is-checked class on buttons
// $('#filters').on( 'click', 'button', function( event ) {
//     var $target = $( event.currentTarget );
//     $target.toggleClass('is-checked');
//     var isChecked = $target.hasClass('is-checked');
//     var buttonFilter = $target.attr('data-filter');
//     console.log(buttonFilter)
//     if ( isChecked ) {
//       // add filters
//       if ( filters.indexOf( buttonFilter ) == -1 ) {
//         filters.push( buttonFilter );
//       }
//     } else {
//       // remove filters
//       var index = filters.indexOf( buttonFilter);
//       if ( index != -1 ) {
//         filters.splice( index, 1 );
//       }
//     }
//     // filter isotope
//     // group filters together, inclusive
//     // $grid.isotope({ filter: filters.join(',') });
//     updateFilterCount();
//   });

// =============== ^