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

 function checkForm() {
  var variantId = $('input[name="variantid"]:checked').val();
  if (variantId === "" || variantId === undefined) {
      var extraVariantCheck = document.getElementById('variantid');
      if (extraVariantCheck != null)
          return true;
      else {
          alert('Du skal velge farge');
          return false;
      }
  }
  return true;
}

}