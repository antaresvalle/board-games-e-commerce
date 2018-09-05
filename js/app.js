$('.carousel').carousel()

Vue.component('product', {
    props: ['image', 'title', 'price', 'id'],
    template: `
    <div class="col-sm-3 new-products" v-on:click="showDetails(id)">
        <div class="card shadow p-3 mb-5 bg-white rounded">
            <a href="#" data-toggle="modal" data-target="#exampleModal" class="cont-img"><img :src="image" :alt="title" class="product-img"></a>
            <p class="price">$ {{ price }}</p>
            <a href="#" data-toggle="modal" data-target="#exampleModal" class="product-title"><p class="title"> {{ title }} </p></a>
        </div>
    </div>
    `,
    methods: {
        showDetails: function (item_id) {
            // console.log(item_id);
            $.ajax({
                url: `https://api.mercadolibre.com/items/${item_id}`,
                type: 'GET',
                crossDomain: true,
                datatype: 'json',
            }).done((response) => {
                // console.log(response);
                this.details = response;
                displayModal(response);
            });
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        products: [],
        currentRoute: window.location.pathname,
    },
    methods: {
        loadProducts: function (endpoint) {
            $.ajax({
                url: `https://api.mercadolibre.com/sites/MLA/search?q=${endpoint}`,
                type: 'GET',
                crossDomain: true,
                datatype: 'json',
            }).done((response) => {
                // console.log(response.results);
                this.products = response.results;
            });
        }
    },
    
})

const displayModal = (data) => {
    let image = data.pictures[0].url;
    let modalItemTitle = data.title;
    let modalPrice = data.price;
    let template = `
        <div class="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" onClick="clean();" data-dismiss='modal' class="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-8">
                                <img src="${image}">
                            </div>
                            <div class="col-4">
                                <p id="itemTitle"><strong>${modalItemTitle}</strong></p>
                                <p class="price-modal">$${modalPrice}</p>
                                <div id="description"></div>
                                <div id="paypal-button"></div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>`

    $('#modal-container').append(template);
    $('#exampleModal').modal();

    $('#paypal-button').empty();

    paypal.Button.render({
        // Configure environment
        env: 'sandbox',
        client: {
          sandbox: 'AY82iE25hTkhJYsi28q6k3MSki3Rk1PlOIVT78Kvqay_vHP-gNjs2ikv3Yd9HKCEXbeQpOlSNWHXxfuj',
          production: 'demo_production_client_id'
        },
        // Customize button (optional)
        locale: 'en_US',
        style: {
          size: 'small',
          color: 'gold',
          shape: 'pill',
        },
        // Set up a payment
        payment: function (data, actions) {
            console.log(modalPrice);
            return actions.payment.create({
              transactions: [{
                amount: {
                  total: modalPrice,
                  currency: 'MXN',
                //   details: {
                //     subtotal: '30.00',
                //     tax: '0.07',
                //     shipping: '0.03',
                //     handling_fee: '1.00',
                //     shipping_discount: '-1.00',
                //     insurance: '0.01'
                //   }
                },
                description: 'The payment transaction description.',
                custom: '90048630024435',
                //invoice_number: '12345', Insert a unique invoice number
                payment_options: {
                  allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                },
                soft_descriptor: 'ECHI5786786',
                item_list: {
                  items: [
                    {
                      name: modalItemTitle,
                      description: 'Brown hat.',
                      quantity: '1',
                      price: modalPrice,
                      currency: 'MXN'
                    },
                  ],
                  shipping_address: {
                    recipient_name: 'Brian Robinson',
                    line1: '4th Floor',
                    line2: 'Unit #34',
                    city: 'San Jose',
                    country_code: 'US',
                    postal_code: '95131',
                    phone: '011862212345678',
                    state: 'CA'
                  }
                }
              }],
              note_to_payer: 'Contact us for any questions on your order.'
            });
          },
        // Execute the payment
        onAuthorize: function (data, actions) {
          return actions.payment.execute()
            .then(function () {
              // Show a confirmation message to the buyer
              window.alert('Thank you for your purchase!');
            });
        }
      }, '#paypal-button');
    }

const clean = () => {
    $('#exampleModal').on('hidden.bs.modal', function (e) {
        $('#exampleModal').modal('dispose');
        $('#modal-container').html('');
    })
}

app.loadProducts('/juegos/');
