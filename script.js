document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ACTIVE NAVIGATION
    // =========================

    const sections = document.querySelectorAll("section, main");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach((section) => {

            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                current = section.getAttribute("id");
            }

        });

        navLinks.forEach((link) => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") === `#${current}`
            ) {
                link.classList.add("active");
            }

        });

    });


    // =========================
    // SCROLL REVEAL
    // =========================

    const revealElements = document.querySelectorAll(
        ".about, .project-card, .skill-category, .contact-placeholder"
    );

    if (revealElements.length > 0) {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }

                });

            },
            {
                threshold: 0.1
            }
        );

        revealElements.forEach((element) => {

            element.classList.add("reveal");
            observer.observe(element);

        });

    }


    // =========================
    // FLOATING CARD MOUSE EFFECT
    // =========================

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual) {

        heroVisual.addEventListener("mousemove", (event) => {

            const cards =
                heroVisual.querySelectorAll(".floating-card");

            const rect = heroVisual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width - 0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height - 0.5;

            cards.forEach((card, index) => {

                const strength =
                    (index + 1) * 4;

                card.style.marginLeft =
                    `${x * strength}px`;

                card.style.marginTop =
                    `${y * strength}px`;

            });

        });


        heroVisual.addEventListener("mouseleave", () => {

            const cards =
                heroVisual.querySelectorAll(".floating-card");

            cards.forEach((card) => {

                card.style.marginLeft = "0";
                card.style.marginTop = "0";

            });

        });

    }


    // =========================
    // PROJECT SCREENSHOT GALLERY
    // =========================

    const galleries =
        document.querySelectorAll(".project-gallery");

    galleries.forEach((gallery) => {

        const shots =
            gallery.querySelectorAll(".project-shot");

        const buttons =
            gallery.querySelectorAll(".gallery-dot");

        const counter =
            gallery.querySelector(".gallery-counter");


        buttons.forEach((button) => {

            button.addEventListener("click", () => {

                const index =
                    parseInt(
                        button.getAttribute("data-index")
                    );


                // Safety check
                if (
                    isNaN(index) ||
                    !shots[index]
                ) {
                    return;
                }


                // Remove active class from screenshots
                shots.forEach((shot) => {

                    shot.classList.remove("active");

                });


                // Remove active class from buttons
                buttons.forEach((btn) => {

                    btn.classList.remove("active");

                });


                // Activate selected screenshot
                shots[index].classList.add("active");


                // Activate clicked button
                button.classList.add("active");


                // Update counter
                if (counter) {

                    const current =
                        String(index + 1)
                            .padStart(2, "0");

                    const total =
                        String(shots.length)
                            .padStart(2, "0");

                    counter.textContent =
                        `${current} / ${total}`;

                }

            });

        });

    });


    // =========================
    // DEBUG
    // =========================

    console.log("Portfolio JavaScript loaded successfully");
    console.log("Galleries found:", galleries.length);

});