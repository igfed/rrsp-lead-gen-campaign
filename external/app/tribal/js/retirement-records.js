$(function() {
    var $recordsCon = $('.area-l2.section.records');
    var $recordsList = $recordsCon.find('.records-list');
    var $modalContainer = $recordsCon.find('.modal-container');

    $recordsList.on('click', '.record-item-inner', function(e) {
        e.preventDefault();
        var $el = $(this).parent();
        $el.addClass('selected').siblings().removeClass('selected');

		var itemId = $el.data('itemid');
		var trackLabel = 'Retirement_LearnMore_' + itemId + '_Expand';
		//window.console.log('tracking: ' + trackLabel);
		igTrack('RRSP_ALBUMS', trackLabel);

        $modalContainer
            .trigger('populate', [$el])
            .trigger('show');

    });

    $modalContainer.find('.modal-cancel').on('click', function(e) {
        e.preventDefault();
        $modalContainer.trigger('cancel');
    });

    $modalContainer.find('.modal-nav').on('click', function(e) {
        $modalContainer.trigger('nav', [$(this).data('direction')]);
    });

    $modalContainer.on('cancel', function() {

        $(this).find('.modal-content').empty();
        $(this).trigger('hide');
        $(window).off('keyup.recordmodal');

        $(this).data('$el').removeClass('selected');

    }).on('click', '.modal-content a', function(e) {

        // ensure that if users click on a link within the modal, it cancels the modal so they navigate properly
        $modalContainer.trigger('cancel');

    }).on('hide', function() {

        $(this).hide();

        $('body').removeClass('rrsp-modal-open');

    }).on('populate', function(e, $elParent) {

        $(this).data('$el', $elParent);
        var htmlContent = $elParent.find('.modal-content').html();
        $(this).find('.modal-content')
			.html(htmlContent)
			.attr('data-recordid', $elParent.data('itemid'));

        $(this).find('.modal-illustration')
			.attr('data-recordid', $elParent.data('itemid'));

        //$(this).toggleClass('modal--has-prev', $elParent.prev().length > 0);
        //$(this).toggleClass('modal--has-next', $elParent.next().length > 0);

    }).on('nav', function(e, direction) {

        var $el = $(this).data('$el');
		var $newEl;

		var itemId = $el.data('itemid');
		var trackDirection = direction === 'next' ? 'Right' : 'Left';
		var trackLabel = 'Retirement_' + itemId + '_Adv_' + trackDirection;

		//window.console.log('tracking: ' + trackLabel);

		igTrack('RRSP_CAROUSEL', trackLabel);

		if (direction === 'next') {
			$newEl = $el.next().length ? $el.next() : $el.siblings().first();
		} else {
			$newEl = $el.prev().length ? $el.prev() : $el.siblings().last();
		}
        if ($newEl.length) {
            $(this).trigger('populate', [$newEl]);
            $newEl.addClass('selected').siblings().removeClass('selected');
        } else {
            return false;
        }

    }).on('show', function() {

        $(window).on('keyup.recordmodal.cancel', function(e) {
            if (e.which === 27) {
                $modalContainer.trigger('cancel');
                $(window).off('keyup.cancel');
            }
        });

        $(window).on('keyup.recordmodal.nav', function(e) {
            switch(e.which) {
                case 37: // left
                    $modalContainer.trigger('nav', ['prev']);
                    break;
                case 39: // right
                    $modalContainer.trigger('nav', ['next']);
                    break;
            }
        });

        $(this).show();
        $('body').addClass('rrsp-modal-open');

    });

});
