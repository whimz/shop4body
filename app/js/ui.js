window.addEventListener('DOMContentLoaded', function () {

  /**************CAROSELS **************/

  let owlCarousel = document.querySelector('.owl-carousel');
  if(owlCarousel !== null){
    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoWidth: true,
      navText: ["&lsaquo;", "&rsaquo;"],
      responsive: {
        0: {
          items: 1,
          nav: false
        },
        600: {
          items: 3,
          nav: false
        },
        1000: {
          items: 5,
          nav: true,
          loop: false
        }
      }
    });
  }



  /***************************MODAL HANDLER START*****************************/

  let showPopupBtns = document.querySelectorAll('[data-popup-toggle]');
  let mdlPopup = document.getElementById('mdl-popup');

  if (showPopupBtns.length !== 0) {
    showPopupBtns.forEach(btn => btn.addEventListener('click', showMdlPopup));
  }

  if (mdlPopup) {
    mdlPopup.addEventListener('click', hideMdlPopup);
  }

  function showMdlPopup(e) {

    e.preventDefault();

    let popupId = this.dataset.popupId;
    let popup = document.querySelector(`#mdl-popup [data-popup="${popupId}"]`);

    if (popup) {
      let body = document.querySelector('body');

      popup.classList.add('visible');
      popup.closest('#mdl-popup').classList.add('visible');
      body.classList.add('scroll-lock');
    }
  }

  function hideMdlPopup(e) {

    if (e.target.id === 'mdl-popup' || e.target.classList.contains('mdl-btn-close')) {
      let popup = e.target.closest('#mdl-popup');
      let visiblePopupContent = popup.querySelector('.visible');
      let body = document.querySelector('body');

      visiblePopupContent.classList.remove('visible');
      popup.classList.remove('visible');
      body.classList.remove('scroll-lock');
    }
  }

  //showDefaultPopup('default', 'aleert');
});

//popupContentId - string 'default'
function showDefaultPopup(popupContentId, popupMessage){
  let popupId = popupContentId;

  let popup = document.querySelector(`#mdl-popup [data-popup="${popupId}"]`);

  if (popup) {
    let body = document.querySelector('body');
    popup.querySelector('.popup-message').innerText = popupMessage;
    popup.classList.add('visible');
    popup.closest('#mdl-popup').classList.add('visible');
    body.classList.add('scroll-lock');
  }
}


/***************************MODAL HANDLER END*******************************/

function setSearchListeners() {
  const searchTab = document.querySelector("[data-search=tab]");
  const searchTabInput = document.querySelector("[data-search=input]");
  const searchTabClose = document.querySelector("[data-search=close]");
  const MOBILE_VIEW_CLASS = "mobile-view";

  if (searchTabInput && searchTab) {

    searchTabInput.addEventListener("click", () => {
      const isMobileViewActive = searchTab.classList.contains(MOBILE_VIEW_CLASS);

      if (!isMobileViewActive) {
        searchTab.classList.add(MOBILE_VIEW_CLASS);
      }
    });
  }

  if (searchTabClose && searchTab && searchTabInput) {
    searchTabClose.addEventListener("click", () => {
      searchTab.classList.remove(MOBILE_VIEW_CLASS);
      searchTabInput.value = "";
    });
  }

}

function setMenuListeners() {
  const navbarButtonToggle = document.querySelector(
    "[data-navibar-header-toggle]"
  );
  const navbar = document.querySelector("[data-navibar]");
  const NAVBAR_OPEN_CLASS = "is-open";

  if (navbar && navbarButtonToggle) {
    window.addEventListener("click", () => {
      navbar.classList.remove(NAVBAR_OPEN_CLASS);
      navbarButtonToggle.classList.remove(NAVBAR_OPEN_CLASS);
    });

    navbarButtonToggle.addEventListener("click", (e) => {
      e.stopPropagation();

      navbar.classList.toggle(NAVBAR_OPEN_CLASS);
      navbarButtonToggle.classList.toggle(NAVBAR_OPEN_CLASS);
    });
  }

  if (navbar) {
    navbar.addEventListener("click", (e) => {
      const isOpened = navbar.classList.contains(NAVBAR_OPEN_CLASS);

      if (isOpened) {
        e.stopPropagation();
      }
    });
  }

}

