jQuery(document).ready( function($) {

	// Remove Saved Offers.
	jQuery('.mwb_wocuf_pro_delete_old_created_offers').on( 'click', function(e) {
		e.preventDefault();
    	var btn_id = $(this).data( 'id' );
		jQuery(".new_created_offers[data-id='" + btn_id + "']").slideUp( 'slow', function() { $(this).remove(); } );
	});

	// Scroll to respective offer section after activating offer template.
	if( typeof offer_section_obj !== 'undefined' ) {

		$('html, body').animate({
		    scrollTop: $('[data-scroll-id="#' + offer_section_obj.value + '"]').offset().top + 300
		}, 'slow');

		// After scrolling remove offer section parameter from url.
		var after_scroll_href = window.location.href;

		if ( after_scroll_href.indexOf( '&mwb-upsell-offer-section=' ) >= 0 ) {

			var after_scroll_newUrl = after_scroll_href.substring( 0, after_scroll_href.indexOf( '&mwb-upsell-offer-section=' ) );

   			window.history.replaceState( {}, '', after_scroll_newUrl );

		}
	}

	jQuery('.wc-funnel-product-search').select2({
  		ajax:{
    			url :mwb.ajaxurl,
    			dataType: 'json',
    			delay: 200,
    			data: function (params) {
      				return {
        				q: params.term,
        				nonce : mwb.auth_nonce,
        				action: 'seach_products_for_funnel'
      				};
    			},
    			processResults: function( data ) {
				var options = [];
				if ( data ) 
				{
					$.each( data, function( index, text )
					{
						text[1]+='( #'+text[0]+')';
						options.push( { id: text[0], text: text[1]  } );
					});
				}
				return {
					results:options
				};
			},
			cache: true
		},
		minimumInputLength: 3 // the minimum of symbols to input before perform a search
	});

	jQuery('.wc-offer-product-search').select2({
  		ajax:{
    			url :mwb.ajaxurl,
    			dataType: 'json',
    			delay: 200,
    			data: function (params) {
      				return {
        				q: params.term,
        				nonce : mwb.auth_nonce,
        				action: 'seach_products_for_offers'
      				};
    			},
    			processResults: function( data ) {
				var options = [];
				if ( data ) 
				{
					$.each( data, function( index, text )
					{
						text[1]+='( #'+text[0]+')';
						options.push( { id: text[0], text: text[1]  } );
					});
				}
				return {
					results:options
				};
			},
			cache: true
		},
		minimumInputLength: 3 // the minimum of symbols to input before perform a search
	});

	// Create New Offer.
	jQuery( '#mwb_upsell_create_new_offer' ).on( 'click', function(e) {

		e.preventDefault();

		// Last offer id.
		var index = $('.new_created_offers:last').data('id');

		// Current funnel id.
		var funnel = $(this).data('id');

		// Show loading icon.
		$('#mwb_wocuf_pro_loader').removeClass('hide');
		$('#mwb_wocuf_pro_loader').addClass('show');

		upsell_create_new_offer_post_request( index, funnel );		
	});


	function upsell_create_new_offer_post_request( index, funnel ) {

		// Increase offer id.
		++index;

		$.ajax({
		    type:'POST',
		    url :mwb.ajaxurl,
		    data:{
		    	action: 'mwb_wocuf_pro_return_offer_content',
		    	nonce : mwb.auth_nonce,
		    	mwb_wocuf_pro_flag: index,
		    	mwb_wocuf_pro_funnel: funnel
		    },

		    success:function( data ) {

		    	// Hide loading icon.
		    	jQuery('#mwb_wocuf_pro_loader').removeClass('show');
				jQuery('#mwb_wocuf_pro_loader').addClass('hide');

		    	jQuery('.new_offers').append(data);

		    	// Slidedown.
		    	jQuery('.new_created_offers').slideDown( 1500 );

		    	// Scrolldown Animate.
		    	var scroll_height = $(document).height() - 300;
		    	$('html, body').animate({ scrollTop: scroll_height }, 1000 );


	    		// Remove Added Offers.
		    	jQuery('.mwb_wocuf_pro_delete_new_created_offers').on( 'click', function(e) {
		    		e.preventDefault();
			    	var btn_id = $(this).data( 'id' );
					jQuery("div.new_created_offers[data-id='" + btn_id + "']").slideUp( 'slow', function() { $(this).remove(); } );
		    	});

		    	// Reinitialize product search in new offer.
		    	jQuery('.wc-offer-product-search').select2({
			  		ajax:{
			    			url :mwb.ajaxurl,
			    			dataType: 'json',
			    			delay: 200,
			    			data: function (params) {
			      				return {
			        				q: params.term,
			        				nonce : mwb.auth_nonce,
			        				action: 'seach_products_for_offers'
			      				};
			    			},
			    			processResults: function( data ) {
							var options = [];
							if ( data ) 
							{
								$.each( data, function( index, text )
								{
									text[1]+='( #'+text[0]+')';
									options.push( { id: text[0], text: text[1]  } );
								});
							}
							return {
								results:options
							};
						},
						cache: true
					},
					minimumInputLength: 3 // the minimum of symbols to input before perform a search
				});
		    }
	   });
    }

    // Insert and Activate respective template.
	$(document).on('click', '.mwb_upsell_activate_offer_template', function(e) {

		e.preventDefault();

		// Current clicked button object.
		var current_button = $(this);

		// Current funnel id.
		var funnel_id = $(this).data( 'funnel-id' );
		// Current offer id.
		var offer_id = $(this).data( 'offer-id' );
		// Current template id.
		var template_id = $(this).data( 'template-id' );
		// Current offer post id.
		var offer_post_id = $(this).data( 'offer-post-id' );

		// Show loading icon.
		$('#mwb_wocuf_pro_loader').removeClass('hide');
		$('#mwb_wocuf_pro_loader').addClass('show');

		$.ajax({
		    type:'POST',
		    url :mwb.ajaxurl,
		    data:{
		    	action: 'mwb_upsell_activate_offer_template_ajax',
				nonce : mwb.auth_nonce,
		    	funnel_id: funnel_id,
		    	offer_id: offer_id,
		    	template_id: template_id,
		    	offer_post_id: offer_post_id
		    },

		    success:function( data ) {

		    	data = JSON.parse( data );
				
				if( true === data.status ) {

		    		// Update Offer template value to current template id. 
		    		current_button.closest('.mwb_upsell_offer_templates_parent').find('.mwb_wocuf_pro_offer_template_input').val(template_id);

		    		/**
		    		 * Append offer section parameter in current url, so after form submit we can scroll back to
		    		 * the current respective offer section.
		    		 */
		    		var href_funnel_offer_url = window.location.href;
					href_funnel_offer_url += '&mwb-upsell-offer-section=offer-section-' + offer_id; 
					window.history.replaceState( {}, '', href_funnel_offer_url );

					// Hide loading icon.
		    		$('#mwb_wocuf_pro_loader').removeClass('show');
					$('#mwb_wocuf_pro_loader').addClass('hide');

					// Submit form ( Save upsell funnel ).
		    		$("#mwb_wocuf_pro_creation_setting_save").click();
		    	} 
			 }
	   });		
	}); 
});