// var options = {
//     accessibility: true,
//     prevNextButtons: true,
//     pageDots: true,
//     setGallerySize: false,
//     arrowShape: {
//       x0: 10,
//       x1: 60,
//       y1: 50,
//       x2: 60,
//       y2: 45,
//       x3: 15
//     }
//   };
  
//   var $carousel = $('[data-carousel]').flickity(options);
// var $slideContent = $('.slide-content');
//   var flkty = $carousel.data('flickity');
//   var selectedSlide = flkty.selectedElement;
  
//   flkty.on('settle', function(index) {
//     selectedSlide = flkty.selectedElement;
//   });
  
//   flkty.on('change', function(index) {
//     $slideContent.eq(index).removeClass('mask');
  
//     setTimeout(function() {
//       $slideContent.addClass('mask');
//     }, 500);
//   });
  
//   flkty.on('dragStart', function(event) {
//     var index = 0;
//     selectedSlide = flkty.selectedElement;
  
  //   if (event.layerX > 0) { 
  //     index = $(selectedSlide).index() + 1;
  //   } else { 
  //     index = $(selectedSlide).index() - 1;
  //   }
  
  //   $slideContent.eq(index).removeClass('mask');
  // });
  
  // setTimeout(function() {
  //   $slideContent.addClass('mask');
  // }, 500);






  // slider tribe eight

  emailjs.init("service_d49jedk");

  (function(){
    emailjs.init("kNAeDx1po4aClhfQ2"); // Replace with the correct public API key
 })();
 

  function sendEmail() {
    // Log form values to ensure they're being read correctly

      console.log("Sending email with these values:");
      console.log("Name: " + document.getElementById("name").value);
      console.log("Email: " + document.getElementById("address").value);
      console.log("Mobile: " + document.getElementById("mobnumber").value);
      console.log("Message: " + document.getElementById("message").value);

      // Send email using EmailJS

      emailjs.send("service_d49jedk", "template_u3uvmhi", {

        name: document.getElementById("name").value,
        email: document.getElementById("address").value,
        mobile: document.getElementById("mobnumber").value,
        message: document.getElementById("message").value,
    })
    .then(function(response) {
      console.log("SUCCESS!", response.status, response.text);
       alert("Message sent successfully!");
    }, function(error) {
      console.log("FAILED...", error);
       alert("Failed to send message. Please try again.");
    });
}

