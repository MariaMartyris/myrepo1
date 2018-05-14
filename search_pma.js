3d_printing:3D Printing
advanced_framework:Advanced Framework Design
asm:Assembly
ar_vr:Augmented Reality
atb:Associative Topology Bus
autobuildz:AutobuildZ
autocrear:Clearance and Creepage Extension
bemod:Behavioral Modeling
cable:Cabling
cfd:Creo Flow Analysis
cmm:Coordinate Measuring Machines (CMM)
collaboration:Collaboration Tools
creo_direct:Creo Direct
creo_unite:Creo Unite
datamanagement:Data Management
design_exploration:Design Exploration
des_anim:Design Animation
detail:Detailed Drawings
diagram:Diagram
ecad:ECAD
expmach:Expert Machinist
facmodel:Facet Modeling
feature_recognition_tool:Feature Recognition Tool
flexible_modeling:Flexible Modeling
freestyle:Freestyle
fundamentals:Fundamentals
feature:Part Modeling
gdnt:Model-Based Definition
harness:Harness
harness_mfg_extn:Creo Harness Manufacturing Extension
impdatadoc:Import DataDoctor
intelligent_fastener:Creo Intelligent Fastener Extension
interface:Interface
instrumented_assemblies:Creo Product Insight
langsupport:Language Suppport
layout:Creo Layout
legacy:Legacy
legacy_migration:Legacy Migration
manikin:Manikin
mech_des:Mechanism Design and Mechanism Dynamics
modelcheck:ModelCHECK
mold:Mold Design and Casting
mold_analysis:Creo Mold Analysis (CMA)
nc:NC
ncsheet:NC Sheetmetal
nonspecpiping:Non Spec-Driven Piping
option_modeler:Creo Options Modeler
photo:Creo Render Studio
processassembly:Assembly Process Planning
processmfg:Manufacturing Process Planning
program:Program
restyle:Reverse Engineering (Restyle)
scantools:Scan Tools
sheetmetaldesign:Sheetmetal Design
simulate:Creo Simulate
sketcher:Sketcher
specpiping:Spec-Driven Piping
style:Interactive Surface Design (Style)
surface:Technical Surfacing
tolerance_analysis:Tolerance Analysis
topology_optimization:Topology Optimization
tutorials:Tutorials
verify:Manufacturing Verification
warp:Warp
welding:Welding
// Copyright (c) 2010-2015 Quadralay Corporation.  All rights reserved.
//
// ePublisher 2015.1
//
// Validated with JSLint <http://www.jslint.com/>
//

/*jslint maxerr: 50, indent: 4 */
/*global window */
/*global google */
/*global _gaq */
/*global Browser */
/*global Message */
/*global Highlight */
/*global Parcels */
/*global SearchClient */

var implementation = 'search-implementation-google';

var analyticsID;
var searchID;

// Search
//

var Search = {
    'window': window,
    'control': undefined,
    'loading': false,
    'query': '',
    'perform_with_delay_timeout': null
};

Search.KnownParcelURL = function (param_url) {
    'use strict';

    var result;

    result = Parcels.KnownParcelURL(Search.connect_info.parcel_prefixes, param_url);

    return result;
};

Search.KnownParcelBaggageURL = function (param_url) {
    'use strict';

    var result;

    result = Parcels.KnownParcelBaggageURL(Search.connect_info.parcel_prefixes, param_url);

    return result;
};

Search.ASPX_Object = function () {
    'use strict';

    this.draw = function (param_id) {
        var cse, search_input, search_button, search_form, container;

        cse = window.document.getElementById('custom-search-engine');
        cse.innerHTML = '';
        search_input = window.document.createElement('input');
        search_input.id = 'search-input-text';
        search_input.name = 'search-input-text';
        search_input.type = 'text';
        search_input.value = Search.query;
        search_input.oninput = Search.Perform_After_Delay;
        search_button = window.document.createElement('input');
        search_button.id = 'search-button';
        search_button.name = 'search-button';
        search_button.type = 'submit';
        search_button.value = 'Search';
        search_form = window.document.createElement('form');
        search_form.id = 'search-form';
        search_form.onsubmit = Search.Perform;
        search_form.appendChild(search_input);
        search_form.appendChild(search_button);
        cse.appendChild(search_form);

        container = window.document.createElement('div');
        container.id = 'search-results-container';
        cse.appendChild(container);
        container.innerHTML = '';

        search_input.focus();
    };

    this.setSearchStartingCallback = function (param_object, param_method) {
        this.search_starting = { object: param_object, method: param_method };
    };

    this.setSearchCompleteCallback = function (param_object, param_method) {
        this.search_complete = { object: param_object, method: param_method };
    };

    this.setLinkTarget = function (param_target) {
        this.target = param_target;
    };

    this.execute = function (param_search_words) {
        var ajax;

        this.search_starting.method.call(this.search_starting.object, this.search_starting.object, null, param_search_words);

        ajax = Browser.GetAJAX(window);

        ajax.onreadystatechange = function () {
            var container;

            if (ajax.readyState === 4) {
                container = window.document.getElementById('search-results-container');
                if (ajax.responseText.length <= 2) {
                    container.innerHTML = '<div>No results for you!</div>';
                } else {
                    container.innerHTML = ajax.responseText;
                }

                Search.control.search_complete.method.call(Search.control.search_complete.object, Search.control.search_complete.object, null);
            }
        };
        ajax.open('GET', 'Search.aspx?q=' + encodeURI(Search.query), true);
        ajax.send(null);
    };

    this.clearAllResults = function () {
        var container = window.document.getElementById('search-results-container');
        container.innerHTML = '';
    };
};

