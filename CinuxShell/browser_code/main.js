/**
 * Cinux Shell - Logic
 * http://webian.org
 * 
 * Copyright @authors 2011
 *
 * @author Constantine Apostolou http://osarena.net/
 * 
 * Cinux Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Webian Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Webian Shell in the LICENSE file. If not, see 
 * <http://www.gnu.org/licenses/>.
 *
 * Cinux Shell is a fork of Webian shell, created by Ben Francis
 * It will be used in the next release of Cinux, as it's default
 * Window Manager, instead of using Gnome at 100%
 */

// Import Chromeless modules
var favicon = require("favicon");
var web_content = require("web-content");
const url = require("url");
const fullscreen = require("fullscreen");

// Set up console for debugging
//console.log('hello world');

// History of URLs
var urlHistory = [];
// Index of current point in URL history
var currentUrlIndex = 0;

/**
 * Clock
 * 
 * Updates the time on the clock when called
 */
function clock() {
	var date = new Date();
	// get hours as string
	var hours = date.getHours()+'';
	// pad with zero if needed
	if(hours.length < 2) { hours = "0" + hours; }
	// get minutes as string
	var minutes = date.getMinutes()+'';
	// pad with zero if needed
	if(minutes.length < 2) { minutes = "0" + minutes; }
	var time = hours + ":" + minutes;
	$('#clock').text(time);
}

/**
 * Make iFrame
 * 
 * Returns true if str contains the substring. Returns false otherwise.
 * 
 * @return true or false
 */
function contains(str, substr) {
	// This is a boolean. See the hint if you're not
	// sure how booleans work.
	var containsSubstring;
	if (str.indexOf(substr) == -1)
	{
    		containsSubstring = false;
	}
	else
	{
        	containsSubstring = true;
	}
  
	//= alert(str.indexOf(substr) != -1);
	// Do calculation here
  
	return containsSubstring;
}

/**
 * Make iFrame
 * 
 * Creates a special iFrame which acts like a browser and will contain the
 * content of a new window.
 * 
 * @return new iFrame object
 */
function makeIframe(windowId) {
	var iFrame = document.createElement("iframe");
	$(iFrame).attr("privilege", "content");
	$(iFrame).attr("class", "window_iframe");
	return iFrame;
}

/**
 * Register Window Event Listeners
 * 
 * Registers event listeners for the currently selected window to detect
 * user actions like go, back forward etc. and attaches progress monitor to
 * iFrame.
 * 
 * @param {String} windowId of window to register listeners for
 */
function registerWindowEventListeners(windowId) {
	var url_input = $('#window_' + windowId + ' .url_input');
	var go_button = $("#window_" + windowId + " .go_button");

	// When URL input text box is selected, change "Refresh" button to "Go" button and remove loaded state
	$(url_input).focusin(function() {
		$(url_input).removeClass('loaded');
                $(go_button).attr("src", "go.png");
	});

	// When URL input box is de-selected and URL un-changed, change "Go" button back to "Refresh" button and set to loaded state
	$(url_input).focusout(function() {
		if ($(url_input).val() == urlHistory[currentUrlIndex]) {
			$(url_input).addClass('loaded');
			$(go_button).attr("src", "refresh.png");
		}
	});

	// Go/Stop/Refresh (Submit URL form or click go button)
	$("#window_" + windowId + " .url_form").submit(function() { 
		navigate($(this).parents(".window").attr("id").substring(7)); 
                return false; 
	});
	$(go_button).click(function() { 
		// If loading then act as stop button
		if($('#windows .selected .url_input').hasClass('loading')) {
			var window_iframe = $("#windows .selected .window_iframe")[0];
			web_content.stopload(window_iframe);
			$(go_button).attr("src", "refresh.png");
		} else {
		// otherwise act as go/refresh
		        navigate($(this).parents(".window").attr("id").substring(7));
		}
	});

	// Back
	$("#window_" + windowId + " .back_button").click(function() {
		if (urlHistory[windowId][0] < 2) return;
		$("#windows .selected .window_iframe").attr("src", 
			urlHistory[windowId][--urlHistory[windowId][0]]);
		urlHistory[windowId][0] = urlHistory[windowId][0];
    	});

	// Forward
	$("#window_" + windowId + " .forward_button").click(function() {
		if(urlHistory[windowId][0] + 1 >= urlHistory[windowId].length) return;
		$("#windows .selected .window_iframe").attr("src", 
			urlHistory[windowId][++urlHistory[windowId][0]]);
		urlHistory[windowId][0] = urlHistory[windowId][0];
		
	});

	// Select tab
	// TODO(tola): de-generalise this and put it somewhere more sensible
	$(".tab").click(function () {
		var tabId = $(this).attr("id");
		selectTab(tabId.substring(4));
	});

	// Close tab
	$("#window_" + windowId + " .close_button").click(function() {
		closeTab($(this).parents(".window").attr("id").substring(7));
	});
}

