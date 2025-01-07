const renderProducts = (data) => {
  const productContainer = document.getElementById('product-list');
  productContainer.innerHTML = ''; // Clear current content

  data.products.forEach((product) => {
    productContainer.innerHTML += `
      <div class="bg-white p-4 rounded-lg shadow self-stretch flex flex-col">
        <img
          src="${product.profile_img.url}"
          alt="${product.name}"
          class="w-full object-cover mb-4 rounded-lg"
        />
        <a
          href="/shop/laptop/${product.id}"
          class="text-lg font-semibold mb-2"
        >
          ${product.name}
        </a>
        <p class="my-2">${product.category}</p>
        <div class="flex items-center mb-4 mt-auto">
          ${
            product.price_sale
              ? `
                <span class="text-lg font-bold text-primary">
                  ${product.price_sale.toLocaleString()}₫
                </span>
                <span class="text-sm font-bold line-through ml-2">
                  ${product.price.toLocaleString()}₫
                </span>
                <span class="text-sm font-bold text-primary ml-2">
                  -${100 - Math.round((product.price_sale / product.price) * 100)}%
                </span>
              `
              : `
                <span class="text-lg font-bold text-primary">
                  ${product.price.toLocaleString()}₫
                </span>
              `
          }
        </div>
        <button
          onclick="addToCartSingle(${product.id})"
          class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full"
        >
          Thêm vào giỏ
        </button>
      </div>
    `;
  });
};


const updatePaginationUI = (currentPage, totalPage) => {
  console.log(currentPage, totalPage);
  const paginationContainer = document.getElementById('product-pagination');
  paginationContainer.innerHTML = ''; // Clear current pagination links

  // Determine the range of pages to display (up to 3 pages around the current page)
  let startPage = currentPage - 1;
  let endPage = currentPage + 1;

  // Ensure we don't go out of bounds
  if (startPage < 1) startPage = 1;
  if (endPage > totalPage) endPage = totalPage;

  // "Previous" button (disabled on the first page)
  if (currentPage > 1) {
    const prevButton = document.createElement('li');
    prevButton.innerHTML = `<button class="w-10 h-10 flex items-center justify-center rounded-full pagination-link">Previous</button>`;
    prevButton.querySelector('button').addEventListener('click', (e) => {
      onPageChange(e, currentPage - 1);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Loop through the page numbers (up to 3 pages)
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('li');
    pageButton.innerHTML = `<button class="w-10 h-10 flex items-center justify-center rounded-full pagination-link ${i === currentPage ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}">${i}</button>`;
    pageButton.querySelector('button').addEventListener('click', (e) => {
      onPageChange(e, i);
    });
    paginationContainer.appendChild(pageButton);
  }

  // "Next" button (disabled on the last page)
  if (currentPage < totalPage) {
    const nextButton = document.createElement('li');
    nextButton.innerHTML = `<button class="w-10 h-10 flex items-center justify-center rounded-full pagination-link">Next</button>`;
    nextButton.querySelector('button').addEventListener('click', (e) => {
      onPageChange(e, currentPage + 1);
    });
    paginationContainer.appendChild(nextButton);
  }
};

// Attach event listeners for pagination
// document.addEventListener('DOMContentLoaded', () => {
//   const paginationLinks = document.querySelectorAll('.pagination-link');
//   paginationLinks.forEach((link) => {
//     link.addEventListener('click', (e) => {
//       const page = Number(link.textContent);
//       onPageChange(e, page);
//     });
//   });
// });

const onPageChange = async function (e, page) {
  e.preventDefault();

  // Get the current URL and extract query parameters
  const currentUrl = new URL(window.location.href);
  const apiUrl = new URL(`${currentUrl.origin}/api/product`);

  // Copy existing query parameters to the API URL, excluding 'page'
  currentUrl.searchParams.forEach((value, key) => {
    if (key !== 'page') {
      // Exclude the 'page' parameter to prevent it from duplicating
      apiUrl.searchParams.set(key, value);
    }
  });

  // Set the new 'page' query parameter
  apiUrl.searchParams.set('page', page);

  console.log(`Page change triggered for page: ${page}`);
  console.log(`Fetching data for API URL: ${apiUrl}`);

  // Fetch data using AJAX
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const data = await response.json(); // Assuming API returns JSON data
    console.log(data);

    // Render new data (Replace this with your data-rendering logic)
    renderProducts(data);

    // Update active page button
    updatePaginationUI(data.currentPage, data.totalPage);

    // Update the URL in the address bar without duplicating the 'page' parameter
    currentUrl.searchParams.set('page', data.currentPage); // Update page number in the URL
    window.history.replaceState(null, '', currentUrl.toString());
  } catch (error) {
    console.error('Failed to load data:', error);
  }
};
