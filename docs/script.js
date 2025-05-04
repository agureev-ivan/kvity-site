document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.querySelector(".product-grid");
    const cartButton = document.querySelector(".cart-button");
    const cartItemsDiv = document.querySelector("#cart-items");
    const cartItemList = document.querySelector("#cart-item-list");
    const cartCountSpan = document.querySelector("#cart-count");
    const orderButton = document.querySelector("#order-button");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");
    const reviewsContainer = document.querySelector(".reviews-container");
    const reviewText = document.getElementById("review-text");
    const reviewName = document.getElementById("review-name"); // Додано поле для імені
    const addReviewButton = document.getElementById("add-review");
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popup-close");
    const contactUsButton = document.querySelector(".contact-us-button");
    const cartWrapper = document.querySelector(".cart-wrapper");

    // Дані про товари (замість бази даних)
    let products = JSON.parse(localStorage.getItem("products")) || [
        { id: 1, name: "Букет 'Весняний'", price: 150, rating: 4, image: "img/flower1.jpg", comments: [] },
        { id: 2, name: "Композиція 'Ніжність'", price: 200, rating: 5, image: "img/flower2.jpg", comments: [] },
        { id: 3, name: "Букет 'Екзотика'", price: 180, rating: 3, image: "img/flower3.jpg", comments: [] },
        { id: 4, name: "Букет 'Літній'", price: 350, rating: 5, image: "img/flower4.jpg", comments: [] },
        { id: 5, name: "Букет 'Кохання'", price: 400, rating: 4, image: "img/flower5.jpg", comments: [] },
        { id: 6, name: "Букет 'Весільний'", price: 550, rating: 5, image: "img/flower6.jpg", comments: [] },
        { id: 7, name: "Букет 'Вечірня зірка'", price: 250, rating: 4, image: "img/flower7.jpg", comments: [] },
        { id: 8, name: "Букет 'Сонячний'", price: 375, rating: 3, image: "img/flower8.jpg", comments: [] },
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    updateCartCount();
    displayProducts();
    displayReviews();

    function displayProducts() {
        productGrid.innerHTML = ""; // Очищаємо вміст перед виводом
        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    function createProductCard(product) {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="zoomable">
            <h3>${product.name}</h3>
            <p class="price">Ціна: ${product.price} грн</p>
            <div class="rating">
                Рейтинг: ${createRatingStars(product.rating)}
                <button class="rate-up" data-id="${product.id}">+</button>
                <button class="rate-down" data-id="${product.id}">-</button>
            </div>
            <div class="comments">
                <textarea placeholder="Ваш коментар"></textarea>
                <button class="add-comment" data-id="${product.id}">Додати коментар</button>
                <div class="comment-list">
                    ${displayComments(product.comments)}
                </div>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
        `;

        // Обробники подій
        const addCommentButton = productCard.querySelector(".add-comment");
        const commentTextarea = productCard.querySelector("textarea");
        const rateUpButton = productCard.querySelector(".rate-up");
        const rateDownButton = productCard.querySelector(".rate-down");
        const addToCartButton = productCard.querySelector(".add-to-cart");

        addCommentButton.addEventListener("click", () => addComment(product.id, commentTextarea.value));
        rateUpButton.addEventListener("click", () => changeRating(product.id, 1));
        rateDownButton.addEventListener("click", () => changeRating(product.id, -1));
        addToCartButton.addEventListener("click", () => addToCart(product.id));

        return productCard;
    }

    function createRatingStars(rating) {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? "<span class='star'>&#9733;</span>" : "<span class='star'>&#9734;</span>";
        }
        return stars;
    }

    function displayComments(comments) {
        if (!comments || comments.length === 0) {
            return "<p>Немає коментарів</p>";
        }
        return comments.map(comment => `<p>${comment}</p>`).join("");
    }

    function addComment(productId, text) {
        if (text.trim() !== "") {
            const product = products.find(p => p.id === productId);
            if (product) {
                product.comments.push(text);
                localStorage.setItem("products", JSON.stringify(products));
                displayProducts(); // Оновлюємо відображення товарів, щоб показати новий коментар
            }
        }
    }

    function changeRating(productId, change) {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.rating += change;
            if (product.rating < 0) product.rating = 0;
            if (product.rating > 5) product.rating = 5;
            localStorage.setItem("products", JSON.stringify(products));
            displayProducts(); // Оновлюємо відображення товарів з новим рейтингом
        }
    }

    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
        }
    }

    function updateCartCount() {
        let totalQuantity = 0;
        cart.forEach(item => totalQuantity += item.quantity);
        cartCountSpan.textContent = totalQuantity;
    }

    function displayCartItems() {
        cartItemList.innerHTML = "";
        if (cart.length === 0) {
            cartItemList.innerHTML = "<p>Кошик порожній</p>";
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <span class="item-price">${item.price * item.quantity} грн</span>
                    <button class="remove-item" data-id="${item.id}">Видалити</button>
                `;
                cartItemList.appendChild(cartItem);
            });
        }
    }

    cartButton.addEventListener("click", () => {
        cartItemsDiv.style.display = cartItemsDiv.style.display === "block" ? "none" : "block";
        displayCartItems();
    });

    cartItemList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const id = parseInt(event.target.dataset.id);
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        } else if (event.target.classList.contains("increase-quantity")) {
            const id = parseInt(event.target.dataset.id);
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            }
        } else if (event.target.classList.contains("decrease-quantity")) {
            const id = parseInt(event.target.dataset.id);
            const item = cart.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            }
        } else if (event.target.tagName === "INPUT") {
            const id = parseInt(event.target.dataset.id);
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity = parseInt(event.target.value);
                if (item.quantity < 1) item.quantity = 1;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
                updateCartCount();
            }
        }
    });

    orderButton.addEventListener("click", () => {
        alert("Дякуємо за замовлення!");
        cart = [];
        localStorage.removeItem("cart");
        updateCartCount();
        cartItemsDiv.style.display = "none";
    });

    // Функціонал лайтбоксу
    const images = document.querySelectorAll(".zoomable");

    const openLightbox = (imgSrc) => {
        lightbox.style.display = "flex";
        lightboxImg.src = imgSrc;
    };

    const closeLightbox = () => {
        lightbox.style.display = "none";
    };

    images.forEach(img => {
        img.addEventListener("click", () => {
            openLightbox(img.src);
        });
    });

    closeBtn.addEventListener("click", () => {
        closeLightbox();
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // Відгуки
    function displayReviews() {
        reviewsContainer.innerHTML = reviews.map((review, index) => {
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");
            reviewCard.innerHTML = `
                <h3>Відгук ${index + 1}</h3>
                <p><b>${review.name}:</b> ${review.text}</p> 
            `;
            return reviewCard.outerHTML;
        }).join("");
    }

    addReviewButton.addEventListener("click", () => {
        const text = reviewText.value.trim();
        const name = reviewName.value.trim(); // Отримуємо ім'я
        if (text && name) { // Перевіряємо, чи обидва поля заповнені
            reviews.push({ name: name, text: text }); // Зберігаємо об'єкт з ім'ям та текстом
            localStorage.setItem("reviews", JSON.stringify(reviews));
            displayReviews();
            reviewText.value = "";
            reviewName.value = ""; // Очищаємо поле імені
        } else {
            alert("Будь ласка, введіть ваше ім'я та відгук.");
        }
    });

    // Popup повідомлення
    contactUsButton.addEventListener("click", (event) => {
        popup.style.display = "flex"; // Показуємо popup
    });

    popupClose.addEventListener("click", () => {
        popup.style.display = "none"; // Ховаємо popup при кліку на кнопку закриття
    });

    // Анімація при скролі (приклад)
    window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add("show");
            }
        });
    });
});