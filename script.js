/**
 * BC Konyhák - Prémium Asztalos Weboldal JS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVIGÁCIÓ GÖRDÜLÉSI EFFEKT ---
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Kezdeti futás ellenőrzése betöltéskor
    
    
    // --- 2. MOBIL MENÜ KEZELÉS ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Akadálymentesítési attribútum állítása
        const isExpanded = mobileToggle.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    };
    
    mobileToggle.addEventListener('click', toggleMenu);
    
    // Menüpontra kattintáskor zárja be a menüt mobilnézetben
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    
    // --- 3. INTERSECTION OBSERVER A SCROLL-ANIMÁCIÓKHOZ ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .image-reveal-container');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Ha egyszer megjelent, ne figyelje tovább
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // picit a hajtás előtt induljon el az animáció
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    
    // --- 4. PREMIUM GALÉRIA LIGHTBOX MODAL ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    let currentGalleryIndex = 0;
    const galleryData = [];
    
    // Töltsük fel a galéria adatokat tömbbe a könnyű navigációhoz
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const category = item.querySelector('.gallery-item-category').textContent;
        const title = item.querySelector('.gallery-item-title').textContent;
        
        galleryData.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            category: category,
            title: title
        });
        
        // Kattintás esemény
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    const openLightbox = (index) => {
        currentGalleryIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Háttér görgetés letiltása
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Háttér görgetés engedélyezése
    };
    
    const showNextImage = () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        updateLightboxContent();
    };
    
    const showPrevImage = () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    };
    
    const updateLightboxContent = () => {
        const data = galleryData[currentGalleryIndex];
        
        // Halványítsuk el képcserekor a sima átmenetért
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxImg.alt = data.alt;
            lightboxCategory.textContent = data.category;
            lightboxTitle.textContent = data.title;
            lightboxImg.style.opacity = '1';
        }, 150);
    };
    
    // Lightbox eseménykezelők
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Kattintás a modal hátterére bezárja azt
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Billentyűzet kezelés
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
    
    
    // --- 5. KAPCSOLATI ŰRLAP VALIDÁCIÓ & KÜLDÉS ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Mezők lekérése
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');
        const privacyCheck = document.getElementById('form-privacy-check');
        const phoneInput = document.getElementById('form-phone');
        
        // 1. Név ellenőrzése
        if (nameInput.value.trim() === '') {
            nameInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('invalid');
        }
        
        // 2. Email ellenőrzése
        if (!validateEmail(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('invalid');
        }
        
        // 3. Üzenet ellenőrzése
        if (messageInput.value.trim() === '') {
            messageInput.parentElement.classList.add('invalid');
            isValid = false;
        } else {
            messageInput.parentElement.classList.remove('invalid');
        }
        
        // 4. Adatvédelem ellenőrzése
        if (!privacyCheck.checked) {
            privacyCheck.closest('.form-privacy').classList.add('invalid');
            isValid = false;
        } else {
            privacyCheck.closest('.form-privacy').classList.remove('invalid');
        }
        
        // Valós idejű hiba-eltüntetés beírás közben
        const setupRealtimeValidation = (input, parentClass) => {
            input.addEventListener('input', () => {
                const parent = parentClass ? input.closest(parentClass) : input.parentElement;
                if (input.type === 'checkbox') {
                    if (input.checked) parent.classList.remove('invalid');
                } else {
                    if (input.value.trim() !== '') {
                        if (input.type === 'email') {
                            if (validateEmail(input.value.trim())) parent.classList.remove('invalid');
                        } else {
                            parent.classList.remove('invalid');
                        }
                    }
                }
            });
        };
        
        setupRealtimeValidation(nameInput);
        setupRealtimeValidation(emailInput);
        setupRealtimeValidation(messageInput);
        setupRealtimeValidation(privacyCheck, '.form-privacy');
        
        if (isValid) {
            // Gomb kikapcsolása küldés alatt
            const submitBtn = document.getElementById('form-submit-btn');
            const submitText = submitBtn.querySelector('span');
            const originalText = submitText.textContent;
            
            submitBtn.disabled = true;
            submitText.textContent = 'Küldés folyamatban...';
            submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
            
            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            
            // Küldés szimuláció (1.5 másodperces késleltetéssel)
            setTimeout(() => {
                // Sikeres küldés állapot
                submitBtn.disabled = false;
                submitText.textContent = originalText;
                submitBtn.querySelector('i').className = 'fa-solid fa-arrow-right';
                
                formSuccess.style.display = 'flex';
                contactForm.reset();
                
                // Sikeres küldés után lebegő label-ek visszaállítása
                const allGroups = contactForm.querySelectorAll('.form-group');
                allGroups.forEach(group => {
                    const input = group.querySelector('input, textarea');
                    if(input) {
                        input.placeholder = ' '; // Újra üres placeholder a label visszaállásához
                    }
                });
                
                // Sikeres visszajelzés eltüntetése 5 másodperc múlva
                setTimeout(() => {
                    formSuccess.style.opacity = '0';
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                        formSuccess.style.opacity = '1';
                    }, 400);
                }, 5000);
                
            }, 1500);
        } else {
            // Hibaüzenet megjelenítése és görgetés az első hibás mezőhöz
            formError.style.display = 'flex';
            const firstInvalid = contactForm.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    
    // --- 6. KONYHA ÁRKALKULÁTOR LOGIKA ---
    
    // Konfigurációs objektum a könnyű módosíthatóságért
    const PRICING = {
        pricePerMeter: 1000000,
        customDesignExtra: 2000000,
        premiumStorageExtra: 2000000
    };

    const calcRange = document.getElementById('calc-range');
    const calcLengthNum = document.getElementById('calc-length-num');
    const calcPriceValue = document.getElementById('calc-price-value');
    
    const summaryLength = document.getElementById('summary-length');
    const summaryDesign = document.getElementById('summary-design');
    const summaryStorage = document.getElementById('summary-storage');
    const calcCtaBtn = document.getElementById('calc-cta-btn');
    
    const breakdownBase = document.getElementById('breakdown-base');
    const breakdownDesignRow = document.getElementById('breakdown-design-row');
    const breakdownDesign = document.getElementById('breakdown-design');
    const breakdownStorageRow = document.getElementById('breakdown-storage-row');
    const breakdownStorage = document.getElementById('breakdown-storage');
    const breakdownTotal = document.getElementById('breakdown-total');
    
    const designCards = document.querySelectorAll('#design-type-grid .calc-card');
    const storageCards = document.querySelectorAll('#storage-type-grid .calc-card');
    const contactMessage = document.getElementById('form-message');
    
    let activeDesign = "Standard";
    let activeStorage = "Alap";
    let currentPrice = 8000000; // Kezdeti ár (8 folyóméter * 1M)

    // Formázási segédfüggvény (pl. 8000000 -> 8 000 000)
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    // Árváltozás animálása (számok pörgése)
    let animationFrameId = null;
    const animatePrice = (targetPrice) => {
        const duration = 400; // animáció hossza ms-ben
        const startTime = performance.now();
        const startPrice = currentPrice;
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        const updateNumber = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad függvény a lassuló lefutáshoz
            const easeProgress = progress * (2 - progress);
            
            const interimPrice = Math.round(startPrice + (targetPrice - startPrice) * easeProgress);
            calcPriceValue.textContent = formatNumber(interimPrice);
            
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(updateNumber);
            } else {
                currentPrice = targetPrice;
                calcPriceValue.textContent = formatNumber(targetPrice);
            }
        };
        
        animationFrameId = requestAnimationFrame(updateNumber);
    };

    // Árkalkuláció végrehajtása
    const calculatePrice = () => {
        const length = parseInt(calcRange.value, 10) || 5;
        
        const isCustomDesign = (activeDesign === "Egyedi");
        const isPremiumStorage = (activeStorage === "Prémium" || activeStorage === "Premium");
        
        // Számítási képlet: hossz * 1 000 000 Ft + extrák
        const basePrice = length * PRICING.pricePerMeter;
        const designExtra = isCustomDesign ? PRICING.customDesignExtra : 0;
        const storageExtra = isPremiumStorage ? PRICING.premiumStorageExtra : 0;
        
        const totalPrice = basePrice + designExtra + storageExtra;
        
        // Animált főár kiíratás indítása
        animatePrice(totalPrice);
        
        // Összegző kártya szövegeinek frissítése
        summaryLength.textContent = `${length} folyóméter`;
        summaryDesign.textContent = activeDesign === "Standard" ? "Standard kialakítás" : "Egyedi kialakítás";
        summaryStorage.textContent = activeStorage === "Alap" ? "Alap belső tárolás" : "Prémium belső tárolás";
        
        // Részletes árbontás frissítése és ki/be kapcsolása
        if (breakdownBase) breakdownBase.textContent = `${formatNumber(basePrice)} Ft`;
        
        if (breakdownDesignRow && breakdownDesign) {
            if (isCustomDesign) {
                breakdownDesign.textContent = `+${formatNumber(PRICING.customDesignExtra)} Ft`;
                breakdownDesignRow.style.display = 'flex';
            } else {
                breakdownDesignRow.style.display = 'none';
            }
        }
        
        if (breakdownStorageRow && breakdownStorage) {
            if (isPremiumStorage) {
                breakdownStorage.textContent = `+${formatNumber(PRICING.premiumStorageExtra)} Ft`;
                breakdownStorageRow.style.display = 'flex';
            } else {
                breakdownStorageRow.style.display = 'none';
            }
        }
        
        if (breakdownTotal) breakdownTotal.textContent = `${formatNumber(totalPrice)} Ft`;
    };

    // Inputok szinkronizálása és eseménykezelése
    const handleLengthChange = (value) => {
        let length = parseInt(value, 10);
        
        // Határértékek kezelése
        if (isNaN(length) || length < 5) length = 5;
        if (length > 15) length = 15;
        
        calcRange.value = length;
        calcLengthNum.value = length;
        
        calculatePrice();
    };

    if (calcRange && calcLengthNum) {
        calcRange.addEventListener('input', (e) => {
            calcLengthNum.value = e.target.value;
            calculatePrice();
        });

        calcLengthNum.addEventListener('change', (e) => {
            handleLengthChange(e.target.value);
        });

        // Kialakítás kártyák kattintás kezelése
        designCards.forEach(card => {
            card.addEventListener('click', () => {
                designCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                activeDesign = card.getAttribute('data-value');
                calculatePrice();
            });
        });

        // Tárolás kártyák kattintás kezelése
        storageCards.forEach(card => {
            card.addEventListener('click', () => {
                storageCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                activeStorage = card.getAttribute('data-value');
                calculatePrice();
            });
        });

        // CTA Ajánlatkérés gomb eseménykezelője (görgetés és automatikus kitöltés)
        if (calcCtaBtn) {
            calcCtaBtn.addEventListener('click', () => {
                const length = calcRange.value;
                const isCustomDesign = (activeDesign === "Egyedi");
                const isPremiumStorage = (activeStorage === "Prémium" || activeStorage === "Premium");
                
                const basePrice = length * PRICING.pricePerMeter;
                const designExtra = isCustomDesign ? PRICING.customDesignExtra : 0;
                const storageExtra = isPremiumStorage ? PRICING.premiumStorageExtra : 0;
                const totalPrice = basePrice + designExtra + storageExtra;
                
                const formattedPrice = formatNumber(totalPrice);
                
                // Szövegsablon összeállítása a kért formátumban
                const messageTemplate = `Tisztelt BC Konyhák!

Szeretnék személyre szabott ajánlatot kérni.

Konyha becsült hossza: ${length} folyóméter
Kialakítás: ${activeDesign}
Belső tárolás: ${activeStorage}
Előzetesen becsült ár: ${formattedPrice} Ft`;

                // Mező értékének beállítása
                if (contactMessage) {
                    contactMessage.value = messageTemplate;
                    
                    // Fókuszálás az űrlap mezőre
                    contactMessage.focus();
                }
                
                // Lágy görgetés a kapcsolatfelvételi űrlaphoz
                const contactSection = document.getElementById('kapcsolat');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
});

