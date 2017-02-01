var d, $container, handAndStick;
var modifiers = [
//    'ఀఁంఃఽా	ిౄృూుీెేైౕౖౢౣొోౌ్',
    'ఀ ఁ ం ః ఴ ఽా ి ీ ు ూ ృ ౄ ె ే ై ొ  ో ప ౌ ౕ	ౖ ౚ ౢ	ౣ'              ,// Telugu modifiers
//    'ఀ ఁ ం ః',
    'ऺऻ़ऽािीुूृॄॅॆेैॉॊोौ्ॎॏ॒॑॓॔ॕॖॗ',       // Hindi modifiers
].join('');
var diff_modifiers = [];

function setupAnimation(xmlfile){
    $container = $('#container');

    d = new Design(xmlfile, function(){
        this.makeMenu();
    });
    $('#next').click(function(){ animationQueue.next('next'); });
    $('#prev').click(function(){ animationQueue.next('prev'); });
    $('#menu').click(function(){ d.makeMenu(); });
    $('#replay').click(function(){animationQueue.replay();});
    $('#footer').show();
};

function scrollToEnd() {
    $('body').animate({
      scrollTop: document.body.scrollHeight
    }, 'slow');
}

/*
 * The following function is a Constructor for Design, to be called when design is to be loaded
 */
function Design(xmlFile, callBack, argsForCallback) {

    /* Setting callback to be called after the XML file has been loaded */
    this.onload = callBack;
    this.argsForCallback = argsForCallback;


    response = xmlFile;

        /* response is the XML Document | $(response) is jQuery Object for corresponding XML */
        this.xmlDoc = $(response);

        var xmlEle = null;
        var designNode = this.xmlDoc.find('design').first();

        // Getting <language>
        var lang = designNode.find('design > language').text().trim();
        if (lang !== "") {
            this.language = lang;
        }

        // Getting <backgroundimage>
        var imagePath = designNode.find('design > backgroundimage').text().trim();
        if (imagePath !== "") {        // if <backgroundimage> exists, getting backgroundimage
            this.backgroundimage = imagePath;
        }

        // Getting <backgroundcolor>
        var color = designNode.find('design > backgroundcolor').text().trim();
        if (color !== "") {        // if <backgroundcolor> exists, getting backgroundcolor
            this.backgroundcolor = color;
        }
        else {
            this.backgroundcolor = 'yellow';        //Default color, if no color given
        }

        // Getting <colortheme>
        getColorTheme.call(this, designNode );

        // Getting <sizeofletters>
        getFontSize.call(this, designNode );

        // Getting <animationstyle>
        getAnimationStyle.call(this, designNode );

        // Getting <animationspeed>
        getAnimationSpeed.call(this, designNode );

        var imagePath = designNode.find('design > imagefornextbutton').text().trim();
        if (imagePath !== "") {
            $('#next').html($('<img>').attr('src',imagePath));
        }
        var imagePath = designNode.find('design > imageforpreviousbutton').text().trim();
        if (imagePath !== "") {
            $('#prev').html($('<img>').attr('src',imagePath));
        }
        var imagePath = designNode.find('design > imageformenubutton').text().trim();
        if (imagePath !== "") {
            $('#menu').html($('<img>').attr('src',imagePath));
        }
        var imagePath = designNode.find('imageforhandandstick').text().trim();
        if (imagePath !== "") {
            this.imageforhandandstick = handAndStick = $('<img>', {
                'class' : 'hand-and-stick'
            }).attr('src',imagePath);
        }
        /*
         * Each design Object has lessons Array. It will have the lesson Object as given in XML document
         */
        this.lessons = new Array();

        var lessonElements = designNode.find('lesson'); // This is collection of all <lesson> from XML

        /*
         * Making Lesson Object for each <lesson> in XML
         */

        lessonElements.each(function(design){

            design.lessons.push( new Lesson( $(this), design ) );
                                        // <lesson>

        },[this]);
                    /* [this] is array of arguments to function called for each <lesson> in <design>
                     * 'this' here refer to design Object,
                     * whereas inside function, this refer to <lesson>
                     */

        /*
         * The XML document has been successfully loaded here.
         * Now, Making animationQueue and
         * Calling the callback function (if any)
         */

        this.makeAnimationQueue();

        if( this.onload !== undefined && typeof(this.onload) === "function") {
            this.onload.apply(this, ( (this.argsForCallback instanceof Array)?this.argsForCallback:undefined) );
        }
        delete this.onload;
        delete this.argsForCallback;

    //For Debugging purpose
    this.type = 'Design, language: '+this.language;
}

