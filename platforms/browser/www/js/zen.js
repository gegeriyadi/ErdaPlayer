

/*
 *
 * ZEN - HTML5-CSS3 Audio Player
 * by @simurai (simurai.com)
 *
 * Most of this code by: @maboa (happyworm.com)
 * and: @quinnirill (niiden.com/jussi/)
 *
 */



$(document).ready(function(){    
		
  	var status = "stop";
	var dragging = false;
	

	
	// init
	
	var player = $("#zen .player");
		
	player.jPlayer({
			ready: function () {
      		$(this).jPlayer("setMedia", {
    			m4a: "http://live.erdamahfm.com:9900/stream",
				mp3: "http://live.erdamahfm.com:9900/stream",
        		oga: "http://live.erdamahfm.com:9900/stream"
      		});
    	},
    	swfPath: "",
		supplied: "m4a, mp3, oga"         
  	});  




	
	// preload, update, end
	
	player.bind($.jPlayer.event.progress, function(event) {    
			
		var audio = $('#zen audio').get(0);
		var pc = 0;    
				
		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
		 	pc = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10); 
		  	displayBuffered(pc);
		  	//console.log(pc);
		  	if(pc >= 99) {
		  		//console.log("loaded");
		  		$('#zen .buffer').addClass("loaded");
		  	}  
		}        
		
	});
	
	//player.bind($.jPlayer.event.loadeddata, function(event) {    
		//$('#zen .buffer').addClass("loaded");    
	//});
	
	player.bind($.jPlayer.event.timeupdate, function(event) { 
		var pc = event.jPlayer.status.currentPercentAbsolute;
		if (!dragging) { 
	    	displayProgress(pc);
		}
	});
	
	player.bind($.jPlayer.event.ended, function(event) {   
		$('#zen .circle').removeClass( "rotate" );
		$("#zen").removeClass( "play" );
		$('#zen .progress').css({rotate: '0deg'});
		status = "stop";
	});
	
	
	
	
	
	// play/pause
	
	$("#zen .button").bind('mousedown', function() {
		// not sure if this can be done in a simpler way.
		// when you click on the edge of the play button, but button scales down and doesn't drigger the click,
		// so mouseleave is added to still catch it.
		$(this).bind('mouseleave', function() {
			$(this).unbind('mouseleave');
			onClick();
		});
	});
	
	$("#zen .button").bind('mouseup', function() {
		$(this).unbind('mouseleave');
		onClick();
	});
	
	
	function onClick() {  		
                    
        if(status != "play") {
			status = "play";
			$("#zen").addClass( "play" );
			player.jPlayer("play");
			document.getElementById("status").innerHTML = "Status: ON";
		} else {
			$('#zen .circle').removeClass( "rotate" );
			$("#zen").removeClass( "play" );
			status = "pause";
			player.jPlayer("pause");
			document.getElementById("status").innerHTML = "Status: OFF - Press Play button!";
		}
	};
	
	
	
	
	// draggin
	
	var clickControl = $('#zen .drag');
	
	clickControl.grab({
		onstart: function(){
			dragging = true;
			$('#zen .button').css( "pointer-events", "none" );
			
		}, onmove: function(event){
			var pc = getArcPc(event.position.x, event.position.y);
			player.jPlayer("playHead", pc).jPlayer("play");
			displayProgress(pc);
			
		}, onfinish: function(event){
			dragging = false;
			var pc = getArcPc(event.position.x, event.position.y);
			player.jPlayer("playHead", pc).jPlayer("play");
			$('#zen .button').css( "pointer-events", "auto" );
		}
	});	
	
	
	
	
	
	
	// functions
	
	function displayProgress(pc) {
		var degs = pc * 3.6+"deg"; 
		$('#zen .progress').css({rotate: degs}); 		
	}
	function displayBuffered(pc) {
		var degs = pc * 3.6+"deg"; 
		$('#zen .buffer').css({rotate: degs}); 		
	}
	
	function getArcPc(pageX, pageY) { 
		var	self	= clickControl,
			offset	= self.offset(),
			x	= pageX - offset.left - self.width()/2,
			y	= pageY - offset.top - self.height()/2,
			a	= Math.atan2(y,x);  
			
			if (a > -1*Math.PI && a < -0.5*Math.PI) {
		   a = 2*Math.PI+a; 
		} 

		// a is now value between -0.5PI and 1.5PI 
		// ready to be normalized and applied   			
		var pc = (a + Math.PI/2) / 2*Math.PI * 10;   
		   
		return pc;
	}
	

	
	
});
