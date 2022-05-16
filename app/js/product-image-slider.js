/* let slides = document.querySelectorAll('#product_slider .carousel-inner .item img');

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

let thumbnails = document.querySelectorAll(".carousel-indicators [data-target='#product_slider']");
let items = document.querySelectorAll('.carousel-inner .item');

thumbnails.forEach(el => el.addEventListener('mouseenter', setActiveImageItem));

function setActiveImageItem(event){
  items.forEach(item => item.classList.remove('active'));
  items[event.target.dataset.slideTo].classList.add('active');

}


 */