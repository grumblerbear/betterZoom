(function( source$ ){

	var methods;
	var customClass = 'better-zoom-wrapper';
	var customSelector = '.' + customClass;

	methods = {
		init: function (options) {
			//noinspection JSValidateTypes
			options = $.extend({
				width: 100,
				height: 100,
				limits: true
			}, options);

			return this.each(function () {
				// Целевое изображение и увеличенное
				var image;
				var source = new Image();
				// Лупа
				var glass;

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
					var widthRatio = source.width / image.outerWidth();
					var heightRatio =  source.height / image.outerHeight();

					$('body').append('<div class="better-zoom-glass"><div>');

					glass = $('.better-zoom-glass');
					glass.css({
						backgroundImage: 'url(' + source.src + ')',
						width: options.width + 'px',
						height: options.height + 'px'
					});

					image.mousemove(setPosition);
					glass.mousemove(setPosition);

					image.mouseout(setPosition);
					glass.mouseout(setPosition);
					/*
					image.mousewheel(setPosition);
					glass.mousewheel(setPosition);
					*/

					function setPosition(target) {
						var offset = image.offset();

						var left = target.pageX - offset.left;
						var top = target.pageY - offset.top;

						if (left < 0 || top < 0 || left > image.outerWidth() || top > image.outerHeight() ) {
							glass.hide();
						} else {
							var leftShift, leftPosition;
							var topShift, topPosition;

							leftShift = (left * widthRatio - glass.outerWidth() / 2) * (-1);
							leftPosition = target.pageX - glass.outerWidth() / 2;

							topShift = (top * heightRatio - glass.outerHeight() / 2) * (-1);
							topPosition = target.pageY - glass.outerHeight() / 2;

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