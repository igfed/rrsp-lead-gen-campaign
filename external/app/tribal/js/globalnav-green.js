// JavaScript Document
(function($){

  var $mainMenu, $searchInput, $clsBtnAccordion;

  // active the accordion on mobile
  $('#menu-button').on("click", function(){
	$(this).closest("body").toggleClass("active");  
  })
  // Deactive the accordion on mobile
  $clsBtnAccordion = $(".closeBtn--accordion");
  $clsBtnAccordion.on('click', function(){
	//alert('xxx');
	$(this).closest("body").removeClass("active");
  })
  
  // Clear search and hide other menu item
  $mainMenu = $('.main-menu');
  $searchInput = $mainMenu.find('.search-input');

  $searchInput.focus(function(){
	$(this).closest("li")
		.siblings()
		.css("visibility", "hidden");
  }).blur(function(){
	$(this).val("")
		.closest("li").siblings()
		.css("visibility", "visible")
  })
  
  // Mobile reset button
      var $mbSearchInput = $(".mb-search-input"),
          $mbSearchReset = $(".mb-search-reset"),
          $mbSearchForm = $(".mb-search-form");

      $mbSearchInput.focus(function(){
        if(!$mbSearchForm.hasClass("active")) 
            $mbSearchForm.addClass('active');
      }).blur(function(){
        $mbSearchForm.removeClass('active')
        $(this).val("");
      });

      $mbSearchReset.click(function(){
        $mbSearchForm.removeClass("active");
      });


})(jQuery);