/*
 * The following function is a Constructor for Lesson. It extracts data related to each lesson from XML,
 * sets the animationStyle, colorScheme (if any),
 */
function Lesson(lessonNode, parentDesignElement) {

    /* setting parent for the Lesson */
    this.parent = parentDesignElement;

    // Getting <colortheme>
    getColorTheme.call(this, lessonNode );

    // Getting <sizeofletters>
    getFontSize.call(this, lessonNode );

    // Getting <animationstyle>
    getAnimationStyle.call(this, lessonNode );

    // Getting <animationspeed>
    getAnimationSpeed.call(this, lessonNode );

    //Getting <instructions>
    getInstructions.call(this, lessonNode );

    //Getting <goals>
    var goalElements = lessonNode.find('goals').children();
    this.goals = new Array();

    goalElements.each(function(goals){
        var goal = new Object();
        var count = getTextSoundImage.call(goal, $(this));
        if( count !== 0 ) {
            goals.push(goal);
        }
    },[this.goals]);

    /*
     * Getting Title for this lesson
     */
    this.title = lessonNode.find('title').text().trim();

    var letterElements = lessonNode.find('letters').children();        // Getting <letters>

    /*
     * Each Lesson will have n letters,
     * which will be saved as Letter Object, in letters array inside Lesson Object
     */

    this.letters = new Array();     //Letter Objects will be stored here

    letterElements.each(function(lesson){

        lesson.letters.push(new Letter( $(this), lesson ));

    }, [this] );

    //For Debuging
    this.type = 'Lesson, title: '+this.title;
}

/*
 * The following function is a Constructor for Letter. It extracts data related to each letter in a lesson from XML,
 * and make the HTML DOM Objects, sets the animationStyle, colorScheme (if any).
 */

function Letter(letterNode, parentLessonObject) {

    /* setting parent(Lesson) for the Letter */
    this.parent = parentLessonObject;

    getTextSoundImage.call(this, letterNode );

    //Getting <instructions>
    getInstructions.call(this, letterNode );

    // Getting <colortheme>
    getColorTheme.call(this, letterNode );

    // Getting <sizeofletters>
    getFontSize.call(this, letterNode );

    // Getting <animationstyle>
    getAnimationStyle.call(this, letterNode );

    // Getting <animationspeed>
    getAnimationSpeed.call(this, letterNode );

    var wordElements = letterNode.find('words').children();
    this.words = new Array();

    wordElements.each(function(letter){

        letter.words.push(new Word( $(this), letter ));

    }, [this] );

    this.type = 'Letter, text: '+this.text;
}

function Word(wordNode, parentLetterObject){
    this.parent = parentLetterObject;

    getTextSoundImage.call(this, wordNode );

    // Getting <colortheme>
    getColorTheme.call(this, wordNode );

    // Getting <sizeofletters>
    getFontSize.call(this, wordNode );

    // Getting <animationstyle>
    getAnimationStyle.call(this, wordNode );

    // Getting <animationspeed>
    getAnimationSpeed.call(this, wordNode );


    this.type = 'Word, text: '+this.text;
}

function Sound( pathOfAudioFile ) {
    var audio = new Audio(pathOfAudioFile);
    this.play = audio.play.bind(audio);
    audio.onended = function(e){
        animationQueue.next('afterAnimation', {source:'soundEnded', event:e});
    };
    this.stop = audio.load.bind(audio);
    this.getDuration = function() {
        return Math.round(1000*audio.duration)/1000;
    };
}

function toUnicode(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}

function detect_best_size(count) {
    if(count < 7) return '9rem';
    if(count < 12) return '7rem';
    if(count < 19) return '5rem';
    return '4rem';
}

