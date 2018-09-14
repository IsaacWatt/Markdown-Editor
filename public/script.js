var pad = document.getElementById('pad');
var markdownArea = document.getElementById('markdown');

window.onload = function() {

    /* allow tabs */
    pad.addEventListener('keydown',function(e) {
          if(e.keyCode === 9) { // tab was pressed
              // get caret position/selection
              var start = this.selectionStart;
              var end = this.selectionEnd;

              var target = e.target;
              var value = target.value;

              // set textarea value to: text before caret + tab + text after caret
              target.value = value.substring(0, start)
                              + "\t"
                              + value.substring(end);

              // put caret at right position again (add one for the tab)
              this.selectionStart = this.selectionEnd = start + 1;
              e.preventDefault();
          }
      });

    var previousMarkdownValue;

    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        previousMarkdownValue = markdownText;
        //html = converter.makeHtml(markdownText);
        //markdownArea.innerHTML = html;

        $.ajax({
            type:"POST",
            url:"/service",
            data : { content : markdownText }
        }).done((result)=>{
            markdownArea.innerHTML = result;
        });
    };

    var didChangeOccur = function(){
        if(previousMarkdownValue != pad.value){
            return true;
        }
        return false;
    };

    setInterval(function() {
        if(didChangeOccur()){
            convertTextAreaToMarkdown();
        }
    }, 1000);

    pad.addEventListener('input', convertTextAreaToMarkdown);

    sharejs.open('home', 'text', function(error, doc) {
        doc.attach_textarea(pad);
        convertTextAreaToMarkdown();
    });
};

$('.md-to-pdf').click( function () {
  var markdownText = $("#markdown").html();
  loadingScreen.show();

  $.ajax({
      type:"POST",
      url:"/downloadmd",
      data : { content : markdownText }
  }).done((result)=>{
    loadingScreen.hide();
  });
});

var loadingScreen = (function($){

    var screenContent = "<div class='notes-load-screen' style='opacity:0;'><i class='fa fa-spin fa-cog'></i></div>";

    function show () {
        $('body').append(screenContent);
        $('.notes-load-screen').animate({
            'opacity':1
        }, 300);
    }

    function hide () {
        $('.notes-load-screen').animate({
            'opacity': 0
        }, 300, function(){
            $(this).remove();
        });
    }

    function isShown () {
        return ( $('.notes-load-screen').length );
    }

    return {
        show:show,
        hide:hide,
        isShown:isShown
    };

}(jQuery));
