document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SAMPLE PRODUCT DATABASE ---
    // We use specific seeds for Picsum to ensure the images look consistent every time.
    const sampleProducts = [
        {
            id: 1,
            title: "Premium Rwandan Coffee (1kg)",
            price: 3.14,
            desc: "Single-origin Arabica beans harvested from the highlands of Musanze. Rich, chocolatey notes.",
            category: "Agriculture",
            seller: "KigaliCoffeeCo",
            image: "https://picsum.photos/seed/coffee123/400/300"
        },
        {
            id: 2,
            title: "Traditional Agaseke Basket",
            price: 1.50,
            desc: "Handwoven peace basket by local artisans. Perfect for home decor or gifts. Durable grass weave.",
            category: "Handcraft",
            seller: "ArtisanRw",
            image: "https://picsum.photos/seed/basket99/400/300"
        },
        {
            id: 3,
            title: "Web Development Service",
            price: 10.00,
            desc: "Full stack website development tailored for the Pi Ecosystem. Includes deployment and security.",
            category: "Services",
            seller: "CodeMaster",
            image: "https://picsum.photos/seed/codingtech/400/300"
        },
        {
            id: 4,
            title: "Urban Land Plot (Kigali)",
            price: 31.40,
            desc: "500 sqm plot in prime location. Ready for construction. Legal title included.",
            category: "Real Estate",
            seller: "NexeraRealty",
            image: "https://picsum.photos/seed/landkigali/400/300"
        },
        {
            id: 5,
            title: "Kiswahili Tutoring (10 Hours)",
            price: 5.50,
            desc: "Online lessons to master East Africa's business language. Experienced native speaker.",
            category: "Education",
            seller: "EduConnect",
            image: "https://picsum.photos/seed/studytime/400/300"
        },
        {
            id: 6,
            title: "Solar Power Kit (Small)",
            price: 8.25,
            desc: "Portable solar panel + battery pack for charging phones and small lights. Off-grid ready.",
            category: "Electronics",
            seller: "GreenEnergy",
            image: "https://picsum.photos/seed/solarpanel/400/300"
        }
    ];

    // --- 2. INITIALIZE PRODUCTS ---
    // Load from LocalStorage if exists, otherwise load sample data
    let products = JSON.parse(localStorage.getItem('nexera_products')) || sampleProducts;
    
    // Save sample data to LocalStorage if this is first visit (so it persists)
    if(!localStorage.getItem('nexera_products')) {
        localStorage.setItem('nexera_products', JSON.stringify(sampleProducts));
    }

    const grid = document.getElementById('product-grid');

    // --- 3. RENDER FUNCTION ---
    function renderProducts() {
        grid.innerHTML = ''; // Clear existing

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Use image from product or fallback
            const imgSrc = product.image || `https://picsum.photos/seed/${product.id}/400/300`;

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <span class="category-badge">${product.category}</span>
                    <img src="${imgSrc}" class="card-img" alt="${product.title}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${product.title}</h3>
                    <div class="card-meta">
                        <span>Seller: <b>${product.seller}</b></span>
                    </div>
                    <p class="card-desc">${product.desc}</p>
                    <div class="card-footer">
                        <span class="card-price">π ${product.price.toFixed(2)}</span>
                        <button class="btn-buy" onclick="buyProduct(${product.id})">Buy Now</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Initial Render
    renderProducts();

    // --- 4. ADD NEW PRODUCT (SELL LOGIC) ---
    const sellForm = document.getElementById('sellForm');
    
    if(sellForm) {
        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Authentication Check
            const currentUser = JSON.parse(localStorage.getItem('nexera_user'));
            if(!currentUser) {
                alert("Please login to sell items.");
                closeModal('sellModal');
                openModal('loginModal');
                return;
            }

            // Create New Product Object
            const newProduct = {
                id: Date.now(),
                title: document.getElementById('sell-title').value,
                price: parseFloat(document.getElementById('sell-price').value),
                desc: document.getElementById('sell-desc').value,
                category: "General", // Default category for manual adds
                seller: currentUser.username,
                // Generate a random image for the new item
                image: `https://picsum.photos/seed/${Date.now()}/400/300`
            };

            // Add to array and storage
            products.unshift(newProduct); // Add to top
            localStorage.setItem('nexera_products', JSON.stringify(products));
            
            renderProducts();
            sellForm.reset();
            closeModal('sellModal');
            alert("Item successfully listed on the Marketplace!");
        });
    }

    // --- 5. BUY LOGIC ---
    // Expose to global scope for the HTML onclick
    window.buyProduct = function(id) {
        const currentUser = JSON.parse(localStorage.getItem('nexera_user'));
        if(!currentUser) {
            alert("Please login to purchase items.");
            openModal('loginModal');
            return;
        }

        const product = products.find(p => p.id === id);
        const confirmMsg = `Confirm Purchase:\n\nItem: ${product.title}\nPrice: π${product.price.toFixed(2)}\n\nProceed with Pi Payment?`;
        
        if(confirm(confirmMsg)) {
            // Simulate payment success
            const txHash = Math.random().toString(36).substring(7).toUpperCase();
            alert(`✅ Payment Successful!\n\nTransaction ID: ${txHash}\nSent to: ${product.seller}`);
        }
    };
});