Letter.prototype.start = function() {
    var titleCont = $('<div class="title-container"></div>').css({
        'color':this.textColor,
        'font-size':'9rem'
    });

    emptyContainer().append( titleCont );
    showButtons();
    this.parent.parent.setBackground();
    diff_modifiers = [];
    for(var i=0; i<this.parent.title.length; i++) {
        var letter = this.parent.title[i];
        diff_modifiers.push(i);
        while (this.parent.title[i+1] && modifiers.indexOf(this.parent.title[i+1]) != -1) {
            letter += this.parent.title[i+1];
            //console.log(letter+" "+this.parent.title[i]+" "+this.parent.title[i+1]);
            //console.log(toUnicode(letter)+" "+toUnicode(this.parent.title[i])+" "+toUnicode(this.parent.title[i+1]));
            i++;
        }
        var ele = $('<div class="title-letter">'+ letter +'</div>').appendTo( titleCont );
        if ( this.parent.title[i] === this.text ) {
            ele.css('color', this.highlightColor);
        }
    }

    $('.title-container').css('font-size', detect_best_size(diff_modifiers.length));

    var letterEle = $('<div class="letter">'+this.text+'</div>').css({
        'color':this.highlightColor,
        'font-size':this.sizeofletters,
        'display':'inline'
    }).appendTo( $container );

    if ( this.animationspeed === 'withsound' ) {
        this.animationspeed = (this.sound)?this.sound.getDuration():1200;
    }
    letterEle.data('myObject',this);

    this.fallingletters(letterEle);
};

Letter.prototype.fallingletters = function(letterEle) {
    var letterInTitle;

    var index = this.parent.title.indexOf(this.text);
    var adjusted_index = diff_modifiers.indexOf(index);
    if(adjusted_index < 0) { adjusted_index=index; /* Don't know if it will ever come here, but let us not break anything :)*/ }

    if ( index !== -1) {
        letterInTitle = $('.title-letter').get(adjusted_index);
    }
    letterEle.css('position','absolute');
    var pos = (letterInTitle)?(letterInTitle.getBoundingClientRect()):({
        top : -letterEle.height(),
        left: (window.innerWidth - letterEle.outerWidth() )/2
    });
    letterEle.css({
        top : '0px',
        left: pos.left + 'px'
    });

    var pseudoLetter = $('<div class="pseudo-letter">'+this.text+'</div>').css({
        'display':'inline',
        'color':this.highlightColor,
        'font-size':this.sizeofletters,
        'visibility':'hidden'
    }).appendTo($container);
    var finalPos = Object.create(pseudoLetter.position());
    pseudoLetter.remove();
    letterEle.animate({
        top: finalPos.top+'px'
    }, this.animationspeed)
    .animate({
        left: finalPos.left+'px'
    }, this.animationspeed, function(){
        $(this).css({
            position:'relative',
            'top':'0px',
            'left':'0px'
        });
        $(this).data('myObject').grow($(this));
    });
};

Letter.prototype.grow = function(letterEle) {
    console.log(letterEle);
    letterEle.animate({
        'font-size':'+=80px',
        'top':'-=40px'
    },this.animationspeed,function(){
        $(this).addClass('blink');
        var pos = this.getBoundingClientRect();
        placeHandAndStick(
                (pos.top+pos.bottom)/2+25,
                (pos.left+pos.right)/2
        );
    });
};


Letter.prototype.complete = function() {

    var titleCont = $('<div class="title-container"></div>').css({
        'color':this.textColor,
        'font-size':this.sizeofletters,
        'position':'relative',
    });

    emptyContainer().append( titleCont );
    showButtons();
    this.parent.parent.setBackground();

    var letterInTitle;
    for(var i=0; i<this.parent.title.length; i++) {
        var letterChar = this.parent.title[i];
        while (this.parent.title[i+1] && modifiers.indexOf(this.parent.title[i+1]) != -1) {
            letterChar += this.parent.title[i+1];
            i++;
        }
        var ele = $('<div class="title-letter">'+ letterChar +'</div>').appendTo( titleCont );
        if ( this.parent.title[i] === this.text ) {
            ele.css('color', this.highlightColor);
            if ( !letterInTitle ) {
                letterInTitle = ele;
            }
        }
    }

    $('.title-container').css('font-size', detect_best_size(diff_modifiers.length));
    
    var letterEle = $('<div class="letter">'+this.text+'</div>').css({
        'font-size':this.sizeofletters,
        'display':'inline-block',
        'color': this.highlightColor,
        'position':'relative',
        'top':'0'
    }).appendTo( $container );

};

