/**
 * Provides drag behaviour by extending the SwipeAction behaviour.
 * Basically this adds some visual elements to the swipe behavior.
 *
 *  - Element follows drag using CSS3 transform.
 *
 *  - Element slides off the screen to indicate a successful action.
 *
 *  - Element returns to original position to indicate a cancelled action.
 *
 * @author Karl Purkhardt
 * @date 14/07/2015
 */
var DragActionBehavior = SwipeActionBehavior.extend({

    /**
     * Handler for the on drag event which is called when the user drags across the screen.
     * Translates the elements X position so that the target element follows the drag.
     */
    onDrag: function(e) {

        var target = e.target;

        if (!e.gesture) {
            return;
        }

        // Translate the element on the X axis, following the drag gesture
        $(target).css({
            '-webkit-transform': 'translateX(' + e.gesture.deltaX + 'px)',
            'transform': 'translateX(' + e.gesture.deltaX + 'px)'
        });
    },

    /**
     * Overwrites the SwipeActionBehavior cancelAction method.
     * Translates the elements X position back to the starting position.
     */
    cancelAction: function($el) {

         // Transition the drag target back to the starting position
        $el.css({
            '-webkit-transition': '-webkit-transform 0.2s ease-in-out',
            'transition': 'transform 0.2s ease-in-out',
            '-webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)'
        });

        // Wait for the transition to end
        $el.on('transitionend webkitTransitionEnd', function() {
            SwipeActionBehavior.prototype.cancelAction.call(this, $el);
            this.reset($el);
        }.bind(this));
    },

    /**
     * Overwrites the SwipeActionBehavior completeAction method.
     * Translates the elements X position off screen in the direction of the drag/swipe.
     */
    completeAction: function($el) {

        // Determine the final translate value
        var finalTranslate = '-100%';
        if (this.direction === Hammer.DIRECTION_RIGHT) {
            finalTranslate = '100%';
        }

        // Transition the element off screen
        $el.css({
            '-webkit-transition': '-webkit-transform 0.45s ease-out',
            'transition': 'transform 0.45s ease-out',
            '-webkit-transform': 'translateX(' + finalTranslate + ')',
            'transform': 'translateX(' + finalTranslate + ')'
        });

        // Wait for the element to be off screen
        $el.on('transitionend webkitTransitionEnd', function() {
            $el.off('transitionend webkitTransitionEnd');

            // Transition the max-height of the element
            $el.css({
                '-webkit-transition': 'max-height 0.1s ease-out',
                'transition': 'max-height 0.1s ease-out',
                'max-height': '0'
            });

            // Wait for the height to reach 0
            $el.on('transitionend webkitTransitionEnd', function() {
                SwipeActionBehavior.prototype.completeAction.call(this, $el);
            }.bind(this));

        }.bind(this));
    },

    /**
     * Handler for the onSwipeReset event which is called whenever an action
     * is cancelled or complete.
     */
    onSwipeReset: function($el) {
        $el.css({
            '-webkit-transition': 'none',
            'transition': 'none'
        });
    }
});
