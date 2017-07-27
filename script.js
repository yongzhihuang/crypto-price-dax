$(function() {
  getEthPrice();
  let refreshCountdown = 10;
  let $refreshDiv = $('.refresh');
  $refreshDiv.html(`Refreh in: ${refreshCountdown} seconds`);

  setInterval(function() {
    $refreshDiv.html(`Refresh in: ${refreshCountdown} seconds`);
    if (refreshCountdown < 1) {
      refreshCountdown = 10;
    }
    refreshCountdown -= 1;
  }, 1000);

  setInterval(function() {
    getEthPrice();
  }, 10000);


  $('.set-target').on('click', function(e) {
    const target = prompt('What is your price target?');
    if (target) {
      window.localStorage.priceTarget = target;
    }
  });
  
  $('.price-options').on('change', function() {
    getEthPrice();
  });
});


function getEthPrice(currency) {
   if (!currency) {
    currency = $('.price-options option:selected').text() || 'eth-usd';
    $('.currency-type').html(`${currency.toUpperCase()} Price`);
   }

   $.ajax(`https://api.gdax.com/products/${currency}/ticker`)
   .then((res) => {
      if (res) {
        const ethPrice = `$${parseFloat(Math.round(res.price * 100) / 100).toFixed(2)}`;
        $('.price').html(ethPrice);
        document.title = ethPrice;
      }

      let priceTarget = window.localStorage.priceTarget || 500;
      const pricePercentage = parseFloat((res.price/priceTarget) * 100).toFixed(2);
      $('.target').html(`Price Target: $${priceTarget} (${pricePercentage}%)`);
   })
}