Word.prototype.start = function() {
    this.parent.complete();
    var title = this.parent.parent.title;

    var final = $('<div class="word"></div>');
    var finalArray = new Array();
    for(var i=0; i < this.text.length; i++) {
        var letterChar = this.text[i];
        if (this.text[i+1] && modifiers.indexOf(this.text[i+1]) != -1) {
            letterChar += this.text[i+1];
            i++;
        }
        var letter = $('<span class="pseudo-word-letter">'+ letterChar +'</span>');
        letter.css('visibility','inherit').appendTo(final);
        finalArray.push(letter);
    }
    final.css({
        'color':this.parent.highlightColor,
        'font-size': parseInt($('.title-letter').css('font-size'))*1.75+'px',
        'margin-top':'-75px',
        'visibility':'hidden'
    }).appendTo($container);

    var forAnimation = new Array();

    for(var i=0; i<finalArray.length; i++) {
        if ( finalArray[i].width() !== 0) {
            var letterChar = finalArray[i].text();
            var index = title.indexOf( letterChar );
            var adjusted_index = diff_modifiers.indexOf(index);
            if(adjusted_index < 0) { adjusted_index=index; /* Don't know if it will ever come here, but let us not break anything :)*/ }
            var letter = $('<span class="word-letter">'+letterChar+'</span>')
                .css({
                    'position':'absolute',
                    'display':'inline-block',
                    'color':this.parent.highlightColor,
                    'font-size': $('.title-letter').css('font-size')
                }).appendTo($container);
            if (index !== -1) {
                var pos = $('.title-letter').get(adjusted_index).getBoundingClientRect();
                letter.css({
                    'top': (pos.top+20)+'px',
                    'left':pos.left+'px'
                });

                var adjusted_index = diff_modifiers.indexOf(index);
                if(adjusted_index < 0) { adjusted_index=index; /* Don't know if it will ever come here, but let us not break anything :)*/ }
                var pos = $('.title-letter').get(adjusted_index).getBoundingClientRect();
                var diff_pos = diff_modifiers[pos];
                letter.css({
                    'top': '0px',
                    'left':pos.left+'px'
                });
            }
            else {
                letter.css({
                    'left': ((window.innerWidth - letter.outerWidth() )/2) +'px',
                    'top' : (-letter.outerHeight()) +'px'
                });
            }
            forAnimation.push(letter.hide());
            letter.data('final', finalArray[i]);
        }
        else {
            var index = title.indexOf( this.text.charAt(i) );
            if ( forAnimation.length !== 0 ) {
                forAnimation[forAnimation.length-1].append(this.text.charAt(i));
            }
            else {

            }
        }
    }
    if (this.animationspeed === 'withsound') {
        this.animationspeed = this.sound.getDuration()/forAnimation.length;
    }
    for(var i=0; i<forAnimation.length;i++) {
        forAnimation[i].data({
            'next':forAnimation[i+1],
            'animationspeed':this.animationspeed
        });
    }
    animateLetterOfWords.call(forAnimation[0]);
};

function animateLetterOfWords() {
    var pos = this.data('final').position();
    this.show().animate({
        top:pos.top+'px',
        left:pos.left+'px'
    },
    this.data('animationspeed'),
    function() {
        if ( $(this).data('next') ) {
            animateLetterOfWords.call($(this).data('next'));
        }
        else {
            $(this).parent().find('.word-letter').each(function(){
                $(this).animate({
                    'font-size':parseInt($('.title-letter').css('font-size'))*1.7+'px'
                },1000).addClass('blink');
            });
            var a = $(this).parent().find('.word-letter');
            if (a.length) {
                placeHandAndStick(
                        a.first().position().top+a.first().height(),
                       (a.first().position().left+a.last().position().left)/2
                );
            }
        }
    });
    //scrollToEnd();
}

/* Helper functions */

function placeHandAndStick(top,left) {
    if (!handAndStick || top==100) {
        return;
    }
    $('.hand-and-stick').remove();
    handAndStick.clone().css({
        'max-height':'200px',
        'max-width':'200px',
        'position':'absolute',
        'top':(parseInt(top)+40)+'px',
        'left':parseInt(left)+'px'
    }).appendTo($container);
    scrollToEnd();
}