Search.InBrowser_Object = function () {
    'use strict';

    var stop_words_array, stop_words_array_index, stop_word;
    var search_module_selector, search_module_sub_selector, found_module;
    // var search_module_list = [['All'], ['Fundamentals',['All','SUB1','SUB2']], ['Flex',['All','S1','S2','S3']], ['Mold']];
    var _Ifa_search_module_list = [
        [
            ['All','Look in all help content']
        ], 
        [
            ['Fundamentals','_Fundamentals_'],
            [
                ['All','_All_'],
                ['SUB1','_SUB1_'],
                ['SUB2','_SUB2_']
            ]
        ], 
        [
            ['Flex','_Flex_'],
            [
                ['All','_All_'],
                ['S1','_S1'],
                ['S2','_S2_'],
                ['S3','_S3_']
            ]
        ], 
        [
            ['Mold','_Mold_']
        ]
    ];
    var search_module_list = [
		[['All','Look in all help content']],
		[['whats_new_pma' ,'What New: Creo Parametric 5.0.0.0'],[['All','All']]],
		[['tutorials_pma' ,'Creo Tutorials'],[['All','All']]],
		[
			['fundamentals','Fundamentals'],
				[
					['All','All'],
					['fundamentals','Fundamentals'],
					['ar_vr','Augmented Reality'],
					['collaboration','Collaboration Tools'],
					['program','Program']
				]
		],

		[['model_based_definition' ,'Model-Based Defintion'],[['All','All']]],
		[['datamanagement' ,'Data Management'],[['All','All']]],
		

		[['design_exploration' ,'Design Exploration'],[['All','All']]],
		[
			['part_modeling','Part Modeling'],
				[
					['All','All'],
					['part_modeling','Part Modeling'],
					['sketcher','Sketcher'],
					['feature_recognition_tool','Feature Recognition Tool'],
					['flexible_modeling','Creo Flexible Modeling']
				]
		],
		[
			['data_exchange','Data Exchange'],
				[
					['All','All'],
					['atb','Associative Topology Bus'],
					['importdatadoc','Import DataDoctor'],
					['interface','Interface'],
					['autobuildz','AutobuildZ'],
					['legacy_migration','Creo Legacy Migration'],
					['creo_unite','Creo Unite']
				]
		],
		[['detail' ,'Detailed Drawings'],[['All','All']]],
		[['layout' ,'Creo Layout'],[['All','All']]],
		[
			['surfacing','Surfacing'],
				[
					['All','All'],
					['surface','Technical Surfacing'],
					['style','Creo Interactive Surface Design (Style)'],
					['restyle','Creo Reverse Engineering (Restyle)'],
					['facmodel','Facet Modeling'],
					['scantools','Scan Tools'],
					['warp','Warp'],
					['freestyle','Freestyle']
				]
		],
		[['rendering' ,'Photorealistic Rendering'],[['All','All']]],
		[
			['assembly','Assembly Design'],
				[
					['All','All'],
					['asm','Assembly'],
					['intelligent_fastener','Creo Intelligent Fastener'],
					['processassembly','Assembly Process Planning'],
					['instrumented_assemblies','Creo Product Insight']
				]
		],
		[['advanced_framework' ,'Creo Advanced Framework'],[['All','All']]],
		[['welding' ,'Welding'],[['All','All']]],
		[
			['electrical_design','Electrical Design'],
				[
					['All','All'],
					['diagram','Diagram'],
					['cable','Cabling'],
					['harness','Harness'],
					['harness_mfg_extn','Creo Harness Manufacturing'],
					['ecad','ECAD']
				]
		],
		
		[['piping' ,'Piping'],[['All','All']]],
		[
			['manufacturing','Manufacturing'],
				[
					['All','All'],
					['nc','Creo NC'],
					['expmach','Expert Machinist'],
					['processmfg','Manufacturing Process Planning'],
					['cmm','Coordinate Measuring Machines (CMM)'],
					['verify','Manufacturing Verification'],
					['3d_printing','Additive Manufacturing']
				]
		],
		[
			['mold_and_casting','Mold Design and Casting'],
				[
					['All','All'],
					['mold','Mold Design and Casting'],
					['mold_analysis','Creo Mold Analysis (CMA)']
				]
		],
		[
			['sheetmetal','Sheetmetal'],
				[
					['All','All'],
					['sheetmetaldesign','Sheetmetal Design'],
					['ncsheet','Creo NC Sheetmetal']
				]
		],
		[
			['model_analysis','Model Analysis'],
				[
					['All','All'],
					['bemod','Creo Behavioral Modeling'],
					['modelcheck','Creo Modelcheck'],
					['autocrear','Clearance and Creepage Analysis'],
					['tolerance_analysis','Creo Tolerance Analysis'],
					['manikin','Creo Manikin']
				]
		],
		[
			['simulate','Simulation'],
				[
					['All','All'],
					['simulate','Creo Simulate'],
					['mech_des','Mechanism Design and Mechanism Dynamics'],
					['des_anim','Design Animation'],
					['cfd','Creo Flow Analysis'],
					['topology_optimization','Creo Topology Optimization']
				]
		],
		[['langsupport' ,'Language Support'],[['All','All']]],
		[['other_modules','Legacy'],[['All','All']]]
                
	];
    var search_module_selector_txt = 'Refine your search: ';
    var search_module_txtObj; // The text node object.

    // Search configuration
    //
    this.minimum_word_length = 0;
    stop_words_array = 'and or'.split(' ');
    this.stop_words = {};
    for (stop_words_array_index = 0; stop_words_array_index < stop_words_array.length; stop_words_array_index += 1) {
        stop_word = stop_words_array[stop_words_array_index];
        if (stop_word.length > 0) {
            this.stop_words[stop_word] = 1;
        }
    }

    // Initialize search data
    //
    this.data_queue = undefined;
    this.data = [];
    this.page_pairs_data = {};

    this.draw = function (param_id) {
        var cse, search_input, search_button, search_form, container;

        cse = window.document.getElementById('custom-search-engine');
        cse.innerHTML = '';
        
        search_input = window.document.createElement('input');
        search_input.id = 'search-input-text';
        search_input.name = 'search-input-text';
        search_input.type = 'text';
        search_input.value = Search.query;
        search_input.oninput = Search.Perform_After_Delay;
        search_button = window.document.createElement('input');
        search_button.id = 'search-button';
        search_button.name = 'search-button';
        search_button.type = 'submit';
        search_button.value = 'Search';
        search_form = window.document.createElement('form');
        search_form.id = 'search-form';
        search_form.onsubmit = Search.Perform;
        search_form.appendChild(search_input);
        search_form.appendChild(search_button);
        cse.appendChild(search_form);
        
        // Search module mechanism - BEGIN --------------------------------
        
        var search_ref, // For creating a dev for the drop downs and text
            search_ref_i; // For inner content
        
        // Add margin to the bottom of the search form
        search_form.setAttribute("style", "margin-bottom: 10px;");

        // Search refinement drop down selection dev
        search_ref = window.document.createElement('dev');
        search_ref.id = 'search_ref_dev';
        search_ref.setAttribute("style", "padding: 10px 0px 40px; border-bottom: 1px dotted rgba(0, 149, 213, 0.24); display:block;");
        
        // Search refinement inner dev
        search_ref_i = window.document.createElement('dev');
        search_ref_i.id = 'search_ref_dev_i';
        search_ref_i.setAttribute("style", "background: rgba(166, 227, 255, 0.27) none repeat scroll 0% 0%; padding: 10px 10px 10px 2px;");
        search_ref_i.innerHTML = '<b>' + search_module_selector_txt + '</b>';
        
        // Module selector object
        search_module_selector = window.document.createElement('select');
        search_module_selector.id = 'search_mod_sel';
        search_module_selector.setAttribute("style", "margin-right: 10px;");
        
        var search_mod_item, search_module_index, search_module_sub_index, search_mod_item_main, search_mod_item_sub, search_module_list_item_subs;
        for (search_module_index = 0; search_module_index < search_module_list.length; search_module_index += 1) {
            search_mod_item = document.createElement('option');
            search_mod_item_main = search_module_list[search_module_index][0];
            search_mod_item.setAttribute("value", search_mod_item_main[0]);
            search_mod_item.appendChild(document.createTextNode(search_mod_item_main[1])); // Reference location 1 where the localised should appear.
            search_module_selector.appendChild(search_mod_item);
        }
        
        // Sub module selector object
        search_module_sub_selector = window.document.createElement('select');
        search_module_sub_selector.id = 'search_mod_sub_sel';
        search_mod_item_sub = document.createElement('option');
        search_mod_item_sub.setAttribute("value", search_module_list[0][0][0]); // All
        search_mod_item_sub.appendChild(document.createTextNode(search_module_list[1][1][0][1])); // All translated for the first item.
        search_module_sub_selector.setAttribute("disabled", 'disabled');
        search_module_sub_selector.setAttribute("style", 'display:none');
        search_module_sub_selector.appendChild(search_mod_item_sub);
        
        // Choice handling - module selector
        search_module_selector.onchange = function() {
            
            var search_mod_item_sub_nodes = search_module_sub_selector.childNodes;
            var search_mod_item_sub_nodes_len = search_mod_item_sub_nodes.length;
            
            if ( ( search_module_selector.value != 'All' ) && ( search_module_list[search_module_selector.selectedIndex].length > 1 ) ) {
                if ( search_mod_item_sub_nodes_len > 1 ) {
                    for (search_module_sub_index = search_mod_item_sub_nodes_len-1; search_module_sub_index > 0 ; --search_module_sub_index) {
                    search_module_sub_selector.removeChild(search_mod_item_sub_nodes[search_module_sub_index]);
                    }
                }
            
                search_module_list_item_subs = search_module_list[search_module_selector.selectedIndex][1];
                for (search_module_sub_index = 1; search_module_sub_index < search_module_list_item_subs.length; search_module_sub_index += 1) { 
                    search_mod_item_sub = document.createElement('option');
                    search_mod_item_sub.setAttribute("value", search_module_list_item_subs[search_module_sub_index][0]);
                    search_mod_item_sub.appendChild(document.createTextNode(search_module_list_item_subs[search_module_sub_index][1]));
                    search_module_sub_selector.appendChild(search_mod_item_sub);
                }
                
                if ( search_module_list_item_subs.length > 1 ) {
                    search_module_sub_selector.removeAttribute("disabled");
                    search_module_sub_selector.removeAttribute("style");
                } else {
                    search_module_sub_selector.setAttribute("disabled", 'disabled');
                    search_module_sub_selector.selectedIndex = 0;
                    search_module_sub_selector.setAttribute("style", 'display:none');
                    // alert (search_module_list_item_subs.length);
                }
            }
            else {
            
                // Remove items other than the first.
                for (search_module_sub_index = 1; search_module_sub_index < search_mod_item_sub_nodes_len; search_module_sub_index += 1)
                    search_module_sub_selector.removeChild(search_mod_item_sub_nodes[1]);
                
                search_module_sub_selector.setAttribute("disabled", 'disabled');
                search_module_sub_selector.selectedIndex = 0;
                search_module_sub_selector.setAttribute("style", 'display:none');
                
                // We can alternativly reconstruct the element, by deleting and recreating.
            
            }
            
            Search.Execute(search_input.value);
                
        };
        
        // Choice handling - sub module
        search_module_sub_selector.onchange = function() {
            Search.Execute(search_input.value);
        };

        search_ref_i.appendChild(search_module_selector);
        search_ref_i.appendChild(search_module_sub_selector);
        search_ref.appendChild(search_ref_i);
        cse.appendChild(search_ref);
        
        // Search module mechanism --- END ------------------------------

        container = window.document.createElement('div');
        container.id = 'search-results-container';
        cse.appendChild(container);
        container.innerHTML = '';

        search_input.focus();
    };

    this.setSearchStartingCallback = function (param_object, param_method) {
        this.search_starting = { object: param_object, method: param_method };
    };

    this.setSearchCompleteCallback = function (param_object, param_method) {
        this.search_complete = { object: param_object, method: param_method };
    };

    this.setLinkTarget = function (param_target) {
        this.target = param_target;
    };

    this.execute = function (param_search_words) {
        var data, data_entry, script_element, ajax, words_and_phrases, words, words_to_patterns, word_pattern_matches, word_index, word, word_as_regex_pattern, patterns_to_matches, data_index, info, word_as_regex, page_matches, page_match_index, page, page_with_score, word_page_matches, matched_words, first_page_match, pages, pages_to_check, page_id, pages_to_remove;

        // Prevent search for '*'
        //
        if (param_search_words === '*') {
            Search.control.clearAllResults();

            data = {
                'action': 'search_complete',
                'query': param_search_words,
                'dimensions': Browser.GetWindowContentWidthHeight(Search.window)
            };
            Message.Post(Search.window.parent, data, Search.window);

            return;
        }

        // Initialize data queue?
        //
        if (this.data_queue === undefined) {
            this.data_queue = Search.connect_info.parcel_sx.slice(0);
        }

        // Need to load search data?
        //
        if (this.data_queue.length > 0) {
            data_entry = this.data_queue.shift();

            // Load data
            //
            if (window.document.location.protocol === 'file:') {
                // Advance progress
                //
                Search.control.advance = function (param_info) {
                    // Track data
                    //
                    Search.control.data.push(param_info);

                    // Invoke method to load more data or perform search
                    //
                    Search.control.execute(param_search_words);
                };

                // Use script element
                //
                script_element = Search.window.document.createElement('script');
                script_element.src = data_entry;
                Search.window.document.body.appendChild(script_element);
            } else {
                // Use AJAX
                //
                ajax = Browser.GetAJAX(window);

                ajax.onreadystatechange = function () {
                    var info_as_text, info_prefix, info_suffix, info;

                    if (ajax.readyState === 4) {
                        // Prep info
                        //
                        info_as_text = ajax.responseText;
                        info_prefix = 'var info =';
                        info_suffix = ';Search.control.advance(info);';
                        info_as_text = info_as_text.substring(
                            info_as_text.indexOf(info_prefix) + info_prefix.length,
                            info_as_text.lastIndexOf(info_suffix)
                        );

                        // Parse JSON
                        //
                        if (window.JSON && window.JSON.parse) {
                            info = window.JSON.parse(info_as_text);
                        } else {
                            info = eval('(' + info_as_text + ')');
                        }

                        // Track data
                        //
                        Search.control.data.push(info);

                        // Invoke method to load more data or perform search
                        //
                        Search.control.execute(param_search_words);
                    }
                };

                ajax.open('GET', data_entry, true);
                ajax.send(null);
            }
        } else {
            this.search_starting.method.call(this.search_starting.object, this.search_starting.object, null, param_search_words);

            // Get words
            //
            words_and_phrases = SearchClient.ParseSearchWords(Search.query.toLowerCase(), this.minimum_word_length, this.stop_words);
            words = words_and_phrases['words'];
            words_to_patterns = {};
            word_pattern_matches = {};
            for (word_index = 0; word_index < words.length; word_index += 1) {
                word = words[word_index];

                // Translate word to regular expression
                //
                word_as_regex_pattern = SearchClient.WordToRegExpPattern(word);


                // Add wildcard to last word
                //
                if ((word_index + 1) === words.length) {
                    word_as_regex_pattern = word_as_regex_pattern.substring(0, word_as_regex_pattern.length - 1) + '.*$';
                }

                // Cache word to pattern result
                //
                words_to_patterns[word] = word_as_regex_pattern;

                word_pattern_matches[word_as_regex_pattern] = [];
            }

            // Process parcels
            //
            patterns_to_matches = {};
            for (data_index = 0; data_index < this.data.length; data_index += 1) {
                info = this.data[data_index];

                // Search info for word matches
                //
                for (word_as_regex_pattern in word_pattern_matches) {
                    if (typeof word_pattern_matches[word_as_regex_pattern] === 'object') {
                        word_as_regex = new window.RegExp(word_as_regex_pattern);

                        // Check each word for a match
                        //
                        for (word in info.words) {
                            if (typeof info.words[word] === 'object') {
                                page_matches = info.words[word];

                                // Match?
                                //
                                if (word_as_regex.test(word)) {
                                
                                    // Debug
                                    var unmatch_counter = 0;
                                    var match_counter = 0;
                                    // alert(search_module_selector.value);
                                    // alert (new RegExp(".*/" + search_module_selector.value + "/"));
                                    // alert(search_module_selector.value);
                                    // alert (new RegExp(search_module_selector.options[search_module_selector.selectedIndex].text + "/"));
				    
				    
                                    // Add page info (page index and score alternate)
                                    //
                                    for (page_match_index = 0; page_match_index < page_matches.length; page_match_index += 2) {
                                        page = info.pages[page_matches[page_match_index]];
                                        page_with_score = { 'page': page, 'score': page_matches[page_match_index + 1] };
					
                                        // Debug
                                        // alert(word); 
                                        // alert(page[0]);
                                        
                                        //if ( (search_module_selector.value == 'All' ) || ( page[0].match(new RegExp(".*/" + search_module_selector.value + "/")) != null ) ) {
                                        if ( (search_module_selector.options[search_module_selector.selectedIndex].value == search_module_list[0][0][0] ) || ( page[0].match(new RegExp(search_module_selector.options[search_module_selector.selectedIndex].value + "/")) != null ) ) {
                                            if ( ( search_module_sub_selector[search_module_sub_selector.selectedIndex].value == search_module_list[0][0][0] ) || ( page[0].match(new RegExp(".*/" + search_module_sub_selector[search_module_sub_selector.selectedIndex].value + "/")) != null ) ) {
                                            // alert ("Match found", page[0]);
                                            match_counter++;
                                            word_pattern_matches[word_as_regex_pattern].push(page_with_score);
                                            }
                                        }
                                        else {
                                          unmatch_counter++;
                                        }
                                          
                                         
                                        
                                    }
				    
                                    // Debug
                                    // alert (match_counter);
                                    // alert (unmatch_counter);
                                    
                                    // Add word to match list for phrase processing
                                    //
                                    if (typeof patterns_to_matches[word_as_regex_pattern] !== 'object') {
                                        patterns_to_matches[word_as_regex_pattern] = {};
                                    }
                                    matched_words = patterns_to_matches[word_as_regex_pattern];
                                    matched_words[word] = true;
                                }
                            }
                        }
                    }
                }
            }

            // Combine search results for each word pattern
            //
            first_page_match = true;
            pages = {};
            for (word_as_regex_pattern in word_pattern_matches) {
                if (typeof word_pattern_matches[word_as_regex_pattern] === 'object') {
                    word_page_matches = word_pattern_matches[word_as_regex_pattern];

                    if (word_page_matches.length === 0) {
                        // Based on implicit AND there are no results possible for this query
                        //
                        pages = {};
                        break;
                    } else if (first_page_match) {
                        // Add all pages
                        //
                        for (page_match_index = 0; page_match_index < word_page_matches.length; page_match_index += 1) {
                            page_with_score = word_page_matches[page_match_index];

                            pages[page_with_score.page[0]] = page_with_score;
                        }
                    } else {
                        // Based on implicit AND, combine like pages and remove pages not present in both page lists
                        //
                        pages_to_check = {};
                        for (page_match_index = 0; page_match_index < word_page_matches.length; page_match_index += 1) {
                            page_with_score = word_page_matches[page_match_index];

                            pages_to_check[page_with_score.page[0]] = 1;

                            // Combine scoring info
                            //
                            if (pages[page_with_score.page[0]] !== undefined) {
                                pages[page_with_score.page[0]].score += page_with_score.score;
                            }
                        }
                        pages_to_remove = {};
                        for (page_id in pages) {
                            if (typeof pages[page_id] === 'object') {
                                if (pages_to_check[page_id] === undefined) {
                                    pages_to_remove[page_id] = true;
                                }
                            }
                        }
                        for (page_id in pages_to_remove) {
                            if (typeof pages_to_remove[page_id] === 'boolean') {
                                delete pages[page_id];
                            }
                        }
                    }

                    first_page_match = false;
                }
            }

            // Load phrase data
            //
            window.setTimeout(function () {
                Search.control.phraseData(pages, words_and_phrases['phrases'], words_to_patterns, patterns_to_matches);
            }, 1);
        }
    };

    // Intention to enable update when user reselects something else.. search_module_selector.onchange = this.execute;
    
    this.phraseData = function (param_pages, param_phrases, param_words_to_patterns, param_patterns_to_matches) {
        var done, page_id, page, page_pair_url, script_element, ajax;

        // Any phrases to check?
        //
        done = true;
        if (param_phrases.length > 0) {
            // Ensure all necessary page pairs loaded
            //
            for (page_id in param_pages) {
                if (typeof param_pages[page_id] === 'object') {
                    // Page pairs loaded?
                    //
                    if (typeof Search.control.page_pairs_data[page_id] !== 'object') {
                        // Get page data
                        //
                        page = param_pages[page_id];
                        page_pair_url = Search.connect_info.base_url + page['page'][3];

                        // Load data
                        //
                        if (window.document.location.protocol === 'file:') {
                            // Advance progress
                            //
                            Search.control.loadWordPairs = function (param_pairs) {
                                // Track data
                                //
                                Search.control.page_pairs_data[page_id] = param_pairs;

                                // Invoke method to load more data or perform further processing
                                //
                                Search.control.phraseData(param_pages, param_phrases, param_words_to_patterns, param_patterns_to_matches);
                            };

                            // Use script element
                            //
                            script_element = Search.window.document.createElement('script');
                            script_element.src = page_pair_url;
                            Search.window.document.body.appendChild(script_element);
                        } else {
                            // Use AJAX
                            //
                            ajax = Browser.GetAJAX(window);

                            ajax.onreadystatechange = function () {
                                var pairs_as_text, pairs_prefix, pairs_suffix, pairs;

                                if (ajax.readyState === 4) {
                                    // Prep data
                                    //
                                    pairs_as_text = ajax.responseText;
                                    pairs_prefix = 'var pairs =';
                                    pairs_suffix = ';Search.control.loadWordPairs(pairs);';
                                    pairs_as_text = pairs_as_text.substring(
                                        pairs_as_text.indexOf(pairs_prefix) + pairs_prefix.length,
                                        pairs_as_text.lastIndexOf(pairs_suffix)
                                    );

                                    // Parse JSON
                                    //
                                    if (window.JSON && window.JSON.parse) {
                                        pairs = window.JSON.parse(pairs_as_text);
                                    } else {
                                        pairs = eval('(' + pairs_as_text + ')');
                                    }

                                    // Track data
                                    //
                                    Search.control.page_pairs_data[page_id] = pairs;

                                    // Invoke method to load more data or perform further processing
                                    //
                                    Search.control.phraseData(param_pages, param_phrases, param_words_to_patterns, param_patterns_to_matches);
                                }
                            };

                            ajax.open('GET', page_pair_url, true);
                            ajax.send(null);
                        }

                        // Not done, need to load some data
                        //
                        done = false;
                        break;
                    }
                }
            }
        }

        // Done?
        //
        if (done) {
            Search.control.phraseCheck(param_pages, param_phrases, param_words_to_patterns, param_patterns_to_matches);
        }
    };

    this.phraseCheckPairs = function (param_phrase, param_index, param_page_pairs, param_words_to_patterns, param_patterns_to_matches) {
        var result, first_word, second_word, first_pattern, second_pattern, first_matches, first_match, following_words, second_matches, second_match;

        // Initialize result
        //
        result = false;

        // Get word pair
        //
        first_word = param_phrase[param_index];
        second_word = param_phrase[param_index + 1];

        // Convert to patterns
        //
        first_pattern = param_words_to_patterns[first_word];
        second_pattern = param_words_to_patterns[second_word];

        // Iterate pattern matches and search for a hit on the page
        //
        first_matches = param_patterns_to_matches[first_pattern];
        for (first_match in first_matches) {
            if (typeof first_matches[first_match] === 'boolean') {
                // Check for word on page
                //
                if (typeof param_page_pairs[first_match] === 'object') {
                    // Access following words hash
                    //
                    following_words = param_page_pairs[first_match];

                    // Found a possibility, check the second word
                    //
                    second_matches = param_patterns_to_matches[second_pattern];
                    for (second_match in second_matches) {
                        if (typeof second_matches[second_match] === 'boolean') {
                            // Check for second word after first word
                            //
                            if (following_words[second_match] === 1) {
                                // Works (so far)
                                // Either return success if last word pair or check next set
                                //
                                if ((param_index + 2) === param_phrase.length) {
                                    // At the end of the phrase
                                    //
                                    result = true;
                                } else {
                                    // Check succeeding pairs
                                    //
                                    result = Search.control.phraseCheckPairs(param_phrase, param_index + 1, param_page_pairs, param_words_to_patterns, param_patterns_to_matches);
                                }
                            }
                        }

                        // Early exit on success
                        //
                        if (result) {
                            break;
                        }
                    }
                }
            }

            // Early exit on success
            //
            if (result) {
                break;
            }
        }

        return result;
    };

    this.phraseCheck = function (param_pages, param_phrases, param_words_to_patterns, param_patterns_to_matches) {
        var pages_to_remove, page_id, page_pairs, phrase_index, matches, phrase;

        // Prepare to remove invalid pages
        //
        pages_to_remove = {};

        // Check phrases
        //
        if (param_phrases.length > 0) {
            // Review each page
            //
            for (page_id in param_pages) {
                if (typeof param_pages[page_id] === 'object') {
                    // Access page pairs
                    //
                    page_pairs = Search.control.page_pairs_data[page_id];

                    // Ensure all phrases occur in this page
                    //
                    matches = true;
                    for (phrase_index = 0; phrase_index < param_phrases.length; phrase_index += 1) {
                        phrase = param_phrases[phrase_index];

                        // Check word pairs in the phrase
                        //
                        matches = Search.control.phraseCheckPairs(phrase, 0, page_pairs, param_words_to_patterns, param_patterns_to_matches);

                        // Early exit on first failed phrase
                        //
                        if (!matches) {
                            break;
                        }
                    }

                    // No match, so remove page from results
                    //
                    if (!matches) {
                        pages_to_remove[page_id] = true;
                    }
                }
            }
        }

        // Remove invalid pages
        //
        for (page_id in pages_to_remove) {
            if (typeof pages_to_remove[page_id] === 'boolean') {
                delete param_pages[page_id];
            }
        }

        // Display results
        //
        Search.control.displayResults(param_pages);
    };

    this.displayResults = function (param_pages) {
        var pages_array, page_id, pages_array_index, buffer, page_with_score, page, container;

        // Sort pages by rank
        //
        pages_array = [];
        for (page_id in param_pages) {
            if (typeof param_pages[page_id] === 'object') {
                pages_array.push(param_pages[page_id]);
            }
        }
        if (pages_array.length > 0) {
            pages_array = pages_array.sort(SearchClient.ComparePageWithScore);
        }

        // Display results
        //
        buffer = [];
        for (pages_array_index = 0; pages_array_index < pages_array.length; pages_array_index += 1) {
            page_with_score = pages_array[pages_array_index];
            page = page_with_score.page;

            buffer.push('<div class="search-result-title"><a target="connect_page" href="../' + SearchClient.EscapeHTML(page[0]) + '">' + SearchClient.EscapeHTML(page[1]) + '</a></div>');
            if (page[2].length > 0) {
                buffer.push('<div class="search-result-summary">' + SearchClient.EscapeHTML(page[2]) + '</div>');
            }
        }

        container = window.document.getElementById('search-results-container');
        if (buffer.length === 0) {
            container.innerHTML = '<div>No results for you!</div>';
        } else {
            container.innerHTML = buffer.join('\n');
        }

        this.search_complete.method.call(this.search_complete.object, this.search_complete.object, null);
    };

    this.clearAllResults = function () {
        var container;

        container = window.document.getElementById('search-results-container');
        container.innerHTML = '';
    };
};

