/**
 * Adds the complex keypress event.
 * 
 * @author Deg Valentine
 * @param start the starting sequence of characters
 * @param end the ending sequence of characters
 * @param handler a closure to handle the complex event
 *
 * TODO does using '==' instead of '>=' to compare states cause errors?
 */
(function($){
$.fn.charSequence = function(start, end, handler) {

    $(this).each(function(){
        bind($(this), convert(start), convert(end), handler, getId($(this)));
    });
    return this;

    /**
     * Converts a character sequence to an array of character codes.
     * @param seq string|[] the sequence to convert
     */
    function convert(seq)
    {
        if (typeof(seq) == 'string') {
            var code = [];
            for (var i in seq) {
                code[i] = seq.charCodeAt(i);
            }
            return code;
        }
        return seq;
    }

    /**
     * Dispatches to method or initializes widget.
     */
    function bind(elem, start, end, handler, eid)
    {
        // define data keys
        var cacheKey = 'cache-' + eid;
        var isCaching = 'isCaching-' + eid;
        var eventKey = 'complex-keypress-' + eid;
        var stateKey = 'state-' + eid;

        // bind handler
        elem.bind(eventKey, handler);
        
        // bind listener to trigger handler
        elem.data(isCaching, start.length == 0);
        elem.data(stateKey, -1);
        elem.data(cacheKey, '');
        elem.bind('keypress', function(e) {
            var state = elem.data(stateKey);

            // starting sequence found, buffer data
            if (elem.data(isCaching)) {
                var cache = elem.data(cacheKey);
                cache += String.fromCharCode(e.which);
                elem.data(cacheKey, cache);
                
                if (end[state+1] != e.which) {
                    state = -1;
                }
                if (end[state+1] == e.which) {
                    ++state;
                    if (state == end.length - 1) {
                        elem.data(isCaching, start.length == 0);
                        state = -1;
                        elem.data(cacheKey, '');
                        elem.trigger(eventKey, [cache.substr(0, cache.length - end.length)]);
                    }
                }
                elem.data(stateKey, state);


            // look for starting sequence
            } else {
                if (start[state+1] != e.which) {
                    state = -1;
                }
                if (start[state+1] == e.which) {
                    ++state;
                    if (state == start.length - 1) {
                        elem.data(isCaching, true);
                        state = -1;
                    }
                }
                elem.data(stateKey, state);
            }
        });

        return elem;
    }

    /**
     * Returns an id to distinguish this complex keypress event.
     * @param elem the element to get id for
     */
    function getId(elem)
    {
        id = elem.data('ckeid');
        if (!id) {
            id = 0;
        }
        elem.data('ckeid', id+1);
        return id;
    }

}})(jQuery);
