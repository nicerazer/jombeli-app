// Instantiate a slider
var mySlider = $("input.slider").bootstrapSlider();

// Call a method on the slider
var value = mySlider.bootstrapSlider('getValue');

// For non-getter methods, you can chain together commands
mySlider
   .bootstrapSlider('setValue', 5)
   .bootstrapSlider('setValue', 7);

/*
$('#filter-price').on('hidden.bs.collapse', function (e) {
   $('#filter-price').addClass('d-none-important');
});

$('#filter-price').click(function(){
   if($('#filter-price').hasClass('d-none-important') == true){
      $('#filter-price').removeClass('d-none-important');
   }
});
*/