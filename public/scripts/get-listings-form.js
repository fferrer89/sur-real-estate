// Immediately Invoked Function Expression (IIFE)
(function () {
    const validations = {
        minLteMax(minVal, maxVal) {
            if (minVal > maxVal) {
                throw new RangeError(`Minimum must be smaller than or equal to maximum`);
            }
        }
    }

    const form = document.getElementById('get-listing-form');
    if (form) {
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const minSqft = document.getElementById('minSqft');
        const maxSqft = document.getElementById('maxSqft');
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // prevents the default behavior of the form submission (aka posting (POST) the form data)
            // There was an error from the client side while validating the form
            if (minPrice && maxPrice && minSqft && maxSqft) {
                minPrice.setCustomValidity("");
                try {
                    validations.minLteMax(parseInt(minPrice.value), parseInt(maxPrice.value));
                    // form.submit();
                } catch (e) {
                    minPrice.setCustomValidity(e.message);
                    minPrice.reportValidity();
                }
                minSqft.setCustomValidity("");
                try {
                    validations.minLteMax(parseInt(minSqft.value), parseInt(maxSqft.value));
                } catch (e) {
                    minSqft.setCustomValidity(e.message);
                    minSqft.reportValidity();
                }
                if (minPrice.checkValidity() && minSqft.checkValidity()) {
                    // .checkValidity() -> Returns true if an input element contains valid data.
                    form.submit(); // Both minPrice and minSqft have valid inputs, hence submit form
                }
            }
        })

        /**
         * Event Listeners for the Price Range input elements (minPrice and maxPrice) that set the validationMessage of
         * minPrice to an empty string
         */
        minPrice.addEventListener("input", () => {
            // .setCustomValidity() -> Sets the validationMessage property of an input element.
            minPrice.setCustomValidity("");
        })
        maxPrice.addEventListener("input", () => {
            minPrice.setCustomValidity("");
        })

        /**
         * Event Listeners for the Square Feet Range input elements (maxSqft and minSqft) that set the validationMessage
         * of minSqft to an empty string
         */
        maxSqft.addEventListener("input", () => {
            minSqft.setCustomValidity("");
        })
        minSqft.addEventListener("input", () => {
            minSqft.setCustomValidity("");
        })
    }

})();
