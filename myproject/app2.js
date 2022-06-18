$(function(){

 //declare variables

 var myArray;
 var inputLength;
 var reading = false;
 

 var action;
 var frequency = 200;
 //on page load hide elements we don't need, leave only
//text area and start button
function enter_text(refreshID,resumeID,pauseID,controllersID,resultID,errorID,startID,userInputID,progresssliderID,fontsizesliderID,speedsliderID,fontID,speedID,percentageID){
 $(refreshID).hide();
 $(resumeID).hide();
 $(pauseID).hide();
 $(controllersID).hide();
 $(resultID).hide();
 $(errorID).hide();


 //click on Start Reading
 $(startID).click(function(){
 //get text and split it to words inside an array
 //\s matches spaces, tabs, new lines, etc and +
//means one or more.
 myArray = $(userInputID).val().split(/\s+/);
console.log(myArray);
 //get the number of words
 inputLength = myArray.length;

 if(inputLength>1){//there is enough input

 //move to reading mode
 reading = true;

 //hide Start/error/userInput, show
//New/Pause/Controls
 $(startID).hide();
 $(errorID).hide();
 $(userInputID).hide();
 $(refreshID).show();
 $(pauseID).show();
 $(controllersID).show();

 //set progress slider max
 $(progresssliderID).attr("max", inputLength-1);

 //start the counter at zero
 

 //show reading box with the first word
 $(resultID).show();
 $(resultID).text(myArray[0]);

 //start reading from the first word
 action = setInterval(read, frequency);

 }else{//not enough text input
 $(errorID).show();
 }

 });
 //Click on New
 $(refreshID).click(function(){
 //reload page
 location.reload();
 });

 //Click on Pause
 $(pauseID).click(function(){
 //stop reading and switch to none reading mode
 clearInterval(action);
 reading = false;

 //hide pause and show resume
 $(pauseID).hide();
 $(resumeID).show();

 });

 //Click on Resume
 $(resumeID).click(function(){

 //start reading
 action = setInterval(read, frequency);

 //go back to reading mode
 reading = true;

 //hide resume and show pause
 $(resumeID).hide();
 $(pauseID).show();

 });

 //Change fontSize
 $(fontsizesliderID+"-wrap").on("slidestop",
function(event,ui){
 //refresh the slider
 $(fontsizesliderID).slider("refresh");

 //get the value of slider
 var slidervalue =
parseInt($(fontsizesliderID).val());

 $(resultID).css("fontSize", slidervalue);
 $(fontID).text(slidervalue);
 });

 //change speed
 $(speedsliderID+"-wrap").on("slidestop", function(event,ui){

 //refresh the slider
 $(speedsliderID).slider("refresh");

 //get the value of slider
 var slidervalue =
parseInt($(speedsliderID).val());

 $(speedID).text(slidervalue);

 //stop reading
 clearInterval(action);

 //change frequency
 frequency = 60000/slidervalue;

 //resume reading if we are in reading mode
 if(reading){
 action = setInterval(read, frequency);
 }
 });

 //progress slider
$(progresssliderID).on("slidestop", function(event,ui){

 //refresh the slider
 $(progresssliderID).slider("refresh");

 //get the value of slider
 var slidervalue =
parseInt($(progresssliderID).val());

 //stop reading
 clearInterval(action);

 //change counter
 slidervalue;

 //change word
 $(resultID).text(myArray[slidervalue]);

 //change value of progress

$(percentageID).text(Math.floor(slidervalue/(inputLength-1)*100));

 //resume reading if we are in reading mode
 if(reading){
 action = setInterval(read, frequency);
 }
 });
 //functions

 function read(){
var value=$(progresssliderID).val();
 if(value== inputLength-1){//last word
 clearInterval(action);
 reading = false; //move to none reading mode
 $(pauseID).hide();
 }else{
 //counter goes up by one
 

 //get word
 // $(resultID).text(myArray[value]);

 //change progress slider value and refresh

value++;
$(resultID).text(myArray[value]);

$(progresssliderID).val(value).slider('refresh');

 //change text of percentage

$(percentageID).text(Math.floor(value/(inputLength-1)*100));
 }

}
}
$("#text").click(enter_text("#refresh","#resume","#pause","#controllers","#result","#error","#start","#userInput","#progressslider","#fontsizeslider","#speedslider","#fontsize","#speed","#percentage"));
$("#upload").click(enter_text("#refresh2","#resume2","#pause2","#controllers2","#result2","#error2","#start2","#userInput2","#progressslider2","#fontsizeslider2","#speedslider2","#fontsize2","#speed2","#percentage2"));   
 
 $("#submit").on("click",function(event){
   $("#error2").hide();
    if($("#inputurl").val().slice(-3)=="pdf"){




pdfjsLib.getDocument($("#inputurl").val()).promise.then(function (PDFDocumentInstance) {

    var totalPages = PDFDocumentInstance.numPages;
    var pageNumber = +$("#pageno").val();
    console.log(pageNumber);
    // Extract the text
    getPageText(pageNumber , PDFDocumentInstance).then(function(textPage){
        // Show the text of the page in the console
        $("#userInput2").val(textPage);
   //     $("#userInput2").text(textPage);
       // console.log(textPage);
         
    });

});


}
else if($("#inputurl").val().slice(-3)=="txt"){

    $.get($("#inputurl").val(), function(data){
    $("#userInput2").val(data);
     console.log(data);
    });
 }
 else{
   $("#error2").show();
 }
     
 });

function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];

                    finalString += item.str + " ";
                }

                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}




