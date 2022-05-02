let slides = document.querySelectorAll('#product_slider .carousel-inner .item img');

slides.forEach(slide => slide.addEventListener('mousemove', setImagePosition));
//slides.forEach(slide => slide.addEventListener('mouseenter', setImgZoom));
//slides.forEach(slide => slide.addEventListener('mouseleave', resetImgZoom));
slides.forEach(slide => slide.addEventListener('mouseleave', setImageImagePosition));

function setImagePosition(e){
  
  let x = -e.offsetX + 'px';
  let y = -e.offsetY + 'px';
  this.style.transform = `translate(${x}, ${y}) scale(2)`;
  //console.log(e.offsetX, e.offsetY);  
}


function setImageImagePosition(e){
  this.style.transform = 'translate(0, 0) scale(1)';
}

