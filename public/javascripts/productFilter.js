// Function to get query parameters as an object
function getQueryParams() {
    const queryString = window.location.search; // Get query string (e.g., "?brand=a,b&cpu=i7,i5&minPrice=100&maxPrice=200")
    const urlParams = new URLSearchParams(queryString);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

// Function to set the selected filter options
function setFilters() {
    const params = getQueryParams();

    // Set checkboxes for brands and CPUs
    const setCheckboxes = (name, values) => {
        if (values) {
            const valueArray = values.split(','); // Split "a,b" into ["a", "b"]
            document
                .querySelectorAll(`input[name="${name}"]`)
                .forEach((checkbox) => {
                    checkbox.checked = valueArray.includes(checkbox.value); // Check if value matches
                });
        }
    };

    setCheckboxes('brand', params.brand); // Set brands
    setCheckboxes('cpu', params.cpu); // Set CPUs
    setCheckboxes('screen_size', params.screen_size); // Set screen sizes

    // Set single value inputs (e.g., minPrice and maxPrice)
    if (params.minPrice) {
        document.getElementById('minPrice').value = params.minPrice;
    }
    if (params.maxPrice) {
        document.getElementById('maxPrice').value = params.maxPrice;
    }

    // Set sort by
    if (params.order) {
        document.getElementById('sort-price').value = params.order;
    }
}

// Call the function to set filters when the page loads
document.addEventListener('DOMContentLoaded', setFilters);

/* Sort by price */
const sortByPrice = function () {
    const sort = document.getElementById('sort-price');
    const queryString = window.location.search; // Get query string (e.g., "?brand=a,b&cpu=i7,i5&minPrice=100&maxPrice=200")
    const queryParams = new URLSearchParams(queryString);

    if (sort.value) {
        queryParams.set('order', sort.value);
        // Redirect
        const baseUrl = window.location.href.split('?')[0];
        window.location.href = `${baseUrl}?${queryParams.toString()}`;
    }
};

/* Shop page filter show/hide */
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('products-toggle-filters');
    const filters = document.getElementById('filters');

    if (toggleButton && filters) {
        toggleButton.addEventListener('click', function () {
            if (filters.classList.contains('hidden')) {
                filters.classList.remove('hidden');
                this.textContent = 'Hide Filters';
            } else {
                filters.classList.add('hidden');
                this.textContent = 'Show Filters';
            }
        });
    }
});

/* Shop page filter*/
document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.querySelector('select');
    const arrowDown = document.getElementById('arrow-down');
    const arrowUp = document.getElementById('arrow-up');

    if (selectElement && arrowDown && arrowUp) {
        selectElement.addEventListener('click', function () {
            arrowDown.classList.toggle('hidden');
            arrowUp.classList.toggle('hidden');
        });
    }
});

// /* search */
// Const search = document.getElementById('search-global');
// Const handleSearchSubmit = (e) => {
//     E.preventDefault();
//     Window.location.href =
//         `${window.location.origin}/shop/laptop ` +
//         (search.value ? `?keyword=${encodeURIComponent(search.value)}` : '');
// };

/* Filter submit */
const onFilterSubmit = async function (e) {
    e.preventDefault();

    // Collect checked values for brand and cpu
    const getCheckedValues = (name) =>
        Array.from(
            document.querySelectorAll(`input[name="${name}"]:checked`),
        ).map((input) => input.value);

    const brand = getCheckedValues('brand');
    const status = getCheckedValues('status');
    const cpu = getCheckedValues('cpu');
    const screen_size = getCheckedValues('screen_size');

    // Collect price range values
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    // Construct query string
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);

    brand.length
        ? queryParams.set('brand', brand.join(','))
        : queryParams.delete('brand');
    status.length
        ? queryParams.set('status', status.join(','))
        : queryParams.delete('status');
    cpu.length
        ? queryParams.set('cpu', cpu.join(','))
        : queryParams.delete('cpu');
    screen_size.length
        ? queryParams.set('screen_size', screen_size.join(','))
        : queryParams.delete('screen_size');
    minPrice
        ? queryParams.set('minPrice', minPrice)
        : queryParams.delete('minPrice');
    maxPrice
        ? queryParams.set('maxPrice', maxPrice)
        : queryParams.delete('maxPrice');

    // Redirect
    const baseUrl = window.location.href.split('?')[0];
    url = `${baseUrl}${queryParams ? '?' : ''}${queryParams.toString()}`;
    window.history.replaceState(null,"", url);      

    const api_url = `${window.location.protocol}//${window.location.host}/api/v1/products${queryParams ? '?' : ''}${queryParams.toString()}`;
    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const {products, totalPage} = await response.json();

        // Render products
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear existing products
        products.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow');
            productElement.innerHTML = `
                <img
                    src="${product.product_image[0]?.url || ''}"
                    alt="${product.name}"
                    class="w-full object-cover mb-4 rounded-lg"
                />
                <a href="/shop/${product.category.name.toLowerCase()}/${product.id}" class="text-lg font-semibold mb-2">
                    ${product.name}
                </a>
                <p class="my-2">${product.category.name}</p>
                <div class="flex items-center mb-4">
                    ${
                        product.price_sale
                            ? `
                        <span class="text-lg font-bold text-primary">${product.price_sale.toLocaleString()}₫</span>
                        <span class="text-sm font-bold line-through ml-2">${product.price.toLocaleString()}₫</span>
                        <span class="text-sm font-bold text-primary ml-2">-${100 - Math.round((product.price_sale / product.price) * 100)}%</span>
                    `
                            : `<span class="text-lg font-bold text-primary">${product.price.toLocaleString()}₫</span>`
                    }
                </div>
                <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                    Thêm vào giỏ
                </button>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error fetching or rendering products:', error.message);
    }
};