function getColorTheme(node) {
    var colors = node.children('colortheme').text().trim().replace('{','').replace('}','');
    if (colors !== "") {
        colors = colors.split(',');
        this.textColor = colors[0].trim();
        this.highlightColor = colors[1].trim();
    }
    else {
        if (this.parent) {
            this.textColor = this.parent.textColor;
            this.highlightColor = this.parent.highlightColor;
        }
        else {
            this.textColor = 'blue';
            this.highlightColor = 'red';
        }
    }
}

function getFontSize(node){
    var size = node.children('sizeofletters').text().trim().toLowerCase();
    if ( size !== "" ) {
        if ( size === 'small' ) {
            this.sizeofletters = '2em';
        }
        else if ( size === 'medium' ) {
            this.sizeofletters = '5em';
        }
        else if ( size === 'large' ) {
            this.sizeofletters = '7em';
        }
    }
    else if (this.parent && this.parent.sizeofletters) {
        this.sizeofletters = this.parent.sizeofletters;
    }
    else {
        this.sizeofletters = '4em';
    }
}

function getAnimationStyle( node ) {
    var style = node.children('animationstyle').text().replace('{','').replace('}','').trim().toLowerCase();
    if ( style !== "") {
        this.animationstyle = style.split(',');
        for(var i=0;i<this.animationstyle.length;i++) {
            this.animationstyle[i] = this.animationstyle[i].trim();
        }
    }
    else if (this.parent && this.parent.animationstyle) {
        this.animationstyle = this.parent.animationstyle;
    }
    else {
        this.animationstyle = ['fallingletters'];
    }
}

function getAnimationSpeed( node ) {
    var speed = node.children('animationspeed').text().replace('{','').replace('}','').trim().toLowerCase();
    if (speed !== "") {
        switch (speed) {
            case 'slow':
                this.animationspeed = 1500;
                break;
            case 'fast':
                this.animationspeed = 750;
                break;
            case 'withsound':
                this.animationspeed = speed;
                break;
            default:
                if (isNumber(speed)) {
                    this.animationspeed = parseInt(speed);
                }
                else {
                    this.animationspeed = 1200;
                }
                break;
        }
    }
    else {
        if ( this.parent && this.parent.animationspeed ) {
            this.animationspeed = this.parent.animationspeed;
        }
        else {
            this.animationspeed = 'withsound';
        }
    }
}

function isNumber(string) {
    var zero = '0'.charCodeAt(0);
    var nine = '9'.charCodeAt(0);
    for(var i=0; i<string.length;i++) {
        var code = string.charCodeAt(i);
        if (code < zero && code > nine) {
            return false;
        }
    }
    return true;
}

function emptyContainer(callAnimationQueue) {
    if (callAnimationQueue) {
        $container.empty();
        animationQueue.next('afterAnimation');
        return;
    }
    return $container.empty();
}

function getInstructions( node ) {
    var instructionsNode = node.children('instructions');

    this.instructions = new Object();
    this.instructions.start = new Object();
    this.instructions.middle = new Object();
    this.instructions.end = new Object();

    var count = getTextSoundImage.call(this.instructions.start, instructionsNode.find('start') );
    if (count === 0) {
        delete this.instructions.start;
    }

    var count = getTextSoundImage.call(this.instructions.middle, instructionsNode.find('middle') );
    if (count === 0) {
        delete this.instructions.middle;
    }

    var count = getTextSoundImage.call(this.instructions.end, instructionsNode.find('end') );
    if (count === 0) {
        delete this.instructions.end;
    }
}

function getTextSoundImage( node ) {
    var count = 0;
    var text = node.children('text').text().trim();
    if ( text !== "" ) {
        this.text = text;
        count++;
    }
    var sound = node.children('sound').text().replace('{', '').replace('}', '').trim();
    if ( sound !== "" ) {
        this.sound = new Sound(sound);
        count++;
    }
    var image = node.children('image').text().replace('{', '').replace('}', '').trim();
    if ( image !== "" ) {
        this.image = image;
        count++;
    }
    return count;
}

