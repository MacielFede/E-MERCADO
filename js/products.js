
document.addEventListener("DOMContentLoaded", function (e) {
  let productsurl =
    "https://japceibal.github.io/emercado-api/cats_products/101.json";

  getJSONData(productsurl).then(function (resObj) {
    if (resObj.status === "ok") {
        let prod = resObj.data;
        let htmlProducts = "";
        for (let i=0; i<prod.products.length; i++) {
            htmlProducts = `
                <div class="product">
                    <div class="img-container">
                        <a href="product-info.html">
                            <img src=${prod.products[i].image} alt="${prod.products[i].name}" >
                        </a>
                        <span class="price">${prod.products[i].currency}${prod.products[i].cost}</span>
                    </div>
                    <h3 class="text" >${prod.products[i].name}</h3>
                    <p class="text" >${prod.products[i].description}</p>
                    <p class="text" > ${prod.products[i].soldCount} vendidos.</p>
                </div>
                `;
            document.getElementById("product_container").innerHTML += htmlProducts;
        }
    }
  });
});