Search.Perform_After_Delay = function (param_event) {
    'use strict';

    var input;
    // Cancel any in progress search request
    //
    if (Search.perform_with_delay_timeout !== null) {
        window.clearTimeout(Search.perform_with_delay_timeout);
        Search.perform_with_delay_timeout = null;
    }

    input = window.document.getElementById('search-input-text');
    // WEBWORKS - Prevent auto-search feature from creating sluggish behavior
    // Wait until at least 6 characters have been input before trying a search
    //
    if(input.value.length > 6) {
    // Wait for inactive period before initiating search
    //
    Search.perform_with_delay_timeout = window.setTimeout(Search.Perform, 100);
    } else {
        // Since a search will not be performed, clear previous results which now may be invalid
        //
        Search.control.clearAllResults();
	}
};

Search.Perform = function (param_event) {
    'use strict';

    var input;

    // Cancel any in progress search request
    //
    if (Search.perform_with_delay_timeout !== null) {
        window.clearTimeout(Search.perform_with_delay_timeout);
        Search.perform_with_delay_timeout = null;
    }

    input = window.document.getElementById('search-input-text');
    Search.Execute(input.value);

    return false;
};

Search.Execute = function (param_query) {
    'use strict';

    var search_input;

    // Update search words
    //
    if (param_query !== undefined) {
        Search.query = param_query;
        search_input = window.document.getElementById('search-input-text');
        if ((search_input !== null) && (search_input.value !== Search.query)) {
            search_input.value = Search.query;
        }
    }

    // Check for a search query string and execute it
    //
    if (Search.query !== '') {
        // Search!
        //
        Search.control.execute(Search.query);
    } else {
        Search.control.clearAllResults();
    }
};

