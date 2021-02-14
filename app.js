const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image 
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  // if the searched data doesn't have any content [invalid input / wrong input] then it will not proceed forward and alert the user and the value of the search box will get reset
  if(images.length==0){
    alert('No Images Found!\n\nPlease Check your input');
    document.getElementById('search').value='';
    return;
  }
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {

    // added hovering functionality that shows views and likes of the hovered pic
    const numberOfViews = image.views;
    const numberOfLikes = image.likes;
    let bigDiv = document.createElement('div');
    bigDiv.innerHTML='';
    let div = document.createElement('div');
    div.id="imageThatWillLoad";
    bigDiv.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = `
    <img style="width:100%;height:100%" class="img-fluid img-thumbnail hoveringClass" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
    `;
    let label = 0;
    bigDiv.appendChild(div);
    const picInfoDiv = document.createElement('div');
    picInfoDiv.id="pictureInfo";
    picInfoDiv.innerHTML=`
      <img src="like.png" alt="" style="width:20px;height:20px">
      <small id="numberOfViewsOfThePhoto">${numberOfLikes}</small>
      <span id="gapSpan"></span>
      <img src="views.png" alt="" style="width:20px;height:20px">
      <small id="numberOfViewsOfThePhoto">${numberOfViews}</small>
    `
    div.addEventListener('mouseenter',function(){
      if(label===0){
        bigDiv.appendChild(picInfoDiv);
        label++;
      }
      else{
        label=1;
        return;
      }
    })
    div.addEventListener('mouseleave',function(){
      if(label===1){
        bigDiv.removeChild(picInfoDiv);
        label=0;
      }
      else{
        return;
      }
    })
    gallery.appendChild(bigDiv);
  })
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    // spelling needs to be hits rather than hitS
    // solved image loading
    .then(data => showImages(data.hits))
    .catch(err => {
      console.log(err);
      // alerting the user whether there is net connection or not
      const onlineOrOffline = window.navigator.onLine;
      if(!onlineOrOffline){
        alert('Please Check Your Internet Connection');
        return;
      }
      // alerting user if the data is not getting for any reasons from the server
      else{
        alert('The Server is facing some issues!\n\nPlease Try Again Later');
        return;
      }
    })
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // if one selected item is clicked again then it will be removed
    sliders.splice(item , 1);
    element.classList.remove('added');
  }
}

var timer

const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  // error checking the duration time
  let duration = document.getElementById('duration').value;
  if(duration<0){
    alert('Slider Changing Time Can not be Negative.');
    document.getElementById('duration').value='';
    return;
  }
  else if(duration==0){
    alert('Slider Changing Time Can not be Zero.\n\nSetting the default time as 3sec');
    duration=3;
  }
  // if not a number then it won't be passed
  else if(isNaN(duration)){
    alert('Slider Timer Input Not A Number\n\nPlease Input a valid positive number');
    document.getElementById('duration').value='';
    return;
  }

  duration *= 1000;

  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector('.main').style.display = 'block';
  // hide image area
  imagesArea.style.display = 'none';

  // resetting the duration input box value when one slider is made
  document.getElementById('duration').value='';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

const searchingFunction = () => {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  if(search.value==''){
    alert('Nothing Input\n\nPlease Input For Searching');
    return;
  }
  getImages(search.value);
  sliders.length = 0;
}

searchBtn.addEventListener('click', function () {
  searchingFunction();
})

// searching functionality when keyup is happening or we can say when the search box is modified
document.getElementById('search').addEventListener( 'keyup' , event => {
  if(event.keyCode===13){
    searchingFunction();
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider();
})

// added enter button functionality in the duration input box
document.getElementById('duration').addEventListener('keyup' , event => {
  if(event.keyCode===13){
    createSlider();
  }
})

document.getElementById('goToHomeButton').addEventListener('click', function(){
  document.getElementById('search').value='';
  document.getElementById('sliderId').style.display='none';
})