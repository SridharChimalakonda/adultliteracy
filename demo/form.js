$(function () {
    var $form = $('.generator-form');
    var $syllableGroup = $('.syllable-group');
    var $wordGroup = $('.word-group');
    var $welcomeScreen = $('.welcome-screen');
    var language = language_selected;
    $wordGroup.remove();
    $syllableGroup.remove();
    $('.generator-form').on('click', '.add-syllable', function () {
        $(this).siblings('.syllable-container').append($syllableGroup.clone());
        handle_local_language(language_selected);
    });
    $('.generator-form').on('click', '.add-word', function () {
        $(this).siblings('.word-container').append($wordGroup.clone());
	handle_local_language(language_selected);
    });
    var getXMLFromForm = function () {
        var data = {};
        data.titleOfTheLesson = $('.title-of-the-lesson').val();
        data.language = language;
        data.backgroundcolor = $('#color1').val();
        data.colortheme = "{"+($('#color2').val())+","+($('#color3').val())+"}";
        data.letters = Array.from($('.syllable-group').map(function () {
            var data = {};
            data.text = $(this).find('.syllable').val();
            data.words = Array.from($(this).find('.word-group').map(function () {
                var $this = $(this);
                var data = {};
                data.text = $this.find('.word').val();
                ['image', 'audio'].forEach(function (elem) {
                    var fileElem = $this.find('.' + elem + '-file')[0];
                    if (fileElem.files.length) {
			//var reader = new FileReader();
			//reader.onload = function(e) {
			//	image_name = +new Date();
				//data[elem] = "local"+image_name;
				//localStorage.setItem("local"+image_name, this.result);
			//}
			//reader.readAsDataURL(fileElem.files[0]);
                        data[elem] = URL.createObjectURL(fileElem.files[0]);
                    }
                });
                return data;
            }));
            return data;
        }));
        var template = $('#xml-template').html();
        var xml = Mustache.render(template, data);
        return xml.trim();
    };
    var getFormFromXML = function (xml) {
        var data = $($.parseXML(xml));
        var title = data.find('design > lesson > title').first().text().trim();
        var letters = [];
        var words = [];
        data.find('design > lesson > letters letter').each(function(index, value) {
            var text = $(this).find('text').first().text().trim();
            letters.push(text);
            var word = [];
            $(this).find('words word').each(function(index, value) {
                word.push([$(this).find('text').text().trim()]);
            });
            words.push(word);
        });

        // lets fill the dom now
        $('.title-of-the-lesson').val(title);
        // lets not break the form design and keep it independent by not adding dom by self
        $(letters).each(function(i){
            $('.add-syllable')[0].click();
            $('.syllable-group:last .syllable').val(letters[i]);
            $(words[i]).each(function(j) {
                $('.syllable-group:last .add-word').click();
                $('.syllable-group:last .word-group:last .word').val(words[i][j]);
            });
        });
        data.letters = Array.from($('.syllable-group').map(function () {
            var data = {};
            data.text = $(this).find('.syllable').val();
            data.words = Array.from($(this).find('.word-group').map(function () {
                var $this = $(this);
                var data = {};
                data.text = $this.find('.word').val();
                ['image', 'audio'].forEach(function (elem) {
                    var fileElem = $this.find('.' + elem + '-file')[0];
                    if (fileElem.files.length) {
                        data[elem] = URL.createObjectURL(fileElem.files[0]);
                    }
                });
                return data;
            }));
            return data;
        }));
        $('#color1').val(get_hex_color($($(data).find('backgroundcolor')[0]).text().trim()));
        var text_color = $($(data).find('colortheme')[0]).text().trim().substr(1).slice(0, -1).split(',');
        $('#color2').val(get_hex_color(text_color[0]));
        $('#color3').val(get_hex_color(text_color[1]));
        return;
        var template = $('#xml-template').html();
        var xml = Mustache.render(template, data);
        return xml.trim();
    };
    $('.generate-btn').on('click', function () {
        var xmlString = getXMLFromForm();
        $form.hide();
        setupAnimation($.parseXML(xmlString));
    });
    $('.download-btn').on('click', function () {
        var name = "";
        while(name === "") {
            name = prompt('Enter course name you wish to save with?');
            if(name == null) { break; }
        }
        var l = "";
        while(l === "" && language_selected == "english" && name !== null) {
            l = prompt('Enter the language of the iPrimer?');
        }
        if(language_selected == "english") {
            language = l;
        }
        else {
            language = language_selected;
        }
        var xmlString = getXMLFromForm();
        if(name !== null) {
            save_new_course_xml(xmlString, name);
        }
    });
    function save_new_course_xml(xml, name) {
        var file = name + ".xml";
        if(localStorage.getItem(file) !== null) {
            var counter = 1;
            file = name + "(" + counter + ").xml";
            while(localStorage.getItem(file) !== null) {
                counter += 1;
                file = name + "(" + counter + ").xml";
            }
        }
        var arr = JSON.parse(localStorage.getItem('available_xml'));
        arr.push(file);
        localStorage.setItem(file, xml);
        localStorage.setItem('available_xml', JSON.stringify(arr));
        update_list_available_courses();
    }
    //Download as file implementation
    $('.downsasadsaload-as-xml').on('click', function () {
        var xmlString = getXMLFromForm();
        var xmlBlob = new Blob([xmlString], {type : 'text/xml;charset=utf-8'});
        var xmlURL = URL.createObjectURL(xmlBlob);
        var a = $('<a>', {
            href: xmlURL,
            download: 'animation.xml',
        }).appendTo('body').get(0);
        a.click();
        a.remove();
    });
    function load_to_cache_default_first_time(force) {
        if(localStorage.getItem('default_downloaded') === null || force == true) {
            localStorage.clear();
            //var available_xml = ['telugu.xml', 'hindi.xml','Lesson 1 Chadavadam.xml','Lesson 2 Rayadam.xml','Lesson 3 Pani Sampadana.xml','Lesson 4 Mana Avasaraniki Dachukundam.xml','Lesson 5 Jatharaku Podaam.xml','Lesson 6 Intintiki Thaguneeru.xml','Lesson 7 Poodika Theesina Cheruvu Ooriki Aaderuvu.xml','Lesson 8 Athiga Vadithe Eruvulu Kuda Baruve.xml','Lesson9 Orpu Nerputho Edainaa Cheyagalam.xml','Lesson 10 Unnauru Kannathalli.xml'];
			var available_xml = ['Telangana Vachakam Standard iPrimer 10 Lessons.xml'];
            localStorage.setItem('available_xml', JSON.stringify(available_xml))
            available_xml.forEach(function(item, index) {
                $.ajax({
                    url: item,
                    type: 'GET',
                    dataType: 'text',
                    success: function (data) {
                        localStorage.setItem(item, data);
                    }
                });
            });
            localStorage.setItem('current_default', -1);
            localStorage.setItem('default_downloaded', true);
            localStorage.setItem('all_language', JSON.stringify(["english", "telugu", "hindi"]));
        }
    }
    function get_currently_playing_xml() {
        var user_choice = localStorage.getItem('current_default');
        var options = JSON.parse(localStorage.getItem('available_xml'));
        console.log(user_choice);
        if(user_choice != -1) {
            return localStorage.getItem(options[user_choice]);
        }
        var play_which = -1;
        options.forEach(function(item, index) {
            xml_raw = localStorage.getItem(item);
            xml_parsed = $($.parseXML(xml_raw));
            language = $(xml_parsed.find('language')[0]).text().trim();
            if(language == language_selected) {
               play_which = index;
               return;
            }
        });
        if(play_which == -1) {
            play_which = 0;
        }
        return localStorage.getItem(options[play_which]);
    }
    $('#go-to-default').on('click', function() {
        xmlString = get_currently_playing_xml();
        $welcomeScreen.hide();
        setupAnimation($.parseXML(xmlString));
    });
    $('#go-to-custom').on('click', function() {
        $welcomeScreen.hide();
        $form.show();
    });
    $('.force-delete-xml').on('click', function() {
        load_to_cache_default_first_time(true);
        setTimeout(function(){update_list_available_courses()}, 500);
    });
    function update_list_available_courses() {
        var $element = $('.list-available-courses');
        var arr = JSON.parse(localStorage.getItem('available_xml'));
        var $html = '';
        var current_default = localStorage.getItem('current_default');
        var common = '<button type="button" class="btn btn-primary start-course"><img src="./icons/start.png" /><span>Start</span></button><button type="button" class="btn edit-course no-filter"><img src="./icons/edit.png" /><span>Edit</span></button><button type="button" class="btn btn-danger delete-course"><img src="./icons/delete.png" /><span>Delete</span></button>';
        var make_default = '<button type="button" class="btn btn-info make-default"><span>Make default</span></button>';
        var all_language = JSON.parse(localStorage.getItem('all_language'));
        arr.forEach(function(value, i ) {
            if(value!==null) {
                $xml = $($.parseXML(localStorage.getItem(value)));
                language = $($xml.find('language')[0]).text().trim();
                if(language == language_selected || (language_selected == "english" && all_language.indexOf(language) == -1)) {
                    $html += '<li class="list-group-item index-' + i + '">' + common;
                    if (current_default != i) {
                        $html += make_default;
                    }
                    $html += value + '<img class="download-as-xml" src="./icons/download_xml.png" style="width:25px;float:right;cursor:pointer;"></li>';
                }
            }
        });
        $element.html($html);
        function class_to_index(class_names) {
            return parseInt(class_names.split(" ")[1].split("-")[1]);
        }
        $('.make-default').click(function(self) {
            var index = class_to_index($(this).parent().attr('class'));
            localStorage.setItem('current_default', index);
            update_list_available_courses();
        });
        $('.start-course').click(function(self) {
            var index = class_to_index($(this).parent().attr('class'));
            var arr = JSON.parse(localStorage.getItem('available_xml'));
            var xml = localStorage.getItem(arr[index]);
            $form.hide();
            setupAnimation($.parseXML(xml));
        });
        $('.edit-course').click(function(self) {
            var index = class_to_index($(this).parent().attr('class'));
            var arr = JSON.parse(localStorage.getItem('available_xml'));
            var xml = localStorage.getItem(arr[index]);
            getFormFromXML(xml);
        });
        $('.delete-course').click(function(self) {
            var index = class_to_index($(this).parent().attr('class'));
            if(localStorage.getItem('current_default') == index) {
                localStorage.setItem('current_default', 0);
            }
            var arr = JSON.parse(localStorage.getItem('available_xml'));
            localStorage.removeItem(arr[index]);
            delete arr[index];
            localStorage.setItem('available_xml', JSON.stringify(arr));
            update_list_available_courses();
        });
        $('.download-as-xml').on('click', function () {
            var index = class_to_index($(this).parent().attr('class'));
            var arr = JSON.parse(localStorage.getItem('available_xml'));
            var xml = localStorage.getItem(arr[index]);
            var xmlBlob = new Blob([xml], {type : 'text/xml;charset=utf-8'});
            var xmlURL = URL.createObjectURL(xmlBlob);
            var a = $('<a>', {
                href: xmlURL,
                download: JSON.parse(localStorage.getItem('available_xml'))[index],
            }).appendTo('body').get(0);
            a.click();
            a.remove();
        });
        handle_local_language(language_selected);
    }
    $('#home').on('click', function() {
        window.location.reload(true);
    });
    $('.upload-xml').on('click', function() {
        input = document.getElementById('fileinput');
        if (!input.files[0]) {
            alert("ముందుగా  మీ దగ్గర ఉన్న వాచకాన్ని ఎంచుకోండి");
        }
        else {
            function process_uploaded_xml() {
                var xml = fr.result;
                //if(!jQuery.isXMLDoc(xml)) {
                //    alert('Not a valid format, please try again.');
                //}
                //else {
                    var name = prompt('మీ వాచకం పేరును రాయండి?');
                    save_new_course_xml(xml, name);
                //}
            }

            file = input.files[0];
            fr = new FileReader();
            fr.onload = process_uploaded_xml;
            console.log(file);
            fr.readAsText(file);
        }
    });
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};
    function get_hex_color(hex) {
        if(colours[hex.trim()] != undefined) {
            hex = colours[hex.trim()];
        }
        return hex;
    }

	if (!Array.from) {
      Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
          return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
          var number = Number(value);
          if (isNaN(number)) { return 0; }
          if (number === 0 || !isFinite(number)) { return number; }
          return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
          var len = toInteger(value);
          return Math.min(Math.max(len, 0), maxSafeInteger);
        };
        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
          // 1. Let C be the this value.
          var C = this;
          // 2. Let items be ToObject(arrayLike).
          var items = Object(arrayLike);
          // 3. ReturnIfAbrupt(items).
          if (arrayLike == null) {
            throw new TypeError("Array.from requires an array-like object - not null or undefined");
          }
          // 4. If mapfn is undefined, then let mapping be false.
          var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
          var T;
          if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
              throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
              T = arguments[2];
            }
          }
          // 10. Let lenValue be Get(items, "length").
          // 11. Let len be ToLength(lenValue).
          var len = toLength(items.length);
          // 13. If IsConstructor(C) is true, then
          // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
          // 14. a. Else, Let A be ArrayCreate(len).
          var A = isCallable(C) ? Object(new C(len)) : new Array(len);
          // 16. Let k be 0.
          var k = 0;
          // 17. Repeat, while k < lenâ€¦ (also steps a - h)
          var kValue;
          while (k < len) {
            kValue = items[k];
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
            k += 1;
          }
          // 18. Let putStatus be Put(A, "length", len, true).
          A.length = len;
          // 20. Return A.
          return A;
        };
      }());
    }


    load_to_cache_default_first_time();
    update_list_available_courses();
});