function showTextAndImage(design, textColor, fontSize) {
    showButtons();
    design.setBackground();
    var container = $('<div class="text-image-container">').appendTo( emptyContainer());
    if (this.text && this.image) {
        container.append( $('<div class="text-with-image">').html(this.text).css({
                                                                                    'color': textColor
                                                                                }) )
                        .append( $('<div class="image-with-text">').html( $('<img>').attr('src',this.image) ));
    }
    else if (this.text) {
        container.append( $('<div class="only-text">').html(this.text).css({
                                                                                    'color': textColor
                                                                                }) );
    }
    else if (this.image) {
        container.append( $('<div class="only-image">').html( $('<img>').attr('src',this.image) ));
    }
    else {
    }
    animationQueue.next('afterAnimation');
}

function getAnimationArray(design, textColor, fontSize) {
    var array = new Array();
    if (this.sound) {
        array.push({
            start : this.sound.play,
            stop  : this.sound.stop
        });
    }
    array.push({
        start : showTextAndImage.bind(this),
        arrayOfArgumentsForStart : [design, textColor, fontSize]
    });
    return array;
}

Design.prototype.makeAnimationQueue = function() {
    var design = this;
    for( var i=0; i < design.lessons.length ; i++) {
        if ( design.lessons[i].instructions.start ) {
            var array = getAnimationArray.call(design.lessons[i].instructions.start, design, design.lessons[i].textColor, design.lessons[i].sizeofletters);
            var index = animationQueue.push(array);
            if ( design.lessons[i].index === undefined) {
                design.lessons[i].index = index;
            }
        }

        for(var j=0; j < design.lessons[i].goals.length; j++) {
            var array = getAnimationArray.call(design.lessons[i].goals[j], design, design.lessons[i].textColor,design.lessons[i].sizeofletters);
            var index = animationQueue.push(array);
            if ( design.lessons[i].index === undefined ) {
                design.lessons[i].index = index;
            }
        }

        for( var j=0; j < design.lessons[i].letters.length ; j++ ) {

            if ( design.lessons[i].letters[j].instructions.start ) {
                var array = getAnimationArray.call(design.lessons[i].letters[j].instructions.start, design, design.lessons[i].textColor,design.lessons[i].sizeofletters);
                var index = animationQueue.push(array);
                if ( design.lessons[i].index === undefined) {
                    design.lessons[i].index = index;
                }
                if ( design.lessons[i].letters[j].index === undefined) {
                    design.lessons[i].letters[j].index = index;
                }
            }

            var array = new Array();
            if (design.lessons[i].letters[j].sound) {
                array.push({
                    start  : design.lessons[i].letters[j].sound.play,
                    stop   : design.lessons[i].letters[j].sound.stop
                });
            }
            array.push({
                start : design.lessons[i].letters[j].start,
                bindTo: design.lessons[i].letters[j]
            });
            var index = animationQueue.push(array);
            if ( design.lessons[i].index === undefined ) {
                design.lessons[i].index = index;
            }
            if ( design.lessons[i].letters[j].index === undefined) {
                design.lessons[i].letters[j].index = index;
            }

            for( var k=0; k < design.lessons[i].letters[j].words.length; k++ ) {
                var array = new Array();
                if ( design.lessons[i].letters[j].words[k].sound ) {
                    array.push({
                        start  : design.lessons[i].letters[j].words[k].sound.play,
                        stop   : design.lessons[i].letters[j].words[k].sound.stop
                    });
                }
                array.push({
                    start : design.lessons[i].letters[j].words[k].start,
                    bindTo: design.lessons[i].letters[j].words[k]
                });
                var index = animationQueue.push(array);
                if ( design.lessons[i].index === undefined ) {
                    design.lessons[i].index = index;
                }
                if ( design.lessons[i].letters[j].index === undefined) {
                    design.lessons[i].letters[j].index = index;
                }
                if ( design.lessons[i].letters[j].words[k].index === undefined) {
                    design.lessons[i].letters[j].words[k].index = index;
                }

                var array = new Array();
                array.push({
                    start : showTextAndImage.bind(design.lessons[i].letters[j].words[k]),
                    arrayOfArgumentsForStart : [design, design.lessons[i].letters[j].textColor, design.lessons[i].letters[j].sizeofletters]
                });
                if (design.lessons[i].letters[j].words[k].image) {
                    animationQueue.push(array);
                }
            }
            if ( design.lessons[i].letters[j].instructions.end ) {
                var array = getAnimationArray.call(design.lessons[i].letters[j].instructions.end, design, design.lessons[i].textColor,design.lessons[i].sizeofletters);
                var index = animationQueue.push(array);
                if ( design.lessons[i].index === undefined) {
                    design.lessons[i].index = index;
                }
                if ( design.lessons[i].letters[j].index === undefined) {
                    design.lessons[i].letters[j].index = index;
                }
            }
        }
        if ( design.lessons[i].instructions.end ) {
            var array = getAnimationArray.call(design.lessons[i].instructions.end, design, design.lessons[i].textColor,design.lessons[i].sizeofletters);
            var index = animationQueue.push(array);
            if ( design.lessons[i].index === undefined) {
                design.lessons[i].index = index;
            }
        }
    }
};