setSearchListeners();
setMenuListeners();


$(".pagenav li").each(function (i, el) {
  if ($(el).hasClass("current_page_item")) {
    $(el).parent().show().parent().addClass("open");
  }
});

const elements = document.querySelectorAll(
  "#body-sidebar > div.sidebar-accordion > ul > li.pagenav > h4 > i "
);

if (elements.length !== 0) {
  elements.forEach(function (e) {
    e.addEventListener("click", function () {
      $(this).closest("li").toggleClass("open");
      $(this).parent().parent().find("ul").slideToggle(100);
    });
  });
}

/***************FILTERS DROPDOWNS START *********************/

let navFilterBtns = document.querySelectorAll(".nav-filter-item .nav-filter-item-dropdown");

if(navFilterBtns.length !== 0){
  navFilterBtns.forEach(btn => btn.addEventListener('click', setActiveFilterBtn));
}

function setActiveFilterBtn(event){
  navFilterBtns.forEach(btn => {
    if(btn !== event.target){
      btn.classList.remove('active');
      btn.nextElementSibling.classList.remove('active')
    }
  });
  event.target.classList.toggle('active');
  event.target.nextElementSibling.classList.toggle('active');
}

let navFilter = document.querySelector('.nav-filter');

if (navFilter) {
  navFilter.addEventListener("click", (event) => {
    console.log(event.target.classList);

    let navFilterItemDropdown = document.querySelector("#nav-filter-sortBy .nav-filter-item-dropdown");
    let navFilterDropdownContent = document.querySelector("#nav-filter-sortBy .nav-filter-dropdown-content");
    let mobileNavFilterItemDropdown = document.querySelector("#mobile-nav-filter .nav-filter-item-dropdown");
    let mobileNavFilterDropdownContent = document.querySelector("#mobile-nav-filter .nav-filter-dropdown-content");

    if (!event.target.classList.contains("sortByFilter") && navFilterItemDropdown && navFilterDropdownContent) {
      navFilterItemDropdown.classList.remove("active");
      navFilterDropdownContent.classList.remove("active");
    }
    if (!event.target.classList.contains("navFilter") && mobileNavFilterItemDropdown && mobileNavFilterDropdownContent) {
      mobileNavFilterItemDropdown.classList.remove("active");
      mobileNavFilterDropdownContent.classList.remove("active");
    }
  });

  // -------- Hide filters dropdown when click on page ----------------

  let body = document.querySelector('body');
  body.addEventListener('click', hideFilterDropdowns);

  function hideFilterDropdowns(event) {
    if (!event.target.closest('.nav-filter-item')) {
      let dropDowns = document.querySelectorAll('.nav-filter-dropdown-content');
      if(dropDowns.length !== 0){
        dropDowns.forEach(item => {
          item.classList.remove('active');
          item.previousElementSibling.classList.remove('active');
        });
      }
    }
  }
}

/***************FILTERS DROPDOWNS END *********************/

/***************MENUS START******************/

let dropDownMenus = [];
let dropDownMenuHide = (menu, toggle) => {
  menu.classList.remove("dropdown-menu-open");
  toggle.classList.remove("dropdown-toggle-open");
};
let dropDownMenuShow = (menu, toggle) => {
  dropDownMenus.forEach((target) => {
    dropDownMenuHide(target.menu, target.toggle);
  });
  toggle.classList.add("dropdown-toggle-open");
  menu.classList.add("dropdown-menu-open");
};
let dropDownMenuToggle = (menu, toggle) => {
  if (menu.classList.contains("dropdown-menu-open") === true) {
    dropDownMenuHide(menu, toggle);
  } else {
    dropDownMenuShow(menu, toggle);
  }
};

let mq = window.matchMedia("(max-width: 767px)");

