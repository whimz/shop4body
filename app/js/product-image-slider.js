let slides = document.querySelectorAll('#product_slider .carousel-inner .item img');

slides.forEach(slide => slide.addEventListener('mousemove', setImagePosition));
slides.forEach(slide => slide.addEventListener('mouseleave', setImageImagePosition));

function setImagePosition(e){
  let x = -e.offsetX + 'px';
  let y = -e.offsetY + 'px';
  this.style.transform = `translate(${x}, ${y}) scale(2)`;
}


function setImageImagePosition(e){
  this.style.transform = 'translate(0, 0) scale(1)';
}