Search.Listen = function (param_event) {
    'use strict';

    if (Search.dispatch === undefined) {
        Search.dispatch = {
            'search_get_page_size': function (param_data) {
                var data;

                data = {
                    'action': 'search_page_size',
                    'dimensions': Browser.GetWindowContentWidthHeight(Search.window),
                    'stage': param_data.stage
                };
                Message.Post(Search.window.parent, data, Search.window);
            },
            'search_connect_info': function (param_data) {
                var data;

                Search.connect_info = param_data;
                delete Search.connect_info['action'];

                data = {
                    'action': 'search_ready'
                };
                Message.Post(Search.window.parent, data, Search.window);
            },
            'search_execute': function (param_data) {
                Search.Execute(param_data.query);
            }
        };
    }

    try {
        // Dispatch
        //
        Search.dispatch[param_event.data.action](param_event.data);
    } catch (ignore) {
        // Keep on rolling
        //
    }
};

Search.SearchQueryHighlight = function (param_search_query) {
    'use strict';

    var expressions;

    // Remove highlights
    //
    Highlight.RemoveFromDocument(Search.window.document, 'search-result-highlight');

    // Highlight words
    //
    if (param_search_query !== undefined) {
        // Convert search query into expressions
        //
        expressions = SearchClient.SearchQueryToExpressions(param_search_query);

        // Apply highlights
        // !@#FIX
        Highlight.ApplyToSearchResults(Search.window.document, Search.window.document.getElementById('search-results-container'), 'search-result-highlight', expressions);
    }
};

