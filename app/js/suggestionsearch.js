$(function () {
  $('#inputSearch').autocomplete({
    showNoSuggestionNotice: true,
    serviceUrl: '/front/search/SuggestionsSearch',
    //appendTo: $('#inputSearch').parent(),
    minChars: 2,
    beforeRender: function (container) {
      container.find('.autocomplete-suggestion .product').parent().wrapAll('<div class="suggestions__product"/>');
      container.find('.autocomplete-suggestion .default').parent().wrapAll('<div class="suggestions__default"/>');
    },
    formatResult: function (sug, cur) {
      if (sug.data.showAll) {
        var sugLenght = sug.data.suggestionsLenght || 1;
        var showAll = '<a class="showAll" href=' + sug.data.link + '>' + sug.value + '</a>'; //+" "+ '(' + sugLenght + ')</a>';
        return showAll;

      } else if (sug.data.type === 'product') {
        var img = '<img class="productImg" src="' + sug.data.img + '" />'
        var productName = '<div class="productName">' + sug.value + '</div>';
        //var productCategory = '<div class="productCategory">' + sug.data.Category + '</div>';
        var productText = '<div class="productText">' + productName + /*productCategory +*/ '</div>';
        var productInfo = '<div class="productInfo">' + img + productText + '</div>';
        var price = '<div class="productPrice">' /*+ '<span>pris </span>'*/ + sug.data.price + '</div>';
        var product = '<a class="productFull product" href=' + sug.data.link + '>' + productInfo + price + '</a>';

        return product;
      } else {
        var sugLenght = sug.data.suggestionsLenght || 1;
        var defaulProduct = '<a class="default" href=' + sug.data.link + '><span> ' + sug.value + '</span> in category (' + sugLenght + ') </a>';
        return defaulProduct;
      }
    },
    onSelect: function (event, ui) {
      var href = $('.autocomplete-suggestion.autocomplete-selected').find('a').attr('href');
      window.location.href = href;
    },
    onSearchStart: function () {
      $('.js-search-icon').hide();
      $('.js-search-icon-loader').show();
    },
    onSearchComplete: function () {
      $('.js-search-icon-loader').hide();
      $('.js-search-icon').show();
    }
  })
});