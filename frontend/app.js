const app = (function () {
    const state = {
        currentView: 'catalog',
    };

    const UI = {
        views: {
            catalog: document.getElementById('catalog-view'),
            admin: document.getElementById('admin-view')
        },
        navBtns: {
            catalog: document.getElementById('nav-catalog'),
            admin: document.getElementById('nav-admin')
        }
    };

    function switchView(viewName) {
        if (!UI.views[viewName]) {
            return;
        }

        Object.keys(UI.views).forEach(key => {
            UI.views[key].classList.add('d-none');
            UI.navBtns[key].classList.remove('active', 'text-primary');
        });

        UI.views[viewName].classList.remove('d-none');
        UI.navBtns[viewName].classList.add('active', 'text-primary');

        state.currentView = viewName;
    }

    function runTests() {
        try {
            console.assert(UI.views.catalog !== null);
            console.assert(UI.views.admin !== null);

            switchView('admin');
            console.assert(UI.views.catalog.classList.contains('d-none') === true);
            console.assert(UI.views.admin.classList.contains('d-none') === false);
            console.assert(state.currentView === 'admin');
            
            switchView('catalog');
            console.assert(UI.views.admin.classList.contains('d-none') === true);
            console.assert(UI.views.catalog.classList.contains('d-none') === false);
            console.assert(state.currentView === 'catalog');

        } catch (error) {
            console.error(error);
        }
    }

    function init() {
        switchView('catalog');
        runTests();
    }

    return {
        init,
        switchView
    };

})();

document.addEventListener('DOMContentLoaded', app.init);