Search.Load = function () {
    'use strict';

    var onSearchStart, onSearchLinkClick, onSearchComplete, data;

    // Setup for listening
    //
    Message.Listen(window, function (param_event) {
        Search.Listen(param_event);
    });

    // Define callbacks
    //
    onSearchStart = function (param_search_control, param_searcher, param_query) {
        var search_input, container;

        // Set search words
        //
        Search.query = param_query;
        search_input = window.document.getElementById('search-input-text');
        if ((search_input !== null) && (search_input.value !== Search.query)) {
            search_input.value = Search.query;
        }

        // Replace results with progress indicator
        //
        container = window.document.getElementById('search-results-container');
        if (container !== null) {
            container.innerHTML = '<div>Searching...</div>';
        }
    };

    onSearchLinkClick = function (param_event) {
        var data;

        data = {
            'action': 'search_display_link',
            'href': this.href
        };
        Message.Post(Search.window.parent, data, Search.window);

        return false;
    };

    onSearchComplete = function (param_search_control, param_searcher) {
        var index, link, search_uri, encoded_search_uri, data;

        // Intercept search result links
        //
        for (index = 0; index < window.document.links.length; index += 1) {
            link = window.document.links[index];

            if (link.target === 'connect_page') {
                // Same hierarchy?
                //
                if (Browser.SameHierarchy(Search.connect_info.base_url, link.href)) {
                    // Verify parcel is known
                    //
                    if ((Search.KnownParcelURL(link.href)) && (!Search.KnownParcelBaggageURL(link.href))) {
                        // Handle via Connect run-time
                        //
                        link.onclick = onSearchLinkClick;
                    } else {
                        // Open in a new window
                        //
                        link.target = '_blank';
                    }
                } else {
                    // Open in a new window
                    //
                    link.target = '_blank';
                }
            }
        }

        // Highlight search words and phrases
        //
        Search.SearchQueryHighlight(Search.query);

        // Track search words in Google Analytics, if enabled
        //
        if ((analyticsID !== undefined) && (_gaq !== undefined)) {
            // Track them!
            //
            search_uri = window.document.location.pathname + '?q=' + Search.query;
            encoded_search_uri = encodeURI(search_uri);
            _gaq.push(['_setAccount', analyticsID]);
            _gaq.push(['_trackPageview', encoded_search_uri]);
        }

        // Notify parent
        //
        data = {
            'action': 'search_complete',
            'query': Search.query,
            'dimensions': Browser.GetWindowContentWidthHeight(Search.window)
        };
        Message.Post(Search.window.parent, data, Search.window);
    };

    // Search control settings
    //
    if (implementation === 'search-implementation-aspx') {
        Search.control = new Search.ASPX_Object();
    } else if (implementation === 'search-implementation-client') {
        Search.control = new Search.InBrowser_Object();
    } else {
        if (searchID !== undefined) {
            Search.control = new google.search.CustomSearchControl(searchID);
        } else {
            Search.control = new google.search.CustomSearchControl();
        }
        Search.control.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
    }
    Search.control.setSearchStartingCallback(this, onSearchStart);
    Search.control.setSearchCompleteCallback(this, onSearchComplete);
    Search.control.setLinkTarget('connect_page');
    //Search.control.enableAds('<Your_AdSense_Publisher_ID>');

    // Draw the control
    //
    Search.control.draw('custom-search-engine');

    // Ready to search
    //
    data = {
        'action': 'search_page_load',
        'dimensions': Browser.GetWindowContentWidthHeight(Search.window)
    };
    Message.Post(Search.window.parent, data, Search.window);
};

