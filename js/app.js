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

    paypal.Button.render({
        env: 'sandbox',
        client: {
            sandbox: 'demo_sandbox_client_id'
        },
        payment: function (data, actions) {
            return actions.payment.create({
                transactions: [{
                    amount: {
                        total: '0.01',
                        currency: 'USD'
                    }
                }]
            });
        },
        onAuthorize: function (data, actions) {
            return actions.payment.execute()
                .then(function () {
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