// TODO:
//1. add page number support for pdfPage
// 2. call pdf function when url suffix = "pdf"; call text function when url suffix = 'txt' else show alert dialog
// 3. fix progress bar

speechSynthesis.onvoiceschanged = function() {
  voicesID = "#voices"
  var $voicelist = $(voicesID);

  if($voicelist.find('option').length == 0) {
     speechSynthesis.getVoices().forEach(function(voice, index) {
       var $option = $('<option>')
       .val(index)
       .html(voice.name + (voice.default ? ' (default)' :''));

        $voicelist.append($option);
     });

     $voicelist.material_select();
  }
}

function speak(text, voice, rate, pitch) {
        var msg = new SpeechSynthesisUtterance();
        msg.voice = voice
        msg.rate = rate / 10;
        msg.pitch = pitch;
        msg.text = text;

        msg.onend = function(e) {
          console.log('Finished in ' + e.elapsedTime + ' seconds.');
        };

        speechSynthesis.speak(msg);
}

function speakWrap(messageID,voicesID,rateID,pitchID){
 
  voices = window.speechSynthesis.getVoices()
  speak($(messageID).val(), voices[$(voicesID).val()],  $(rateID).val(), $(pitchID).val());
  
}
 $("#error3").hide();
$("#speak").click(function(){
  // $("#error3").hide();
var txt=$("#message");
if(txt.val()!=null && txt.val() != "") {
  speakWrap("#message","#voices","#rate","#pitch");
}
else if($("#inputurl2").val().slice(-3)=="txt"){
    $.get($("#inputurl2").val(), function(data){
    $("#userInput3").val(data);
     console.log(data);
     speakWrap("#userInput3","#voices","#rate","#pitch");
    });
    
}
else if($("#inputurl2").val().slice(-3)=="pdf"){
    pdfjsLib.getDocument($("#inputurl2").val()).promise.then(function (PDFDocumentInstance) {

    var totalPages = PDFDocumentInstance.numPages;
    var pageNumber = +$("#pageno2").val();
    console.log(pageNumber);
    // Extract the text
    getPageText(pageNumber , PDFDocumentInstance).then(function(textPage){
        // Show the text of the page in the console
        $("#userInput3").val(textPage);
        speakWrap("#userInput3","#voices","#rate","#pitch");
   //     $("#userInput2").text(textPage);
       // console.log(textPage);
         
    });

    });
   // setListeners("#speak","#userInput3","#voices","#rate","#pitch");
}
else{
    $("#error3").show();
}
});



});