if (mq.addEventListener) {
  mq.addEventListener("change", mqMatchesDropDownMenuHide);
} else {
  mq.addListener(mqMatchesDropDownMenuHide);
}

function mqMatchesDropDownMenuHide() {
  if (!mq.matches) {
    dropDownMenus.forEach(function (target) {
      dropDownMenuHide(target.menu, target.toggle);
    });
  }
}

let dropDownItems = document.querySelectorAll(".dropdown-item");

if (!mq.matches) {
  dropDownItems.forEach(item => {
    let dropDownMenu = item.querySelector('.dropdown-menu');
    if (dropDownMenu) {
      dropDownMenu.classList.remove('dropdown-menu-open');
    }
  });
}

if (dropDownItems.length !== 0) {
  dropDownItems.forEach((dropDown) => {
    let toggle = dropDown.querySelector(".dropdown-toggle");
    let menu = dropDown.querySelector(".dropdown-menu");

    if (toggle != null && menu != null) {
      dropDownMenus.push({ toggle: toggle, menu: menu });
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropDownMenuToggle(menu, toggle);
      });

      let indside = false;
      menu.addEventListener("mouseenter", (e) => {
        if (!mq.matches) indside = true;
      });
      menu.addEventListener("mouseleave", (e) => {
        if (!mq.matches) {
          indside = false;
          dropDownMenuHide(menu, toggle);
        }
      });

      toggle.addEventListener("mouseenter", (e) => {
        if (!mq.matches && !indside) {
          dropDownMenuToggle(menu, toggle);
        }
      });

      toggle.addEventListener("mouseleave", (e) => {
        setTimeout(() => {
          if (!mq.matches && !indside) {
            dropDownMenuHide(menu, toggle);
          }
        }, 1);
      });
    }
  });

  /*********************MENUS END ****************************/

  /***************CART QUANTITY START ***********************/

  $('.minus-bt').click(function () {
    var qnty = parseFloat($('#qnty_txt').val());
    if ((qnty == 1) || (qnty < 1)) {
    qnty = 2;
    }
    var count = qnty - 1;
    $('#qnty_txt').val(count);
    })
    $('.plus-bt').click(function () {
    var qnty = parseFloat($('#qnty_txt').val());
    var count = qnty + 1;
    $('#qnty_txt').val(count);
  });

 /***************CART QUANTITY end ***********************/
 

/****************  DELIVERY PICKUP SHOPS START ***********/

function accourdion_init(){
  hideAll();
  activateLinks();
}

function hideAll(){
  var $el = document.querySelectorAll('.accordion_content');
  for (var i = 0; i < $el.length; i++) {
     $el[i].style.display='none';
  }
  var $el = document.querySelectorAll('.accordion_title .delivery-panel-item-radio input[type="radio"]');
  for (var i = 0; i < $el.length; i++) {
     $el[i].checked = false;
  }
  
}

function showTab(id){
  var $el = document.querySelectorAll('.accordion_content[for="'+id+'"]');
  $el[0].style.display='';
  
 var $el = document.querySelectorAll('.accordion_title[id="'+id+'"] .delivery-panel-item-radio input[type="radio"]');
  $el[0].checked = true;
}

function activateLinks(){
 //links
 var $el = document.querySelectorAll('.accordion_title');
  for (var i = 0; i < $el.length; i++) {
     $el[i].addEventListener("click",function(e){
      accordion_click(e);
},false);
  }
 //buttons
 var $btn = document.querySelectorAll('.tab_buttons');
  for (var i = 0; i < $btn.length; i++) {
     $btn[i].addEventListener("click",function(e){
     search_btn_click(e);  
     return false;
},false);
  }
}

function accordion_click(e){
  var id = e.currentTarget.id;
  hideAll();
  showTab(id); 
}

function search_btn_click(e){
  e.preventDefault();
  var id = e.currentTarget.id;
  var tab = id.slice(7); // button_tab_x to tab_x
  var tab_id = id.slice(11);
  loadData(tab_id, document.getElementById("input_post_"+tab).value, document.getElementById("input_street_"+tab).value);
  
}  