/**
 * Attach iFrame Progress Monitor
 *
 * Attach progress monitor to react to page load progress.
 * 
 * @param {String} windowId of window containing iFrame to listen to
 */
function attachIframeProgressMonitor(windowId) {
	var progressMonitor = web_content.ProgressMonitor();
	var window_iframe = $('#window_' + windowId + ' .window_iframe');
	var url_input = $('#window_' + windowId + ' .url_input');
	
	// Add progress monitor to iFrame...
	progressMonitor.attach(window_iframe[0]);
	
	// Check progress of page load...
	progressMonitor.on('progress', function(percent) {
		$(url_input).addClass('loading');
		$(url_input).css('-moz-background-size', percent+"%");
		$(url_input).css('background-size', percent+"%");			
	});

	// When page starts to load...
	progressMonitor.on('load-start', function(url) {
		// Update address bar
		$(url_input).val(url);
		// Set go button as stop button
		$("#window_" + windowId + " .go_button").attr("src", "stop.png");
		// If URL has changed, add to history and update index
		if (url !== urlHistory[windowId][urlHistory[windowId][0]]) {
			// Remove previous future if new future being created!
			if (urlHistory[windowId][0] < urlHistory[windowId].length) {
				urlHistory[windowId].splice(
					urlHistory[windowId][0] + 1,
					urlHistory[windowId].length - urlHistory[windowId][0]);
			}
			
			// Add new URL to history
			urlHistory[windowId].push(url);
			
			// Update index
			urlHistory[windowId][0]++;
		}			
	});

	// When page and contents are completely loaded...
	progressMonitor.on('load-stop', function() {
		// Set URL input textbox to loaded state
		$(url_input).removeClass('loading');
		$(url_input).addClass('loaded');
		// Change "Go" button to "Refresh"
		$('#window_' + windowId + ' .go_button').attr("src", "refresh.png");				
	});

	
	// When title changes...
	progressMonitor.on('title-change', function(document_title) {
		if(document_title) {
			$('#window_' + windowId + ' .document_title').addClass("active");	
			$('#window_' + windowId + ' .document_title').text(document_title);	
		}
	});
	
}

/**
 * Select Tab
 * 
 * Select a tab and its corresponding window
 *
 * @param {String} windowId of tab to be selected
 */
function selectTab(windowId) {
	// Activate windows container if not already active
	if (!$("#windows").hasClass("active")) {
		activateWindows();
	} 
	$("#windows .selected").removeClass("selected");
	$("#window_" + windowId).addClass("selected");
	$("#tabs .selected").removeClass("selected");
	$("#tab_" + windowId).addClass("selected");

}

/**
 * New Tab
 * 
 * Creates a new tab & corresponding window and selects that tab
 */
function newTab(url) {
	// Create new window from template
	var newWindow = $("#window_template").clone();
	




	// Generate unique ID for window
	var randomNumberString = Math.random() + "";
	var windowId = randomNumberString.substring(2);
	newWindow.attr("id", "window_" + windowId);

	// Add new window to interface
	$("#windows").append(newWindow);

	// Add corresponding tab
	$("#tabs ul").append('<li id="tab_' + windowId + 
		'" class="tab"><a href="javascript:null()"></a></li>');

	// Select new tab
	selectTab(windowId);

	// Add a new iFrame to new window
	var newIframe = makeIframe(windowId);
	$("#windows .selected .window_toolbar").after(newIframe);
	
	// Register window event listeners
	registerWindowEventListeners(windowId);
	
	// Attach iFrame progress monitor
	attachIframeProgressMonitor(windowId);
	
	// Create history array for window, using first element as index
	urlHistory[windowId] = [];
	urlHistory[windowId][0] = 0;
	
	// Navigate to URL if provided
	if(url) {
		$("#windows .selected .url_input").val(url);
		navigate(windowId);
	}
}

/** 
 * Close Tab
 * 
 * Closes tab & window corresponding to provided windowId
 * 
 * @param {String} windowId
 */