Design.prototype.makeMenu = function() {
    var design = this;
    var menu = this.xmlDoc.find('menu');
    var title = menu.find('title').text().trim();
    var color = menu.find('colortheme').text().replace('{','').replace('}','').trim();
    var backgroundcolor = menu.find('backgroundcolor').text().replace('{','').replace('}','').trim();
    var backgroundimage = menu.find('backgroundimage').text().replace('{','').replace('}','').trim();
    hideButtons();
    $('body').css({
        'background-image':'url('+backgroundimage+')',
        'background-color':backgroundcolor
    });
    var menuContainer = $('<div class="menu-container"></div>').appendTo( emptyContainer() ).css({
        'color':color
    });
    menuContainer.append( $('<div class="menu-title"></div>').html( title ) );
    for(var i=0; i<design.lessons.length; i++) {
        var menuItem = $('<div class="menu-item"></div>')
            .append(
                $('<div class="menu-bullet">+</div>')
                .on('click', function(){
                    if( $(this).html().trim() === '+' ) {
                        $(this).html('-')
                        .parent().data('subItem').slideDown();
                    }
                    else {
                        $(this).html('+')
                        .parent().data('subItem').slideUp();
                    }
                })
             ).append(
                $('<div class="menu-text">'+design.lessons[i].title+'</div>')
                .data('index',design.lessons[i].index)
                .click(function(){
                    animationQueue.goto( $(this).data('index') );
                })
            ).appendTo( menuContainer );
        var subItemContainer = $('<div class="sub-menu-container">').appendTo(menuItem).hide();
        menuItem.data('subItem',subItemContainer);
        for(var j=0; j<design.lessons[i].letters.length; j++) {
            var subMenuItem = $('<div class="sub-menu-item">').appendTo(subItemContainer)
                .append(
                    $('<div class="menu-bullet small">+</div>')
                    .on('click', function(){
                    if( $(this).html().trim() === '+' ) {
                        $(this).html('-')
                        .parent().data('subItem').slideDown();
                    }
                    else {
                        $(this).html('+')
                        .parent().data('subItem').slideUp();
                    }
                })
                )
                .append( $('<div class="menu-text">'+design.lessons[i].letters[j].text+'</div>')
                    .data('index',design.lessons[i].letters[j].index)
                    .click(function(){
                    animationQueue.goto( $(this).data('index') );
                    })
                );
            var subItemContainer2 = $('<div class="sub-menu-container">').appendTo(subMenuItem).hide();
            subMenuItem.data('subItem',subItemContainer2);
            for(var k=0; k<design.lessons[i].letters[j].words.length; k++) {
                var subMenuItem2 =
                        $('<div class="sub-menu-item">').appendTo(subItemContainer2)
                        .append(design.lessons[i].letters[j].words[k].text)
                        .data('index', design.lessons[i].letters[j].words[k].index)
                        .click(function(){
                            animationQueue.goto( $(this).data('index') );
                        });
            }
        }
    }
};

Design.prototype.setBackground = function() {
    $('body').css({
        'background-image':'url('+this.backgroundimage+')',
        'background-color':this.backgroundcolor
    });
};

function hideButtons() {
    $('#animation-control').hide();
}
function showButtons() {
    $('#animation-control').show();
}
