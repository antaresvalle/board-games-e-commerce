// $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
//   })
$('.carousel').carousel()

Vue.component('newP', {
    props: ['image','title', 'price', 'id'],
    template: `
    <div class="col-sm-4 new-products" v-on:click="showDetails(id)">
            <a href="#" data-toggle="modal" data-target="#exampleModal""><img :src="image" :alt="title"></a>
            <a href="#" class="product-title"><p><strong> {{ title }} </strong></p></a>
            <p>$ {{ price }}</p>
    </div>
    `,
})

Vue.component('product', {
    props: ['image','title', 'price', 'id'],
    template: `
    <div class="col-sm-4 new-products" v-on:click="showDetails(id)">
            <a href="#" data-toggle="modal" data-target="#exampleModal""><img :src="image" :alt="title"></a>
            <a href="#" class="product-title"><p><strong> {{ title }} </strong></p></a>
            <p>$ {{ price }}</p>
    </div>
    `,
    methods: {
        showDetails: function(item_id){
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




var allProducts = new Vue({
    el: '#all-products',
    data: {
        newProducts: [],
        products: [],
    },
    methods: {
        loadProducts: function(){
            $.ajax({
                url: `https://api.mercadolibre.com/sites/MLA/search?q=juegos/mesa/#menu=categories`,
                type: 'GET',
                crossDomain: true,
                datatype: 'json',
            }).done((response) => {
                // console.log(response.results);
                this.products = response.results;
            });
        },
        newP: function(){
            $.ajax({
                url: `https://api.mercadolibre.com/sites/MLA/search?q=juegos/mesa/_PublishedToday_YES`,
                type: 'GET',
                crossDomain: true,
                datatype: 'json',
            }).done((response) => {
                console.log(response.results);
                this.newProducts = response.results;
            });
        },
        // showDetails: function(item_id){
        //     console.log(item_id);
        // }
    }
})

const displayModal = (data) => {
    console.log(data)
    // $('#modal').html('');
    let image = data.pictures[0].url;
    let modalItemTitle = data.title;
    let template = `<div class="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <img src="${image}">
                <h5 class="modal-title" id="modalItemTitle">${modalItemTitle}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p id="itemTitle"></p>
                <div id="description"></div>
            </div>
            <div class="modal-footer">

            </div>
        </div>
    </div>
</div>`
$('#modal').append(template);
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })
}

const clean = () =>{
    console.log('here');
    // $('#modal').html('');
}

allProducts.loadProducts();
allProducts.newP();
// allProducts.showDetails("MLA673577112");

// $(document).ready(() => {

// // https://api.mercadolibre.com/items/${item_id}

// const showProducts = (item_id) => {
//     $.ajax({
//         url: `https://api.mercadolibre.com/sites/MLA/search?q=juegos/mesa/#menu=categories`,
//         type: 'GET',
//         crossDomain: true,
//         datatype: 'json',
//     }).done((response) => {
//         console.log(response.results);
//     });
// }

// showProducts('MLM590492715');
// showProducts();
// })