function closeTab(windowId) {
	// Remove selected window & corresponding tab
	$("#window_" + windowId).remove();
	$("#tab_" + windowId).remove();

	// If no tabs are open, activate home screen
	if($(".window").length < 2) {
		activateHomeScreen();

	// otherwise, Select last remaining tab (not including the template window!)
	} else {
		var newLastWindowId = $(".window:not(#window_template)").last().attr("id").substring(7);
		selectTab(newLastWindowId);
	}
	
	// Remove browsing history for tab
	urlHistory.splice(windowId, 1);
}

/**
 * Navigate
 * 
 * Sets the src attribute of the iFrame belonging to the window specified by
 * windowId in order to navigate to a resource identified by the URI in the
 * address bar of that window. Also fetches favicon for the resource.
 * 
 * @param windowId of window to use
 */
function navigate(windowId) {
      // invoked when the user hits the go button or hits enter in url box
      try{
          var address;
          if(url.guess($.trim($("#windows .selected .url_input").val())).indexOf(".") == -1)
          {
                if(url.guess($.trim($("#windows .selected .url_input").val())).indexOf("http://") == -1)
                {
                        // There is no chance that the argument will not have "http://" in it, but
                        // I wrote this just in case. Bits are crazy...
                        address = "http://www.google.gr/search?q=" + url.guess($.trim($("#windows .selected .url_input").val()));
                }
                else
                {
                        try
                        {
			      // If someone wants to go to a localhost page, he can do it with these three lines of code
			      // this code should fix that annoying bug, but ... it doesn't ... gotta figure that out!
			      if(url.guess($.trim($("#windows .selected .url_input").val())).indexOf("localhost:") != -1)
			      {
				   adress = url.guess($.trim($("#windows .selected .url_input").val()));
			      }
                              // Replace the "http://" and any backslash to provide a clean search
                              // argument and then send a request to google, if the arguments are other than 
			      // localhost
			      else
			      {
                                   address = url.guess($.trim($("#windows .selected .url_input").val()));
                                   address = address.replace("http://","");
                                   address = address.replace("/","");
                                   address = "http://www.google.gr/search?q=" + address;
			      }
                        }
                        catch(err)
                        {
                              // Catch the error here
                              //alert("");
                        }
                }
          }
          else
          {
	        //navigate($(this).parents(".window").attr("id").substring(7));
                address = url.guess($.trim($("#windows .selected .url_input").val()));
          }
          // trigger navigation        
          $("#windows .selected .window_iframe").attr("src", address);
          // Fetch favicon for window
          favicon.fetch(address, function(faviconUrl) {
           	  var img = $("<img>").attr("src", faviconUrl);
        	  img.attr("width", 16);
        	  img.attr("height", 16);
        	  $("#tab_" + windowId + " a").empty();
		  $("#tab_" + windowId + " a").append(img);		
          });
     }catch(err)
     {
          // Catch the error here
     }
}

/**
 * Activate Home Screen
 * 
 * Hides all windows and shows the home screen
 */
function activateHomeScreen() {
	$("#windows .selected").removeClass("selected");
	$("#tabs .selected").removeClass("selected");
	$("#windows").removeClass("active");
	$("#home_screen").addClass("active");
	$("#home_button").removeClass("active");
	$("#tabs").addClass("detached");
}

/**
 * Activate Windows
 * 
 * Hides the home screen and makes the windows container active
 */
function activateWindows() {
	$("#home_screen").removeClass("active");
	$("#windows").addClass("active");
	$("#home_button").addClass("active");
	$("#tabs").removeClass("detached");
}

// When Shell starts up...
$(document).ready(function() {

	// Set clock to be updated every second	
	self.setInterval("clock()",1000);

	// Create a first tab like this: 
        //newTab("http://osarena.net/");
        // Keep start up clean, les boot up time

	// Listen for requested new tabs
	$("#new_tab_button").click(function() {
		newTab();
	});

	// Shut down
	$("#power_button").click(function() {
		// Make it show a MessageBox with a warning message
                window.exit();
                //_system.shutDown();
	});

	// Home
	$("#home_button").click(function() {
		activateHomeScreen();
	});
	
        // Facebook
	$("#google_button").click(function() {
		newTab("http://www.facebook.com/");
	});

        // Twitter
	$("#twitter_button").click(function() {
		newTab("http://www.twitter.com/");
	});

	// Full screen will be toggled after 0.2 seconds
        // in Cinux, in some other Linux distribution  
        // the web browser won't operate in full screen,
        // so this field won't exist.
	setTimeout("fullscreen.toggle(window)", 200);
});