// Handle load
//

Search.OnLoad = function () {
    'use strict';

    if (implementation === 'search-implementation-aspx') {
        if (!Search.loading) {
            Search.loading = true;
            Search.Load();
        }
    } else if (implementation === 'search-implementation-client') {
        if (!Search.loading) {
            Search.loading = true;
            Search.Load();
        }
    }
};

if (implementation === 'search-implementation-aspx') {
    // Start running as soon as possible
    //
    if (window.addEventListener !== undefined) {
        window.addEventListener('DOMContentLoaded', Search.OnLoad, false);
    }
} else if (implementation === 'search-implementation-client') {
    // Start running as soon as possible
    //
    if (window.addEventListener !== undefined) {
        window.addEventListener('DOMContentLoaded', Search.OnLoad, false);
    }
} else {
    google.load('search', '1');
    google.setOnLoadCallback(Search.Load, true);
}

en: Select a Help topic to open.
de: Wählen Sie das Hilfe-Thema aus, das geöffnet werden soll.
fr: Sélectionnez la rubrique d'aide que vous souhaitez ouvrir.
it: Selezionate l'argomento della guida da aprire.
es: Seleccione el tema de ayuda que desee abrir.
ja: 開くヘルプトピックを選択します。
ko: 열려는 도움말 항목을 선택하십시오.
cn: 选择要打开的帮助主题。
tw: 選取要開啟的說明主題。
ru: Выберите раздел справки, чтобы открыть.
br-pt: Selecione um tópico de ajuda para abrir.
