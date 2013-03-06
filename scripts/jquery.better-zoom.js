(function( source$ ){

	var methods;
	var customClass = 'better-zoom-wrapper';
	var customSelector = '.' + customClass;

	methods = {
		init: function (options) {
			//noinspection JSValidateTypes
			options = $.extend({
				width: 200,
				height: 200,
				limits: true,
				overlay: false
			}, options);

			return this.each(function () {
				var image;
				var source = new Image();

				$(this).addClass('better-zoom-wrapper');

				if ($(this).is('img')) {
					image = $(this);
				} else {
					image = $(this).find('img');
				}
				if ($(this).is('a')) {
					source.src = $(this).attr('href');
				} else {
					source.src = $(this).data('src');
				}

				$(source).load(function(){
					var glass = $('<div class="better-zoom-glass"><div>');
					glass.css({
						backgroundImage: 'url(' + source.src + ')',
						width: options.width + 'px',
						height: options.height + 'px'
					});
					glass.data({
						source: source,
						image: image,
						options: options
					});

					image.after(glass);

					if (options.overlay) {
						var overlay = $('<div class="better-zoom-overlay"><div>');
						overlay.css({
							left: image.offset().left + 'px',
							top: image.offset().top + 'px',
							width: image.outerWidth() + 'px',
							height: image.outerHeight() + 'px'
						});
						glass.after(overlay);
						overlay.mousemove(setPosition);
						overlay.mouseout(setPosition);
						overlay.mousewheel(setPosition);
					}

					image.mousemove(setPosition);
					glass.mousemove(setPosition);

					image.mouseout(setPosition);
					glass.mouseout(setPosition);

					image.mousewheel(setPosition);
					glass.mousewheel(setPosition);

					function setPosition(target) {
						var glass;
						if ($(this).is('.better-zoom-glass')) {
							glass = $(this);
						} else {
							if ($(this).is('.better-zoom-overlay')) {
								glass = $(this).prev();
							} else {
								glass = $(this).next();
							}
						}
						var image = glass.data('image');
						var source = glass.data('source');
						var options = glass.data('options');

						if (options.overlay) {
							var overlay = glass.next();
						}

						var widthRatio = source.width / image.outerWidth();
						var heightRatio =  source.height / image.outerHeight();

						var offset = image.offset();

						var left = target.pageX - offset.left;
						var top = target.pageY - offset.top;

						if (left < 0 || top < 0 || left > image.outerWidth() || top > image.outerHeight() ) {
							glass.hide();
							if (options.overlay) {
								overlay.hide();
							}
						} else {
							var leftShift = (left * widthRatio - glass.outerWidth() / 2) * (-1);
							var leftPosition = target.pageX - glass.outerWidth() / 2;

							var topShift = (top * heightRatio - glass.outerHeight() / 2) * (-1);
							var topPosition = target.pageY - glass.outerHeight() / 2;

							if (options.limits) {
								if (leftShift > 0) {
									leftShift = 0;
								}
								if (leftShift < (source.width - glass.outerWidth()) * (-1)) {
									leftShift = (source.width - glass.outerWidth()) * (-1);
								}
								if (topShift > 0) {
									topShift = 0;
								}
								if (topShift < (source.height - glass.outerHeight()) * (-1)) {
									topShift = (source.height - glass.outerHeight()) * (-1);
								}
							}
							glass.css({
								left: leftPosition + 'px',
								top: topPosition + 'px',
								backgroundPosition: leftShift + 'px ' + topShift + 'px'
							});

							glass.show();
							if (options.overlay) {
								overlay.show();
							}
						}
					}
				});
			});
		}
	};

	$.fn.betterZoom = function ( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Метод ' +  method + ' в jQuery.betterZoom не существует' );
		}
	};
})( jQuery );