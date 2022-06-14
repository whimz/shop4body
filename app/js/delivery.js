window.onload = function(){

  let deliveryOptionRadios = document.querySelectorAll('input[name="deliveryID"]');
  let deliverySearchButtons = document.querySelectorAll('.delivery-panel-items button[name="search"]');

  if(deliverySearchButtons.length > 0){
    deliverySearchButtons.forEach(button => {
      button.addEventListener('click', requestPickupShops);
    });
  }

  if(deliveryOptionRadios.length !== 0){
    deliveryOptionRadios.forEach(radio => {
      radio.addEventListener('change', requestPickupShops);
      radio.addEventListener('change', removeShopIdFromLocalStorage);
      radio.addEventListener('change', saveCurrentTabToLocalStorage);
    });
  }

  function saveCurrentTabToLocalStorage(event){
    localStorage.setItem('deliveryID', event.target.value);
    if (event.target.dataset.deliveryType == 'no-shops'){
      localStorage.setItem('deliveryShop', '');
    }
  }

  function removeShopIdFromLocalStorage(){
    if (localStorage.getItem('deliveryShop') !== null) {
      localStorage.setItem('deliveryShop', '');
    } 
  }

  // if we have tab in localStorage when pageloads then show stored tab
  if(localStorage.deliveryID){
    let currentRadioButton = document.querySelector(`[value="${localStorage.deliveryID}"]`);
    let currentTab = currentRadioButton.closest('.delivery-panel-tab');

    currentRadioButton.checked = true;

    // if it has shop stored then show the shop too
    if(localStorage.deliveryShop !== ''){
      hideSearchForm(currentTab);
      assignRadioButtonWithShopId(currentRadioButton);
      renderShopOpeningHours(JSON.parse(localStorage.deliveryShop), currentTab);
    }else{
      getInitialPickupList(currentRadioButton);
    }
  
  //otherwise - default behavior
  }else{
    if(deliveryOptionRadios.length !== 0){
      deliveryOptionRadios.forEach(radio => {
        // if radiobutton is checked when page loads then get its pickup shops list
        if(radio.checked){
          getInitialPickupList(radio);
        }
      });
    } 
  }

  // search form inputs error handling
  let searchInputs = document.querySelectorAll('.delivery-panel-pickup-search [name="postalCode"], .delivery-panel-pickup-search [name="address"]');
  if(searchInputs.length !== 0){
    searchInputs.forEach(input => {
      input.addEventListener('focus', (event) => {
        event.target.classList.remove('error');
      })
    });
  }

  // tabs elements show/hide on selecting tabs radiobuttons
  if(deliveryOptionRadios.length > 0){
    deliveryOptionRadios.forEach(radio => {
      radio.addEventListener('change', setTabsInitialState);
    });
  }

  // if shopId exists in localStorage then assign radiobutton with it
  function assignRadioButtonWithShopId(radio){
    let shopId = (JSON.parse(localStorage.getItem('deliveryShop'))).id;
    radio.setAttribute('data-shop-id', shopId);
  }

  // getshoplist for checked tab on page load
  function getInitialPickupList(radio){
    if(radio.dataset.deliveryType === 'no-shops'){
      return;
    }

    let currentTab = radio.closest('.delivery-panel-tab');
    let formSearchElements = currentTab.querySelector('form.delivery-panel-pickup-search').elements; 

    //prepare HttpRequest paramenters
    //delivery ID
    let requestParams = `?${radio.name}=${radio.value}`;

    // adding extra parameters
    for(let i = 0; i < formSearchElements.length; i++){
      //countryCode + postalCode + address
      if(formSearchElements[i].nodeName === 'INPUT'){
        requestParams += `&${formSearchElements[i].name}=${formSearchElements[i].value}`;
      }
    } 

    let spinner = currentTab.querySelector('.lds-dual-ring');
    if(spinner){
      spinner.classList.add('visible');
    } 
    //sendShopsRequest(requestParams, currentTab);
/********************************************************************************
 * ******************************************************************************
 * ******************************************************************************
 */
    testShopRequest(requestParams, currentTab);
  }

  //hide openingHours table, show pickup-shops
  function setTabsInitialState(event){

    let currentTab = event.target.closest('.delivery-panel-tab');
    let tabs = event.target.closest('.delivery-panel-items').querySelectorAll('.delivery-panel-tab');

    tabs.forEach(tab => {

      let shopList = tab.querySelector('.delivery-panel-pickup-shops');

      if(shopList){
        shopList.classList.remove('error');
      }

      if(tab !== currentTab){
        let openingHours = tab.querySelector('.shop-opening-hours');

        if(openingHours && openingHours.classList.contains('visible')){
          openingHours.classList.remove('visible');
          removeShopIdFromRadioButton(tab);

          if(shopList){
            shopList.classList.add('active');
          }

        }

        let searchForm = tab.querySelector('.delivery-panel-pickup-search');

        if(searchForm && searchForm.classList.contains('hidden')){
          searchForm.classList.remove('hidden');
        }

        removeErrorMessage(tab);
      }
    });
  }

  function requestPickupShops(event){

    let currentTab = event.target.closest('.delivery-panel-tab');
    if(currentTab.querySelectorAll('.shop-container').length !== 0 && event.type !== 'click'){
      return;
    }

    //if request is from the search form or after Opening-Hours-Close-button click
    if(event.type === 'click'){
      event.preventDefault();

      let searchFormValid = true;
      let searchFormInputs = currentTab.querySelectorAll('[name="postalCode"], [name="address"]');
   
      searchFormInputs.forEach(input => {
        if(input.value == ''){
          searchFormValid = false;
          input.classList.add('error');
        }
      });
  
      if(!searchFormValid){
        return;
      }
    }

    // if tab has no shops by default
    if(event.target.dataset.deliveryType === 'no-shops'){
      return;
    }

    currentTab.querySelector('.shop-opening-hours').classList.remove('visible');

    let deliveryIdRadioButton = currentTab.querySelector('input[name="deliveryID"]');
    let formSearchElements = currentTab.querySelector('form.delivery-panel-pickup-search').elements; 
    let spinner = currentTab.querySelector('.lds-dual-ring');
    if(spinner){
      spinner.classList.add('visible');
    } 

    //prepare HttpRequest paramenters
    //delivery ID
    let requestParams = `?${deliveryIdRadioButton.name}=${deliveryIdRadioButton.value}`;

    // adding extra parameters
    for(let i = 0; i < formSearchElements.length; i++){
      //countryCode + postalCode + address
      if(formSearchElements[i].nodeName === 'INPUT'){
        requestParams += `&${formSearchElements[i].name}=${formSearchElements[i].value}`;
      }
    } 
    
    //sendShopsRequest(requestParams, currentTab);
/********************************************************************************
 * ******************************************************************************
 * ******************************************************************************
 */
    testShopRequest(requestParams, currentTab);
    
  }

  /*************************  PICKUPS REQUEST  **************************************** */

  function sendShopsRequest(requestParams, currentTab){

    let url = '/checkout/delivery/GetServicePoints'; 
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url + requestParams);
    xhr.send();

    xhr.onload = function() {
      if (xhr.status == 200) {

        let deliveryPanelPickupShops = currentTab.querySelector('.delivery-panel-pickup-shops');
        let spinner = currentTab.querySelector('.lds-dual-ring');

        clearDeliveryPanel(deliveryPanelPickupShops);
          
        if(spinner){
          spinner.classList.remove('visible'); 
        }

        renderPickupShops(xhr.response, currentTab);

        console.log(`Success ${xhr.response.length} bytes`); 
      } else { 
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
      }
    }
  }


  /*********  TEST FUNCTION  *********/
  function testShopRequest(requestParams, currentTab){
    
    let testPickupJSON = '{"servicePoints":[{"id":"110987","name":"Toolpartner ApS","distance":200,"address":{"street":"Dannebrogsgade 26A","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.051483,"longitude":9.904226},"openingHours":[{"day":"Mandag","hours":"11:00 - 17:30"},{"day":"Tirsdag","hours":"11:00 - 17:30"},{"day":"Onsdag","hours":"11:00 - 17:30"},{"day":"Torsdag","hours":"11:00 - 17:30"},{"day":"Fredag","hours":"11:00 - 17:30"},{"day":"Lørdag","hours":"11:00 - 17:30"},{"day":"Søndag","hours":"11:00 - 17:30"}]},{"id":"108562","name":"Schou Bertelsen Sko","distance":2100,"address":{"street":"Vestergade 2A","postalCode":"9400","city":"Nørresundby"},"coordinates":{"latitude":57.059138,"longitude":9.922549},"openingHours":[{"day":"Mandag","hours":"10:00 - 17:30"},{"day":"Tirsdag","hours":"10:00 - 17:30"},{"day":"Onsdag","hours":"10:00 - 17:30"},{"day":"Torsdag","hours":"10:00 - 17:30"},{"day":"Fredag","hours":"10:00 - 17:30"},{"day":"Lørdag","hours":"10:00 - 17:30"},{"day":"Søndag","hours":"10:00 - 17:30"}]},{"id":"109521","name":"SuperBrugsen Nordhavnen","distance":2100,"address":{"street":"Havnegade 10","postalCode":"9400","city":"Nørresundby"},"coordinates":{"latitude":57.056644,"longitude":9.924482},"openingHours":[{"day":"Mandag","hours":"08:00 - 21:00"},{"day":"Tirsdag","hours":"08:00 - 21:00"},{"day":"Onsdag","hours":"08:00 - 21:00"},{"day":"Torsdag","hours":"08:00 - 21:00"},{"day":"Fredag","hours":"08:00 - 21:00"},{"day":"Lørdag","hours":"08:00 - 21:00"},{"day":"Søndag","hours":"08:00 - 21:00"}]},{"id":"106881","name":"Kiosken på Boulevarden","distance":2100,"address":{"street":"Boulevarden 33","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.043939,"longitude":9.918728},"openingHours":[{"day":"Mandag","hours":"09:00 - 18:00"},{"day":"Tirsdag","hours":"09:00 - 18:00"},{"day":"Onsdag","hours":"09:00 - 18:00"},{"day":"Torsdag","hours":"09:00 - 18:00"},{"day":"Fredag","hours":"09:00 - 18:00"},{"day":"Lørdag","hours":"09:00 - 18:00"},{"day":"Søndag","hours":"09:00 - 18:00"}]},{"id":"108413","name":"Next Data","distance":2200,"address":{"street":"Østerbrogade 79","postalCode":"9400","city":"Nørresundby"},"coordinates":{"latitude":57.058604,"longitude":9.926823},"openingHours":[{"day":"Mandag","hours":"10:00 - 17:30"},{"day":"Tirsdag","hours":"10:00 - 17:30"},{"day":"Onsdag","hours":"10:00 - 17:30"},{"day":"Torsdag","hours":"10:00 - 17:30"},{"day":"Fredag","hours":"10:00 - 17:30"},{"day":"Lørdag","hours":"10:00 - 17:30"},{"day":"Søndag","hours":"10:00 - 17:30"}]},{"id":"109789","name":"Stationsvejenskiosk","distance":3100,"address":{"street":"Stationsvej 31","postalCode":"9400","city":"Nørresundby"},"coordinates":{"latitude":57.065005,"longitude":9.911514},"openingHours":[{"day":"Mandag","hours":"08:00 - 21:00"},{"day":"Tirsdag","hours":"08:00 - 21:00"},{"day":"Onsdag","hours":"08:00 - 21:00"},{"day":"Torsdag","hours":"08:00 - 21:00"},{"day":"Fredag","hours":"08:00 - 21:00"},{"day":"Lørdag","hours":"08:00 - 21:00"},{"day":"Søndag","hours":"08:00 - 21:00"}]},{"id":"107559","name":"Netkiosken.dk","distance":3100,"address":{"street":"Kayerødsgade 6","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.044744,"longitude":9.924055},"openingHours":[{"day":"Mandag","hours":"09:00 - 19:30"},{"day":"Tirsdag","hours":"09:00 - 19:30"},{"day":"Onsdag","hours":"09:00 - 19:30"},{"day":"Torsdag","hours":"09:00 - 19:30"},{"day":"Fredag","hours":"09:00 - 19:30"},{"day":"Lørdag","hours":"09:00 - 17:30"},{"day":"Søndag","hours":"09:00 - 17:30"}]},{"id":"109302","name":"Silvan Aalborg","distance":3300,"address":{"street":"Håndværkervej 21-23","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.033786,"longitude":9.927391},"openingHours":[{"day":"Mandag","hours":"08:00 - 20:00"},{"day":"Tirsdag","hours":"08:00 - 20:00"},{"day":"Onsdag","hours":"08:00 - 20:00"},{"day":"Torsdag","hours":"08:00 - 20:00"},{"day":"Fredag","hours":"08:00 - 20:00"},{"day":"Lørdag","hours":"08:00 - 18:00"},{"day":"Søndag","hours":"08:00 - 18:00"}]},{"id":"108895","name":"Fætter V","distance":3600,"address":{"street":"Hadsundvej 18A","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.043176,"longitude":9.949908},"openingHours":[{"day":"Mandag","hours":"10:00 - 17:30"},{"day":"Tirsdag","hours":"10:00 - 17:30"},{"day":"Onsdag","hours":"10:00 - 17:30"},{"day":"Torsdag","hours":"10:00 - 17:30"},{"day":"Fredag","hours":"10:00 - 17:30"},{"day":"Lørdag","hours":"10:00 - 17:30"},{"day":"Søndag","hours":"10:00 - 17:30"}]},{"id":"108088","name":"Vejgaard Boghandel","distance":3700,"address":{"street":"Hadsundvej 29","postalCode":"9000","city":"Aalborg"},"coordinates":{"latitude":57.042171,"longitude":9.950905},"openingHours":[{"day":"Mandag","hours":"09:30 - 17:30"},{"day":"Tirsdag","hours":"09:30 - 17:30"},{"day":"Onsdag","hours":"09:30 - 17:30"},{"day":"Torsdag","hours":"09:30 - 17:30"},{"day":"Fredag","hours":"09:30 - 17:30"},{"day":"Lørdag","hours":"09:30 - 17:30"},{"day":"Søndag","hours":"09:30 - 17:30"}]}]}';


    let deliveryPanelPickupShops = currentTab.querySelector('.delivery-panel-pickup-shops');

    clearDeliveryPanel(deliveryPanelPickupShops);
    setTimeout(()=>{
      let spinner = currentTab.querySelector('.lds-dual-ring');
      if(spinner){
        spinner.classList.remove('visible'); 
      }
      renderPickupShops(testPickupJSON, currentTab);
    }, 500);
     

    
  }

  /******************************************* */

  function renderPickupShops(shopListJSON, currentTab){
    
    let shopList= (JSON.parse(shopListJSON))['servicePoints'];
    let deliveryPanelPickupShops = currentTab.querySelector('.delivery-panel-pickup-shops');
   
    let shopsHtml = '';

    deliveryPanelPickupShops.classList.add('active');

    shopList.forEach(shop => {
      shopsHtml += `<div class="shop-container">
                      
                      <div class="delivery-panel-pickup-shop">
                        <label for="${'shopID_' + shop.id}">
                          <span class="shop-name-distance">${shop.name} (${parseFloat((shop.distance / 1000).toFixed(1))} km),</span> 
                          <span class="shop-address">${shop.address.street}, ${shop.address.postalCode || ''} ${shop.address.city}</span>
                        </label>
                      </div>
                      <button class="myBtn  myBtnPrimary pickup-detail-button" value="${shop.id}" name="shopID">Vælg</button>                      
                    </div>
                    `;
    });

    deliveryPanelPickupShops.innerHTML = shopsHtml;
    let pickupDetailsButtons = [];
    pickupDetailsButtons = currentTab.getElementsByClassName('pickup-detail-button');

    if(pickupDetailsButtons.length != 0){
      for(let i = 0; i < pickupDetailsButtons.length; i++){

        pickupDetailsButtons[i].addEventListener('click', (event) => { 

          event.stopPropagation();

          removeErrorNotification(deliveryPanelPickupShops);
          removeErrorMessage(currentTab);


          hideSearchForm(currentTab);

          localStorage.setItem('deliveryID', currentTab.querySelector('[type="radio"]').value);
          localStorage.setItem('deliveryShop', JSON.stringify(shopList[i]));
          
          addShopIdToRadioButton(shopList[i].id, currentTab);
          renderShopOpeningHours(shopList[i], currentTab);
        });
      };

    }

  }

  function removeErrorNotification(deliveryPanelPickupShops){
    deliveryPanelPickupShops.classList.remove('error');
  }

  function removeErrorMessage(currentTab){
    let errorMessage = currentTab.querySelector('.error-message');
    if(errorMessage){
      errorMessage.classList.remove('visible');
    }
  }

  function clearDeliveryPanel(panel){
    while(panel.hasChildNodes()){
      panel.removeChild(panel.lastChild);
    }
  }

  function hideSearchForm(currentTab){
    let searchForm = currentTab.querySelector('.delivery-panel-pickup-search');
    searchForm.classList.add('hidden');
  }

  function showSearchForm(currentTab){
    let searchForm = currentTab.querySelector('.delivery-panel-pickup-search');
    searchForm.classList.remove('hidden');
  }

  function renderShopOpeningHours(shop, currentTab){
    let timetableHtml = `
                          <h4>${shop.name}</h4>
                          <p>${shop.address.street}, ${shop.address.postalCode || ''} ${shop.address.city}</p>
                          <button class="myBtn myBtnPrimary close-details-btn">Væelg et andet afhentningssted</button>
                          <table class="timetable">`;

    shop.openingHours.forEach(dayOfWeek => {
      timetableHtml += `<tr>
                          <td>${dayOfWeek.day}</td>
                          <td>${dayOfWeek.hours}</td>
                        </tr>`;
    });
          
    timetableHtml += `</table>`;
    
    let shopOpeningHours = currentTab.querySelector('.shop-opening-hours');
    let panelPickupShops = currentTab.querySelector('.delivery-panel-pickup-shops');

    panelPickupShops.classList.remove('active');
    shopOpeningHours.innerHTML = timetableHtml;
    shopOpeningHours.classList.add('visible');

    let closeBtn = shopOpeningHours.querySelector('.close-details-btn');

    closeBtn.addEventListener('click', (event)=>{

      hideShopOpeningHours(shopOpeningHours, panelPickupShops, currentTab);
      showSearchForm(currentTab);
      if (currentTab.querySelectorAll('.shop-container').length === 0){
        requestPickupShops(event);
      }
      removeShopIdFromRadioButton(currentTab);
      removeShopIdFromLocalStorage();
    });
   
  }

  function addShopIdToRadioButton(shopId, currentTab){
    currentTab.querySelector('input[type="radio"]').setAttribute('data-shop-id', shopId);
  }

  function removeShopIdFromRadioButton(currentTab){
    currentTab.querySelector('input[type="radio"]').removeAttribute('data-shop-id');
  }

  function hideShopOpeningHours(shopOpeningHours, panelPickupShops){
    shopOpeningHours.classList.remove('visible');
    panelPickupShops.classList.add('active');
  }

  /***********validation****************/

  let submitBtn = document.getElementById('submit-btn');

  if(submitBtn){
    submitBtn.addEventListener('click', submitClickHandler);
  }

  function submitClickHandler(event){
    validateDelivery(event.target);
  }

  function validateDelivery(submitBtn){

    let checkedDelivery = document.querySelector('input[name="deliveryID"]:checked');

    if(checkedDelivery.dataset.deliveryType){
      return;
    }

    if(!checkedDelivery.dataset.shopId){
      
      let currentShopList = checkedDelivery.closest('.delivery-panel-tab').querySelector('.delivery-panel-pickup-shops');
      let errorMessage = currentShopList.closest('.delivery-panel-tab').querySelector('.error-message');


      currentShopList.classList.add('error');
      errorMessage.classList.add('visible');
    }
    


  }

}