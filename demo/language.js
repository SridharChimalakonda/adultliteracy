function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function handle_local_language(language_selected) {
	var english = {
	'home-left': 'Standard iPrimer',
	'home-right': 'Custom iPrimer',
	'course-editor': 'Course Editor',
	'add-syllable': 'Add Syllable',
	'download-btn': 'Save iPrimer',
	'generate-btn': 'Generate',
	'available-courses': 'Available Courses',
	'start-course': 'Start',
	'edit-course': 'Edit',
	'delete-course': 'Delete',
	'make-default': 'Make default',
	'upload-xml': 'Upload XML',
	'force-delete-xml': 'Reset my iPrimers',
	'form-to-home': 'Back to home',
	'add-word': 'Add Example Words',
	'title-of-the-lesson': 'Title of the lesson',
	'syllable': 'Syllable',
	'word': 'Word',
        'background': 'Background',
        'color-text-1': 'TextColor1',
        'color-text-2': 'TextColor2',
        'download-book': 'Download book'
	};

        var hindi = {
        'home-left': 'शुरू करे',
        'home-right': 'संशोधित करे',
        'course-editor': 'संशोधित करे',
        'add-syllable': 'नया शब्दांश',
        'download-btn': 'डाउनलोड करे ',
        'generate-btn': 'शुरू करे',
        'available-courses': 'सभी उपलब्ध कौर्सेस',
        'start-course': 'शुरू करे',
        'edit-course': 'संशोधित करे',
        'delete-course': 'हटाये',
        'make-default': 'नियुक्त करे',
        'upload-xml': 'अपलोड करे',
        'force-delete-xml': 'सब डिलीट करे',
        'form-to-home': 'होम पेज',
        'add-word': 'शब्द जोड़ो',
	'title-of-the-lesson': 'पाठ का नाम लिखो',
         'syllable': 'अक्षर',
         'word': 'शब्द लिखो',
        'background': 'पीछे का रंग',
        'color-text-1': 'श्ब्दो का रंग',
        'color-text-2': 'श्ब्दो का रंग',
        'download-book': 'Download book'
        };

        var telugu = {
	'home-left': 'ప్రధాన వాచకం',
        'home-right': 'మీ సొంత వాచకం',
        'course-editor': 'వాచక కూర్పు సాధనం',
        'add-syllable': 'అక్షరాన్ని కలుపు',
        'download-btn': 'వాచకాన్ని దాచు',
        'generate-btn': 'వాచకాన్ని సృష్టించు',
        'available-courses': 'మా దగ్గర ఉన్న వాచకాలు',
        'start-course': 'మొదలు పెట్టు',
        'edit-course': 'మార్చు',
        'delete-course': 'తీసేయి',
        'make-default': 'ప్రధాన వాచకంగా మార్చు',
        'upload-xml': 'వాచకాన్ని తీసుకో',
        'force-delete-xml': 'అన్ని వచకాలని తీసేయి',
        'form-to-home': 'మొదటకి వెళ్ళు',
        'add-word': 'పదాన్ని/వాక్యాన్ని కలుపు',
	'title-of-the-lesson': 'ఈ పాఠం పేరును ఇక్కడ రాయండి',
	'syllable': 'ఇక్కడ మీరు నేర్పే అక్షరాన్ని రాయండి',
	'word': 'ఇక్కడ మీరు నేర్పే పదాన్ని/వాక్యాన్ని రాయండి',
        'background': 'పీచెయ్ రంగు',
        'color-text-1': 'లేఖ యొక్క రంగు',
        'color-text-2': 'లేఖ యొక్క రంగు',
        'download-book': 'Download book'
	};

	var language_available = {
		'english': english,
		'hindi': hindi,
		'telugu': telugu
	}
	// homepage
	var c = language_available[language_selected];
	var icons = $('.welcome-screen div a');
	$(icons[0]).find('h2').text(c['home-left']);
	$(icons[1]).find('h2').text(c['home-right']);
	
	// editor
	var buttons = ['download-btn', 'add-syllable', 'generate-btn', 'upload-xml', 'force-delete-xml', 'form-to-home', 'add-word', 'download-book'];
	$(buttons).each(function(index, value) {
		$('.'+value+' span:last').text(c[value]);
	});
	var multi_buttons = ['start-course', 'edit-course', 'delete-course', 'make-default'];
	$(multi_buttons).each(function(index, value) {
		$('.'+value+' span').text(c[value]);
	});
	var li = $('.generator-form .list-group');
	$($(li[0]).find('li')[0]).text(c['course-editor']);
	$($(li[1]).find('li')[0]).text(c['available-courses']);

	$('.title-of-the-lesson').attr('placeholder', c['title-of-the-lesson']);
	var multi_fields = ['word', 'syllable'];
	$(multi_fields).each(function(index, value) {
		$('.'+value).each(function(index, v) {
			$(this).attr('placeholder', c[value]);
		});
	});
        
        $($('#color1').parent().find('span')[0]).text(c['background']);
        $($('#color2').parent().find('span')[0]).text(c['color-text-1']);
        $($('#color3').parent().find('span')[0]).text(c['color-text-2']);
}

var language_selected = getParameterByName('language');
if(language_selected == null || language_selected == "") {
	language_selected = 'telugu';
}
$( document ).ready(function() {
	handle_local_language(language_selected);
});
