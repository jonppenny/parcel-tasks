'use strict';

// Use this to dynamically load modules only if they are found on the page
// for example:
// const loaderModule = await import('./loader.js');
// await loaderModule.default.init('.paragraph', './templates/paragraph', 'paragraph--type--');
// await loaderModule.default.init('.block', './templates/block', 'block--');
// });

export default {
    importedModules: new Map(),

    /**
     * @param {string} selector
     * @param {string} path
     * @param {string} needle
     */
    async init(selector, path, needle) {
        if (!this.importedModules.has(selector)) {
            this.importedModules.set(selector, new Set());
        }

        const elements = document.querySelectorAll(selector);
        const moduleSet = this.importedModules.get(selector);

        for (const element of elements) {
            const matchingClasses = Array.from(element.classList).filter(className => className.startsWith(needle));

            for (const className of matchingClasses) {
                if (!moduleSet.has(className)) {
                    moduleSet.add(className);

                    try {
                        const module = await import(`${path}/${className}.js`);

                        if (module.default && typeof module.default.init === 'function') {
                            module.default.init();
                        } else {
                            console.warn(`Module ${className}.js doesn't have a default export with init method`);
                        }
                    }
                    catch (error) {
                        console.debug(`No module found for ${className}:`, error.message);
                    }
                }
            }
        }
    },
};
