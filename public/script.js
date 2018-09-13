window.onload = function() {
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');

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
