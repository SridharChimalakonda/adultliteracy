/*
 * The following function(s) will take care of the animation.
 * This queue contains Arrays of object.
 * The prototype of this object is
 * {
 *   start  : Function (function to be called when animation has to be started)
 *   arrayOfArgumentsForStart: Array (this is the Array of arguments given to the above function)
 *   stop: Function (function to be called when animation has to stopped)
 *   arrayOfArgumentsForStop: Array (this is the Array of arguments given to the above function)
 *   bindTo: Object (the object to which this will correspond to in the above functions [it's is first argument to apply])
 * }
 * An array correspond to one animation. it may have as many number of such objects.
 * The next animation will start only after all these start function have done their jobs.
 *
 */

var animationQueue = new (function(){

 var 
    queue = new Array(),
    index = null,
    currLength = 0,
    curr = 0,
    mode = 'manual';
    
    this.q = queue;
    
    var stopThis = function(thisIndex){
        var array = queue[thisIndex];
        for( var i=0; i < array.length; i++) {
            if ( typeof( array[i].stop ) === 'function' ) {
                array[i].stop.apply( array[i].bindTo, array[i].arrayOfArgumentsForStop );
            }
            else {
                console.log('invalid function given to animation queue');
            }
        }
    };
    
    var startThis = function(thisIndex) {
        index = thisIndex;
        var array = queue[thisIndex];
        for( var i=0; i < array.length; i++) {
            if ( typeof( array[i].start ) === 'function' ) {
                array[i].start.apply( array[i].bindTo, array[i].arrayOfArgumentsForStart );
            }
            else {
                console.log('invalid function given to animation queue');
            }
        }
    };
    
    /* this function will push given element into queue */
    this.push = function(arg) {
        queue.push(arg);
        return queue.length - 1;
    };
    
    this.next = function(origin) {
        if (origin === 'afterAnimation' ) {
            
        }
        else if ( origin === 'next' ) {
            stopThis( index );
            if ( index+1 >= queue.length ) {
                return;
            }
            index++;
            startThis( index );
        }
        else if (origin === 'prev' )  {
            stopThis( index );
            if ( index < 1) {
                return;
            }
            index--;
            startThis(index);      
        }
    };
    
    this.goto = function(thisIndex) {
        if ( index !== null ) {
            stopThis( index );
        }
        startThis( thisIndex );
    };
    
    this.stop = function() {
        if ( index !== null ) {
            stopThis( index );
        }
        index = null;
    };
    this.replay = function() {
        if ( index !== null) {
            stopThis(index);
            startThis(index);
        }
    };
})();