document.addEventListener('DOMContentLoaded', function(){
  accourdion_init();
  document.querySelectorAll('.sbmt_button')[0].addEventListener("click",function(e){
      form_send(e);
},false);
});

function httpGet(theUrl)
{
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
   xmlHttp.send( null );
   return xmlHttp.responseText;
}

function loadData(groupId, param1, param2){
 var data = httpGet('https://my-json-server.typicode.com/CAHCAHbI4/t20221208/db?param1='+param1+'&param2='+param2);      
 var dataObj = JSON.parse(data);    
 //console.log(dataObj);
 var item_template = '<div class="delivery-panel-pickup-radio"><input type="radio" value="{item_id}" name="{subgroup_name}" id="{subgroup_id}" ></div><div class="delivery-panel-pickup-shop"><label for="{subgroup_id}">{item_text}</label></div><div class="delivery-panel-pickup-divider"></div>';
 var new_html = '';
 for (var i=0; i<dataObj.pickup_locations.length;i++){
   var item = dataObj.pickup_locations[i].name + " ("+dataObj.pickup_locations[i].distance+"), "+dataObj.pickup_locations[i].address.address+", "+dataObj.pickup_locations[i].address.postcode+" "  +dataObj.pickup_locations[i].address.city
   //console.log(item);
   new_html += item_template.replaceAll('{subgroup_name}', 'subgroup'+groupId).replaceAll('{subgroup_id}', 'subgroup'+groupId+'_'+(i+1)).replaceAll('{item_text}', item).replaceAll('{item_id}', dataObj.pickup_locations[i].id);
 }
 document.querySelectorAll('.accordion_content[for="tab_'+groupId+'"] div.delivery-panel-pickup-shops')[0].innerHTML = new_html;
}

function form_send(e){
 var param = '?';
 if (document.querySelectorAll('input[name="group1"]:checked')[0]!=undefined){
    param += 'panelId='+document.querySelectorAll('input[name="group1"]:checked')[0].value;
    id = document.querySelectorAll('input[name="group1"]:checked')[0].id.split('_')[1];
    if (document.querySelectorAll('input[name="subgroup'+id+'"]:checked')[0]!=undefined){
      console.log(document.querySelectorAll('input[name="subgroup'+id+'"]:checked')[0]);
      param +='&subpanelId='+document.querySelectorAll('input[name="subgroup'+id+'"]:checked')[0].value;
    }
  }
 
 window.open(window.location.host+param,'_blank'); 
}










/*************************  PICKUPS REQUEST  **************************************** */


let deliveryTypes = document.querySelectorAll('.delivery-panel-item.accordion_title');

if(deliveryTypes.length > 0){
  deliveryTypes.forEach(el => {
    el.addEventListener('change', getDeliveryPickupPoints);
  });
}


//let testPickupJSON = '[{"id":"110987","name":"Toolpartner ApS","distance":200,"address":{"street":"Dannebrogsgade 26A","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.051483,"longitude":9.904226},"openingHours":null},{"id":"108562","name":"Schou Bertelsen Sko","distance":2100,"address":{"street":"Vestergade 2A","zipCode":null,"city":"N\u00F8rresundby","countryCode":null},"coordinates":{"latitude":57.059138,"longitude":9.922549},"openingHours":null},{"id":"109521","name":"SuperBrugsen Nordhavnen","distance":2100,"address":{"street":"Havnegade 10","zipCode":null,"city":"N\u00F8rresundby","countryCode":null},"coordinates":{"latitude":57.056644,"longitude":9.924482},"openingHours":null},{"id":"106881","name":"Kiosken p\u00E5 Boulevarden","distance":2100,"address":{"street":"Boulevarden 33","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.043939,"longitude":9.918728},"openingHours":null},{"id":"108413","name":"Next Data","distance":2200,"address":{"street":"\u00D8sterbrogade 79","zipCode":null,"city":"N\u00F8rresundby","countryCode":null},"coordinates":{"latitude":57.058604,"longitude":9.926823},"openingHours":null},{"id":"109789","name":"Stationsvejenskiosk","distance":3100,"address":{"street":"Stationsvej 31","zipCode":null,"city":"N\u00F8rresundby","countryCode":null},"coordinates":{"latitude":57.065005,"longitude":9.911514},"openingHours":null},{"id":"107559","name":"Netkiosken.dk","distance":3100,"address":{"street":"Kayer\u00F8dsgade 6","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.044744,"longitude":9.924055},"openingHours":null},{"id":"109302","name":"Silvan Aalborg","distance":3300,"address":{"street":"H\u00E5ndv\u00E6rkervej 21-23","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.033786,"longitude":9.927391},"openingHours":null},{"id":"108895","name":"F\u00E6tter V","distance":3600,"address":{"street":"Hadsundvej 18A","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.043176,"longitude":9.949908},"openingHours":null},{"id":"108088","name":"Vejgaard Boghandel","distance":3700,"address":{"street":"Hadsundvej 29","zipCode":null,"city":"Aalborg","countryCode":null},"coordinates":{"latitude":57.042171,"longitude":9.950905},"openingHours":null}]'
//console.log(JSON.parse(testPickupJSON));

