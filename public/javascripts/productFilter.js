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
    setCheckboxes('status', params.status); // Set CPUs

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
const onFilterSubmit = function (e) {
    e.preventDefault();

    // Collect checked values for brand and cpu
    const getCheckedValues = (name) =>
        Array.from(
            document.querySelectorAll(`input[name="${name}"]:checked`),
        ).map((input) => input.value);

    const brand = getCheckedValues('brand');
    const status = getCheckedValues('status');

    // Collect price range values
    const minPrice = document.getElementById('minPrice').value;
    console.log(minPrice);
    const maxPrice = document.getElementById('maxPrice').value;

    // Construct query string
    const queryString = window.location.search;
    const queryParams = new URLSearchParams(queryString);
    if (brand.length) queryParams.set('brand', brand.join(','));
    if (status.length) queryParams.set('status', status.join(','));
    if (minPrice) queryParams.set('minPrice', minPrice);
    if (maxPrice) queryParams.set('maxPrice', maxPrice);

    // Redirect
    const baseUrl = window.location.href.split('?')[0];
    window.location.href = `${baseUrl}${queryParams ? '?' : ''}${queryParams.toString()}`;
};
