jQuery(document).ready(function($) {

	// Facebook Pixel data.
	var is_pixel_enabled = mwb.facebook_pixel.is_pixel_enabled;
	var pixel_account_id = false;
	var product_catalog_id = false;
	var enable_pixel_purchase_event = 'no';
	var enable_pixel_viewcontent_event = 'no';
	var enable_pixel_debug_mode = 'no';

	// Google Amalytics data.
	var is_ga_enabled = mwb.google_analytics.is_ga_enabled;
	var ga_account_id = false;
	var enable_ga_purchase_event = 'no';
	var enable_ga_pageview_event = 'no';
	var enable_ga_debug_mode = 'no';

	// Other required data.
	var current_user_role = mwb.current_user;
	var currency_code = mwb.currency_code;
	var currency_symbol = mwb.currency_symbol;
	var current_location = mwb.current_location;
	var product_price = 0;
	var quantity = 1;
	var total_value = 0;

	// End Pixel tracking start.
	if( typeof( is_pixel_enabled ) !== 'undefined' && 'true' == is_pixel_enabled ) {

		// Add Pixel basecode.
		pixel_account_id = mwb.facebook_pixel.pixel_account_id;
		product_catalog_id = mwb.facebook_pixel.product_catalog_id;
		enable_pixel_debug_mode = mwb.facebook_pixel.enable_debug_mode;
		enable_pixel_viewcontent_event = mwb.facebook_pixel.enable_viewcontent_event;
		enable_pixel_add_to_cart_event = mwb.facebook_pixel.enable_add_to_cart_event;
		enable_pixel_initiate_checkout_event = mwb.facebook_pixel.enable_initiate_checkout_event;
		enable_pixel_purchase_event = mwb.facebook_pixel.enable_purchase_event;

		/**
		 * Event : View Content.
		 * Location required : Product Page.
		 */
		if( typeof( enable_pixel_viewcontent_event ) != 'undefined' && 'yes' == enable_pixel_viewcontent_event ) {

			if( 'product' == current_location ) {
				fbq('track', 'ViewContent', {
					value: mwb.product_price,
					currency: currency_code,
				});
			}
		}

		/**
		 * Event : Add to Cart.
		 * Location required : Product Page/ Shop page.
		 */
		if( typeof( enable_pixel_add_to_cart_event ) != 'undefined' && 'yes' == enable_pixel_add_to_cart_event ) {

			if( 'product' == current_location ) {
				if( jQuery( '.single_add_to_cart_button' ).length != '0' ) {
					jQuery(document).on( 'click', '.single_add_to_cart_button', add_to_cart );
				}
			}

			if( 'shop' == current_location ) {
				jQuery(document).on( 'click', '.add_to_cart_button', add_to_cart );
			}
		}

		/**
		 * Event : Initiate Checkout.
		 * Location required : Checkout Page.
		 */
		if( typeof( enable_pixel_initiate_checkout_event ) != 'undefined' && 'yes' == enable_pixel_initiate_checkout_event ) {
			
			if( 'checkout' == current_location ) {

				if( jQuery( '#place_order' ).length != '0' ) {
					jQuery(document).on( 'click', '#place_order', initiate_checkout );
				}
			}
		}

	} // End Pixel tracking end.

	// End GA tracking start.
	if( typeof( is_ga_enabled ) !== 'undefined' &&  'true' == is_ga_enabled ) {

		// Add GA basecode.
		ga_account_id = mwb.google_analytics.ga_account_id;
		enable_ga_purchase_event = mwb.google_analytics.enable_purchase_event;
		enable_ga_pageview_event = mwb.google_analytics.enable_pageview_event;
		enable_ga_debug_mode = mwb.google_analytics.enable_debug_mode;

	} // End GA tracking end.

	/**
	 * Start Debugging via console.
	 */
	debug_setup_values();



	/**==================================
		All function definations here
	===================================*/

	/**
	 * Add to cart event Function.
	 */
	function add_to_cart(e) {

		if( 'product' == current_location ) {
			quantity = jQuery( 'input[name=quantity]' ).val();
			total_value = parseInt( quantity ) * parseFloat( mwb.product_price );
			product_id = mwb.product_id;
		}

		else if ( 'shop' == current_location ){

			quantity = jQuery( this ).attr( 'data-quantity' );
			product_id = jQuery( this ).attr( 'data-product_id' );
			jQuery( this ).parent().find( 'a' ).map( function() {
            
	            // Check if any of them are empty.
	            if( jQuery( this ).hasClass( 'woocommerce-loop-product__link' ) ) {
	            	price_html = jQuery( this ).find( 'span.price ins' ).text();
	            	total_value = price_html.replace( currency_symbol , '' );
	            }
	        });
		}

		// Trigger event.
		fbq('track', 'AddToCart', {
			value: total_value,
			currency: currency_code,
			contents: [
				{
				    id: product_id,
				    quantity: quantity
				}
			],
			content_type : 'product',
			product_catalog_id : product_catalog_id,
		});
	}

	/**
	 * Initiate Checkout event Function.
	 */
	function initiate_checkout(e) {

		e.preventDefault();

		// Trigger event.
		fbq( 'track', 'InitiateCheckout',{
			value: mwb.cart_value,
			currency: currency_code,
		});

		// Submit checkout form.
		jQuery( 'form.checkout' ).submit();
	}

	/**
	 * Debugger Function.
	 */
	function debug_setup_values() {
		
		// Only for admin.
		if( ! current_user_role.includes( 'administrator' ) ) {
			return;
		}

		if( typeof( enable_pixel_debug_mode ) != 'undefined' && 'yes' == enable_pixel_debug_mode ) {
			console.log( '/**===================' );
			console.log( '  Pixel Analytics' );
			console.log( '====================*/' );
			console.log( 'Pixel Account Id : ' + pixel_account_id ) ;
			console.log( 'View Content Event : ' + enable_pixel_viewcontent_event );
			console.log( 'Add To Cart Event : ' + enable_pixel_add_to_cart_event );
			console.log( 'Initiate Checkout Event : ' + enable_pixel_initiate_checkout_event );
			console.log( 'Purchase Event : ' + enable_pixel_purchase_event );
		}

		if( typeof( enable_ga_debug_mode ) != 'undefined' && 'yes' == enable_ga_debug_mode ) {
			console.log( '/**===================' );
			console.log( '  Google Analytics' );
			console.log( '====================*/' );
			console.log( 'Google Analytics Account Id : ' + ga_account_id ) ;
			console.log( 'Page View Event : ' + enable_ga_pageview_event );
			console.log( 'Purchase Event : ' + enable_ga_purchase_event );
		}

		console.log( 'Current Location : ' + current_location );
	}

// End of script.
});