function getDeliveryPickupPoints(event){

  // if radiobutton is checked and its delivery option provides pickup-shops (data-delivery="true" in html)
  if(event.target.checked && event.target.dataset.delivery){

    let currentTab = event.target.closest('.delivery-panel-item.accordion_title');

    // if pickup shops list is empty - means that we didn't make GET-request or it came with empty respond
    // prepare new request params
    if(!currentTab.nextElementSibling.querySelector('.delivery-panel-pickup-shops.active')){
      let deliveryId = event.target.value;
      let currentTabId = (currentTab.getAttribute('id')).toString();
      let countryCode = document.querySelector('[for=' + currentTabId + '] form input[name=countryCode]').value;
      let zipCode = document.querySelector('[for=' + currentTabId + '] form input[name=zipCode]').value;
      let address = document.querySelector('[for=' + currentTabId + '] form input[name=address]').value;
      
      let httpParams = '?deliveryId=' + deliveryId + '&countryCode=' + countryCode + '&zipCode=' + zipCode + '&address=' + address;

      // GET-request
      getPickupsJSON(httpParams, currentTab);
    
    }
  }
}

function getPickupsJSON(httpParams, currentTab){

  let url = '__URL__';  // replace __URL__ with valid url
  let xhr = new XMLHttpRequest();

  console.log(url + httpParams);
  xhr.open('GET', url + httpParams);
  xhr.send();

  xhr.onload = function() {
    if (xhr.status != 200) { 
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else { 
      //renderPickupShops(testPickupJSON, currentTab);
      renderPickupShops(xhr.response, currentTab);
      console.log(`Success ${xhr.response.length} bytes`);
    }
  };

}

function renderPickupShops(shopListJSON, currentTab){
  let shopList= JSON.parse(shopListJSON);
  let currentTabId = (currentTab.getAttribute('id')).toString();
  let deliveryPanelPickupShops = currentTab.nextElementSibling.querySelector('.delivery-panel-pickup-shops');
  let shopsHtml = '';

  deliveryPanelPickupShops.classList.add('active');

  shopList.forEach(shop => {
    shopsHtml += `<div class="shop-container">
                    <div class="delivery-panel-pickup-radio">
                      <input type="radio" value="${shop.id}" name="${shop.name}" id="${currentTabId + '_shop'}" >
                    </div>
                    <div class="delivery-panel-pickup-shop">
                      <label for="${currentTabId + '_shop'}">
                        ${shop.name} (${parseFloat((shop.distance / 1000).toFixed(1))} km), ${shop.address.street}, ${shop.address.zipCode || ''} ${shop.address.city}
                      </label>
                    </div>
                    <div class="delivery-panel-pickup-divider"></div>
                  </div>`;
  });

  deliveryPanelPickupShops.innerHTML = shopsHtml;
  
}


/****************  DELIVERY PICKUP SHOPS END *********** */
}


