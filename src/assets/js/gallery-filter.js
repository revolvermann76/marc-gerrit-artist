document.addEventListener("DOMContentLoaded", () => {
    const filterBar = document.querySelector(".gallery-filter");
    const galleryItems = document.querySelectorAll(".gallery a");

    if (!filterBar) return;

    filterBar.addEventListener("click", (event) => {
        const button = event.target.closest(".filter-tag");
        if (!button) return;

        filterBar
            .querySelectorAll(".filter-tag")
            .forEach((btn) => btn.classList.remove("is-active"));
        button.classList.add("is-active");

        const tag = button.dataset.tag;
        galleryItems.forEach((item) => {
            const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
            item.style.display = !tag || tags.includes(tag) ? "" : "none";
        });
    });
});
