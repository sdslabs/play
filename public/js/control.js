(function($, play){


    function Volume(){
      this.config = null;
      holi=this;
    };

    var CP = Volume.prototype;

    CP.checkLocation = function(){
      if(window.location.pathname == "/volume")
        return true;
      else
        return false;
    };

    CP.to403 = function( s, msg, e ){
      if( e == 'Forbidden' )
        alert('Only lab member from inside lab can change volume!');
    };

    CP.showTooltip = function(obj, value, pos){
    obj.attr("data-hint",""+value+"");
    obj.addClass("hint--"+top+" hint--bounce");
    };

    CP.removeTooltip = function(obj, pos){
      obj.mouseleave(function(){
          obj.removeClass("hint--"+pos);
          obj.removeAttr("data-hint");
        });
    };

    CP.initialize = function(){
      if(this.checkLocation()){
        this.muteVolume();
      }
    };


    CP.setup = function(){
      var This = this;
      return $.getJSON('/config.json').done(
        function(data){
          This.config = data;
          This.initialize();
        });
    };

    CP.muteVolume = function(){
      var This = this;
      $('.mute').click(function(){
        $.get("/volume/mute").fail( This.to403 );
      });
    };

    CP.volumeUp = function(){
      var This = this;
      $('.vup').click(function(){
        $.get("/volume/up").fail( This.to403 );
      });
    };

    CP.volumeDown = function(){
      var This = this;
      $('.vdown').click(function(){
        $.get("/volume/down").fail( This.to403 );
      });
    };

    
    play.volume = new Volume();
    play.volume.setup();

}( window.jQuery, window.Play));
